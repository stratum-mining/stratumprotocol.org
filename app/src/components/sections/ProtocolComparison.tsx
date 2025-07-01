import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Network } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function ProtocolComparison() {
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
          <h2 className="text-4xl font-mono mb-4">{t('protocolComparison.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('protocolComparison.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('protocolComparison.enhancedSecurity.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('protocolComparison.enhancedSecurity.description')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('protocolComparison.betterPerformance.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('protocolComparison.betterPerformance.description')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <Network className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('protocolComparison.decentralization.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('protocolComparison.decentralization.description')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
