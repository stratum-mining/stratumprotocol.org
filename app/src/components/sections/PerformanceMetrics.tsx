import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

export function PerformanceMetrics() {
  const { t } = useTranslation();
  
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">{t('performanceMetrics.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('performanceMetrics.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-mono">{t('performanceMetrics.bandwidthUsage')}</h3>
              <span className="text-cyan-500">75% {t('performanceMetrics.reduction')}</span>
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
              <h3 className="font-mono">{t('performanceMetrics.transactionSpeed')}</h3>
              <span className="text-cyan-500">4x {t('performanceMetrics.faster')}</span>
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
              <h3 className="font-mono">{t('performanceMetrics.infrastructureRequirements')}</h3>
              <span className="text-cyan-500">60% {t('performanceMetrics.lower')}</span>
            </div>
            <Progress value={60} className="h-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
