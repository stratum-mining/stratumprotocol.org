import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function generateMarkdownData(dir) {
  const fullDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return {}; // skip if folder doesn't exist

  const filenames = fs.readdirSync(fullDir);
  const dataObject = {};

  const posts = filenames.filter(
    (filename) => filename.endsWith(".md") && filename !== "README.md"
  );

  for (const filename of posts) {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(fullDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { content } = matter(fileContents);
    const html = md.render(content);

    dataObject[slug] = { slug, content, html };
  }

  return dataObject;
}

// Generate data from both folders
const specificationData = generateMarkdownData("src/specification");
const extensionData = generateMarkdownData("src/specification/extensions");

// Merge extensions into specifications
const mergedData = { ...specificationData, ...extensionData };

// Save to the same JSON file
const outputDir = path.join(process.cwd(), "app/src/data");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, "specification.json"),
  JSON.stringify(mergedData, null, 2)
);

console.log(
  `✅ Generated specification data with ${Object.keys(mergedData).length} posts`
);

