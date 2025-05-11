import { Navigation } from "@/components/Navigation";
import { Link } from "react-router";

export default function ResourcesPage() {
  return (
    <main className='min-h-screen bg-background text-foreground h-full'>
      <Navigation />
      <section className='pt-32 pb-16 px-4 container mx-auto h-full min-h-screen max-h-screen'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-9 h-full max-h-[calc(100vh-8rem)]'>
          <div className='h-full col-span-1 lg:block hidden max-h-[calc(100vh-8rem)]'>
            <section className='flex flex-col gap-4 items-start'>
              {["Read", "Watch"].map((item) => (
                <button
                  key={item}
                  className='capitalize text-xl font-medium'
                  onClick={() => {
                    const element = document.getElementById(item.toLowerCase());
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </section>
          </div>

          <div className='h-full col-span-3 overflow-y-auto flex flex-col gap-14 pb-16 max-h-[calc(100vh-8rem)] hide-scrollbar'>
            <h1 className='text-5xl sm:text-6xl md:text-7xl font-dm-mono text-center'>Resources</h1>
            <section className='flex flex-col gap-7 items-start'>
              <h5 className='text-xl sm:text-2xl text-muted-foreground uppercase font-medium font-dm-mono' id='learn'>
                Learn
              </h5>

              <section className='flex flex-col gap-4'>
                <h2 className='text-3xl sm:text-5xl font-semibold font-dm-mono'>LEARN SV2</h2>
                <p className='text-justify sm:text-left'>
                  This resource page is designed to provide users with access to various media related to Stratum V2. The goal is to support users in
                  their use and promotion of Stratum V2 by offering a hub for all necessary materials and information.
                </p>
              </section>
            </section>

            <section className='flex flex-col gap-7 items-start'>
              <h5 className='text-3xl sm:text-4xl underline underline-offset-8 text-muted-foreground uppercase font-medium font-dm-mono' id='read'>
                Read
              </h5>

              <section className='flex flex-col gap-9 w-full'>
                {READ_RESOURCES.map((resource) => (
                  <button className='font-medium border border-border rounded-md w-full items-center justify-center p-8 px-0 sm:p-10  flex flex-col gap-6'>
                    <p className='text-xl sm:text-2xl md:text-3xl font-semibold'>{resource.title}</p>
                    <Link
                      to={resource.href}
                      key={resource.title}
                      target='_blank'
                      className='bg-cyan-custom-100 text-black text-sm sm:text-lg px-4 py-2 rounded-md font-medium uppercase'
                    >
                      {resource.linkText}
                    </Link>
                  </button>
                ))}
              </section>
            </section>

            <section className='flex flex-col gap-7 items-start w-full'>
              <h5 className='text-3xl sm:text-4xl underline underline-offset-8 text-muted-foreground uppercase font-medium font-dm-mono' id='watch'>
                Watch
              </h5>

              <section className='flex flex-col gap-9 w-full'>
                {WATCH_RESOURCES.map((resource) => (
                  <div className='w-full aspect-video relative' key={resource.youtube}>
                    <iframe
                      src={`https://www.youtube.com/embed/${resource.youtube}`}
                      className='w-full h-full border-[0.5px] border-white'
                      frameBorder='0'
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </section>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

const READ_RESOURCES = [
  {
    title: "Master Thesis on StratumV2",
    href: "https://webthesis.biblio.polito.it/27678/",
    linkText: "View the thesis",
  },
  {
    title: "Satsie's Pocket Guide to StratumV2",
    href: "https://satsie.dev/zines/sv2.html",
    linkText: "View the magazine",
  },
  {
    title: "The Bullish Case for StratumV2",
    href: "https://www.swanbitcoin.com/industry/the-bullish-case-for-stratum/",
    linkText: "View the article",
  },
];

const WATCH_RESOURCES = [
  {
    youtube: "XDXQuEJHa8Q",
  },
  {
    youtube: "xrdhtQPHg2o",
  },
  {
    youtube: "f3XsNhLiPBk",
  },
  {
    youtube: "4r3hb2OqLBg",
  },
  {
    youtube: "mTXw3UZNT0Y",
  },
  {
    youtube: "videoseries?list=PLZXAi8dsUIn0GmElOcmqUtgA5psfFIZoO",
  },
];
