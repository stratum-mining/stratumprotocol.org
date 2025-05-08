import { Navigation } from '../src/components/Navigation';
import { motion } from 'framer-motion';
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
  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />
      <Hero />
      <MiningCentralization />
      <TransactionControl />
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
              Faster & Lighter
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
            Stratum V2 replaces the verbose JSON messages used by Stratum V1 with a compact binary protocol, leading to ~60% reductions in bandwidth usage.
            Lower bandwidth plays a supporting role in maintaining stable operations, especially in environments with constrained or unreliable connectivity.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <LatencyComparison />
            <BandwidthComparison />
          </div>
        </div>
      </section>
      <BlockPropagation />
      <TranslationProxy />
      <CommunitySection />
      <Sponsorship />
    </main>
  );
}
