# AGENTS Standards

This document defines the cross-platform design, performance, and implementation standards for all AI tools and developers working on this project.

## 1. Technical Stack
- **Bundler:** Vite
- **CSS:** Tailwind CSS v4, PostCSS, PurgeCSS
- **JS/TS:** Vanilla JS / TypeScript (ESNext)
- **Performance Testing:** Lighthouse CI

## 2. Design System & Aesthetics
- **Colors:** Neutral, muted palettes. No bright/neon purple/blue gradients or acid accents (The Lila Ban).
- **Typography:** Geist, Satoshi, or Cabinet Grotesk (sans-serif).
- **Layouts:** Use CSS Grid for complex layouts. Full-height blocks must use `min-h-[100dvh]`.
- **DOM Depth:** Keep nesting below 14 levels. No redundant `div` wrappers.

## 3. Interaction & Animation
- **Transitions:** Use `transform` and `opacity` with hardware acceleration.
- **Micro-scripts:**
  - **Scroll Reveal:** IntersectionObserver-based, using temporary `will-change: transform, opacity`.
  - **Magnetic Hover:** CSS-variable driven translations (`translate3d(var(--mx), var(--my), 0)`).
- **Cleanup:** Clear event listeners and cancel animation frames on destroy.

## 4. Verification
- **Lighthouse Budget:** 
  - Performance: $\ge$ 95
  - Accessibility: $\ge$ 90
  - Best Practices: $\ge$ 95
  - SEO: $\ge$ 95
  - FCP < 1.5s, LCP < 2.5s, CLS < 0.1, TBT < 150ms

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
