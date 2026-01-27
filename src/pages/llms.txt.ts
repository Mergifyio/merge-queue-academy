import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/**
 * Auto-generated llms.txt index per https://llmstxt.org/ spec
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

export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");

  // Build page list with metadata
  const pages = docs
    .filter((doc) => doc.id !== "index") // Skip homepage
    .map((doc) => {
      const section = doc.id.split("/")[0];
      return {
        id: doc.id,
        title: doc.data.title,
        description: doc.data.description || "",
        section,
        order: doc.data.sidebar?.order ?? 99,
      };
    });

  // Group by section
  const bySection: Record<string, typeof pages> = {};
  for (const page of pages) {
    if (!bySection[page.section]) bySection[page.section] = [];
    bySection[page.section].push(page);
  }

  // Sort sections and pages within sections
  const sortedSections = Object.entries(bySection).sort(
    ([a], [b]) => (SECTIONS[a]?.order ?? 99) - (SECTIONS[b]?.order ?? 99)
  );

  for (const [, sectionPages] of sortedSections) {
    sectionPages.sort((a, b) => a.order - b.order);
  }

  // Build output
  const lines: string[] = [
    "# Merge Queue Academy",
    "",
    "> Educational documentation about merge queues—systems that serialize and validate pull requests before they land on main. Learn how merge queues keep your main branch stable while enabling high-velocity development.",
    "",
    "Merge queues solve a fundamental problem: pull requests that pass CI individually can break main when merged together. A merge queue tests each PR against its actual merge target—including all PRs ahead of it—guaranteeing main stays green.",
    "",
  ];

  for (const [sectionKey, sectionPages] of sortedSections) {
    const sectionName = SECTIONS[sectionKey]?.name || sectionKey;
    lines.push(`## ${sectionName}`);
    lines.push("");

    for (const page of sectionPages) {
      const url = `/${page.id}/`;
      const desc = page.description ? `: ${page.description}` : "";
      lines.push(`- [${page.title}](${url})${desc}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n").trim() + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
