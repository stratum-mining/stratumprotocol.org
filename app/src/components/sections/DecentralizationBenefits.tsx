import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Settings, Coins } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function DecentralizationBenefits() {
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
          <h2 className="text-4xl font-mono mb-4">{t('decentralizationBenefits.title')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('decentralizationBenefits.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <Network className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('decentralizationBenefits.transactionSelection.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('decentralizationBenefits.transactionSelection.description')}
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
                <Settings className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('decentralizationBenefits.independentOperation.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('decentralizationBenefits.independentOperation.description')}
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
                <Coins className="w-10 h-10 text-cyan-500 mb-2" />
                <CardTitle>{t('decentralizationBenefits.feeOptimization.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('decentralizationBenefits.feeOptimization.description')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
