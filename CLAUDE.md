# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron system-level text selection tool. Users select text in any application and press a global shortcut to show a floating ball at the cursor position.

## Tech Stack

- Electron 39 + Vite 7 + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui (new-york style)
- @nut-tree-fork/nut-js for keyboard simulation
- react-router-dom for multi-window routing

## Development Commands

```bash
pnpm dev          # Start dev mode with hot reload
pnpm build        # Typecheck + build for production
pnpm typecheck    # TypeScript check (runs both node and web configs)
pnpm lint         # ESLint check
pnpm format       # Prettier format all files
pnpm build:mac    # Build macOS app
pnpm build:win    # Build Windows app
pnpm build:linux  # Build Linux app
```

## Architecture

Three-layer Electron structure:

- `src/main/` - Main process (IPC handlers, window management, global shortcuts)
- `src/preload/` - Bridge between main and renderer (exposes `window.api`)
- `src/renderer/` - React frontend with HashRouter routing

### Key Modules

- `main/index.ts` - Entry point, IPC registration, window lifecycle
- `main/floatingWindow.ts` - Floating ball window management
- `main/mouseListener.ts` - Global shortcut listener
- `main/selection.ts` - Clipboard capture + simulated copy (Cmd/Ctrl+C)
- `main/utils/platform.ts` - Platform detection + IPC channel constants
- `renderer/components/FloatingBall.tsx` - Floating ball UI component

### Multi-Window Routing

Uses HashRouter with routes:

- `/` - Main application window
- `/floating` - Floating ball window (transparent, frameless, always-on-top)

## IPC Channels

| Channel             | Direction       | Purpose                |
| ------------------- | --------------- | ---------------------- |
| `selection:result`  | main → renderer | Send selected text     |
| `floating:show`     | renderer → main | Show floating ball     |
| `floating:hide`     | renderer → main | Hide floating ball     |
| `floating:resize`   | renderer → main | Resize floating window |
| `selection:get`     | renderer → main | Manual text capture    |
| `listener:status`   | renderer → main | Query listener state   |
| `listener:shortcut` | renderer → main | Get current shortcut   |

Use `IPC_CHANNELS` from `utils/platform.ts` instead of hardcoding strings.

## Workflow

### Before Coding: Check Skills

Check `.claude/skills/` directory for applicable skills before writing code:

- Use `/simplify` skill for code change review
- Reference skill best practices and conventions

### During Coding: Follow Conventions

- Functions max 70 lines
- Use `utils/platform.ts` for platform detection
- Use `IPC_CHANNELS` constants, not hardcoded strings
- Keep only WHY comments (hidden constraints, special reasons)

### After Coding: Quality Check

Run checks after completing code:

```bash
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint check
pnpm format       # Prettier format
```

Checklist:

- [ ] TypeScript no errors
- [ ] ESLint no warnings/errors
- [ ] Functions ≤ 70 lines
- [ ] No duplicate platform detection code
- [ ] IPC channels use constants
- [ ] Files end with newline

## Code Conventions

1. **Function length**: Max 70 lines. Split complex logic into smaller functions.
2. **Platform detection**: Use `isMac`, `isWindows`, `isLinux` from `utils/platform.ts`.
3. **IPC channels**: Use `IPC_CHANNELS` constants, not hardcoded strings.
4. **Async delay**: Use `delay()` from `utils/async.ts`.
5. **Window state**: Check `isDestroyed()` before accessing stored BrowserWindow references.
6. **React cleanup**: Use `removeListener` not `removeAllListeners` for IPC cleanup.
7. **Comments**: Only explain WHY (hidden constraints, special reasons), not WHAT.

## Global Shortcut

- macOS: `Command+Shift+C`
- Windows/Linux: `Ctrl+Shift+C`

## macOS Permissions

Requires Accessibility permission for keyboard simulation:

- System Settings → Privacy & Security → Accessibility → Add app

## Available Skills

- `/simplify` - Review code for reuse, quality, efficiency
- `/shadcn` - shadcn/ui component patterns
- `/web-design-guidelines` - UI/UX review for web interface guidelines
- `/vercel-react-best-practices` - React best practices
- `/vercel-composition-patterns` - React composition patterns
