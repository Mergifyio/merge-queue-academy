# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

This is an Astro documentation site using the Starlight theme.

- **Content**: Documentation pages live in `src/content/docs/` as `.md` or `.mdx` files. Each file becomes a route based on its filename.
- **Configuration**: Site settings (title, sidebar navigation, social links) are in `astro.config.mjs` under the `starlight()` integration.
- **Content Schema**: The docs collection is defined in `src/content.config.ts` using Starlight's built-in schema.
- **Assets**: Images go in `src/assets/` (for processed images) or `public/` (for static assets like favicons).
