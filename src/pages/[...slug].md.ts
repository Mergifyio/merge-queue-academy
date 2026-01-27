import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Generate static paths for all docs pages
export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection("docs");

  return docs.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

// Serve the raw markdown content
export const GET: APIRoute = async ({ params, props }) => {
  const { entry } = props as { entry: { id: string; body?: string } };

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  // Try to read the source file directly
  const possiblePaths = [
    join(process.cwd(), "src/content/docs", `${entry.id}.mdx`),
    join(process.cwd(), "src/content/docs", `${entry.id}.md`),
    join(process.cwd(), "src/content/docs", entry.id, "index.mdx"),
    join(process.cwd(), "src/content/docs", entry.id, "index.md"),
  ];

  let content = "";
  let found = false;

  for (const filePath of possiblePaths) {
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, "utf-8");
      // Strip frontmatter and clean up for LLM consumption
      content = raw
        .replace(/^---\n[\s\S]*?\n---\n/, "") // Remove frontmatter
        .replace(/```mermaid[\s\S]*?```/g, "[diagram]") // Replace mermaid
        .replace(/^import .+$/gm, "") // Remove imports
        .replace(/<[A-Z][a-zA-Z]*[\s\S]*?\/>/g, "") // Remove self-closing components
        .replace(/<[A-Z][a-zA-Z]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "") // Remove components
        .replace(/\n{3,}/g, "\n\n") // Normalize newlines
        .trim();
      found = true;
      break;
    }
  }

  if (!found) {
    return new Response("Not found", { status: 404 });
  }

  // Ensure content ends with newline
  if (!content.endsWith("\n")) {
    content += "\n";
  }

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
