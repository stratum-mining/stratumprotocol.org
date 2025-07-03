import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { PoolSelector } from '@/components/PoolSelector';
import { LatencyJobBlockComparison } from '@/components/sections/LatencyJobBlockComparison';
import { ShareAcceptance } from '@/components/sections/ShareAcceptance';
import { useTranslation } from 'react-i18next';
import {
  Zap, BarChart3, Coins, Rocket, Settings, Shield
} from 'lucide-react';


export default function MinersPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />

      {/* Hero Section */}
      <section 
        className="min-h-screen flex flex-col justify-center px-4 relative bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: 'url(/assets/minersBackgound.png)',
        }}
        aria-labelledby="hero-heading"
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-mono mb-8 text-white">
            {t('miners.hero.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12">
            {t('miners.hero.subtitle')}
          </p>
          <div className="flex justify-center w-full">
            <PoolSelector />
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-8 bg-black/95 border-t border-cyan-500/20 border-b border-cyan-500/20 relative">
        {/* Top decorative lines */}
        <div className="absolute top-0 left-0 w-full h-0.5" style={{
          borderTop: '1px solid #6ADDDF4D'
        }}></div>
        
        {/* Bottom decorative lines */}
        <div className="absolute bottom-0 left-0 w-full h-0.5" style={{
          borderBottom: '1px solid #6ADDDF4D'
        }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Profit Increase */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{t('miners.metrics.profitIncrease.value')}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{t('miners.metrics.profitIncrease.label')}</div>
            </div>
            
            {/* First vertical divider */}
            <div className="absolute left-1/3 -top-4 -bottom-4 w-px hidden md:block" style={{
              background: 'linear-gradient(180deg, rgba(65, 255, 230, 0) 0%, #62EAE7 50%, rgba(65, 255, 230, 0) 100%)'
            }}></div>
            
            {/* Block Change */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{t('miners.metrics.blockChange.value')}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{t('miners.metrics.blockChange.label')}</div>
            </div>
            
            {/* Second vertical divider */}
            <div className="absolute left-2/3 -top-4 -bottom-4 w-px hidden md:block" style={{
              background: 'linear-gradient(180deg, rgba(65, 255, 230, 0) 0%, #62EAE7 50%, rgba(65, 255, 230, 0) 100%)'
            }}></div>
            
            {/* Security Protection */}
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{t('miners.metrics.hashrateProtection.value')}</div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">{t('miners.metrics.hashrateProtection.label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 lg:py-24 px-2 md:px-6 lg:px-8 bg-muted/5" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-3 md:px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8">
              <BarChart3 className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.profitability.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.profitability.gain')}</li>
              </ul>
            </Card>
            <Card className="p-8">
              <Zap className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.efficiency.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.efficiency.blockLatency')}</li>
              </ul>
            </Card>
            <Card className="p-8">
              <Coins className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.feeCapture.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.feeCapture.moreFees')}</li>
              </ul>
            </Card>
            <Card className="p-8">
              <Rocket className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.adoption.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.adoption.translator')}</li>
              </ul>
            </Card>
            <Card className="p-8">
              <Settings className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.templateControl.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.templateControl.construction')}</li>
              </ul>
            </Card>
            <Card className="p-8">
              <Shield className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-2xl font-mono mb-4">{t('miners.security.title')}</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li>{t('miners.security.encryption')}</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Maximizing Your Mining Profitability Section */}
      <section className="py-8 md:py-16 lg:py-24 px-3 md:px-6 lg:px-8 bg-black/95">
        <div className="container mx-auto px-3 md:px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-gray-400 text-sm mb-4">{t('miners.profitabilitySection.subtitle')}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {t('miners.profitabilitySection.title')}
            </h2>
      </div>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <LatencyJobBlockComparison />
          <ShareAcceptance />
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}