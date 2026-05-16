# Contributing to RuFix

Thank you for your interest in contributing to RuFix! We're excited to have you help make this project better. Whether you're fixing bugs, adding features, improving documentation, or sharing ideas, your contributions are valuable.

---

## 🎯 Code of Conduct

Please read and follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). We're committed to providing a welcoming and inclusive environment for all contributors.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and **npm** 8+
- **Git** for version control
- Familiarity with **React**, **TypeScript**, and **CSS**

### Development Setup

```bash
# 1. Fork the repository
# Click "Fork" on GitHub

# 2. Clone your fork locally
git clone https://github.com/YOUR-USERNAME/RuFix.git
cd RuFix

# 3. Add upstream remote
git remote add upstream https://github.com/tauhiddotexe/RuFix.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

### Verify Your Setup
```bash
# Run tests
npm test

# Run linter
npm run lint

# Build project
npm run build
```

If all commands pass, you're ready to contribute! ✅

---

## 📋 Finding Issues to Work On

### Good First Issues
Start with issues labeled **[good first issue](https://github.com/tauhiddotexe/RuFix/labels/good%20first%20issue)** — these are beginner-friendly and perfect for new contributors.

### Issue Labels Guide

| Label | Meaning | Difficulty |
|-------|---------|-----------|
| `good first issue` | Perfect for newcomers | ⭐ Beginner |
| `bug` | Something is broken | Varies |
| `enhancement` | New feature or improvement | Varies |
| `documentation` | Docs, comments, examples | ⭐ Easy |
| `performance` | Speed/optimization | ⭐⭐⭐ Hard |
| `3d-rendering` | 3D visualization work | ⭐⭐ Medium |
| `4x4-solver` | 4×4 cube algorithm | ⭐⭐⭐ Hard |
| `help wanted` | Maintainers need assistance | Varies |

---

## 🛠️ Development Workflow

### 1. Create a Feature Branch

```bash
# Always branch from upstream/main
git fetch upstream
git checkout -b feature/your-feature-name upstream/main
```

**Branch naming convention:**
- `feature/add-playback-speed` — New features
- `fix/camera-scanner-bug` — Bug fixes
- `docs/improve-readme` — Documentation
- `refactor/cube-utils-cleanup` — Refactoring
- `perf/optimize-solver` — Performance

### 2. Make Your Changes

```bash
# Edit files
# Keep changes focused and atomic

# Run linter
npm run lint

# Run tests
npm test

# Preview changes
npm run build
npm run preview
```

**Code Quality Checklist:**
- [ ] Code follows project style (enforced by ESLint)
- [ ] TypeScript has no `any` types without justification
- [ ] New functions have JSDoc comments
- [ ] Tests pass (`npm test`)
- [ ] No console errors or warnings
- [ ] Changes are well-scoped (single feature/fix)

### 3. Commit with Clear Messages

```bash
git add .
git commit -m "feat: Add adjustable playback speed control"
```

**Commit message format:**
```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation only
- `style` — Code style (formatting, missing semicolons, etc.)
- `refactor` — Code refactoring without feature changes
- `perf` — Performance improvements
- `test` — Adding or updating tests
- `chore` — Build process, dependencies, tooling

**Examples:**
```
feat(playback): Add adjustable speed control (0.5x - 2x)
fix(camera): Handle low-light conditions better
docs(readme): Add architecture section
refactor(cubeUtils): Extract rotation logic to separate function
perf(solver): Cache cube state transformations
```

### 4. Push and Create a Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a PR
# Link related issues using "Closes #123"
```

**PR Title Format:**
```
[Type] Brief description of changes
```

Examples:
- `[Feature] Add playback speed control`
- `[Bug Fix] Fix camera scanner in dark environments`
- `[Docs] Improve solver architecture documentation`

**PR Template (use this in your description):**
```markdown
## Description
Brief explanation of what this PR does.

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
Describe how you tested your changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
```

### 5. Respond to Code Review

Maintainers may request changes. This is normal and helps maintain code quality:
- Be open to feedback
- Ask questions if something is unclear
- Make requested changes
- Push updates (no need for new PR)
- Request re-review when ready

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run specific test file
npm test -- cubeUtils.test.ts

# Run with coverage
npm test -- --coverage
```

### Writing Tests

Create test files alongside implementation:
```
src/lib/cubeUtils.ts      → src/test/cubeUtils.test.ts
src/lib/cubeSolver.ts     → src/test/cubeSolver.test.ts
```

