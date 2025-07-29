import matter from "gray-matter";
import { Link } from "react-router";
import { formatDateString } from "@/utils";
import { useLayoutEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<
    Array<Record<string, string | string[]>>
  >([]);

  useLayoutEffect(() => {
    const createBlogPostsData = async () => {
      const blogPosts = import.meta.glob("../src/_blog/*.md", {
        query: "?raw",
        import: "default",
      });

      const blogPostsData = await Promise.all(
        Object.entries(blogPosts).map(async ([path, module]) => {
          const fileContents = await module();
          const { data, content } = matter(fileContents as string);
          const trimPath = path.replace("../src/_blog/", "").replace(".md", "");
          return {
            slug: trimPath,
            title: data.title || "",
            description: data.description || "",
            date: data.date || "",
            formattedDate: formatDateString(data.date, true),
            authors: data.authors || [],
            tags: data.tags || [],
            content,
          };
        })
      );

      const sortedBlogPosts = blogPostsData.sort((a, b) => {
        if (a.date < b.date) return 1;
        return -1;
      });

      setBlogPosts(sortedBlogPosts);
    };

    createBlogPostsData();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-medium underline underline-offset-4 decoration-wavy decoration-4 decoration-cyan-custom-100 font-dm-mono uppercase">
              Blog
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-dm-mono font-medium">
              Articles
            </h1>
          </div>

          <div className="grid gap-10 max-w-4xl mx-auto">
            {blogPosts.map((post, index) => (
              <article
                key={index}
                className={`flex flex-col gap-4 ${
                  post.slug === "getting-started" ? "hidden" : ""
                }`}
              >
                <h2 className="text-3xl font-medium font-mono group">
                  <Link to={`/blog/${post.slug}`} className="relative">
                    {post.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-custom-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                  </Link>
                </h2>
                <section className="flex flex-col gap-4">
                  <section className="flex gap-2">
                    <p className="text-sm sm:text-base">
                      By {(post.authors as string[]).join(", ")} on{" "}
                    </p>
                    <p className="text-sm sm:text-base text-gray-400">
                      {post.formattedDate}
                    </p>
                  </section>
                  <p className="text-sm text-gray-400">{post.description}</p>
                </section>

                <section className="flex gap-2 flex-wrap">
                  {(post.tags as string[]).map((tag) => (
                    <span
                      key={tag}
                      className="text-sm font-medium font-dm-mono border border-cyan-custom-100 rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </section>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
