import { CubeColor, COLORS, COLOR_NAMES } from '@/types/cube';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  selectedColor: CubeColor | null;
  onColorSelect: (color: CubeColor | null) => void;
}

const CUBE_COLORS: CubeColor[] = ['W', 'Y', 'R', 'O', 'B', 'G'];

export const ColorPicker = ({ selectedColor, onColorSelect }: ColorPickerProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-muted-foreground font-medium">
        Pick a color
      </span>
      <div className="flex gap-2">
        {CUBE_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(selectedColor === color ? null : color)}
            className={cn(
              'color-btn',
              COLORS[color],
              selectedColor === color && 'selected'
            )}
            title={COLOR_NAMES[color]}
          />
        ))}
      </div>
      {selectedColor && (
        <p className="text-xs text-muted-foreground">
          Click on cube cells to set {COLOR_NAMES[selectedColor].toLowerCase()}
        </p>
      )}
    </div>
  );
};
