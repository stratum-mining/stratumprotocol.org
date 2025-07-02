import { Navigation } from '../src/components/Navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Hero } from '@/components/sections/Hero';
import { SecurityComparison } from '@/components/sections/SecurityComparison';
import { MiningCentralization } from '@/components/sections/MiningCentralization';
import { TransactionControl } from '@/components/sections/TransactionControl';
import { LatencyComparison } from '@/components/sections/LatencyComparison';
import { BandwidthComparison } from '@/components/sections/BandwidthComparison';
import { BlockPropagation } from '@/components/sections/BlockPropagation';
import { TranslationProxy } from '@/components/sections/TranslationProxy';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { Sponsorship } from '@/components/sections/Sponsorship';

export function meta() {
  return [{ title: 'Stratum Protocol - Home' }];
}

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />
      <Hero />
      <MiningCentralization />
      <SecurityComparison />
      <section className="py-24 px-4" aria-labelledby="performance-heading">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 id="performance-heading" className="text-4xl font-mono mb-4">
              {t('indexPage.performance.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('indexPage.performance.description')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <LatencyComparison />
            <BandwidthComparison />
          </div>
        </div>
      </section>
      <BlockPropagation />
      <TransactionControl />      
      <TranslationProxy />
      <CommunitySection />
      <Sponsorship />
    </main>
  );
}
