import { motion } from 'framer-motion';
import { Shield, ShieldOff } from 'lucide-react';

export function SecurityVisualization() {
  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Security Comparison</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visualizing the security improvements in Stratum V2
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* V1 Protocol */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <ShieldOff className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-mono">Stratum V1</h3>
            </div>

            <svg className="w-full" viewBox="0 0 300 200">
              <path
                d="M50,100 L250,100"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <circle cx="50" cy="100" r="8" fill="currentColor" />
              <circle cx="250" cy="100" r="8" fill="currentColor" />
              <text x="50" y="130" textAnchor="middle" className="text-sm">
                Miner
              </text>
              <text x="250" y="130" textAnchor="middle" className="text-sm">
                Pool
              </text>

              <motion.circle
                cx="150"
                cy="100"
                r="12"
                fill="rgb(239 68 68)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text
                x="150"
                y="80"
                textAnchor="middle"
                className="text-sm text-destructive"
              >
                Vulnerable
              </text>
            </svg>
          </motion.div>

          {/* V2 Protocol */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
              <h3 className="text-2xl font-mono">Stratum V2</h3>
            </div>

            <svg className="w-full" viewBox="0 0 300 200">
              <path
                d="M50,100 L250,100"
                stroke="rgb(6 182 212)"
                strokeWidth="4"
                fill="none"
              />
              <circle cx="50" cy="100" r="8" fill="rgb(6 182 212)" />
              <circle cx="250" cy="100" r="8" fill="rgb(6 182 212)" />
              <text x="50" y="130" textAnchor="middle" className="text-sm">
                Miner
              </text>
              <text x="250" y="130" textAnchor="middle" className="text-sm">
                Pool
              </text>

              <motion.path
                d="M70,100 L230,100"
                stroke="rgb(6 182 212)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
