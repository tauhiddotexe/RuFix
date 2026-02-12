import { CubeState, COLORS, Move } from '@/types/cube';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Cube3DProps {
  cube: CubeState;
  rotationX?: number;
  rotationY?: number;
  activeMove?: Move | null;
}

// Arrow configuration for each face move
type ArrowConfig = {
  face: keyof CubeState;
  direction: 'cw' | 'ccw' | 'double';
};

const getMoveArrowConfig = (move: Move): ArrowConfig | null => {
  const map: Record<string, ArrowConfig> = {
    'F': { face: 'F', direction: 'cw' },
    "F'": { face: 'F', direction: 'ccw' },
    'F2': { face: 'F', direction: 'double' },
    'R': { face: 'R', direction: 'cw' },
    "R'": { face: 'R', direction: 'ccw' },
    'R2': { face: 'R', direction: 'double' },
    'U': { face: 'U', direction: 'cw' },
    "U'": { face: 'U', direction: 'ccw' },
    'U2': { face: 'U', direction: 'double' },
    'B': { face: 'B', direction: 'cw' },
    "B'": { face: 'B', direction: 'ccw' },
    'B2': { face: 'B', direction: 'double' },
    'L': { face: 'L', direction: 'cw' },
    "L'": { face: 'L', direction: 'ccw' },
    'L2': { face: 'L', direction: 'double' },
    'D': { face: 'D', direction: 'cw' },
    "D'": { face: 'D', direction: 'ccw' },
    'D2': { face: 'D', direction: 'double' },
  };
  return map[move] ?? null;
};

const getFaceTransform = (face: keyof CubeState, halfFace: number): string => {
  const transforms: Record<keyof CubeState, string> = {
    F: `translateZ(${halfFace}px)`,
    B: `translateZ(-${halfFace}px) rotateY(180deg)`,
    R: `translateX(${halfFace}px) rotateY(90deg)`,
    L: `translateX(-${halfFace}px) rotateY(-90deg)`,
    U: `translateY(-${halfFace}px) rotateX(90deg)`,
    D: `translateY(${halfFace}px) rotateX(-90deg)`,
  };
  return transforms[face];
};

const ArrowOverlay = ({ direction, faceSize }: { direction: 'cw' | 'ccw' | 'double'; faceSize: number }) => {
  const center = faceSize / 2;
  const radius = faceSize * 0.34;
  const strokeWidth = 3;
  const arrowColor = direction === 'double' ? '#facc15' : '#38bdf8';
  const glowColor = direction === 'double' ? 'rgba(250,204,21,0.6)' : 'rgba(56,189,248,0.6)';

  // Draw a circular arc arrow
  const isClockwise = direction === 'cw' || direction === 'double';
  const startAngle = isClockwise ? -60 : 240;
  const endAngle = isClockwise ? 200 : -20;
  const sweepFlag = isClockwise ? 1 : 0;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = center + radius * Math.cos(toRad(startAngle));
  const y1 = center + radius * Math.sin(toRad(startAngle));
  const x2 = center + radius * Math.cos(toRad(endAngle));
  const y2 = center + radius * Math.sin(toRad(endAngle));

  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  // Arrowhead at end point
  const arrowAngle = isClockwise
    ? toRad(endAngle + 90)
    : toRad(endAngle - 90);
  const arrowLen = 10;
  const ax1 = x2 + arrowLen * Math.cos(arrowAngle - 0.5);
  const ay1 = y2 + arrowLen * Math.sin(arrowAngle - 0.5);
  const ax2 = x2 + arrowLen * Math.cos(arrowAngle + 0.5);
  const ay2 = y2 + arrowLen * Math.sin(arrowAngle + 0.5);

  return (
    <svg
      width={faceSize}
      height={faceSize}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <defs>
        <filter id="arrow-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Glow background arc */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${x2} ${y2}`}
        fill="none"
        stroke={glowColor}
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        filter="url(#arrow-glow)"
      />
      {/* Main arc */}
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweepFlag} ${x2} ${y2}`}
        fill="none"
        stroke={arrowColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <polygon
        points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
        fill={arrowColor}
        filter="url(#arrow-glow)"
      />
      {/* Double turn indicator */}
      {direction === 'double' && (
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          fill={arrowColor}
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
          filter="url(#arrow-glow)"
        >
          ×2
        </text>
      )}
    </svg>
  );
};

export const Cube3D = ({ cube, rotationX = -25, rotationY = -35, activeMove = null }: Cube3DProps) => {
  const cellSize = 48;
  const gap = 4;
  const faceSize = cellSize * 3 + gap * 2;
  const halfFace = faceSize / 2;

  const arrowConfig = activeMove ? getMoveArrowConfig(activeMove) : null;

  const renderFace = (face: keyof CubeState, transform: string) => (
    <div
      className="absolute grid grid-cols-3 gap-1 p-1 bg-black/90 rounded-md"
      style={{
        width: faceSize,
        height: faceSize,
        transform,
        backfaceVisibility: 'hidden',
      }}
    >
      {cube[face].map((color, index) => (
        <div
          key={index}
          className={cn(
            'rounded-sm transition-colors duration-200',
            COLORS[color]
          )}
          style={{
            width: cellSize,
            height: cellSize,
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)',
          }}
        />
      ))}
      {/* Arrow overlay for the active face */}
      <AnimatePresence>
        {arrowConfig && arrowConfig.face === face && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <ArrowOverlay direction={arrowConfig.direction} faceSize={faceSize} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div
      className="cube-3d-container flex items-center justify-center"
      style={{ width: 280, height: 280 }}
    >
      <motion.div
        className="cube-3d relative"
        style={{
          width: faceSize,
          height: faceSize,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: rotationX,
          rotateY: rotationY,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Front - Red */}
        {renderFace('F', `translateZ(${halfFace}px)`)}

        {/* Back - Orange */}
        {renderFace('B', `translateZ(-${halfFace}px) rotateY(180deg)`)}

        {/* Right - Blue */}
        {renderFace('R', `translateX(${halfFace}px) rotateY(90deg)`)}

        {/* Left - Green */}
        {renderFace('L', `translateX(-${halfFace}px) rotateY(-90deg)`)}

        {/* Top - White */}
        {renderFace('U', `translateY(-${halfFace}px) rotateX(90deg)`)}

        {/* Bottom - Yellow */}
        {renderFace('D', `translateY(${halfFace}px) rotateX(-90deg)`)}
      </motion.div>
    </div>
  );
};
