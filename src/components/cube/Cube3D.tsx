import { CubeState, COLORS } from '@/types/cube';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Cube3DProps {
  cube: CubeState;
  rotationX?: number;
  rotationY?: number;
}

export const Cube3D = ({ cube, rotationX = -25, rotationY = -35 }: Cube3DProps) => {
  const cellSize = 48;
  const gap = 4;
  const faceSize = cellSize * 3 + gap * 2;
  const halfFace = faceSize / 2;

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
