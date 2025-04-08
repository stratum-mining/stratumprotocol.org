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
          Stratum V2 improves how miners, pools, and the Bitcoin network communicate. It strengthens security with encryption and <span className="text-primary">makes mining faster and more efficient</span> by reducing bandwidth use and latency.
        </>
      )
    },
    {
      highlight: "decentralized",
      paragraph: (
        <>
          Most importantly, Stratum V2 empowers miners to choose which transactions are included in blocks, protecting Bitcoin's fundamental properties - <span className="text-primary">decentralization and censorship resistance</span>.
        </>
      )
    }
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
      <div className='container relative mx-auto px-4'>
        <div className='max-w-8xl mx-auto'>
          <motion.h1
            className='text-4xl md:text-[6.75rem] leading-[7.5rem] font-dm-mono mb-8 tracking-tight'
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
              className="text-primary"
            >
              {texts[activeText].highlight}
            </motion.span>{" "}
            mining
          </motion.h1>

          <div className="h-32 md:h-24 mb-12 max-w-6xl">
            <motion.p
              key={activeText}
              className="text-lg md:text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {texts[activeText].paragraph}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PoolSelector buttonText="Start Mining" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}