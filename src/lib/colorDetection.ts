import { CubeColor } from '@/types/cube';

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type HsvColor = {
  h: number;
  s: number;
  v: number;
};

export type ColorCalibration = Partial<Record<CubeColor, HsvColor>>;

export type StickerDetection = {
  color: CubeColor;
  rgb: RgbColor;
  hsv: HsvColor;
  validPixels: number;
};

type HueRange = {
  min: number;
  max: number;
};

type ColorRule = {
  hue: HueRange[];
  saturation: { min: number; max: number };
  value: { min: number; max: number };
};

type DetectionOptions = {
  calibration?: ColorCalibration;
  centerHintColor?: CubeColor;
  lowLightThreshold?: number;
};

type DetectionResult = {
  colors: CubeColor[];
  detections: StickerDetection[];
  calibrationCandidate?: {
    color: CubeColor;
    hsv: HsvColor;
  };
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeHue = (hue: number): number => {
  const normalized = hue % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

const hueDistance = (a: number, b: number): number => {
  const difference = Math.abs(normalizeHue(a) - normalizeHue(b));
  return Math.min(difference, 360 - difference);
};

const isHueInRange = (hue: number, range: HueRange): boolean => {
  const normalized = normalizeHue(hue);
  if (range.min <= range.max) {
    return normalized >= range.min && normalized <= range.max;
  }

  return normalized >= range.min || normalized <= range.max;
};

const rangePenalty = (value: number, min: number, max: number, scale: number): number => {
  if (value < min) return (min - value) / scale;
  if (value > max) return (value - max) / scale;
  return 0;
};

const STATIC_COLOR_RULES: Record<CubeColor, ColorRule> = {
  W: {
    hue: [{ min: 0, max: 360 }],
    saturation: { min: 0, max: 28 },
    value: { min: 60, max: 100 },
  },
  Y: {
    hue: [{ min: 42, max: 72 }],
    saturation: { min: 30, max: 100 },
    value: { min: 45, max: 100 },
  },
  R: {
    hue: [{ min: 345, max: 360 }, { min: 0, max: 16 }],
    saturation: { min: 35, max: 100 },
    value: { min: 25, max: 100 },
  },
  O: {
    hue: [{ min: 16, max: 36 }],
    saturation: { min: 35, max: 100 },
    value: { min: 28, max: 100 },
  },
  B: {
    hue: [{ min: 185, max: 255 }],
    saturation: { min: 30, max: 100 },
    value: { min: 22, max: 100 },
  },
  G: {
    hue: [{ min: 75, max: 165 }],
    saturation: { min: 25, max: 100 },
    value: { min: 25, max: 100 },
  },
};

export const rgbToHsv = (r: number, g: number, b: number): HsvColor => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    switch (max) {
      case red:
        hue = 60 * (((green - blue) / delta) % 6);
        break;
      case green:
        hue = 60 * ((blue - red) / delta + 2);
        break;
      default:
        hue = 60 * ((red - green) / delta + 4);
        break;
    }
  }

  return {
    h: normalizeHue(hue),
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
};

const normalizePixel = (
  r: number,
  g: number,
  b: number,
  lowLightThreshold: number
): RgbColor | null => {
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luma < lowLightThreshold) {
    return null;
  }

  const targetLuma = 160;
  const gain = clamp(targetLuma / Math.max(luma, 1), 0.85, 1.4);
  const contrast = 1.08;

  const adjust = (channel: number) =>
    clamp((((channel * gain) - 128) * contrast) + 128, 0, 255);

  return {
    r: adjust(r),
    g: adjust(g),
    b: adjust(b),
  };
};

const buildColorRule = (color: CubeColor, calibration?: HsvColor): ColorRule => {
  const baseRule = STATIC_COLOR_RULES[color];

  if (!calibration) {
    return baseRule;
  }

  if (color === 'W') {
    return {
      hue: [{ min: 0, max: 360 }],
      saturation: {
        min: 0,
        max: clamp(Math.max(baseRule.saturation.max, calibration.s + 10), 0, 45),
      },
      value: {
        min: clamp(Math.min(baseRule.value.min, calibration.v - 18), 35, 100),
        max: 100,
      },
    };
  }

  const hueTolerance = color === 'R' || color === 'O' ? 18 : 22;

  return {
    hue: [
      {
        min: normalizeHue(calibration.h - hueTolerance),
        max: normalizeHue(calibration.h + hueTolerance),
      },
    ],
    saturation: {
      min: clamp(Math.min(baseRule.saturation.min, calibration.s - 25), 0, 100),
      max: 100,
    },
    value: {
      min: clamp(Math.min(baseRule.value.min, calibration.v - 22), 0, 100),
      max: 100,
    },
  };
};

