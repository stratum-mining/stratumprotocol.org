import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Network } from "lucide-react";

export function ProtocolComparison() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Protocol Comparison</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how Stratum V2 improves upon the original protocol across key metrics
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
                <CardTitle>Enhanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end encryption prevents man-in-the-middle attacks and hashrate hijacking
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
                <CardTitle>Better Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  75% reduction in bandwidth usage and 4x faster transaction processing
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
                <CardTitle>Decentralization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Miners gain more control over block templates and transaction selection
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
