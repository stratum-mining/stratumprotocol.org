/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import SpecificationSidebar from "@/components/specification-sidebar";

export default function SpecificationsPage() {
  const [currentMarkdown, setCurrentMarkdown] = useState("");

  useEffect(() => {
    // Use import.meta.glob with the updated syntax
    const markdownFiles = import.meta.glob("../src/specification/*.md", {
      query: "?raw",
      import: "default",
    });

    async function fetchMarkdown() {
      try {
        const filePath = `../src/specification/README.md`;

        if (markdownFiles[filePath]) {
          const content = await markdownFiles[filePath]();

          setCurrentMarkdown(content as string);
        }
      } catch (error) {
        console.error("Failed to load markdown:", error);
        setCurrentMarkdown("## Error\n\nFailed to load the specification.");
      }
    }

    fetchMarkdown();
  }, []);

  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <section className='pt-32 pb-16 px-4'>
        <div className='container mx-auto flex flex-col gap-12'>
          <h1 className='text-5xl sm:text-6xl md:text-7xl font-dm-mono font-medium text-center'>Specification</h1>

          <div className='flex gap-10 mx-auto'>
            <SpecificationSidebar currentSublinks={[]} />
            <div>
              <ReactMarkdown
                components={{
                  h1: ({ ...props }: React.ComponentPropsWithoutRef<"h1">) => {
                    return (
                      <h1 {...props} className='text-4xl sm:text-5xl font-medium sm:font-semibold font-dm-mono pb-3 leading-[120%] tracking-tight' />
                    );
                  },
                  h2: ({ ...props }: React.ComponentPropsWithoutRef<"h2">) => {
                    return <h2 {...props} className='text-4xl font-medium sm:font-medium font-dm-mono pt-7 pb-3' />;
                  },

                  p: ({ ...props }) => <p {...props} className='font-dm-mono leading-[1.7] mb-[18px]' />,

                  ul: ({ ordered, depth, ...props }: { ordered?: boolean; depth?: number } & React.ComponentPropsWithoutRef<"ul">) => (
                    <ul
                      {...props}
                      className='list-disc list-inside ml-4 font-dm-mono leading-[1.7] mb-4 sm:tracking-tight flex flex-col gap-2 sm:gap-1'
                    />
                  ),

                  a: ({ ...props }) => {
                    const linkTarget = props?.node?.properties?.href || props.children;

                    // make link have only a single dash between items
                    const formattedLink = (linkTarget as string).replace(/\.md$/, "/");
                    const splitlink = formattedLink.split("-");
                    const sluggifiedlink = splitlink.filter((item) => item !== "").join("-");

                    console.log(sluggifiedlink);

                    return (
                      <a {...props} className='cursor-pointer' href={`/specification/${sluggifiedlink}`}>
                        {props.children}
                      </a>
                    );
                  },
                }}
                className='specification-readme'
              >
                {currentMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
