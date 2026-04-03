import { describe, expect, it } from 'vitest';
import { classifyHsvColor, rgbToHsv } from '@/lib/colorDetection';

describe('colorDetection', () => {
  it('converts RGB to HSV for primary colors', () => {
    const hsv = rgbToHsv(255, 0, 0);

    expect(Math.round(hsv.h)).toBe(0);
    expect(Math.round(hsv.s)).toBe(100);
    expect(Math.round(hsv.v)).toBe(100);
  });

  it('classifies representative cube colors using HSV ranges', () => {
    expect(classifyHsvColor({ h: 0, s: 92, v: 88 })).toBe('R');
    expect(classifyHsvColor({ h: 28, s: 88, v: 92 })).toBe('O');
    expect(classifyHsvColor({ h: 58, s: 75, v: 95 })).toBe('Y');
    expect(classifyHsvColor({ h: 128, s: 78, v: 70 })).toBe('G');
    expect(classifyHsvColor({ h: 220, s: 82, v: 72 })).toBe('B');
    expect(classifyHsvColor({ h: 40, s: 8, v: 94 })).toBe('W');
  });

  it('uses calibration to resolve warm-color drift', () => {
    const driftingOrange = { h: 15, s: 72, v: 88 };

    expect(classifyHsvColor(driftingOrange)).toBe('R');
    expect(
      classifyHsvColor(driftingOrange, {
        O: { h: 18, s: 76, v: 90 },
      })
    ).toBe('O');
  });
});
