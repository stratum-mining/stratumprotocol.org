import { motion, useScroll, AnimatePresence, useTransform } from "framer-motion";
import { PoolSelector } from "@/components/PoolSelector";
import { useEffect, useState, useRef } from "react";

export function Hero() {
  const [activeText, setActiveText] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const sectionRef = useRef(null);
  const textSectionRef = useRef(null);
  const prevScrollY = useRef(0);
  const texts = [
    {
      highlight: "efficient",
      paragraph: (
        <>
          <span className='text-primary'> Stratum V2 </span> improves how miners, pools, and the Bitcoin network communicate.{" "}
          <span className='text-primary'> It strengthens security </span> with encryption and{" "}
          <span className='text-primary'>makes mining faster and more efficient</span> by reducing bandwidth use and latency.
        </>
      ),
    },
    {
      highlight: "decentralized",
      paragraph: (
        <>
          Most importantly,<span className='text-primary'>  Stratum V2</span> empowers miners to choose which transactions are included in blocks,
          protecting Bitcoin's fundamental properties - <span className='text-primary'>decentralization</span> and{" "}
          <span className='text-primary'>censorship resistance</span>.
        </>
      ),
    },
    {
      highlight: "profitable",
      paragraph: (
        <>
          <span className='text-primary'>Stratum V2</span> increases<span className='text-primary'> miner profits</span> by minimizing stale shares, reducing block and job latency, 
          improving propagation speed, and cutting bandwidth waste. These upgrades directly improve efficiency{" "}
          <span className='text-primary'>turning savings </span> into <span className='text-primary'>more revenue</span>.
        </>
      ),
    },
  ];

  // Track scroll progress for the text animation section only
  const { scrollYProgress: textScrollProgress } = useScroll({
    target: textSectionRef,
    offset: ["start end", "end start"]
  });

  // Track scroll progress for the entire section to make it sticky
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Create a transform to use for sticky behavior
  const stickyProgress = useTransform(scrollYProgress, [0.75, 0.85, 0.98, 1], [0, 0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > prevScrollY.current ? 'down' : 'up';
      setScrollDirection(direction);
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = textScrollProgress.onChange(value => {
      // Change text based on scroll position - using the text section's scroll progress
      if (value < 0.5) {
        setActiveText(0); // efficient
      } else if (value < 0.6) {
        setActiveText(1); // decentralized
      } else if (value < 0.85 ) {
        setActiveText(2); // profitable
      }
    });

    return () => unsubscribe();
  }, [textScrollProgress]);

  // Animation variants for sequential vertical sliding
  const textVariants = {
    hidden: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? 70 : -70,
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0] // cubic-bezier for smoother motion
      }
    },
    exit: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? -70 : 70,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

  // Paragraph variants with similar sequential effect
  const paragraphVariants = {
    hidden: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? 30 : -30,
    }),
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0],
        delay: 0.1 
      }
    },
    exit: (direction: string) => ({
      opacity: 0,
      y: direction === 'down' ? -30 : 30,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    })
  };

  return (
    <section 
      ref={sectionRef} 
      className='relative min-h-screen py-32 bg-background'
    >
      {/* Background lines - kept outside the sticky container */}
      <div className='absolute top-0 left-0 right-0 bottom-0'>
        <div className='relative h-full w-full'>
          <img src='/assets/svgs/background-lines.svg' alt='background lines' className='object-cover w-full h-full' />
        </div>
      </div>
      
      {/* Make the content sticky until the animation completes */}
      <motion.div 
        className='sticky top-0 min-h-screen flex items-center justify-center overflow-hidden'
        style={{ translateY: useTransform(stickyProgress, (v) => v * -50 + '%') }}
      >
        <div className='container relative px-4 flex flex-col gap-15 md:gap-20'>
          {/* This is where we track the text animation scroll progress */}
          <div ref={textSectionRef} className='flex flex-col gap-5 md:gap-10'>
            <motion.h1
              className='text-4xl md:text-7xl leading-[120%] lg:text-[5.75rem] lg:leading-[104%] font-dm-mono tracking-tight'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              One giant leap
              <br />
              for{" "}
              <span className="inline-flex items-center h-[1.2em] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {activeText === 0 && (
                    <motion.span
                      key="efficient"
                      custom={scrollDirection}
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-primary font-dm-mono tracking-tight"
                      style={{ display: 'inline-block' }}
                    >
                      efficient
                    </motion.span>
                  )}
                  
                  {activeText === 1 && (
                    <motion.span
                      key="decentralized"
                      custom={scrollDirection}
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-transparent font-dm-mono tracking-tight bg-clip-text"
                      style={{
                        WebkitTextStroke: '1px rgb(0, 255, 255)',
                        textShadow: '#000',
                        display: 'inline-block'
                      }}
                    >
                      decentralized
                    </motion.span>
                  )}
                  
                  {activeText === 2 && (
                    <motion.div
                      key="profitable"
                      custom={scrollDirection}
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative font-dm-mono tracking-tight"
                      style={{ display: 'inline-block' }}
                    >
                      {/* Background stroked text */}
                      <span
                        className="absolute text-transparent"
                        style={{
                          WebkitTextStroke: '1px #6ADDDF',
                          textShadow: '#000',
                        }}
                      >
                        profitable
                      </span>
                      {/* Foreground filled text with increased offset for more pronounced 3D effect */}
                      <span
                        className="relative text-[#0C5E5C] font-dm-mono tracking-tight"
                        style={{
                          position: 'relative',
                          left: '6px',
                          WebkitTextStroke: '1px #6ADDDF'
                        }}
                      >
                        profitable
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              mining
            </motion.h1>

            <div className='max-w-[70rem] min-h-[6rem] overflow-hidden'>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeText}
                  custom={scrollDirection}
                  variants={paragraphVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className='text-lg md:text-xl text-muted-foreground'
                >
                  {texts[activeText].paragraph}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <PoolSelector buttonText='Start Mining' />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Spacer to ensure we have enough scroll room for the animation */}
      <div className="h-[100vh]"></div>
    </section>
  );
}
