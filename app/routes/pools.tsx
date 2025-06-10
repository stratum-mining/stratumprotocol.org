
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Scale, Code2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PoolsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-mono mb-8">
            {t('pools.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {t('pools.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto space-y-16">

          {/* Operational Benefits */}
          <div>
            <h2 className="text-3xl font-mono mb-8 text-center">{t('pools.operationalBenefits.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <Shield className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-mono mb-2">{t('pools.operationalBenefits.security.title')}</h3>
                <p className="text-muted-foreground">
                  {t('pools.operationalBenefits.security.description')}
                </p>
              </Card>

              <Card className="p-6">
                <Zap className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-mono mb-2">{t('pools.operationalBenefits.overhead.title')}</h3>
                <p className="text-muted-foreground">
                  {t('pools.operationalBenefits.overhead.description')}
                </p>
              </Card>

              <Card className="p-6">
                <Scale className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-mono mb-2">{t('pools.operationalBenefits.accounting.title')}</h3>
                <p className="text-muted-foreground">
                  {t('pools.operationalBenefits.accounting.description')}
                </p>
              </Card>
            </div>
          </div>

          {/* Strategic Differentiators */}
          <div>
            <h2 className="text-3xl font-mono mb-8 text-center">{t('pools.strategicDifferentiators.title')}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <Code2 className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-mono mb-2">{t('pools.strategicDifferentiators.developerFriendly.title')}</h3>
                <p className="text-muted-foreground">
                  {t('pools.strategicDifferentiators.developerFriendly.description')}
                </p>
              </Card>

              <Card className="p-6">
                <Rocket className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-mono mb-2">{t('pools.strategicDifferentiators.futureBuilt.title')}</h3>
                <p className="text-muted-foreground">
                  {t('pools.strategicDifferentiators.futureBuilt.description')}
                </p>
              </Card>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-mono mb-8 text-center">
            {t('pools.gettingStarted.title')}
          </h2>
          <div className="max-w-2xl mx-auto bg-background p-8 rounded-lg">
            <pre className="bg-muted p-4 rounded mb-4 overflow-x-auto">
              <code>
                {`${t('pools.gettingStarted.cloneRepo')}
git clone https://github.com/stratum-mining/stratum
cd stratum

${t('pools.gettingStarted.buildPool')}
cargo build --release

${t('pools.gettingStarted.configurePool')}
cp config.example.toml config.toml
${t('pools.gettingStarted.editConfig')}

${t('pools.gettingStarted.startPool')}
./target/release/sv2-pool
`}
              </code>
            </pre>
            <Button className="w-full">
              {t('pools.gettingStarted.viewDocs')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
