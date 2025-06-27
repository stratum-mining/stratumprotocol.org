import { motion, AnimatePresence } from "framer-motion";
import { PoolSelector } from "@/components/PoolSelector";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { t } = useTranslation();
  const [activeText, setActiveText] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<gsap.plugins.ScrollTriggerInstance | null>(null);
  const isAnimatingRef = useRef(false);
  const texts = [
    {
      highlight: t("hero.efficient"),
      paragraph: (
        <>
          <span className='text-primary'> Stratum V2 </span> {t("hero.texts.efficient")}
        </>
      ),
    },
    {
      highlight: t("hero.decentralized"),
      paragraph: (
        <>
          {t("hero.texts.decentralized")}
        </>
      ),
    },
    {
      highlight: t("hero.profitable"),
      paragraph: (
        <>
          {t("hero.texts.profitable")}
        </>
      ),
    },
  ];

  // Memoize the text update function to prevent unnecessary re-renders
  const updateActiveText = useCallback((progress: number) => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    if (progress < 0.33) {
      setActiveText(0);
    } else if (progress < 0.66) {
      setActiveText(1);
    } else {
      setActiveText(2);
    }
    // Reset the flag after a short delay to prevent rapid updates
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 100);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Kill any existing ScrollTrigger instance
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
    }

    const ctx = gsap.context(() => {
      // Create a timeline for the text animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self: gsap.plugins.ScrollTriggerInstance) => {
            updateActiveText(self.progress);
          },
          onEnter: () => {
            gsap.to(textContainerRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: "easeOut"
            });
          },
          onLeaveBack: () => {
            gsap.to(textContainerRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: "easeIn"
            });
          }
        }
      });

      // Store the ScrollTrigger instance for cleanup
      if (tl.scrollTrigger) {
        scrollTriggerRef.current = tl.scrollTrigger;
      }

      return () => {
        tl.scrollTrigger?.kill();
      };
    }, sectionRef);

    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [updateActiveText]);

  // Animation variants for text transitions
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0] // cubic-bezier for smooth motion
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.1, 0.25, 1.0] // cubic-bezier for smooth motion
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className='relative min-h-[150vh] bg-background'
    >
      {/* Background lines */}
      <div className='absolute top-0 left-0 right-0 bottom-0'>
        <div className='relative h-full w-full'>
          <img src='/assets/svgs/background-lines.svg' alt='background lines' className='object-cover w-full h-full' />
        </div>
      </div>

      {/* Fixed content container */}
      <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center py-40'>
        <div className='container relative px-4 flex flex-col gap-20 md:gap-24'>
          {/* Text animation container */}
          <div ref={textContainerRef} className='flex flex-col gap-8 md:gap-12 opacity-0'>
            <motion.h1
              className='text-5xl md:text-8xl leading-[120%] lg:text-[6.5rem] lg:leading-[104%] font-dm-mono tracking-tight'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t("hero.oneGiantLeap")}
              <br />
              {t("hero.for")}{" "}
              <span className="inline-flex items-center min-h-[1.2em]">
                <AnimatePresence mode="wait" initial={false}>
                  {activeText === 0 && (
                    <motion.span
                      key="efficient"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-primary font-dm-mono tracking-tight"
                      style={{ display: 'inline-block' }}
                    >
                      {t("hero.efficient")}
                    </motion.span>
                  )}

                  {activeText === 1 && (
                    <motion.span
                      key="decentralized"
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
                      {t("hero.decentralized")}
                    </motion.span>
                  )}

                  {activeText === 2 && (
                    <motion.div
                      key="profitable"
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
                        {t("hero.profitable")}
                      </span>
                      {/* Foreground filled text */}
                      <span
                        className="relative text-[#0C5E5C] font-dm-mono tracking-tight"
                        style={{
                          position: 'relative',
                          left: '6px',
                          WebkitTextStroke: '1px #6ADDDF'
                        }}
                      >
                        {t("hero.profitable")}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>{" "}
              {t("hero.mining")}
            </motion.h1>

            <div className='max-w-[80rem] min-h-[8rem] overflow-hidden'>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeText}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className='text-xl md:text-2xl text-muted-foreground'
                >
                  {texts[activeText].paragraph}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <PoolSelector buttonText={t("hero.startMining")} />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground font-dm-mono">
            {t("hero.scrollToExplore")}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="p-2 rounded-full border border-cyan-custom-100/30 bg-black/20 backdrop-blur-sm"
          >
            <ChevronDown className="w-5 h-5 text-cyan-custom-100" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}