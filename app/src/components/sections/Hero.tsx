import { motion } from "framer-motion";
import { PoolSelector } from "@/components/PoolSelector";
import { useEffect, useState } from "react";

export function Hero() {
  const [activeText, setActiveText] = useState(0);
  const texts = [
    {
      highlight: "efficient",
      paragraph: (
        <>
          <span className='text-white'> Stratum V2 </span> improves how miners, pools, and the Bitcoin network communicate.{" "}
          <span className='text-white'> It strengthens security </span> with encryption and{" "}
          <span className='text-white'>makes mining faster and more efficient</span> by reducing bandwidth use and latency.
        </>
      ),
    },
    {
      highlight: "decentralized",
      paragraph: (
        <>
          <span className='text-white'> Most importantly, Stratum V2</span> empowers miners to choose which transactions are included in blocks,
          protecting Bitcoin's fundamental properties - <span className='text-white'>decentralization</span> and{" "}
          <span className='text-white'>censorship resistance</span>.
        </>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveText((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden py-32 bg-background'>
      <div className='absolute top-0 left-0 right-0 bottom-0'>
        <div className='relative h-full w-full'>
          <img src='/assets/svgs/background-lines.svg' alt='background lines' className=' object-cover w-full h-full' />
        </div>
      </div>
      <div className='container relative px-4 flex flex-col gap-15 md:gap-20'>
        <div className='flex flex-col gap-5 md:gap-10'>
          <motion.h1
            className='text-4xl md:text-7xl leading-[120%] lg:text-[5.75rem] lg:leading-[104%] font-dm-mono tracking-tight'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            One giant leap
            <br />
            for{" "}
            <motion.span
              key={texts[activeText].highlight}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='text-primary'
            >
              {texts[activeText].highlight}
            </motion.span>{" "}
            mining
          </motion.h1>

          <div className='max-w-[70rem]'>
            <motion.p
              key={activeText}
              className='text-lg md:text-xl text-muted-foreground'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {texts[activeText].paragraph}
            </motion.p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <PoolSelector buttonText='Start Mining' />
        </motion.div>
      </div>
    </section>
  );
}
