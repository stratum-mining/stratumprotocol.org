import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

// Initialize markdown-it with your preferred options
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function generateSpecificationData() {
  const specificationDir = path.join(process.cwd(), "app/src/specification");
  const filenames = fs.readdirSync(specificationDir);

  const specificationsObject = {};
  const posts = filenames.filter((filename) => filename.endsWith(".md") && filename !== "README.md");

  for (const filename of posts) {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(specificationDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { content } = matter(fileContents);
    const html = md.render(content);

    specificationsObject[slug] = {
      slug,
      content,
      html,
    };
  }

  return specificationsObject;
}

const specificationData = generateSpecificationData();

const outputDir = path.join(process.cwd(), "app/src/data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, "specification.json"), JSON.stringify(specificationData, null, 2));

console.log(`✅ Generated specification data with ${Object.keys(specificationData).length} posts`);
