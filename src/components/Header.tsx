import { Box } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Box className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              RuFix
            </h1>
            <p className="text-xs text-muted-foreground">
              Rubik's Cube Solver
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Enter colors • Click Solve • Follow steps
        </div>
      </div>
    </header>
  );
};
