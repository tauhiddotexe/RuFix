import { CubeState4x4, Move4x4 } from '@/types/cube4x4';
import { isSolved4x4, invertSequence4x4 } from './cube4x4Utils';

/**
 * Solve a 4x4 cube by reversing the stored scramble sequence.
 * Only works for states produced by the scramble button.
 */
export function solve4x4Reduction(
  cube: CubeState4x4,
  scrambleMoves?: Move4x4[]
): { success: boolean; solution?: Move4x4[]; error?: string } {
  if (isSolved4x4(cube)) {
    return { success: true, solution: [] };
  }

  if (scrambleMoves && scrambleMoves.length > 0) {
    const solution = invertSequence4x4(scrambleMoves);
    return { success: true, solution };
  }

  return {
    success: false,
    error: 'Manual configurations cannot be solved for 4x4. Please use the Scramble button.',
  };
}
