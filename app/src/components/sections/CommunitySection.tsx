import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Github, Globe, Lock, Users } from 'lucide-react';
import { SiDiscord } from 'react-icons/si';

export function CommunitySection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Built by the Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stratum V2 is an open-source protocol developed by the community,
            for the community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-6 bg-black/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <Github className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-mono mb-2">Open Source</h3>
                <p className="text-muted-foreground">
                  Fully open-source under the permissive MIT license, allowing anyone to
                  use, modify, and build upon the protocol freely.
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
                <h3 className="text-xl font-mono mb-2">Community Driven</h3>
                <p className="text-muted-foreground">
                Built by a global contributor network, free from single-entity control, with a roadmap shaped by the mining community’s needs.
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
            <h3 className="text-2xl font-mono mb-4">Join Our Community</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Connect with miners, developers, and pool operators.
            Share ideas, get support, and help shape the future of Bitcoin mining.
            </p>
            <Button
              size="lg"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              <SiDiscord className="w-5 h-5 mr-2" />
              Join Discord
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
