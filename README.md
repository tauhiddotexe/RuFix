# RuFix — Rubik's Cube Solver & Visualizer

[![Live Demo](https://img.shields.io/badge/live%20demo-rufix.vercel.app-blue)](https://rufix.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)

A modern, interactive Rubik's Cube solver with real-time 3D visualization, supporting 2×2, 3×3 cubes, and experimental 4×4 solver. Built with React, TypeScript, and cutting-edge web technologies.

---

## ✨ Features

| Feature | Status | Details |
|---------|--------|---------|
| **3×3 Solver** | ✅ Complete | Kociemba two-phase algorithm via cubejs (solves any valid state in <2s) |
| **2×2 Solver** | ✅ Complete | BFS-based optimal solver with move sequence generation |
| **4×4 Solver** | 🧪 Experimental | Scramble-inverse solver (not a true real-world solver yet) |
| **3D Visualization** | ✅ Complete | Interactive CSS 3D cube with smooth rotation controls |
| **2D Net View** | ✅ Complete | Flat net visualization with interactive sticker editing |
| **Camera Scanner** | ✅ Complete | Input cube colors directly via webcam |
| **Solution Playback** | ✅ Complete | Step-forward, step-backward, jump-to-step, autoplay with adjustable speed |
| **Manual Controls** | ✅ Complete | Directional move arrows with visual feedback |
| **Cube Scrambler** | ✅ Complete | Generate random scrambles or apply custom sequences |

---

## 🎯 Roadmap

### Near-term (v1.1)
- [ ] **Real 4×4 Solver** — Implement proper 4×4 solving algorithm with parity handling
- [ ] **Adjustable Playback Speed** — Control solution animation timing
- [ ] **Mobile Responsiveness** — Full mobile/tablet support with touch controls
- [ ] **Step-by-step Mode** — Interactive "next hint" guidance for learning

### Mid-term (v1.2-v1.3)
- [ ] **5×5 Cube Support** — Full solving and visualization
- [ ] **Better 3D Interactions** — Drag-to-rotate, pinch-to-zoom, gesture support
- [ ] **UI/UX Redesign** — Modern layout with improved accessibility
- [ ] **Statistics & History** — Track solve times, save solutions, replay history
- [ ] **Cube State Import/Export** — JSON/image format support

### Long-term (v2.0+)
- [ ] **6×6 & 7×7 Support** — With architecture planning for NxN scalability
- [ ] **Real Camera Recognition** — Scan physical cubes via device camera
- [ ] **Multiplayer Mode** — Competitive solving with timer
- [ ] **Teaching Mode** — Interactive tutorials and learning paths
- [ ] **Performance Optimization** — WASM solver for faster computations
- [ ] **Offline Support** — Progressive Web App with service workers

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and **npm** 8+
- Modern browser with WebGL support (for 3D visualization)

### Installation

```bash
# Clone the repository
git clone https://github.com/tauhiddotexe/RuFix.git
cd RuFix

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint with ESLint
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── cube/
│   │   ├── Cube3D.tsx              # 3D cube rendering (CSS transforms)
│   │   ├── CubeNet.tsx             # 2D net visualization and editing
│   │   ├── Cube2x2Solver.tsx       # 2×2 solver UI component
│   │   ├── Cube4x4Solver.tsx       # 4×4 solver UI component (experimental)
│   │   ├── MoveControls.tsx        # Manual move buttons with visual feedback
│   │   ├── ColorPicker.tsx         # Color selection UI
│   │   ├── SolutionDisplay.tsx     # Solution steps display and playback
│   │   ├── CameraScanner.tsx       # Camera-based color input
│   │   └── CubeTransformVisuals.tsx # Active move visualization
│   ├── ui/                         # shadcn/ui reusable components
│   ├── Header.tsx                  # App header and navigation
│   └── ...
├── hooks/
│   ├── useCube.ts                  # 3×3 cube state management
│   ├── useCube2x2.ts               # 2×2 cube state management
│   ├── useCube4x4.ts               # 4×4 cube state management
│   └── ...
├── lib/
│   ├── cubeUtils.ts                # Cube state transformations
│   ├── cubeSolver.ts               # 3×3 solver interface
│   ├── cubeSolverCore.ts           # Core solving logic (cubejs wrapper)
│   ├── solver3x3.worker.ts         # Web Worker for non-blocking solving
│   ├── cube2x2Solver.ts            # 2×2 BFS solver
│   ├── cube4x4Solver.ts            # 4×4 solver (experimental)
│   └── utils.ts                    # General utility functions
├── types/
│   └── cube.ts                     # TypeScript cube type definitions
├── pages/
│   ├── Index.tsx                   # Main app page with 3D/2D tabs
│   └── NotFound.tsx                # 404 error page
├── test/                           # Vitest unit tests
│   ├── cubeUtils.test.ts
│   ├── cubeSolver.test.ts
│   ├── cube2x2Solver.test.ts
│   └── ...
├── App.tsx                         # Root React component
├── main.tsx                        # React app entry point
└── index.css                       # Global styles with Tailwind

# Configuration files
├── vite.config.ts                  # Vite build configuration
├── vitest.config.ts                # Vitest testing configuration
├── tailwind.config.ts              # Tailwind CSS customization
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # ESLint rules
└── package.json                    # Dependencies and scripts
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18.3 | Modern UI components |
| **Language** | TypeScript 5.8 | Type-safe JavaScript |
| **Build Tool** | Vite 5.4 | Fast development & production builds |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Accessible, customizable components |
| **Animations** | Framer Motion 12.29 | Smooth motion and transitions |
| **Routing** | React Router 6.30 | Client-side page routing |
| **Icons** | Lucide React 0.462 | Beautiful, consistent icons |
| **Solving (3×3)** | cubejs 1.3.2 | Kociemba algorithm implementation |
| **Testing** | Vitest 3.2 | Fast unit test framework |
| **Testing Library** | React Testing Library 16 | Component testing utilities |
| **CSS-in-JS** | Tailwind Merge | Smart class merging |

---

## 🔧 Architecture & Design Patterns

### Cube State Management
- **Hook-based architecture** — Each cube size (2×2, 3×3, 4×4) has dedicated hooks
- **Immutable updates** — Cube state is never mutated; new states are created
- **Efficient re-renders** — State is normalized to prevent unnecessary component updates

### 3D Rendering
- **CSS 3D Transforms** — Hardware-accelerated, cross-browser compatible
- **Transform matrices** — Precise control over cube orientation
- **No external 3D library** — Lightweight and performant

### Solver Implementation
- **Web Workers** — Solving runs off the main thread to keep UI responsive
- **Async/await pattern** — Clean promise-based API
- **Timeout handling** — Long-running solves won't freeze the app

### Testing Strategy
- **Unit tests** — Core logic (cube moves, solving) thoroughly tested
- **Component tests** — UI components tested with React Testing Library
- **Type safety** — TypeScript prevents entire classes of runtime errors

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, implementing features, or improving documentation, here's how to get started:

### For New Contributors
1. **Read** [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines
2. **Check** [good first issue](https://github.com/tauhiddotexe/RuFix/labels/good%20first%20issue) labels for beginner-friendly tasks
3. **Start small** — Pick an issue, fork the repo, and submit a pull request

### Development Workflow
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint
npm run test
npm run build

# Commit with clear messages
git commit -m "feat: Add adjustable playback speed"

# Push and create a PR
git push origin feature/your-feature-name
```

### Code Quality Standards
- **ESLint** — All code must pass linting checks (`npm run lint`)
- **TypeScript** — No `any` types without justification
- **Tests** — New features should include tests
- **Documentation** — Update relevant docs and comments

---

## 📚 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Contribution guidelines and workflow
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** — Community standards and behavior
- **[SECURITY.md](SECURITY.md)** — Security policy and vulnerability reporting
- **Inline Comments** — Code is extensively commented for clarity

---

## 🐛 Known Limitations & TODOs

### Current Limitations
- **4×4 Solver** is experimental and doesn't solve arbitrary scrambles correctly (only reverses sequences)
- **Mobile UX** needs optimization (touch controls, responsive layout)
- **Camera Scanner** works in well-lit environments; poor lighting affects accuracy

### Performance Considerations
- Complex scrambles may take 1-2 seconds to solve (due to Kociemba algorithm complexity)
- 3D rendering on low-end devices may be less smooth
- Camera scanning is computationally intensive on mobile

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details. You're free to use, modify, and distribute this software with proper attribution.

---

## 🙏 Acknowledgments

- **cubejs** — Incredible Kociemba algorithm implementation in JavaScript
- **shadcn/ui** — Beautiful, accessible component library built on Radix UI
- **Framer Motion** — Industry-leading animation library for React
- **The Speedcubing Community** — Inspiration and validation from the cubing world
- **Open Source Contributors** — Every improvement makes RuFix better

---

## 📞 Support & Questions

- **Issues** — Found a bug? [Create an issue](https://github.com/tauhiddotexe/RuFix/issues/new)
- **Discussions** — Have questions? [Start a discussion](https://github.com/tauhiddotexe/RuFix/discussions)
- **Live Demo** — Try it out at [rufix.vercel.app](https://rufix.vercel.app/)

---

## 🎮 Next Steps

New to the project? Start here:
1. ⭐ **Star the repo** if you find it interesting
2. 🍴 **Fork** to start contributing
3. 📖 **Read [CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines
4. 🎯 **Pick a [good first issue](https://github.com/tauhiddotexe/RuFix/labels/good%20first%20issue)** to work on
5. 🚀 **Submit a pull request** and join the community!

---

**Built with ❤️ by [tauhiddotexe](https://github.com/tauhiddotexe) • [Live Demo](https://rufix.vercel.app/)**
