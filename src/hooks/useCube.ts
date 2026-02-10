import { useState, useCallback } from 'react';
import { CubeState, Move, CubeColor, SOLVED_CUBE } from '@/types/cube';
import { applyMove, applyMoves, generateScramble, cloneCube, isSolved } from '@/lib/cubeUtils';
import { solveWithTimeout } from '@/lib/cubeSolver';

export const useCube = () => {
  const [cube, setCube] = useState<CubeState>(cloneCube(SOLVED_CUBE));
  const [solution, setSolution] = useState<Move[] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setCube(cloneCube(SOLVED_CUBE));
    setSolution(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setError(null);
  }, []);

  const scramble = useCallback(() => {
    const moves = generateScramble(4);
    setCube(applyMoves(cloneCube(SOLVED_CUBE), moves));
    setSolution(null);
    setCurrentStep(0);
    setError(null);
  }, []);

  const executeMove = useCallback((move: Move) => {
    setCube(prev => applyMove(prev, move));
    setSolution(null);
    setCurrentStep(0);
  }, []);

  const setFaceColor = useCallback((face: keyof CubeState, index: number, color: CubeColor) => {
    setCube(prev => {
      const newCube = cloneCube(prev);
      newCube[face][index] = color;
      return newCube;
    });
    setSolution(null);
    setCurrentStep(0);
    setError(null);
  }, []);

  const setCubeState = useCallback((newCube: CubeState) => {
    setCube(cloneCube(newCube));
    setSolution(null);
    setCurrentStep(0);
    setError(null);
  }, []);

  const solve = useCallback(async () => {
    setIsSolving(true);
    setError(null);
    setSolution(null);
    setCurrentStep(0);

    try {
      const result = await solveWithTimeout(cube, 15000);
      
      if (result.success && result.solution) {
        setSolution(result.solution);
      } else {
        setError(result.error || 'Failed to solve cube');
      }
    } catch (e) {
      setError('An error occurred while solving');
    } finally {
      setIsSolving(false);
    }
  }, [cube]);

  const stepForward = useCallback(() => {
    if (solution && currentStep < solution.length) {
      setCube(prev => applyMove(prev, solution[currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [solution, currentStep]);

  const stepBackward = useCallback(() => {
    if (solution && currentStep > 0) {
      const moveToUndo = solution[currentStep - 1];
      const inverseMove = moveToUndo.includes("'") 
        ? moveToUndo.replace("'", '') as Move
        : moveToUndo.includes('2') 
          ? moveToUndo 
          : (moveToUndo + "'") as Move;
      setCube(prev => applyMove(prev, inverseMove));
      setCurrentStep(prev => prev - 1);
    }
  }, [solution, currentStep]);

  const jumpToStep = useCallback((step: number) => {
    if (!solution) return;
    
    // Rebuild cube state from scratch up to the target step
    let newCube = cloneCube(SOLVED_CUBE);
    
    // First apply scramble (reverse solution from current state)
    // This is a simplification - in production, store original scrambled state
    for (let i = solution.length - 1; i >= 0; i--) {
      const move = solution[i];
      const inverseMove = move.includes("'") 
        ? move.replace("'", '') as Move
        : move.includes('2') 
          ? move 
          : (move + "'") as Move;
      newCube = applyMove(newCube, inverseMove);
    }
    
    // Apply solution up to target step
    for (let i = 0; i < step; i++) {
      newCube = applyMove(newCube, solution[i]);
    }
    
    setCube(newCube);
    setCurrentStep(step);
  }, [solution]);

  return {
    cube,
    solution,
    currentStep,
    isPlaying,
    isSolving,
    error,
    isCubeSolved: isSolved(cube),
    reset,
    scramble,
    executeMove,
    setFaceColor,
    setCubeState,
    solve,
    stepForward,
    stepBackward,
    jumpToStep,
    setIsPlaying,
  };
};
