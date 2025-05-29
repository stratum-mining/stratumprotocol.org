/* eslint-disable @typescript-eslint/no-unused-vars */
import remarkGfm from "remark-gfm";
import { sluggifyTags } from "@/utils";
import { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import specificationData from "@/data/specification.json";
import { Link, useLocation, useParams } from "react-router";
import SpecificationSidebar from "@/components/specification-sidebar";

export default function SpecificationPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = useLocation().pathname;
  const getHash = typeof window !== "undefined" && window.location.hash ? window.location.hash.replace("#", "") : "";

  const slugWithoutExtension = slug ? slug.replace(".md", "") : "";
  const currentPost = useMemo(() => specificationData[slugWithoutExtension as keyof typeof specificationData], [slugWithoutExtension]);

  const generateSublinks = useMemo(() => {
    // extract all headings from currentMarkdown (h1, h2, h3,h4,h5,h6)
    return currentPost.content.match(/^#{1,6}\s+(.*)$/gm) ?? [];
  }, [currentPost]);

  // scroll to position based on id # tags
  useEffect(() => {
    if (currentPost.content && getHash) {
      setTimeout(() => {
        const element = document.getElementById(getHash);
        const scrollContainer = document.querySelector("[data-scroll-container]");

        if (element && scrollContainer) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop - 100;

          scrollContainer.scrollTo({
            top: relativeTop,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [getHash, currentPost.content]);

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />

      <section className='pt-32 px-4 h-screen'>
        <div className='container mx-auto flex flex-col gap-12 h-full'>
          <div className='flex gap-10 mx-auto h-full'>
            <div className='w-full max-w-[320px] max-h-[calc(100vh-128px)] h-full overflow-y-auto pb-10 hide-scrollbar hidden lg:block'>
              <SpecificationSidebar currentSublinks={generateSublinks} />
            </div>

            <div className='w-fit max-w-4xl max-h-[calc(100vh-128px)] overflow-y-auto pb-10 hide-scrollbar' data-scroll-container>
              <div className='border border-cyan-custom-100 rounded-[8px] shadow-lg p-3 px-4 w-fit sticky top-0 bg-background block lg:hidden z-50'>
                {pathname !== "/specification" && (
                  <button className='group w-fit'>
                    <Link to='/specification' className='font-dm-mono cursor-pointer font-medium flex gap-2 items-center relative'>
                      <ArrowLeft className='w-4 h-4' />
                      <p>Back</p>
                      <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-custom-100 mt-1 transition-all duration-300 ease-in-out group-hover:w-full'></span>
                    </Link>
                  </button>
                )}
              </div>

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }: React.ComponentPropsWithoutRef<"h1">) => {
                    return (
                      <h1
                        {...props}
                        className='text-4xl sm:text-5xl font-medium sm:font-semibold font-dm-mono pt-7 pb-3 leading-[120%] tracking-tight'
                        id={sluggifyTags(props.children)}
                      />
                    );
                  },

                  h2: ({ ...props }: React.ComponentPropsWithoutRef<"h2">) => {
                    return (
                      <h2
                        {...props}
                        className='text-2xl sm:text-4xl font-medium sm:font-medium font-dm-mono pt-7 pb-3 leading-[120%] tracking-tight'
                        id={sluggifyTags(props.children)}
                      />
                    );
                  },

                  h3: ({ ...props }: React.ComponentPropsWithoutRef<"h3">) => {
                    return (
                      <h3
                        {...props}
                        className='text-xl sm:text-3xl font-medium sm:font-medium font-dm-mono pt-7 pb-3'
                        id={sluggifyTags(props.children)}
                      />
                    );
                  },

                  h4: ({ ...props }: React.ComponentPropsWithoutRef<"h4">) => {
                    return <h4 {...props} className='text-2xl font-medium sm:font-medium font-dm-mono pt-7 pb-3' id={sluggifyTags(props.children)} />;
                  },

                  p: ({ ...props }) => <p {...props} className='font-dm-mono leading-[1.7] mb-[18px] whitespace-pre-wrap text-wrap break-words' />,

                  ul: ({ ordered, depth, ...props }: { ordered?: boolean; depth?: number } & React.ComponentPropsWithoutRef<"ul">) => (
                    <ul {...props} className='list-disc list-inside ml-4 font-dm-mono leading-[1.7] mb-4 sm:tracking-tight break-words' />
                  ),

                  ol: ({ ordered, depth, ...props }: { ordered?: boolean; depth?: number } & React.ComponentPropsWithoutRef<"ol">) => (
                    <ol {...props} className='list-decimal list-inside ml-4 font-dm-mono leading-[1.7] mb-4 sm:tracking-tight break-words' />
                  ),

                  li: ({ ordered, depth, ...props }: { ordered?: boolean; depth?: number } & React.ComponentPropsWithoutRef<"li">) => (
                    <li {...props} className='font-dm-mono leading-[1.7] mb-[18px] list-outside ml-3' />
                  ),
                  table: ({ ...props }: React.ComponentPropsWithoutRef<"table">) => {
                    return (
                      <div className='relative w-full overflow-hidden rounded-lg bg-gray-900/80 my-4 border border-gray-700'>
                        <div className='overflow-x-auto'>
                          <table {...props} className='w-full border-collapse my-0 font-dm-mono text-xs sm:text-sm sm:min-w-[500px]' />
                        </div>
                      </div>
                    );
                  },

                  thead: ({ ...props }: React.ComponentPropsWithoutRef<"thead">) => {
                    return <thead {...props} className='bg-gray-800/50 sticky top-0 z-10' />;
                  },

                  tbody: ({ ...props }: React.ComponentPropsWithoutRef<"tbody">) => {
                    return <tbody {...props} className='divide-y divide-gray-700' />;
                  },

                  tr: ({ isHeader, ...props }: { isHeader?: boolean } & React.ComponentPropsWithoutRef<"tr">) => {
                    return <tr {...props} className='border-b border-gray-700 hover:bg-gray-800/30' />;
                  },

                  th: ({ isHeader, ...props }: { isHeader?: boolean } & React.ComponentPropsWithoutRef<"th">) => {
                    return <th {...props} className='p-2 sm:p-4 text-left font-semibold text-cyan-custom-100 whitespace-nowrap' />;
                  },

                  td: ({ isHeader, ...props }: { isHeader?: boolean } & React.ComponentPropsWithoutRef<"td">) => {
                    return <td {...props} className='p-2 sm:p-4 whitespace-normal break-words' />;
                  },

                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code
                        className='bg-gray-800/50 text-cyan-custom-100 px-2 py-1 rounded-md text-xs sm:text-sm font-mono whitespace-pre-wrap break-words max-w-fit inline-block align-middle leading-relaxed'
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },

                  pre({ ...props }: React.ComponentPropsWithoutRef<"pre">) {
                    return (
                      <div className='relative w-full overflow-hidden rounded-lg bg-gray-900/80 my-4 border border-gray-700'>
                        <div className='overflow-x-auto'>
                          <pre
                            {...props}
                            className='p-2 text-xs sm:text-[0.95em] font-mono whitespace-pre max-w-[350px] sm:max-w-xl xl:max-w-2xl 2xl:max-w-3xl'
                            style={{
                              WebkitOverflowScrolling: "touch",
                              scrollbarWidth: "thin",
                              msOverflowStyle: "-ms-autohiding-scrollbar",
                            }}
                          />
                        </div>
                      </div>
                    );
                  },

                  a: ({ ...props }) => {
                    return (
                      <a {...props} className='text-cyan-custom-100 font-dm-mono underline underline-offset-4 cursor-pointer' target='_blank'>
                        <span className='gap-1 items-center w-fit inline-flex'>
                          {props.children} <ExternalLink className='w-4 h-4' />
                        </span>
                      </a>
                    );
                  },

                  img: ({ ...props }: React.ComponentPropsWithoutRef<"img">) => {
                    const src = props.src?.replace(".", "");

                    return <img {...props} className='w-full h-full object-center object-contain my-8' src={`/specification${src}`} />;
                  },
                }}
                className='specification-content'
              >
                {currentPost.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
