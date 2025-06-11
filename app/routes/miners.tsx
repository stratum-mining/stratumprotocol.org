
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Shield, Zap, DollarSign } from 'lucide-react';
import { PoolSelector } from '@/components/PoolSelector';
import { LatencyJobBlockComparison } from '@/components/sections/LatencyJobBlockComparison';
import { ShareAcceptance } from '@/components/sections/ShareAcceptance';
import { MinersBandwidth } from '@/components/sections/MinersBandwidth';
import { useTranslation } from 'react-i18next';

export default function MinersPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" aria-labelledby="hero-heading">
        <div className="container mx-auto text-center">
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-mono mb-8">
            {t('miners.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {t('miners.hero.subtitle')}
          </p>
        </div>
        <div className="flex justify-center w-full">
            <PoolSelector />
        </div>  
      </section>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <LatencyJobBlockComparison />
          <ShareAcceptance />
        </div>
      </div>
      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/5" aria-labelledby="benefits-heading">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.profitability.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.profitability.gain')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.profitability.noUpgrade')}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.efficiency.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.efficiency.blockLatency')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.efficiency.jobLatency')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.efficiency.blockPropagation')}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.feeCapture.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.feeCapture.moreFees')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.feeCapture.fresherJobs')}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.bandwidth.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.bandwidth.reduction')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.bandwidth.lowerCost')}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.adoption.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.adoption.translator')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.adoption.noUpgrade')}</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <h3 className="text-2xl font-mono mb-4">{t('miners.templateControl.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.templateControl.construction')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{t('miners.templateControl.autonomy')}</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
