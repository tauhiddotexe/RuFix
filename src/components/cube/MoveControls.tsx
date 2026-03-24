import { Move } from '@/types/cube';
import { cn } from '@/lib/utils';

interface MoveControlsProps {
  onMove: (move: Move) => void;
  disabled?: boolean;
}

const MOVES: { label: string; move: Move }[][] = [
  [
    { label: 'F', move: 'F' },
    { label: "F'", move: "F'" },
    { label: 'R', move: 'R' },
    { label: "R'", move: "R'" },
    { label: 'U', move: 'U' },
    { label: "U'", move: "U'" },
  ],
  [
    { label: 'B', move: 'B' },
    { label: "B'", move: "B'" },
    { label: 'L', move: 'L' },
    { label: "L'", move: "L'" },
    { label: 'D', move: 'D' },
    { label: "D'", move: "D'" },
  ],
];

export const MoveControls = ({ onMove, disabled }: MoveControlsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-muted-foreground font-medium">
        Manual moves
      </span>
      <div className="flex flex-col gap-2">
        {MOVES.map((row, i) => (
          <div key={i} className="flex gap-2 flex-wrap">
            {row.map(({ label, move }) => (
              <button
                key={label}
                onClick={() => onMove(move)}
                disabled={disabled}
                className={cn(
                  'move-btn',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
