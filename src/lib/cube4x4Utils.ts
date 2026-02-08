import { CubeState4x4, Face4x4, Move4x4, SOLVED_CUBE_4X4, CubeColor4x4 } from '@/types/cube4x4';

export const cloneCube4x4 = (cube: CubeState4x4): CubeState4x4 => ({
  U: [...cube.U],
  D: [...cube.D],
  F: [...cube.F],
  B: [...cube.B],
  L: [...cube.L],
  R: [...cube.R],
});

const rotateFaceCW = (face: Face4x4): Face4x4 => [
  face[12], face[8], face[4], face[0],
  face[13], face[9], face[5], face[1],
  face[14], face[10], face[6], face[2],
  face[15], face[11], face[7], face[3],
];

const rotateFaceCCW = (face: Face4x4): Face4x4 => [
  face[3], face[7], face[11], face[15],
  face[2], face[6], face[10], face[14],
  face[1], face[5], face[9], face[13],
  face[0], face[4], face[8], face[12],
];

export const applyMove4x4 = (cube: CubeState4x4, move: Move4x4): CubeState4x4 => {
  const c = cloneCube4x4(cube);

  switch (move) {
    // ===== U =====
    case 'U': {
      c.U = rotateFaceCW(cube.U);
      for (let i = 0; i < 4; i++) {
        c.F[i] = cube.R[i]; c.R[i] = cube.B[i];
        c.B[i] = cube.L[i]; c.L[i] = cube.F[i];
      }
      break;
    }
    case "U'": {
      c.U = rotateFaceCCW(cube.U);
      for (let i = 0; i < 4; i++) {
        c.F[i] = cube.L[i]; c.L[i] = cube.B[i];
        c.B[i] = cube.R[i]; c.R[i] = cube.F[i];
      }
      break;
    }
    case 'U2': return applyMove4x4(applyMove4x4(cube, 'U'), 'U');

    // ===== D =====
    case 'D': {
      c.D = rotateFaceCW(cube.D);
      for (let i = 12; i < 16; i++) {
        c.F[i] = cube.L[i]; c.L[i] = cube.B[i];
        c.B[i] = cube.R[i]; c.R[i] = cube.F[i];
      }
      break;
    }
    case "D'": {
      c.D = rotateFaceCCW(cube.D);
      for (let i = 12; i < 16; i++) {
        c.F[i] = cube.R[i]; c.R[i] = cube.B[i];
        c.B[i] = cube.L[i]; c.L[i] = cube.F[i];
      }
      break;
    }
    case 'D2': return applyMove4x4(applyMove4x4(cube, 'D'), 'D');

    // ===== R =====
    case 'R': {
      c.R = rotateFaceCW(cube.R);
      const col = [3, 7, 11, 15];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = [cube.B[12], cube.B[8], cube.B[4], cube.B[0]];
      for (let i = 0; i < 4; i++) {
        c.U[col[i]] = tF[i];
        c.F[col[i]] = tD[i];
        c.D[col[i]] = tB[3 - i];
      }
      c.B[12] = tU[0]; c.B[8] = tU[1]; c.B[4] = tU[2]; c.B[0] = tU[3];
      break;
    }
    case "R'": {
      c.R = rotateFaceCCW(cube.R);
      const col = [3, 7, 11, 15];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = [cube.B[12], cube.B[8], cube.B[4], cube.B[0]];
      for (let i = 0; i < 4; i++) {
        c.F[col[i]] = tU[i];
        c.D[col[i]] = tF[i];
        c.U[col[i]] = tB[3 - i];
      }
      c.B[12] = tD[0]; c.B[8] = tD[1]; c.B[4] = tD[2]; c.B[0] = tD[3];
      break;
    }
    case 'R2': return applyMove4x4(applyMove4x4(cube, 'R'), 'R');

    // ===== L =====
    case 'L': {
      c.L = rotateFaceCW(cube.L);
      const col = [0, 4, 8, 12];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = [cube.B[15], cube.B[11], cube.B[7], cube.B[3]];
      for (let i = 0; i < 4; i++) {
        c.F[col[i]] = tU[i];
        c.D[col[i]] = tF[i];
        c.U[col[i]] = tB[3 - i];
      }
      c.B[15] = tD[0]; c.B[11] = tD[1]; c.B[7] = tD[2]; c.B[3] = tD[3];
      break;
    }
    case "L'": {
      c.L = rotateFaceCCW(cube.L);
      const col = [0, 4, 8, 12];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = [cube.B[15], cube.B[11], cube.B[7], cube.B[3]];
      for (let i = 0; i < 4; i++) {
        c.U[col[i]] = tF[i];
        c.F[col[i]] = tD[i];
        c.D[col[i]] = tB[3 - i];
      }
      c.B[15] = tU[0]; c.B[11] = tU[1]; c.B[7] = tU[2]; c.B[3] = tU[3];
      break;
    }
    case 'L2': return applyMove4x4(applyMove4x4(cube, 'L'), 'L');

    // ===== F =====
    case 'F': {
      c.F = rotateFaceCW(cube.F);
      const tU = [cube.U[12], cube.U[13], cube.U[14], cube.U[15]];
      const tR = [cube.R[0], cube.R[4], cube.R[8], cube.R[12]];
      const tD = [cube.D[0], cube.D[1], cube.D[2], cube.D[3]];
      const tL = [cube.L[3], cube.L[7], cube.L[11], cube.L[15]];
      for (let i = 0; i < 4; i++) {
        c.R[i * 4] = tU[i];
        c.D[i] = tR[3 - i];
        c.L[i * 4 + 3] = tD[i];
        c.U[12 + i] = tL[3 - i];
      }
      break;
    }
    case "F'": {
      c.F = rotateFaceCCW(cube.F);
      const tU = [cube.U[12], cube.U[13], cube.U[14], cube.U[15]];
      const tR = [cube.R[0], cube.R[4], cube.R[8], cube.R[12]];
      const tD = [cube.D[0], cube.D[1], cube.D[2], cube.D[3]];
      const tL = [cube.L[3], cube.L[7], cube.L[11], cube.L[15]];
      for (let i = 0; i < 4; i++) {
        c.L[i * 4 + 3] = tU[3 - i];
        c.U[12 + i] = tR[i];
        c.R[i * 4] = tD[3 - i];
        c.D[i] = tL[i];
      }
      break;
    }
    case 'F2': return applyMove4x4(applyMove4x4(cube, 'F'), 'F');

    // ===== B =====
    case 'B': {
      c.B = rotateFaceCW(cube.B);
      const tU = [cube.U[0], cube.U[1], cube.U[2], cube.U[3]];
      const tR = [cube.R[3], cube.R[7], cube.R[11], cube.R[15]];
      const tD = [cube.D[12], cube.D[13], cube.D[14], cube.D[15]];
      const tL = [cube.L[0], cube.L[4], cube.L[8], cube.L[12]];
      for (let i = 0; i < 4; i++) {
        c.R[i * 4 + 3] = tU[i];
        c.D[12 + i] = tR[i];
        c.L[i * 4] = tD[3 - i];
        c.U[i] = tL[3 - i];
      }
      break;
    }
    case "B'": {
      c.B = rotateFaceCCW(cube.B);
      const tU = [cube.U[0], cube.U[1], cube.U[2], cube.U[3]];
      const tR = [cube.R[3], cube.R[7], cube.R[11], cube.R[15]];
      const tD = [cube.D[12], cube.D[13], cube.D[14], cube.D[15]];
      const tL = [cube.L[0], cube.L[4], cube.L[8], cube.L[12]];
      for (let i = 0; i < 4; i++) {
        c.L[i * 4] = tU[i];
        c.U[i] = tR[3 - i];
        c.R[i * 4 + 3] = tD[3 - i];
        c.D[12 + i] = tL[i];
      }
      break;
    }
    case 'B2': return applyMove4x4(applyMove4x4(cube, 'B'), 'B');

    // ===== Inner u (2nd row, same dir as U) =====
    case 'u': {
      for (let i = 4; i < 8; i++) {
        c.F[i] = cube.R[i]; c.R[i] = cube.B[i];
        c.B[i] = cube.L[i]; c.L[i] = cube.F[i];
      }
      break;
    }
    case "u'": {
      for (let i = 4; i < 8; i++) {
        c.F[i] = cube.L[i]; c.L[i] = cube.B[i];
        c.B[i] = cube.R[i]; c.R[i] = cube.F[i];
      }
      break;
    }
    case 'u2': return applyMove4x4(applyMove4x4(cube, 'u'), 'u');

    // ===== Inner d (3rd row, same dir as D) =====
    case 'd': {
      for (let i = 8; i < 12; i++) {
        c.F[i] = cube.L[i]; c.L[i] = cube.B[i];
        c.B[i] = cube.R[i]; c.R[i] = cube.F[i];
      }
      break;
    }
    case "d'": {
      for (let i = 8; i < 12; i++) {
        c.F[i] = cube.R[i]; c.R[i] = cube.B[i];
        c.B[i] = cube.L[i]; c.L[i] = cube.F[i];
      }
      break;
    }
    case 'd2': return applyMove4x4(applyMove4x4(cube, 'd'), 'd');

    // ===== Inner r (col [2,6,10,14], same dir as R) =====
    case 'r': {
      const col = [2, 6, 10, 14];
      const bCol = [13, 9, 5, 1]; // B 2nd col from left, reversed
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = bCol.map(j => cube.B[j]);
      for (let i = 0; i < 4; i++) {
        c.U[col[i]] = tF[i];
        c.F[col[i]] = tD[i];
        c.D[col[i]] = tB[3 - i];
      }
      c.B[bCol[0]] = tU[3]; c.B[bCol[1]] = tU[2];
      c.B[bCol[2]] = tU[1]; c.B[bCol[3]] = tU[0];
      break;
    }
    case "r'": {
      const col = [2, 6, 10, 14];
      const bCol = [13, 9, 5, 1];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = bCol.map(j => cube.B[j]);
      for (let i = 0; i < 4; i++) {
        c.F[col[i]] = tU[i];
        c.D[col[i]] = tF[i];
        c.U[col[i]] = tB[3 - i];
      }
      c.B[bCol[0]] = tD[3]; c.B[bCol[1]] = tD[2];
      c.B[bCol[2]] = tD[1]; c.B[bCol[3]] = tD[0];
      break;
    }
    case 'r2': return applyMove4x4(applyMove4x4(cube, 'r'), 'r');

    // ===== Inner l (col [1,5,9,13], same dir as L) =====
    case 'l': {
      const col = [1, 5, 9, 13];
      const bCol = [14, 10, 6, 2]; // B 2nd col from right, reversed
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = bCol.map(j => cube.B[j]);
      for (let i = 0; i < 4; i++) {
        c.F[col[i]] = tU[i];
        c.D[col[i]] = tF[i];
        c.U[col[i]] = tB[3 - i];
      }
      c.B[bCol[0]] = tD[3]; c.B[bCol[1]] = tD[2];
      c.B[bCol[2]] = tD[1]; c.B[bCol[3]] = tD[0];
      break;
    }
    case "l'": {
      const col = [1, 5, 9, 13];
      const bCol = [14, 10, 6, 2];
      const tU = col.map(j => cube.U[j]);
      const tF = col.map(j => cube.F[j]);
      const tD = col.map(j => cube.D[j]);
      const tB = bCol.map(j => cube.B[j]);
      for (let i = 0; i < 4; i++) {
        c.U[col[i]] = tF[i];
        c.F[col[i]] = tD[i];
        c.D[col[i]] = tB[3 - i];
      }
      c.B[bCol[0]] = tU[3]; c.B[bCol[1]] = tU[2];
      c.B[bCol[2]] = tU[1]; c.B[bCol[3]] = tU[0];
      break;
    }
    case 'l2': return applyMove4x4(applyMove4x4(cube, 'l'), 'l');

    // ===== Inner f (slice behind F: U row 8-11, R col [1,5,9,13], D row 4-7, L col [2,6,10,14]) =====
    case 'f': {
      const tU = [cube.U[8], cube.U[9], cube.U[10], cube.U[11]];
      const tR = [cube.R[1], cube.R[5], cube.R[9], cube.R[13]];
      const tD = [cube.D[4], cube.D[5], cube.D[6], cube.D[7]];
      const tL = [cube.L[2], cube.L[6], cube.L[10], cube.L[14]];
      for (let i = 0; i < 4; i++) {
        c.R[1 + i * 4] = tU[i];
        c.D[4 + i] = tR[3 - i];
        c.L[i * 4 + 2] = tD[i];
        c.U[8 + i] = tL[3 - i];
      }
      break;
    }
    case "f'": {
      const tU = [cube.U[8], cube.U[9], cube.U[10], cube.U[11]];
      const tR = [cube.R[1], cube.R[5], cube.R[9], cube.R[13]];
      const tD = [cube.D[4], cube.D[5], cube.D[6], cube.D[7]];
      const tL = [cube.L[2], cube.L[6], cube.L[10], cube.L[14]];
      for (let i = 0; i < 4; i++) {
        c.L[i * 4 + 2] = tU[3 - i];
        c.U[8 + i] = tR[i];
        c.R[1 + i * 4] = tD[3 - i];
        c.D[4 + i] = tL[i];
      }
      break;
    }
    case 'f2': return applyMove4x4(applyMove4x4(cube, 'f'), 'f');

    // ===== Inner b (slice behind B: U row 4-7, R col [2,6,10,14], D row 8-11, L col [1,5,9,13]) =====
    case 'b': {
      const tU = [cube.U[4], cube.U[5], cube.U[6], cube.U[7]];
      const tR = [cube.R[2], cube.R[6], cube.R[10], cube.R[14]];
      const tD = [cube.D[8], cube.D[9], cube.D[10], cube.D[11]];
      const tL = [cube.L[1], cube.L[5], cube.L[9], cube.L[13]];
      for (let i = 0; i < 4; i++) {
        c.R[i * 4 + 2] = tU[i];
        c.D[8 + i] = tR[i];
        c.L[1 + i * 4] = tD[3 - i];
        c.U[4 + i] = tL[3 - i];
      }
      break;
    }
    case "b'": {
      c.B = cube.B; // no face rotation for inner
      const tU = [cube.U[4], cube.U[5], cube.U[6], cube.U[7]];
      const tR = [cube.R[2], cube.R[6], cube.R[10], cube.R[14]];
      const tD = [cube.D[8], cube.D[9], cube.D[10], cube.D[11]];
      const tL = [cube.L[1], cube.L[5], cube.L[9], cube.L[13]];
      for (let i = 0; i < 4; i++) {
        c.L[1 + i * 4] = tU[i];
        c.U[4 + i] = tR[3 - i];
        c.R[i * 4 + 2] = tD[3 - i];
        c.D[8 + i] = tL[i];
      }
      break;
    }
    case 'b2': return applyMove4x4(applyMove4x4(cube, 'b'), 'b');

    default:
      return c;
  }

  return c;
};

export const applyMoves4x4 = (cube: CubeState4x4, moves: Move4x4[]): CubeState4x4 => {
  return moves.reduce((state, move) => applyMove4x4(state, move), cube);
};

export const generateScramble4x4 = (length: number = 40): Move4x4[] => {
  const faces: ('F' | 'R' | 'U' | 'B' | 'L' | 'D')[] = ['F', 'R', 'U', 'B', 'L', 'D'];
  const modifiers: ('' | "'" | '2')[] = ['', "'", '2'];
  const moves: Move4x4[] = [];
  let lastFace = '';

  for (let i = 0; i < length; i++) {
    let face: string;
    do {
      face = faces[Math.floor(Math.random() * faces.length)];
    } while (face === lastFace);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    moves.push((face + modifier) as Move4x4);
    lastFace = face;
  }

  return moves;
};

export const isSolved4x4 = (cube: CubeState4x4): boolean => {
  return (
    cube.U.every(c => c === cube.U[0]) &&
    cube.D.every(c => c === cube.D[0]) &&
    cube.F.every(c => c === cube.F[0]) &&
    cube.B.every(c => c === cube.B[0]) &&
    cube.L.every(c => c === cube.L[0]) &&
    cube.R.every(c => c === cube.R[0])
  );
};