**Example test:**
```typescript
import { describe, it, expect } from 'vitest';
import { applyMove } from '@/lib/cubeUtils';
import { SOLVED_CUBE } from '@/types/cube';

describe('cubeUtils - applyMove', () => {
  it('should rotate F face correctly', () => {
    const result = applyMove(SOLVED_CUBE, 'F');
    expect(result.F).toEqual(['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']);
  });

  it('should handle inverse moves', () => {
    const once = applyMove(SOLVED_CUBE, 'R');
    const twice = applyMove(once, 'R');
    const thrice = applyMove(twice, 'R');
    const four = applyMove(thrice, 'R');
    expect(four).toEqual(SOLVED_CUBE);
  });
});
```

---

## 📖 Documentation Standards

### Code Comments
```typescript
// ✅ Good - explains the WHY
// We clone the cube to avoid mutating the original state,
// which would break React's change detection
const newCube = cloneCube(cube);

// ❌ Bad - obvious from code
// Create a copy of the cube
const newCube = cloneCube(cube);
```

### JSDoc Comments
```typescript
/**
 * Applies a single move to the cube state.
 * 
 * @param cube - Current cube state
 * @param move - Valid cube move (e.g., 'R', "R'", 'R2')
 * @returns New cube state after applying move
 * 
 * @example
 * const newCube = applyMove(solvedCube, 'R');
 */
export const applyMove = (cube: CubeState, move: Move): CubeState => {
  // implementation
};
```

### README Updates
When adding features, update the relevant section in [README.md](README.md):
- Add to **Features** table
- Update **Project Structure** if needed
- Add setup/usage instructions if applicable

---

## 🐛 Reporting Bugs

Found a bug? [Create an issue](https://github.com/tauhiddotexe/RuFix/issues/new/choose) with:

1. **Clear title** — "Camera scanner fails in low light"
2. **Steps to reproduce** — Exact steps to trigger the bug
3. **Expected vs actual behavior** — What should happen vs what happens
4. **Screenshots/videos** — Visual proof if applicable
5. **Environment** — Browser, OS, Node version
6. **Browser console errors** — Any error messages

---

## 💡 Suggesting Features

Have an idea? [Open a discussion](https://github.com/tauhiddotexe/RuFix/discussions) or create an issue:

1. **Clear title** — "Add 5×5 cube support"
2. **Problem statement** — Why this feature matters
3. **Proposed solution** — How you'd implement it
4. **Alternatives considered** — Other approaches
5. **Additional context** — Related issues, links, mockups

---

## 🏗️ Architecture Guidelines

### File Organization
- Keep files small and focused (< 300 lines)
- Related functions in same module
- Tests in `test/` directory with matching name

### Component Structure
```typescript
// ✅ Good
interface Props {
  cube: CubeState;
  onRotate: (move: Move) => void;
}

export const Cube3D = ({ cube, onRotate }: Props) => {
  // component logic
};

// ❌ Bad - unclear prop purpose
export const Cube3D = (props: any) => {
  // component logic
};
```

### Type Safety
- **Never use `any`** without TypeScript `@ts-expect-error` comment
- Prefer unions over enums for cube moves/colors
- Use discriminated unions for state variants

```typescript
// ✅ Good
type SolveState = 
  | { status: 'idle' }
  | { status: 'solving' }
  | { status: 'success'; moves: Move[] }
  | { status: 'error'; message: string };

// ❌ Bad
type SolveState = {
  status: 'idle' | 'solving' | 'success' | 'error';
  moves?: Move[];
  message?: string;
};
```

### Immutability
```typescript
// ✅ Good - returns new object
const newCube = { ...cube, F: newFace };

// ❌ Bad - mutates original
cube.F = newFace;
```

---

## 📚 Resources

- **[React Documentation](https://react.dev)** — React best practices
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** — Type safety
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** — Styling
- **[Vitest Guide](https://vitest.dev/)** — Testing
- **[Rubik's Cube Notation](https://ruwix.com/the-rubiks-cube/notation/)** — Cube move syntax

---

## ✅ Review Checklist for Maintainers

When reviewing PRs, we check:
- Code quality and consistency
- TypeScript types are correct
- Tests are included and passing
- Documentation is updated
- No performance regressions
- Breaking changes are justified

---

## 🚀 What Happens After Your PR

1. **Code review** — We provide feedback (usually within 48h)
2. **Changes requested** — Update based on feedback
3. **Approval** — PR is approved
4. **Merge** — Your code is merged to main
5. **Release** — Your changes are included in next version

---

## ❓ Questions?

- **GitHub Issues** — For bugs and feature requests
- **GitHub Discussions** — For questions and ideas
- **PR Comments** — Ask clarifying questions during review

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make RuFix better. Thank you for being part of this community!

---

**Happy coding! 🚀**
