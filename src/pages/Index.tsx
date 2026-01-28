import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, RotateCcw, Sparkles, Loader2, AlertCircle, Box } from 'lucide-react';
import { useCube } from '@/hooks/useCube';
import { Cube3D } from '@/components/cube/Cube3D';
import { CubeNet } from '@/components/cube/CubeNet';
import { ColorPicker } from '@/components/cube/ColorPicker';
import { MoveControls } from '@/components/cube/MoveControls';
import { SolutionDisplay } from '@/components/cube/SolutionDisplay';
import { Header } from '@/components/Header';
import { CubeColor } from '@/types/cube';

type ViewMode = '3d' | 'net';

const Index = () => {
  const {
    cube,
    solution,
    currentStep,
    isPlaying,
    isSolving,
    error,
    isCubeSolved,
    reset,
    scramble,
    executeMove,
    setFaceColor,
    solve,
    stepForward,
    stepBackward,
    jumpToStep,
    setIsPlaying,
  } = useCube();

  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [selectedColor, setSelectedColor] = useState<CubeColor | null>(null);
  const [rotation, setRotation] = useState({ x: -25, y: -35 });

  // Auto-play solution
  useEffect(() => {
    if (isPlaying && solution && currentStep < solution.length) {
      const timer = setTimeout(() => {
        stepForward();
      }, 600);
      return () => clearTimeout(timer);
    } else if (isPlaying && solution && currentStep >= solution.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, solution, stepForward, setIsPlaying]);

  const handleResetSolution = () => {
    if (solution) {
      jumpToStep(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Cube Visualization */}
          <div className="space-y-6">
            {/* View toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === '3d'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setViewMode('net')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'net'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Flat View
              </button>
            </div>

            {/* Cube display */}
            <motion.div 
              className="glass-panel p-8 flex items-center justify-center min-h-[320px]"
              layout
            >
              {viewMode === '3d' ? (
                <Cube3D 
                  cube={cube} 
                  rotationX={rotation.x} 
                  rotationY={rotation.y} 
                />
              ) : (
                <CubeNet 
                  cube={cube}
                  onCellClick={selectedColor ? (face, index) => setFaceColor(face, index, selectedColor) : undefined}
                  selectedColor={selectedColor}
                />
              )}
            </motion.div>

            {/* 3D rotation controls */}
            {viewMode === '3d' && (
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rotate:</span>
                  <button
                    onClick={() => setRotation(r => ({ ...r, y: r.y - 45 }))}
                    className="move-btn px-3 py-1"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setRotation(r => ({ ...r, y: r.y + 45 }))}
                    className="move-btn px-3 py-1"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setRotation(r => ({ ...r, x: r.x - 30 }))}
                    className="move-btn px-3 py-1"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => setRotation(r => ({ ...r, x: r.x + 30 }))}
                    className="move-btn px-3 py-1"
                  >
                    ↓
                  </button>
                </div>
              </div>
            )}

            {/* Solved indicator */}
            {isCubeSolved && !solution && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 px-6 rounded-xl bg-success/10 border border-success/20"
              >
                <span className="text-success font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Cube is solved!
                </span>
              </motion.div>
            )}
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Color picker for net view */}
            {viewMode === 'net' && (
              <div className="glass-panel p-6">
                <ColorPicker
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                />
              </div>
            )}

            {/* Move controls */}
            <div className="glass-panel p-6">
              <MoveControls 
                onMove={executeMove} 
                disabled={isSolving || isPlaying}
              />
            </div>

            {/* Action buttons */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={scramble}
                  disabled={isSolving || isPlaying}
                  className="action-btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Scramble
                </button>
                <button
                  onClick={reset}
                  disabled={isSolving || isPlaying}
                  className="action-btn-secondary flex-1 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
              
              <button
                onClick={solve}
                disabled={isSolving || isCubeSolved || isPlaying}
                className="action-btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
              >
                {isSolving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Solving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Solve
                  </>
                )}
              </button>

              {/* Error display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Solution display */}
            <SolutionDisplay
              solution={solution}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onJumpToStep={jumpToStep}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onReset={handleResetSolution}
            />

            {/* Instructions */}
            {!solution && (
              <div className="glass-panel p-6 space-y-3">
                <h3 className="font-semibold text-foreground">How to use</h3>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <span className="text-primary font-mono">1.</span>
                    Switch to <strong>Flat View</strong> to input your cube's colors
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-mono">2.</span>
                    Select a color, then click cells to paint them
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-mono">3.</span>
                    Or click <strong>Scramble</strong> to generate a random puzzle
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-mono">4.</span>
                    Click <strong>Solve</strong> and follow the step-by-step solution
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-4 text-center text-sm text-muted-foreground">
        RuFix • Rubik's Cube Solver using Kociemba Algorithm
      </footer>
    </div>
  );
};

export default Index;
