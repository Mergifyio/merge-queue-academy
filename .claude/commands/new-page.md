# Create New Documentation Page

Create a new documentation page for this Starlight site.

**Arguments:** $ARGUMENTS

## Instructions

1. Parse the arguments to determine:
   - **Title**: The page title (required)
   - **Section**: Where to place it (introduction, decision, features, use-cases, real-world, getting-started, best-practices)

2. Generate the filename:
   - Lowercase
   - Replace spaces with hyphens
   - Example: "Automatic Retries" → `automatic-retries.md`

3. Create the file at `src/content/docs/{section}/{filename}.md` with this template:

```markdown
---
title: {Title}
description: {Generate a brief, SEO-friendly description}
sidebar:
  order: {Suggest appropriate order based on existing pages}
---

{Brief introductory paragraph explaining what this page covers}

## Overview

Content coming soon.

## Key Concepts

Content coming soon.

## Examples

Content coming soon.

## Summary

Content coming soon.
```

4. Check `astro.config.mjs` to see if the section already auto-includes pages or needs manual sidebar entry.

5. Run `npm run build` to verify the page is created correctly.

6. Report:
   - File path created
   - Suggested next steps (fill in content sections)
   - Any sidebar configuration needed
