import { motion } from 'framer-motion';
import { Server, Database } from 'lucide-react';

// Miner component without internal decorations
const Miner = ({ delay }: { delay: number }) => (
  <motion.div
    className="relative aspect-square rounded border border-red-500/20 bg-black/20 flex items-center justify-center w-16 md:w-24"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 2, delay, repeat: Infinity }}
  >
    <span className="text-xs md:text-sm font-mono text-red-500">SV1</span>
  </motion.div>
);

// Animated dots for connections
const ConnectionDots = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    className={`absolute w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${color}`}
    initial={{ opacity: 0, left: '0%' }}
    animate={{ opacity: [0, 1, 0], left: ['0%', '100%'] }}
    transition={{ duration: 1.5, delay, repeat: Infinity }}
  />
);

export function TranslationProxy() {
  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto flex flex-col items-center">
        <motion.div
          className="text-center mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">
            Firmware upgrade not necessary
          </h2>
          <p className="text-muted-foreground">
            Connect your SV1 firmware devices through Translation Proxy which
            facilitates the conversion of SV1 messages to SV2 for communication
            with an SV2 pool.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 md:gap-12 mb-16">
            {/* SV1 Miners Column */}
            <div className="flex flex-col gap-2 md:gap-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <Miner delay={i * 0.3} />
                  {/* Single centered connection line with animated dots */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-20 w-12 md:w-20">
                    <div className="h-[1px] w-full bg-red-500/40" />
                    {[0, 0.3, 0.6].map((dotDelay) => (
                      <ConnectionDots
                        key={dotDelay}
                        color="bg-red-500"
                        delay={i * 0.3 + dotDelay}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Translation Proxy */}
            <div className="relative">
              <div className="w-28 md:w-54 h-48 md:h-96 border border-cyan-500/20 rounded bg-black/20 flex flex-col items-center justify-center p-4 ml-8">
                <Server className="w-8 h-8 md:w-12 md:h-12 text-cyan-500 mb-4" />
                <p className="text-[10px] md:text-sm font-mono text-center text-cyan-500">
                  SV1→SV2 Translation Proxy
                </p>
              </div>

              {/* Connection to Pool with animated dots */}
              <div className="absolute -right-12 md:-right-20 top-1/2 -translate-y-1/2 w-12 md:w-20">
                <div className="h-[1px] w-full bg-cyan-500/40" />
                {[0, 0.3, 0.6].map((delay) => (
                  <ConnectionDots
                    key={delay}
                    color="bg-cyan-500"
                    delay={delay}
                  />
                ))}
              </div>
            </div>

            {/* SV2 Mining Pool */}
            <motion.div
              className="w-28 md:w-54 h-48 md:h-96 border border-cyan-500/20 rounded bg-black/20 flex flex-col items-center justify-center p-4 ml-8"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Database className="w-8 h-8 md:w-12 md:h-12 text-cyan-500 mb-4" />
              <p className="text-[10px] md:text-sm font-mono text-center text-cyan-500">
                SV2 Mining Pool
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
