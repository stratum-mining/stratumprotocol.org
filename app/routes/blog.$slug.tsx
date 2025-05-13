import { useParams } from "react-router";
import blogPostsData from "@/data/blog-posts.json";
import { Navigation } from "@/components/Navigation";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  authors: string[];
  tags: string[];
  content: string;
  html: string;
}

export default function BlogPostPage() {
  // Extract the slug parameter from the URL
  const { slug } = useParams<{ slug: string }>();

  function getBlogPostBySlug(blogPostsData: BlogPost[], slug: string): BlogPost | null {
    const post = blogPostsData.find((post) => post.slug === slug);
    return post || null;
  }

  // Get the blog post data using the slug
  const post = getBlogPostBySlug(blogPostsData, slug || "");

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <section className='pt-32 pb-16 px-4'>
        <div className='container mx-auto max-w-4xl'>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </section>
    </main>
  );
}
