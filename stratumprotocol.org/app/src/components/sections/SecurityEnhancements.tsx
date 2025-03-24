import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Unlock } from "lucide-react";

const SecurityVisualizer = () => {
  return (
    <div className="relative h-[200px] flex items-center justify-center">
      <div className="grid grid-cols-2 gap-12 w-full max-w-3xl">
        {/* Unprotected Side */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-4">
              <Unlock className="w-6 h-6 text-red-500" />
              <div className="text-sm font-mono text-red-500 bg-red-500/5 px-3 py-1 rounded border border-red-500/20">
                PLAIN DATA
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute inset-x-0 top-1/2 h-px bg-red-500/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Protected Side */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <Lock className="w-6 h-6 text-cyan-500" />
              <div className="text-sm font-mono text-cyan-500 bg-cyan-500/5 px-3 py-1 rounded border border-cyan-500/20">
                ***ENCRYPTED***
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Central Shield */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="p-4 rounded-full bg-background border border-cyan-500/20">
            <Shield className="w-8 h-8 text-cyan-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export function SecurityEnhancements() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Enhanced Security</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Current SV1 protocol is unencrypted and plaintext, leaving miners
            susceptible to man in the middle attack and hashrate theft. Stratum
            V2 is encrypted by default enhancing security over legacy protocol.
          </p>
        </motion.div>

        <Card className="p-6 bg-black/20">
          <SecurityVisualizer />

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-x-12">
              <div>
                <h3 className="text-xl font-mono mb-4 text-red-500">Before: Vulnerable</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Credentials and mining data sent as plaintext</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Susceptible to man-in-the-middle attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Vulnerable to hashrate hijacking</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-mono mb-4 text-cyan-500">After: Protected</h3>
                <ul className="space-y-3 text-sm text-cyan-500">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>End-to-end encryption for all data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Secure authentication protocol</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Perfect forward secrecy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}