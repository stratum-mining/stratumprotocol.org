import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export function PerformanceMetrics() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Performance Improvements</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quantifiable improvements in key performance metrics
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-mono">Bandwidth Usage</h3>
              <span className="text-cyan-500">75% Reduction</span>
            </div>
            <Progress value={75} className="h-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-mono">Transaction Speed</h3>
              <span className="text-cyan-500">4x Faster</span>
            </div>
            <Progress value={80} className="h-4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-mono">Infrastructure Requirements</h3>
              <span className="text-cyan-500">60% Lower</span>
            </div>
            <Progress value={60} className="h-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
