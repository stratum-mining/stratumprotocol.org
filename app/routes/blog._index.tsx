import { Link } from "react-router";
import blogPostsData from "@/data/blog-posts.json";
import { Navigation } from "@/components/Navigation";

export default function BlogPage() {
  const blogPosts = blogPostsData;

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <section className='pt-32 pb-16 px-4'>
        <div className='container mx-auto max-w-4xl flex flex-col gap-12'>
          <div className='flex flex-col gap-6'>
            <h1 className='text-2xl font-medium underline underline-offset-4 decoration-wavy decoration-4 decoration-cyan-custom-100 font-dm-mono uppercase'>
              Blog
            </h1>
            <h1 className='text-5xl sm:text-6xl md:text-7xl font-dm-mono font-medium'>Articles</h1>
          </div>

          <div className='grid gap-10 max-w-4xl mx-auto'>
            {blogPosts.map((post, index) => (
              <article key={index} className='flex flex-col gap-4'>
                <h2 className='text-3xl font-medium font-mono group'>
                  <Link to={`/blog/${post.slug}`} className='relative'>
                    {post.title}
                    <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-custom-100 transition-all duration-300 ease-in-out group-hover:w-full'></span>
                  </Link>
                </h2>
                <section className='flex flex-col gap-4'>
                  <section className='flex gap-2'>
                    <p className='text-sm sm:text-base'>By {post.authors.join(", ")} on </p>
                    <p className='text-sm sm:text-base text-gray-400'>{post.formattedDate}</p>
                  </section>
                  <p className='text-sm text-gray-400'>{post.description}</p>
                </section>

                <section className='flex gap-2 flex-wrap'>
                  {post.tags.map((tag) => (
                    <span key={tag} className='text-sm font-medium font-dm-mono border border-cyan-custom-100 rounded-full px-2 py-1'>
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