const scoreColorRule = (hsv: HsvColor, rule: ColorRule, color: CubeColor): number => {
  const huePenalty = rule.hue.reduce((bestPenalty, range) => {
    if (isHueInRange(hsv.h, range)) {
      return 0;
    }

    const rangeCenter = range.min <= range.max
      ? (range.min + range.max) / 2
      : normalizeHue((range.min + range.max + 360) / 2);

    return Math.min(bestPenalty, hueDistance(hsv.h, rangeCenter) / 18);
  }, Number.POSITIVE_INFINITY);

  const saturationPenalty = rangePenalty(
    hsv.s,
    rule.saturation.min,
    rule.saturation.max,
    color === 'W' ? 10 : 18
  );
  const valuePenalty = rangePenalty(hsv.v, rule.value.min, rule.value.max, 15);

  return huePenalty + saturationPenalty + valuePenalty;
};

export const classifyHsvColor = (
  hsv: HsvColor,
  calibration: ColorCalibration = {}
): CubeColor => {
  if (hsv.s <= 24 && hsv.v >= 62) {
    return 'W';
  }

  let bestColor: CubeColor = 'W';
  let bestScore = Number.POSITIVE_INFINITY;

  for (const color of Object.keys(STATIC_COLOR_RULES) as CubeColor[]) {
    let score = scoreColorRule(hsv, buildColorRule(color, calibration[color]), color);

    // When a face has been calibrated, bias toward the closest calibrated hue.
    // This helps separate adjacent warm colors like red and orange under mixed lighting.
    if (calibration[color] && color !== 'W') {
      const proximityBonus = Math.max(0.75 - (hueDistance(hsv.h, calibration[color]!.h) / 30), 0);
      score -= proximityBonus;
    }

    if (score < bestScore) {
      bestScore = score;
      bestColor = color;
    }
  }

  return bestColor;
};

const sampleSticker = (
  imageData: ImageData,
  centerX: number,
  centerY: number,
  cellSize: number,
  lowLightThreshold: number
): Omit<StickerDetection, 'color'> => {
  const { data, width, height } = imageData;
  const sampleHalfSize = Math.max(4, Math.floor(cellSize * 0.18));
  const step = Math.max(1, Math.floor(cellSize / 18));

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let validPixels = 0;

  for (let y = centerY - sampleHalfSize; y <= centerY + sampleHalfSize; y += step) {
    for (let x = centerX - sampleHalfSize; x <= centerX + sampleHalfSize; x += step) {
      const pixelX = clamp(Math.round(x), 0, width - 1);
      const pixelY = clamp(Math.round(y), 0, height - 1);
      const pixelIndex = (pixelY * width + pixelX) * 4;
      const normalizedPixel = normalizePixel(
        data[pixelIndex],
        data[pixelIndex + 1],
        data[pixelIndex + 2],
        lowLightThreshold
      );

      if (!normalizedPixel) {
        continue;
      }

      totalR += normalizedPixel.r;
      totalG += normalizedPixel.g;
      totalB += normalizedPixel.b;
      validPixels++;
    }
  }

  if (validPixels === 0) {
    const fallbackX = clamp(Math.round(centerX), 0, width - 1);
    const fallbackY = clamp(Math.round(centerY), 0, height - 1);
    const fallbackIndex = (fallbackY * width + fallbackX) * 4;
    const rgb = {
      r: data[fallbackIndex],
      g: data[fallbackIndex + 1],
      b: data[fallbackIndex + 2],
    };

    return {
      rgb,
      hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
      validPixels: 0,
    };
  }

  const rgb = {
    r: totalR / validPixels,
    g: totalG / validPixels,
    b: totalB / validPixels,
  };

  return {
    rgb,
    hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
    validPixels,
  };
};

export const detectCubeColorsFromImageData = (
  imageData: ImageData,
  cubeSize: 2 | 3 | 4,
  options: DetectionOptions = {}
): DetectionResult => {
  const centerX = imageData.width / 2;
  const centerY = imageData.height / 2;
  const gridSize = Math.min(imageData.width, imageData.height) * 0.5;
  const cellSize = gridSize / cubeSize;
  const startX = centerX - gridSize / 2;
  const startY = centerY - gridSize / 2;
  const lowLightThreshold = options.lowLightThreshold ?? 45;

  const detections: Omit<StickerDetection, 'color'>[] = [];

  for (let row = 0; row < cubeSize; row++) {
    for (let col = 0; col < cubeSize; col++) {
      const stickerCenterX = startX + col * cellSize + cellSize / 2;
      const stickerCenterY = startY + row * cellSize + cellSize / 2;

      detections.push(sampleSticker(imageData, stickerCenterX, stickerCenterY, cellSize, lowLightThreshold));
    }
  }

  const effectiveCalibration: ColorCalibration = { ...(options.calibration ?? {}) };
  let calibrationCandidate: DetectionResult['calibrationCandidate'];

  if (cubeSize === 3 && options.centerHintColor) {
    const centerDetection = detections[4];

    calibrationCandidate = {
      color: options.centerHintColor,
      hsv: centerDetection.hsv,
    };
    effectiveCalibration[options.centerHintColor] = centerDetection.hsv;
  }

  const classifiedDetections: StickerDetection[] = detections.map((detection) => ({
    ...detection,
    color: classifyHsvColor(detection.hsv, effectiveCalibration),
  }));

  return {
    colors: classifiedDetections.map((detection) => detection.color),
    detections: classifiedDetections,
    calibrationCandidate,
  };
};
