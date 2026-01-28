export type CubeColor = 'W' | 'Y' | 'R' | 'O' | 'B' | 'G';

export type FaceName = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';

export type Face = CubeColor[];

export type CubeState = {
  U: Face; // Up (white)
  D: Face; // Down (yellow)
  F: Face; // Front (red)
  B: Face; // Back (orange)
  L: Face; // Left (green)
  R: Face; // Right (blue)
};

export type Move = 
  | 'F' | "F'" | 'F2'
  | 'R' | "R'" | 'R2'
  | 'U' | "U'" | 'U2'
  | 'B' | "B'" | 'B2'
  | 'L' | "L'" | 'L2'
  | 'D' | "D'" | 'D2';

export const COLORS: Record<CubeColor, string> = {
  W: 'bg-cube-white',
  Y: 'bg-cube-yellow',
  R: 'bg-cube-red',
  O: 'bg-cube-orange',
  B: 'bg-cube-blue',
  G: 'bg-cube-green',
};

export const COLOR_NAMES: Record<CubeColor, string> = {
  W: 'White',
  Y: 'Yellow',
  R: 'Red',
  O: 'Orange',
  B: 'Blue',
  G: 'Green',
};

export const SOLVED_CUBE: CubeState = {
  U: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  D: ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  F: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
  B: ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  L: ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  R: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
};
