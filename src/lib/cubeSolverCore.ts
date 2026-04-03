import Cube from 'cubejs';
import { CubeState, Move, CubeColor } from '@/types/cube';
import { isSolved } from './cubeUtils';

export type SolveResult = {
  success: boolean;
  solution?: Move[];
  error?: string;
};

// Lazy initialization keeps the solver tables inside whichever thread uses them.
let solverInitialized = false;
let solverInitError: string | null = null;

const ensureSolverInitialized = (): boolean => {
  if (solverInitialized) return true;
  if (solverInitError) return false;

  try {
    Cube.initSolver();
    solverInitialized = true;
    return true;
  } catch (error) {
    solverInitError = 'Failed to initialize solver engine.';
    console.error('cubejs initSolver failed:', error);
    return false;
  }
};

const COLOR_TO_FACELET: Record<CubeColor, string> = {
  W: 'U',
  B: 'R',
  R: 'F',
  Y: 'D',
  G: 'L',
  O: 'B',
};

const cubeStateToFaceletString = (cube: CubeState): string => {
  const faceOrder: (keyof CubeState)[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  let faceletString = '';

  for (const face of faceOrder) {
    for (const color of cube[face]) {
      faceletString += COLOR_TO_FACELET[color];
    }
  }

  return faceletString;
};

const parseCubejsSolution = (solutionStr: string): Move[] => {
  const trimmed = solutionStr.trim();
  if (!trimmed) return [];
  return trimmed.split(/\s+/) as Move[];
};

export const validateCube = (cube: CubeState): { valid: boolean; error?: string } => {
  const colorCount: Record<CubeColor, number> = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };
  const faces: (keyof CubeState)[] = ['U', 'D', 'F', 'B', 'L', 'R'];

  for (const face of faces) {
    for (const color of cube[face]) {
      colorCount[color]++;
    }
  }

  for (const color of Object.keys(colorCount) as CubeColor[]) {
    if (colorCount[color] !== 9) {
      return {
        valid: false,
        error: `Each color must appear exactly 9 times. ${color} appears ${colorCount[color]} times.`,
      };
    }
  }

  const expectedCenters: Record<keyof CubeState, CubeColor> = {
    U: 'W',
    D: 'Y',
    F: 'R',
    B: 'O',
    L: 'G',
    R: 'B',
  };

  for (const face of faces) {
    if (cube[face][4] !== expectedCenters[face]) {
      return {
        valid: false,
        error: `Center piece on ${face} face should be ${expectedCenters[face]}`,
      };
    }
  }

  return { valid: true };
};

export const solveCubeSync = (
  cube: CubeState,
  options?: { skipValidation?: boolean }
): SolveResult => {
  if (!options?.skipValidation) {
    const validation = validateCube(cube);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
  }

  if (isSolved(cube)) {
    return { success: true, solution: [] };
  }

  if (!ensureSolverInitialized()) {
    return { success: false, error: solverInitError || 'Solver engine not available.' };
  }

  try {
    const faceletString = cubeStateToFaceletString(cube);
    const cubeInstance = Cube.fromString(faceletString);
    const solutionStr = cubeInstance.solve();

    return {
      success: true,
      solution: parseCubejsSolution(solutionStr),
    };
  } catch {
    return {
      success: false,
      error: 'Failed to solve cube. The cube state may be invalid.',
    };
  }
};
