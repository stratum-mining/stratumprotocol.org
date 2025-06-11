import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, Globe, Lock, Users } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';
import { useTranslation } from 'react-i18next';

export function CommunitySection() {
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
          <h2 className="text-4xl font-mono mb-4">{t('sections.community.builtByCommunity')}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 bg-black/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Github className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-mono mb-2">{t('sections.community.openSource.title')}</h3>
                <p className="text-muted-foreground">
                  {t('sections.community.openSource.description')}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-black/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Users className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-mono mb-2">{t('sections.community.communityDriven.title')}</h3>
                <p className="text-muted-foreground">
                  {t('sections.community.communityDriven.description')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Discord CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="https://discord.gg/fsEW23wFYs"
            className="inline-block p-8 rounded-lg bg-cyan-500/5 border border-cyan-500/20"
          >
            <h3 className="text-2xl font-mono mb-4">{t('sections.community.joinOurCommunity.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t('sections.community.joinOurCommunity.description')}
            </p>
            <Button
              size="lg"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              <SiDiscord className="w-5 h-5 mr-2" />
              {t('sections.community.joinDiscordButton')}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}