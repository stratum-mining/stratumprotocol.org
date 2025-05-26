import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router";

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

const SpecificationSidebar = () => {
  const pathname = useLocation().pathname;

  // get current active specificationNavItem based on pathname
  const currentActiveSpecificationNavItem = specificationSidebarNavItems.find(([path]) => pathname.includes(path));

  return (
    <div className='sticky top-20 h-full flex-col gap-4 lg:flex hidden max-w-[300px] w-[300px]'>
      {pathname !== "/specification" && (
        <button className='group w-fit'>
          <Link to='/specification' className='font-dm-mono cursor-pointer font-medium flex gap-2 items-center relative'>
            <ArrowLeft />
            <p>Back</p>
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-custom-100 mt-1 transition-all duration-300 ease-in-out group-hover:w-full'></span>
          </Link>
        </button>
      )}

      <div className='flex flex-col gap-2'>
        {specificationSidebarNavItems.map(([path, title]) => (
          <Link
            to={`${path}.md`}
            key={path}
            className={`relative font-dm-mono text-lg font-medium hover:text-cyan-custom-100 hover:underline underline-offset-4 ${
              currentActiveSpecificationNavItem?.[0] === path ? "text-cyan-custom-100" : ""
            }`}
          >
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecificationSidebar;
