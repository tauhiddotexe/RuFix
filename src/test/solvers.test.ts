import { describe, it, expect } from 'vitest';
import { cloneCube2x2, applyMoves2x2, generateScramble2x2, isSolved2x2, solve2x2 } from '@/lib/cube2x2Utils';
import { SOLVED_CUBE_2X2 } from '@/types/cube2x2';
import { solveCube } from '@/lib/cubeSolver';
import { applyMoves, generateScramble, isSolved, cloneCube } from '@/lib/cubeUtils';
import { SOLVED_CUBE } from '@/types/cube';
import { cloneCube4x4, applyMove4x4, applyMoves4x4, generateScramble4x4, isSolved4x4, invertMove4x4, invertSequence4x4 } from '@/lib/cube4x4Utils';
import { SOLVED_CUBE_4X4 } from '@/types/cube4x4';
import { Move4x4 } from '@/types/cube4x4';

describe('2x2 Solver', () => {
  it('solves a short scramble', () => {
    const scramble = generateScramble2x2(4);
    const scrambled = applyMoves2x2(cloneCube2x2(SOLVED_CUBE_2X2), scramble);
    expect(isSolved2x2(scrambled)).toBe(false);

    const solution = solve2x2(scrambled);
    expect(solution).not.toBeNull();

    const solved = applyMoves2x2(scrambled, solution!);
    expect(isSolved2x2(solved)).toBe(true);
  });

  it('returns empty array for solved cube', () => {
    const solution = solve2x2(cloneCube2x2(SOLVED_CUBE_2X2));
    expect(solution).toEqual([]);
  });
});

describe('3x3 Solver', () => {
  it('solves a short scramble', async () => {
    const scramble = generateScramble(3);
    const scrambled = applyMoves(cloneCube(SOLVED_CUBE), scramble);
    expect(isSolved(scrambled)).toBe(false);

    const result = await solveCube(scrambled);
    expect(result.success).toBe(true);
    expect(result.solution).toBeDefined();

    const solved = applyMoves(scrambled, result.solution!);
    expect(isSolved(solved)).toBe(true);
  }, 30000);

  it('returns empty for solved cube', async () => {
    const result = await solveCube(cloneCube(SOLVED_CUBE));
    expect(result.success).toBe(true);
    expect(result.solution).toEqual([]);
  });
});

describe('4x4 Scramble Inverse Solver', () => {
  it('invertMove4x4 symmetry: apply move then inverse restores cube', () => {
    const moves: Move4x4[] = ['R', "R'", 'U', "U'"];
    for (const move of moves) {
      const afterMove = applyMove4x4(cloneCube4x4(SOLVED_CUBE_4X4), move);
      const afterInverse = applyMove4x4(afterMove, invertMove4x4(move));
      expect(isSolved4x4(afterInverse)).toBe(true);
    }
  });

  it('scramble generates 3 or 4 moves using only R and U faces', () => {
    for (let i = 0; i < 20; i++) {
      const scramble = generateScramble4x4();
      expect(scramble.length).toBeGreaterThanOrEqual(3);
      expect(scramble.length).toBeLessThanOrEqual(4);
      for (const move of scramble) {
        expect(move[0]).toMatch(/[RU]/);
      }
      // No consecutive same-face moves
      for (let j = 1; j < scramble.length; j++) {
        expect(scramble[j][0]).not.toBe(scramble[j - 1][0]);
      }
    }
  });

  it('invertSequence4x4 produces clean notation', () => {
    const scramble: Move4x4[] = ['R', "U'", 'R'];
    const solution = invertSequence4x4(scramble);
    expect(solution).toEqual(["R'", 'U', "R'"]);
  });

  it('scramble inverse solves the cube', () => {
    for (let i = 0; i < 10; i++) {
      const scramble = generateScramble4x4();
      const scrambled = applyMoves4x4(cloneCube4x4(SOLVED_CUBE_4X4), scramble);
      expect(isSolved4x4(scrambled)).toBe(false);
      const solution = invertSequence4x4(scramble);
      const solved = applyMoves4x4(scrambled, solution);
      expect(isSolved4x4(solved)).toBe(true);
    }
  });
});
