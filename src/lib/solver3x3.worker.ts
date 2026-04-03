/// <reference lib="webworker" />

import { CubeState } from '@/types/cube';
import { solveCubeSync, type SolveResult } from './cubeSolverCore';

type SolveWorkerRequest = {
  cube: CubeState;
  options?: {
    skipValidation?: boolean;
  };
};

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<SolveWorkerRequest>) => {
  try {
    const result: SolveResult = solveCubeSync(event.data.cube, event.data.options);
    workerScope.postMessage(result);
  } catch (error) {
    console.error('3x3 solver worker failed:', error);
    workerScope.postMessage({
      success: false,
      error: 'Solver worker failed while processing the cube.',
    } satisfies SolveResult);
  }
};

export {};
