import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Shield, Zap, DollarSign } from 'lucide-react';
import { PoolSelector } from '@/components/PoolSelector';

export default function MinersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" aria-labelledby="hero-heading">
        <div className="container mx-auto text-center">
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-mono mb-8">
            Upgrade Your Mining Operation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join the next generation of Bitcoin mining with enhanced security,
            reduced costs, and complete control over your operation
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/5" aria-labelledby="benefits-heading">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Measured Profitability Gains</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Estimated 2.7% to 4.7% increase in net profit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Benefits apply even without firmware upgrades</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Efficiency Through Latency Reduction</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Block change latency reduced by 118x</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Job delivery latency reduced by 232x</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Block propagation improved by 28x</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Improved Fee Capture</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Up to 1.06% more transaction fees per block</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Fresher job templates allow optimal fee inclusion</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Bandwidth and Infrastructure Savings</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>40% to 60% reduction in bandwidth usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Lower operational cost at scale</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Ease of Adoption</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Translator Proxy allows use with SV1 firmware</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>No firmware upgrade required</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">Full Template Control</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Miner-side block template construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Greater autonomy and revenue strategy flexibility</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
            <div className="flex justify-center w-full">
            <PoolSelector />
          </div>
    </main>
  );
}