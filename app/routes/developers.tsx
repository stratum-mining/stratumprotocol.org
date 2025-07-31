import "../global.css";
import React from "react";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { replaceYouTubeLinks } from "@/utils";
import { Navigation } from "@/components/Navigation";
import { Copy, Check, ExternalLink } from "lucide-react";
import { ImageZoom } from "@/components/ui/image-zoom";
import { useLayoutEffect, useState } from "react";

export default function DevelopersPage() {
  const [gettingStarted, setGettingStarted] = useState<{
    title: string;
    content: string;
  } | null>(null);

  useLayoutEffect(() => {
    const loadGettingStarted = async () => {
      const markdownFiles = import.meta.glob("../src/_developers/*.md", {
        query: "?raw",
        import: "default",
      });

      try {
        const filePath = "../src/_developers/getting-started.md";
        if (markdownFiles[filePath]) {
          const fileContents = await markdownFiles[filePath]();
          const { data, content } = matter(fileContents as string);
          setGettingStarted({
            title: data.title || "Getting Started",
            content,
          });
        }
      } catch (error) {
        console.error("Failed to load getting started content:", error);
      }
    };

    loadGettingStarted();
  }, []);

  if (!gettingStarted) {
    return <div>Loading...</div>;
  }

  // Replace YouTube links with custom syntax to render youtube video in iframe
  const modifiedContent = replaceYouTubeLinks(gettingStarted.content || "");

  const renderContent = () => {
    // Split content by YouTube embed markers
    const parts = modifiedContent.split(/(\[youtube:[^:]+:[^\]]+\])/);

    return parts.map((part, index) => {
      const match = part.match(/\[youtube:([^:]+):([^\]]+)\]/);

      if (match) {
        const [, videoId, path] = match;
        return (
          <iframe
            key={`youtube-${index}`}
            title={`YouTube-${videoId}`}
            src={`https://www.youtube-nocookie.com/embed/${path}?autoplay=0&autohide=1&modestbranding=1&color=white&rel=0`}
            frameBorder='0'
            allow='autoplay;encrypted-media;picture-in-picture'
            allowFullScreen
            className='w-full aspect-video my-5 border-[0.5px] border-white'
          />
        );
      }

      // Render regular markdown content
      return part ? (
        <ReactMarkdown
          key={`markdown-${index}`}
          remarkPlugins={[remarkGfm, remarkSlug]}
          components={{
            code: ({ inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (inline) {
                return (
                  <code
                    className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              const CodeCopy = () => {
                const [copied, setCopied] = React.useState(false);

                const copyToClipboard = async () => {
                  const text = String(children).replace(/\n$/, "");
                  await navigator.clipboard.writeText(text);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                };

                return (
                  <button
                    onClick={copyToClipboard}
                    className='absolute top-2 right-2 p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 z-10'
                    title='Copy code'
                  >
                    {copied ? <Check className='w-4 h-4 text-green-400' /> : <Copy className='w-4 h-4 text-gray-300' />}
                  </button>
                );
              };

              return (
                <div className='relative group'>
                  <CodeCopy />
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag='div'
                    className='rounded-lg !mt-0 !mb-4'
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.5rem",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            },
            a: ({ ...props }) => {
              return (
                <a
                  {...props}
                  className='text-cyan-custom-100 font-dm-mono underline underline-offset-4 cursor-pointer'
                  target='_blank'
                >
                  <span className='gap-1 items-center w-fit inline-flex'>
                    {props.children} <ExternalLink className='w-4 h-4' />
                  </span>
                </a>
              );
            },
            p: (props) => <p {...props} className='font-dm-mono leading-[1.7] mb-[18px]' />,
            ul: ({
              ...props
            }: React.ComponentPropsWithoutRef<"ul">) => (
              <ul
                {...props}
                className='list-disc list-inside ml-4 font-dm-mono leading-[1.7] mb-4 sm:tracking-tight flex flex-col gap-2 sm:gap-1'
              />
            ),
            ol: ({
              ...props
            }: React.ComponentPropsWithoutRef<"ol">) => (
              <ol
                {...props}
                className='list-decimal list-inside ml-4 font-dm-mono leading-[1.7] mb-4 sm:tracking-tight flex flex-col gap-2 sm:gap-1'
              />
            ),
            h1: ({ node, ...props }) => {
              const id = node?.properties?.id || "";
              return (
                <h1
                  {...props}
                  id={id as string}
                  className='text-5xl font-medium sm:font-medium font-dm-mono pt-7 pb-3 group relative scroll-mt-32'
                >
                  {props.children}
                  {id && (
                    <a
                      href={`#${id}`}
                      className='ml-2 text-gray-400 hover:text-cyan-custom-100 opacity-0 group-hover:opacity-100 transition absolute -left-6 top-1'
                      aria-label='Link to this section'
                      tabIndex={-1}
                    >
                      #
                    </a>
                  )}
                </h1>
              );
            },
            h2: ({ node, ...props }) => {
              const id = node?.properties?.id || "";
              return (
                <h2
                  {...props}
                  id={id as string}
                  className='text-4xl font-medium sm:font-medium font-dm-mono pt-7 pb-3 group relative scroll-mt-32'
                >
                  {props.children}
                  {id && (
                    <a
                      href={`#${id}`}
                      className='ml-2 text-gray-400 hover:text-cyan-custom-100 opacity-0 group-hover:opacity-100 transition absolute -left-6 top-1'
                      aria-label='Link to this section'
                      tabIndex={-1}
                    >
                      #
                    </a>
                  )}
                </h2>
              );
            },
            h3: ({ node, ...props }) => {
              const id = node?.properties?.id || "";
              return (
                <h3
                  {...props}
                  id={id as string}
                  className='text-3xl font-medium sm:font-medium font-dm-mono pt-7 pb-3 group relative scroll-mt-32'
                >
                  {props.children}
                  {id && (
                    <a
                      href={`#${id}`}
                      className='ml-2 text-gray-400 hover:text-cyan-custom-100 opacity-0 group-hover:opacity-100 transition absolute -left-6 top-1'
                      aria-label='Link to this section'
                      tabIndex={-1}
                    >
                      #
                    </a>
                  )}
                </h3>
              );
            },
            h4: ({ node, ...props }) => {
              const id = node?.properties?.id || "";
              return (
                <h4
                  {...props}
                  id={id as string}
                  className='text-2xl font-medium sm:font-medium font-dm-mono pt-7 pb-3 group relative scroll-mt-32'
                >
                  {props.children}
                  {id && (
                    <a
                      href={`#${id}`}
                      className='ml-2 text-gray-400 hover:text-cyan-custom-100 opacity-0 group-hover:opacity-100 transition absolute -left-6 top-1'
                      aria-label='Link to this section'
                      tabIndex={-1}
                    >
                      #
                    </a>
                  )}
                </h4>
              );
            },
            img: ({ ...props }: React.ComponentPropsWithoutRef<"img">) => {
              return (
                <ImageZoom
                  src={props.src || ""}
                  alt={props.alt || ""}
                  className='w-full object-center object-contain my-5'
                />
              );
            },
            hr: ({ ...props }: React.ComponentPropsWithoutRef<"hr">) => {
              return <hr {...props} className='my-4' />;
            },
            table: ({ ...props }: React.ComponentPropsWithoutRef<"table">) => {
              return (
                <table {...props} className='w-full border-collapse my-6 font-dm-mono text-sm overflow-x-auto block' />
              );
            },
            thead: ({ ...props }: React.ComponentPropsWithoutRef<"thead">) => {
              return <thead {...props} className='bg-gray-800/50' />;
            },
            tbody: ({ ...props }: React.ComponentPropsWithoutRef<"tbody">) => {
              return <tbody {...props} className='divide-y divide-gray-700' />;
            },
            tr: ({ ...props }: React.ComponentPropsWithoutRef<"tr">) => {
              return <tr {...props} className='border-b border-gray-700 hover:bg-gray-800/30' />;
            },
            th: ({ ...props }: React.ComponentPropsWithoutRef<"th">) => {
              return <th {...props} className='px-2 sm:px-4 py-3 text-left font-semibold text-cyan-custom-100' />;
            },
            td: ({ ...props }: React.ComponentPropsWithoutRef<"td">) => {
              return <td {...props} className='px-2 sm:px-4 py-3 whitespace-normal' />;
            },
          }}
          className='opacity-90 markdownContentStyles'
        >
          {part}
        </ReactMarkdown>
      ) : null;
    });
  };

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <div className='pt-32 md:pt-44 pb-16 px-4 container mx-auto max-w-4xl flex flex-col gap-8'>
        <article>{renderContent()}</article>
      </div>
    </main>
  );
}
