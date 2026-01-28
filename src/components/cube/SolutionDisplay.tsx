import { Move } from '@/types/cube';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipBack,
  RotateCcw 
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SolutionDisplayProps {
  solution: Move[] | null;
  currentStep: number;
  isPlaying: boolean;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (step: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
}

export const SolutionDisplay = ({
  solution,
  currentStep,
  isPlaying,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onPlayPause,
  onReset,
}: SolutionDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current step
  useEffect(() => {
    if (containerRef.current && solution) {
      const activeElement = containerRef.current.querySelector('.active');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep, solution]);

  if (!solution) {
    return null;
  }

  const isComplete = currentStep >= solution.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Solution</h3>
          <p className="text-sm text-muted-foreground">
            {solution.length} moves • Step {currentStep} of {solution.length}
          </p>
        </div>
        <AnimatePresence>
          {isComplete && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium"
            >
              ✓ Solved!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Move list */}
      <div 
        ref={containerRef}
        className="flex gap-2 overflow-x-auto py-2 scrollbar-thin"
      >
        {solution.map((move, index) => (
          <button
            key={index}
            onClick={() => onJumpToStep(index)}
            className={cn(
              'solution-step flex-shrink-0',
              index < currentStep && 'completed',
              index === currentStep && 'active'
            )}
          >
            {move}
          </button>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          className="move-btn p-2"
          title="Reset to start"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className={cn(
            'move-btn p-2',
            currentStep === 0 && 'opacity-50 cursor-not-allowed'
          )}
          title="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onPlayPause}
          disabled={isComplete}
          className={cn(
            'action-btn-primary p-3 rounded-full',
            isComplete && 'opacity-50 cursor-not-allowed'
          )}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>
        <button
          onClick={onStepForward}
          disabled={isComplete}
          className={cn(
            'move-btn p-2',
            isComplete && 'opacity-50 cursor-not-allowed'
          )}
          title="Next step"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / solution.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};
