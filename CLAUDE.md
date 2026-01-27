# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

**Critical:** Always run `npm run build` after editing content to verify no broken links or syntax errors.

**Important:** Never start the dev server (`npm run dev`). Use `npm run build` to verify changes.

## Architecture

This is an Astro documentation site using the Starlight theme.

- **Content**: Documentation pages live in `src/content/docs/` as `.md` or `.mdx` files. Each file becomes a route based on its filename.
- **Configuration**: Site settings (title, sidebar navigation, social links) are in `astro.config.mjs` under the `starlight()` integration.
- **Content Schema**: The docs collection is defined in `src/content.config.ts` using Starlight's built-in schema.
- **Styling**: Custom theme in `src/styles/custom-theme.css`, mermaid styles in `src/styles/mermaid.css`.
- **Assets**: Images go in `src/assets/` (for processed images) or `public/` (for static assets like favicons).

## Content Structure

```
src/content/docs/
├── index.mdx                    # Homepage
├── introduction/                # Core concepts
├── decision/                    # Do you need a merge queue?
├── features/                    # Feature deep-dives
├── use-cases/                   # Scenarios and applications
├── real-world/                  # Companies, tool comparison
├── getting-started/             # Setup guides
└── best-practices/              # Metrics, pitfalls, troubleshooting
```

## Starlight Components

### Callouts/Asides

```markdown
:::tip[Title]
Helpful information
:::

:::note[Title]
General information
:::

:::caution[Title]
Warning about potential issues
:::

:::danger[Title]
Critical warning
:::
```

### Cards

```mdx
import { Card, CardGrid, LinkCard } from '@astrojs/starlight/components';

<CardGrid>
  <LinkCard title="Title" description="Description" href="/path/" />
  <Card title="Title" icon="icon-name">Content here</Card>
</CardGrid>
```

## Mermaid Diagrams

Mermaid diagrams render inline via rehype-mermaid. Key patterns:

### Syntax Rules
- **Line breaks in nodes:** Don't use `\n` - it renders literally. Use periods or parentheses instead.
- **Notes in sequence diagrams:** Use `Note right of X:` not `Note over X:` to avoid text overflow issues.
- **Keep note text short:** Long text in notes can overflow the background rectangle.

### Common Diagram Types

```markdown
# Sequence diagram
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Message
    B-->>A: Response
    Note right of B: Short note

# Flowchart
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Other]

# State diagram
stateDiagram-v2
    [*] --> State1
    State1 --> State2

# Git graph
gitGraph
    commit id: "main"
    branch feature
    commit id: "change"
    checkout main
    merge feature
```

### Theme
Our mermaid theme uses warm dark colors defined in `astro.config.mjs`. Primary accent is amber (#f59e0b).

## Content Style

- **Voice:** Direct, technical, educational
- **Examples:** Always include concrete examples (code, diagrams, scenarios)
- **Structure:** Use headers liberally, keep paragraphs short
- **Links:** Use relative paths like `/features/batching/`

## Frontmatter

Every content file needs:

```yaml
---
title: Page Title
description: Brief description for SEO and previews.
sidebar:
  order: 1  # Optional: controls sidebar position
---
```

## Code Blocks

Use Expressive Code features:
- Add filename with `# filename.py` as first line (renders as tab)
- Language is auto-detected or specify after opening backticks
