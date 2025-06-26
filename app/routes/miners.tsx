import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PoolSelector } from '@/components/PoolSelector';
import { LatencyJobBlockComparison } from '@/components/sections/LatencyJobBlockComparison';
import { ShareAcceptance } from '@/components/sections/ShareAcceptance';
import { MinersBandwidth } from '@/components/sections/MinersBandwidth';
import {
  Zap, BarChart3, Link2, Coins, Rocket, Settings, Shield, DollarSign, FileText
} from 'lucide-react';
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
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8">
            <BarChart3 className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.profitability.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.profitability.gain')}</li>
              <li>{t('miners.profitability.noUpgrade')}</li>
            </ul>
          </Card>
          <Card className="p-8">
            <Zap className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.efficiency.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.efficiency.blockLatency')}</li>
              <li>{t('miners.efficiency.jobLatency')}</li>
              <li>{t('miners.efficiency.blockPropagation')}</li>
            </ul>
          </Card>
          <Card className="p-8">
            <Coins className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.feeCapture.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.feeCapture.moreFees')}</li>
              <li>{t('miners.feeCapture.fresherJobs')}</li>
            </ul>
          </Card>
          <Card className="p-8">
            <Rocket className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.adoption.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.adoption.translator')}</li>
              <li>{t('miners.adoption.noUpgrade')}</li>
            </ul>
          </Card>
          <Card className="p-8">
            <Settings className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.templateControl.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.templateControl.construction')}</li>
              <li>{t('miners.templateControl.autonomy')}</li>
            </ul>
          </Card>
          <Card className="p-8">
            <Shield className="w-12 h-12 text-cyan-500 mb-4" />
            <h3 className="text-2xl font-mono mb-4">{t('miners.security.title')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li>{t('miners.security.encryption')}</li>
              <li>{t('miners.security.profitProtection')}</li>
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}