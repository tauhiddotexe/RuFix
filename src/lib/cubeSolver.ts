import { CubeState } from '@/types/cube';
import { solveCubeSync, validateCube, type SolveResult } from './cubeSolverCore';

export { validateCube };

export const solveCube = async (
  cube: CubeState,
  options?: { skipValidation?: boolean; timeLimitMs?: number }
): Promise<SolveResult> => {
  return solveCubeSync(cube, options);
};

const createSolverWorker = () => {
  return new Worker(new URL('./solver3x3.worker.ts', import.meta.url), { type: 'module' });
};

export const solveWithTimeout = (
  cube: CubeState,
  timeoutMs: number = 15000
): Promise<SolveResult> => {
  if (typeof Worker === 'undefined') {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: 'Solver timeout. Try a simpler scramble.' });
      }, timeoutMs);

      Promise.resolve(solveCube(cube)).then((result) => {
        clearTimeout(timeout);
        resolve(result);
      });
    });
  }

  return new Promise((resolve) => {
    const worker = createSolverWorker();

    const cleanup = () => {
      clearTimeout(timeout);
      worker.terminate();
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ success: false, error: 'Solver timeout. Try a simpler scramble.' });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<SolveResult>) => {
      cleanup();
      resolve(event.data);
    };

    worker.onerror = () => {
      cleanup();
      resolve({ success: false, error: 'Solver worker crashed. Please try again.' });
    };

    worker.postMessage({ cube });
  });
};
