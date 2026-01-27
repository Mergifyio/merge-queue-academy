import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Auto-generated llms-full.txt with complete content per https://llmstxt.org/ spec
 */

const SECTIONS: Record<string, { name: string; order: number }> = {
  introduction: { name: "Introduction", order: 1 },
  decision: { name: "Do You Need One?", order: 2 },
  features: { name: "Features", order: 3 },
  "use-cases": { name: "Use Cases", order: 4 },
  "real-world": { name: "Real World", order: 5 },
  "getting-started": { name: "Getting Started", order: 6 },
  "best-practices": { name: "Best Practices", order: 7 },
};

function cleanContent(raw: string): string {
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, "") // Remove frontmatter
    .replace(/```mermaid[\s\S]*?```/g, "[diagram]") // Replace mermaid
    .replace(/^import .+$/gm, "") // Remove imports
    .replace(/<[A-Z][a-zA-Z]*[\s\S]*?\/>/g, "") // Remove self-closing components
    .replace(/<[A-Z][a-zA-Z]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "") // Remove components
    .replace(/\n{3,}/g, "\n\n") // Normalize newlines
    .trim();
}

function readSourceFile(id: string): string | null {
  const possiblePaths = [
    join(process.cwd(), "src/content/docs", `${id}.mdx`),
    join(process.cwd(), "src/content/docs", `${id}.md`),
  ];

  for (const filePath of possiblePaths) {
    if (existsSync(filePath)) {
      return readFileSync(filePath, "utf-8");
    }
  }
  return null;
}

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");

  // Build page list with metadata
  const pages = docs
    .filter((doc) => doc.id !== "index") // Skip homepage
    .map((doc) => {
      const section = doc.id.split("/")[0];
      const raw = readSourceFile(doc.id);
      return {
        id: doc.id,
        title: doc.data.title,
        section,
        order: doc.data.sidebar?.order ?? 99,
        content: raw ? cleanContent(raw) : "",
      };
    });

  // Sort by section order, then page order
  pages.sort((a, b) => {
    const sectionA = SECTIONS[a.section]?.order ?? 99;
    const sectionB = SECTIONS[b.section]?.order ?? 99;
    if (sectionA !== sectionB) return sectionA - sectionB;
    return a.order - b.order;
  });

  // Build output
  const lines: string[] = [
    "# Merge Queue Academy",
    "",
    "> Educational documentation about merge queues—systems that serialize and validate pull requests before they land on main. Learn how merge queues keep your main branch stable while enabling high-velocity development.",
    "",
  ];

  for (const page of pages) {
    lines.push(`## ${page.title}`);
    lines.push("");
    lines.push(`Source: /${page.id}/`);
    lines.push("");
    lines.push(page.content);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return new Response(lines.join("\n").trim() + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
