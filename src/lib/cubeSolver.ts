import { CubeState, Move, CubeColor } from '@/types/cube';
import { isSolved } from './cubeUtils';
import Cube from 'cubejs';

// Initialize cubejs lookup tables once
Cube.initSolver();

// Mapping from CubeColor to cubejs facelet character
const COLOR_TO_FACELET: Record<CubeColor, string> = {
  W: 'U', // White = Up
  B: 'R', // Blue  = Right
  R: 'F', // Red   = Front
  Y: 'D', // Yellow = Down
  G: 'L', // Green = Left
  O: 'B', // Orange = Back
};

// Convert CubeState to cubejs 54-char facelet string (URFDLB order)
const cubeStateToFaceletString = (cube: CubeState): string => {
  const faceOrder: (keyof CubeState)[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  let faceletStr = '';
  for (const face of faceOrder) {
    for (const color of cube[face]) {
      faceletStr += COLOR_TO_FACELET[color];
    }
  }
  return faceletStr;
};

// Parse cubejs solution string (e.g. "R U' F2 D") into Move[]
const parseCubejsSolution = (solutionStr: string): Move[] => {
  const trimmed = solutionStr.trim();
  if (trimmed === '') return [];
  return trimmed.split(/\s+/) as Move[];
};

// Check if the cube configuration is valid
export const validateCube = (cube: CubeState): { valid: boolean; error?: string } => {
  // Count colors
  const colorCount: Record<CubeColor, number> = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };

  const faces: (keyof CubeState)[] = ['U', 'D', 'F', 'B', 'L', 'R'];
  for (const face of faces) {
    for (const color of cube[face]) {
      colorCount[color]++;
    }
  }

  // Each color should appear exactly 9 times
  for (const color of Object.keys(colorCount) as CubeColor[]) {
    if (colorCount[color] !== 9) {
      return {
        valid: false,
        error: `Each color must appear exactly 9 times. ${color} appears ${colorCount[color]} times.`
      };
    }
  }

  // Check center pieces (fixed in standard cube)
  const expectedCenters: Record<keyof CubeState, CubeColor> = {
    U: 'W', D: 'Y', F: 'R', B: 'O', L: 'G', R: 'B'
  };

  for (const face of faces) {
    if (cube[face][4] !== expectedCenters[face]) {
      return {
        valid: false,
        error: `Center piece on ${face} face should be ${expectedCenters[face]}`
      };
    }
  }

  return { valid: true };
};

// Main solve function
export const solveCube = async (cube: CubeState, options?: { skipValidation?: boolean; timeLimitMs?: number }): Promise<{
  success: boolean;
  solution?: Move[];
  error?: string
}> => {
  if (!options?.skipValidation) {
    const validation = validateCube(cube);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
  }

  if (isSolved(cube)) {
    return { success: true, solution: [] };
  }

  try {
    const faceletStr = cubeStateToFaceletString(cube);
    const cubeInstance = Cube.fromString(faceletStr);
    const solutionStr: string = cubeInstance.solve();
    const moves = parseCubejsSolution(solutionStr);
    return { success: true, solution: moves };
  } catch (e) {
    return {
      success: false,
      error: 'Failed to solve cube. The cube state may be invalid.'
    };
  }
};

// Optimized solver using precomputed moves
export const solveWithTimeout = (
  cube: CubeState,
  timeoutMs: number = 15000
): Promise<{ success: boolean; solution?: Move[]; error?: string }> => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ success: false, error: 'Solver timeout. Try a simpler scramble.' });
    }, timeoutMs);

    solveCube(cube).then((result) => {
      clearTimeout(timeout);
      resolve(result);
    });
  });
};
