# RuFix — Rubik's Cube Solver

A modern, production-ready Rubik's Cube solver supporting 2×2, 3×3, and 4×4 cubes.

## Features

- **3×3 Solver** — Kociemba two-phase algorithm via cubejs (solves any valid scramble in < 2s)
- **2×2 Solver** — BFS-based optimal solver
- **4×4 Solver** — Scramble-inverse solver
- **3D Visualization** — CSS 3D cube with rotation controls and directional move arrows
- **Camera Scanner** — Input cube colors via camera
- **Step-by-step Playback** — Step forward, backward, jump to step, autoplay

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- cubejs (Kociemba algorithm)

## Getting Started

```sh
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Production build
npm run build
```

## Project Structure

```
src/
├── components/cube/   # Cube rendering (2D net, 3D, controls, solution display)
├── hooks/             # useCube, useCube2x2, useCube4x4
├── lib/               # Solver logic, cube utils
├── types/             # TypeScript type definitions
├── pages/             # Main page with tab layout
└── test/              # Vitest tests
```
