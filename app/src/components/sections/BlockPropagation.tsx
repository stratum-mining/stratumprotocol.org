import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Boxes } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Create a single node component for reuse
const Node = ({ delay, version }: { delay: number; version: 'v1' | 'v2' }) => (
  <motion.div
    className={`
      relative aspect-square rounded-lg border
      ${
        version === 'v1'
          ? 'border-red-500/20 bg-red-500/5'
          : 'border-cyan-500/20 bg-cyan-500/5'
      }
    `}
    initial={{ opacity: 0.3 }}
    animate={{
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: version === 'v1' ? 1.8 : 0.1, // 18x difference (72ms vs 4ms)
      delay: delay,
      repeat: Infinity,
    }}
  >
    {/* Connection Lines */}
    <motion.div
      className={`
        absolute inset-0 border-b border-r
        ${version === 'v1' ? 'border-red-500' : 'border-cyan-500'}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: version === 'v1' ? 1.8 : 0.1, // Match the 18x ratio
        delay: delay,
        repeat: Infinity,
      }}
    />

    {/* Block Propagation Indicator */}
    <motion.div
      className={`
        absolute inset-2 rounded
        ${version === 'v1' ? 'bg-red-500/30' : 'bg-cyan-500/30'}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: version === 'v1' ? 1.8 : 0.1, // Match the 18x ratio
        delay: delay,
        repeat: Infinity,
      }}
    />
  </motion.div>
);

// For the Network Grid component, adjust the delay calculation to maintain the ratio
const NetworkGrid = ({ version }: { version: 'v1' | 'v2' }) => (
  <div className="grid grid-cols-4 gap-3 p-4">
    {[...Array(12)].map((_, i) => (
      <Node
        key={i}
        version={version}
        delay={
          // Calculate delays based on node position and maintain the 18x ratio
          (Math.floor(i / 4) * 0.2 + (i % 4) * 0.1) *
          (version === 'v1' ? 1 : 0.056) // Scale factor for V2 (4ms vs 72ms)
        }
      />
    ))}
  </div>
);

export function BlockPropagation() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            id="block-propagation-heading"
            className="text-4xl font-mono mb-4"
          >
            {t('sections.blockPropagation.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('sections.blockPropagation.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* V1 Card */}
          <Card className="p-6 bg-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Boxes className="w-5 h-5 text-red-500" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-mono">{t('sections.blockPropagation.v1Label')}</h3>
                <p className="text-sm text-red-500 font-mono">
                  {t('sections.blockPropagation.v1Propagation')}
                </p>
                <p className="text-sm text-red-500 font-mono">
                  {t('sections.blockPropagation.v1BlockChange')}
                </p>
              </div>
            </div>
            <NetworkGrid version="v1" />
          </Card>

          {/* V2 Card */}
          <Card className="p-6 bg-black/20">
            <div className="flex items-center gap-3 mb-4">
              <Boxes className="w-5 h-5 text-cyan-500" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-mono">{t('sections.blockPropagation.v2Label')}</h3>
                <p className="text-sm text-cyan-500 font-mono">
                  {t('sections.blockPropagation.v2Propagation')}
                </p>
                <p className="text-sm text-cyan-500 font-mono">
                  {t('sections.blockPropagation.v2BlockChange')}
                </p>
              </div>
            </div>
            <NetworkGrid version="v2" />
          </Card>
        </div>
      </div>
    </section>
  );
}