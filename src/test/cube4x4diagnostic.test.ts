import { describe, it, expect } from 'vitest';
import { cloneCube4x4, applyMove4x4 } from '@/lib/cube4x4Utils';
import { SOLVED_CUBE_4X4, CubeState4x4, CubeColor4x4, Move4x4 } from '@/types/cube4x4';

function colorCounts4x4(cube: CubeState4x4): Record<CubeColor4x4, number> {
  const counts: Record<CubeColor4x4, number> = { W: 0, Y: 0, R: 0, O: 0, B: 0, G: 0 };
  const faces: (keyof CubeState4x4)[] = ['U', 'D', 'F', 'B', 'L', 'R'];
  for (const f of faces) for (const c of cube[f]) counts[c]++;
  return counts;
}

const ALL_MOVES: Move4x4[] = [
  'U', "U'", 'U2', 'D', "D'", 'D2', 'F', "F'", 'F2', 'R', "R'", 'R2', 'B', "B'", 'B2', 'L', "L'", 'L2',
  'u', "u'", 'd', "d'", 'r', "r'", 'l', "l'", 'f', "f'", 'b', "b'",
];

describe('All 4x4 moves preserve color counts', () => {
  for (const move of ALL_MOVES) {
    it(`${move}`, () => {
      const cube = applyMove4x4(cloneCube4x4(SOLVED_CUBE_4X4), move);
      const counts = colorCounts4x4(cube);
      for (const [color, count] of Object.entries(counts)) {
        expect(count, `${color} after ${move}`).toBe(16);
      }
    });
  }
});
