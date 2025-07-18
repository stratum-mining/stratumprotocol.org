import { sluggifyTags } from "@/utils";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { PluggableList } from "react-markdown/lib/react-markdown";
import { Link, useLocation, useParams } from "react-router";
import specificationData from "@/data/specification.json";
import { useMemo } from "react";

const specificationSidebarNavItems = [
  ["/specification/00-Abstract", "0. Abstract"],
  ["/specification/01-Motivation", "1. Motivation"],
  ["/specification/02-Design-Goals", "2. Design Goals"],
  ["/specification/03-Protocol-Overview", "3. Protocol Overview"],
  ["/specification/04-Protocol-Security", "4. Protocol Security"],
  ["/specification/05-Mining-Protocol", "5. Mining Protocol"],
  ["/specification/06-Job-Declaration-Protocol", "6. Job Declaration Protocol"],
  ["/specification/07-Template-Distribution-Protocol", "7. Template Distribution Protocol"],
  ["/specification/08-Message-Types", "8. Message Types"],
  ["/specification/09-Extensions", "9. Extensions"],
  ["/specification/10-Discussion", "10. Discussion"],
];

const SpecificationSidebar = ({ setIsMobileSidebarOpen }: { setIsMobileSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { slug } = useParams<{ slug: string }>();
  const pathname = useLocation().pathname;

  const slugWithoutExtension = slug ? slug.replace(".md", "") : "";
  const currentPost = specificationData[slugWithoutExtension as keyof typeof specificationData] || specificationData["00-Abstract"];

  const currentSublinks = useMemo(() => {
    // extract all headings from currentMarkdown (h1, h2, h3,h4,h5,h6)
    return currentPost.content.match(/^#{1,6}\s+(.*)$/gm) ?? [];
  }, [currentPost]);

  const joinedSublinks = currentSublinks?.length > 1 ? currentSublinks.join(" \n") : null;

  // scroll smoothly to heading position
  const handleSmoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    // Manually update the URL hash
    window.history.pushState(null, "", `#${id}`);

    setTimeout(() => {
      const element = document.getElementById(id);
      const scrollContainer =
        document.querySelector("[data-scroll-container]") || document.querySelector(".overflow-y-auto") || document.documentElement;

      if (element && scrollContainer) {
        if (scrollContainer === document.documentElement) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const relativeTop = elementRect.top - containerRect.top + scrollContainer.scrollTop - 100;

          scrollContainer.scrollTo({
            top: relativeTop,
            behavior: "smooth",
          });
        }
      }
    }, 150);

    setIsMobileSidebarOpen?.(false);
  };

  // get current active specificationNavItem based on pathname
  const currentActiveSpecificationNavItem = specificationSidebarNavItems.find(([path]) => pathname.includes(path));

  return (
    <div className='h-full flex-col gap-4 flex max-w-[320px] w-[320px] overflow-y-auto hide-scrollbar'>
      {pathname !== "/specification" && (
        <button className='group w-fit'>
          <Link to='/specification' className='font-dm-mono cursor-pointer font-medium flex gap-2 items-center relative'>
            <ArrowLeft className='w-5 h-5' />
            <p>Back</p>
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-custom-100 mt-1 transition-all duration-300 ease-in-out group-hover:w-full'></span>
          </Link>
        </button>
      )}

      <div className='flex flex-col gap-6'>
        {specificationSidebarNavItems.map(([path, title]) => (
          <div key={path} className='flex flex-col'>
            <Link
              to={`${path}/`}
              key={path}
              className={`relative font-dm-mono text-sm lg:text-lg font-medium hover:text-cyan-custom-100 hover:underline underline-offset-4 ${
                currentActiveSpecificationNavItem?.[0] === path ? "text-cyan-custom-100 font-semibold" : ""
              }`}
              onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById(sluggifyTags([title]));
                  if (element) {
                    element.scrollIntoView();
                  }
                }, 500);

                setIsMobileSidebarOpen?.(false);
              }}
            >
              {title}
            </Link>

            {currentSublinks?.length > 1 && currentActiveSpecificationNavItem?.[0] === path ? (
              <div className='flex flex-col gap-4 pt-4'>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw as any] as PluggableList}
                  components={{
                    h1: ({ ...props }: React.ComponentPropsWithoutRef<"h1">) => {
                      return <h1 {...props} className='hidden' />;
                    },

                    h2: ({ ...props }: React.ComponentPropsWithoutRef<"h2">) => {
                      return (
                        <h2
                          {...props}
                          className='text-sm lg:text-base font-medium sm:font-medium font-dm-mono leading-[120%] tracking-tight pl-3 cursor-pointer hover:text-cyan-custom-100 hover:underline underline-offset-4'
                          onClick={(e) => handleSmoothScroll(e, sluggifyTags(props?.children))}
                        >
                          <a href={`#${sluggifyTags(props?.children)}`}>{props.children}</a>
                        </h2>
                      );
                    },

                    h3: ({ ...props }: React.ComponentPropsWithoutRef<"h3">) => {
                      return (
                        <h3
                          {...props}
                          className='text-sm lg:text-base font-medium sm:font-medium font-dm-mono pl-6 cursor-pointer  hover:text-cyan-custom-100 hover:underline underline-offset-4'
                          onClick={(e) => handleSmoothScroll(e, sluggifyTags(props?.children))}
                        >
                          <a href={`${path}/#${sluggifyTags(props?.children)}`}>{props.children}</a>
                        </h3>
                      );
                    },

                    h4: ({ ...props }: React.ComponentPropsWithoutRef<"h4">) => {
                      return (
                        <h4
                          {...props}
                          className='text-sm lg:text-base font-medium sm:font-medium font-dm-mono pl-8 cursor-pointer hover:text-cyan-custom-100 hover:underline underline-offset-4'
                          onClick={(e) => handleSmoothScroll(e, sluggifyTags(props?.children))}
                        >
                          <a href={`${path}/#${sluggifyTags(props?.children)}`}>{props.children}</a>
                        </h4>
                      );
                    },
                  }}
                >
                  {joinedSublinks ? joinedSublinks : ""}
                </ReactMarkdown>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificationSidebar;
