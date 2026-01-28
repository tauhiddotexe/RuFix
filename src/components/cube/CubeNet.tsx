import { CubeState, CubeColor, FaceName } from '@/types/cube';
import { CubeFace } from './CubeFace';

interface CubeNetProps {
  cube: CubeState;
  onCellClick?: (face: keyof CubeState, index: number) => void;
  selectedColor?: CubeColor | null;
}

export const CubeNet = ({ cube, onCellClick, selectedColor }: CubeNetProps) => {
  const handleCellClick = (face: keyof CubeState) => (index: number) => {
    if (onCellClick && selectedColor) {
      onCellClick(face, index);
    }
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, auto)' }}>
      {/* Top row - empty, U, empty, empty */}
      <div />
      <CubeFace 
        face={cube.U} 
        faceName="Up (White)" 
        onCellClick={selectedColor ? handleCellClick('U') : undefined}
        selectedColor={selectedColor}
      />
      <div />
      <div />
      
      {/* Middle row - L, F, R, B */}
      <CubeFace 
        face={cube.L} 
        faceName="Left (Green)" 
        onCellClick={selectedColor ? handleCellClick('L') : undefined}
        selectedColor={selectedColor}
      />
      <CubeFace 
        face={cube.F} 
        faceName="Front (Red)" 
        onCellClick={selectedColor ? handleCellClick('F') : undefined}
        selectedColor={selectedColor}
      />
      <CubeFace 
        face={cube.R} 
        faceName="Right (Blue)" 
        onCellClick={selectedColor ? handleCellClick('R') : undefined}
        selectedColor={selectedColor}
      />
      <CubeFace 
        face={cube.B} 
        faceName="Back (Orange)" 
        onCellClick={selectedColor ? handleCellClick('B') : undefined}
        selectedColor={selectedColor}
      />
      
      {/* Bottom row - empty, D, empty, empty */}
      <div />
      <CubeFace 
        face={cube.D} 
        faceName="Down (Yellow)" 
        onCellClick={selectedColor ? handleCellClick('D') : undefined}
        selectedColor={selectedColor}
      />
      <div />
      <div />
    </div>
  );
};
