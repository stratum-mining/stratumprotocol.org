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

function getAllDeveloperPosts() {
  const developersDir = path.join(process.cwd(), "app/src/_developers");
  const filenames = fs.readdirSync(developersDir);

  const allPostsData = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      // get slug from filename
      const slug = filename.replace(/\.md$/, "");

      // read markdown file as string
      const fullPath = path.join(developersDir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      // format the date
      const formattedDate = formatDateString(data.date, true);

      // render markdown to html
      const html = md.render(content);

      // return the post data
      return {
        slug,
        title: data.title || data.pageHeading || "",
        pageHeading: data.pageHeading || data.title || "",
        description: data.description || "",
        date: data.date || "",
        formattedDate,
        authors: data.authors || [],
        tags: data.tags || [],
        content,
        html,
      };
    })
    .sort((a, b) => {
      if (a.date < b.date) return 1;
      return -1;
    });

  return allPostsData;
}

const formatDateString = (date, year) => {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: year ? "numeric" : undefined,
    month: "short",
    day: "numeric",
  }).format(dateObj);

  return formattedDate;
};

const developerPosts = getAllDeveloperPosts();

const outputDir = path.join(process.cwd(), "app/src/data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, "developers.json"), JSON.stringify(developerPosts, null, 2));

console.log(`✅ Generated developers data with ${developerPosts.length} posts`);
