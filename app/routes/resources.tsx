
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function ResourcesPage() {
  const { t } = useTranslation();

  const READ_RESOURCES = [
    {
      title: t("resources.read.thesis.title"),
      href: "https://webthesis.biblio.polito.it/27678/",
      linkText: t("resources.read.thesis.linkText"),
    },
    {
      title: t("resources.read.pocketGuide.title"),
      href: "https://satsie.dev/zines/sv2.html",
      linkText: t("resources.read.pocketGuide.linkText"),
    },
    {
      title: t("resources.read.bullishCase.title"),
      href: "https://www.swanbitcoin.com/industry/the-bullish-case-for-stratum/",
      linkText: t("resources.read.bullishCase.linkText"),
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

  return (
    <main className='min-h-screen bg-background text-foreground h-full'>
      <Navigation />
      <section className='pt-32 pb-16 px-4 container mx-auto h-full min-h-screen max-h-screen'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-9 h-full max-w-4xl mx-auto'>
          <div className='h-full col-span-4 overflow-y-auto flex flex-col gap-14 pb-16 hide-scrollbar'>
            <h1 className='text-5xl sm:text-6xl md:text-7xl font-dm-mono text-center'>{t("resources.title")}</h1>
            <section className='flex flex-col gap-7 items-start'>
              <h5 className='text-xl sm:text-2xl text-muted-foreground uppercase font-medium font-dm-mono' id='learn'>
                {t("resources.learn.heading")}
              </h5>

              <section className='flex flex-col gap-4'>
                <h2 className='text-3xl sm:text-5xl font-semibold font-dm-mono'>{t("resources.learn.title")}</h2>
                <p className='text-justify sm:text-left'>
                  {t("resources.learn.description")}
                </p>
              </section>
            </section>

            <section className='flex flex-col gap-7 items-start'>
              <h5 className='text-3xl sm:text-4xl underline underline-offset-8 text-muted-foreground uppercase font-medium font-dm-mono' id='read'>
                {t("resources.read.heading")}
              </h5>

              <section className='flex flex-col gap-9 w-full'>
                {READ_RESOURCES.map((resource) => (
                  <button
                    className='font-medium border border-border rounded-md w-full items-center justify-center p-8 px-0 sm:p-10  flex flex-col gap-6'
                    key={resource.title}
                  >
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
                {t("resources.watch.heading")}
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
