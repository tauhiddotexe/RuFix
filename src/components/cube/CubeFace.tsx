import { Face, CubeColor, COLORS } from '@/types/cube';
import { cn } from '@/lib/utils';

interface CubeFaceProps {
  face: Face;
  faceName: string;
  onCellClick?: (index: number) => void;
  selectedColor?: CubeColor | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const gapClasses = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1.5',
};

export const CubeFace = ({ 
  face, 
  faceName, 
  onCellClick, 
  selectedColor,
  size = 'md' 
}: CubeFaceProps) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground mb-1 font-medium">
        {faceName}
      </span>
      <div className={cn('grid grid-cols-3', gapClasses[size])}>
        {face.map((color, index) => (
          <button
            key={index}
            onClick={() => onCellClick?.(index)}
            disabled={!onCellClick || index === 4} // Center is fixed
            className={cn(
              'cube-face',
              sizeClasses[size],
              COLORS[color],
              index === 4 && 'cursor-not-allowed opacity-80',
              onCellClick && index !== 4 && 'hover:ring-2 hover:ring-primary'
            )}
            title={index === 4 ? 'Center (fixed)' : `Click to change color`}
          />
        ))}
      </div>
    </div>
  );
};
