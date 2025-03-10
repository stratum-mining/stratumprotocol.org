import { motion } from "framer-motion";
import { PoolSelector } from "@/components/PoolSelector";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 bg-background">
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl md:text-7xl font-mono mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            One giant leap
            <br /> 
            for bitcoin mining
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg md:text-xl text-muted-foreground mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Stratum V2 improves how miners, pools, and the Bitcoin network communicate. It strengthens security with encryption and makes mining faster and more efficient by reducing bandwidth use and latency.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Most importantly, Stratum V2 empowers miners to choose which transactions are included in blocks, protecting Bitcoin's fundamental properties - decentralization and censorship resistance.
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