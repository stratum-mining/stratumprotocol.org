import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const poolData = [
  { name: "Foundry USA", value: 34.38, color: "#e4405f" },
  { name: "AntPool", value: 19.54, color: "#6b46c1" },
  { name: "ViaBTC", value: 13.26, color: "#4338ca" },
  { name: "F2Pool", value: 11.82, color: "#1d4ed8" },
  { name: "Binance Pool", value: 4.12, color: "#0ea5e9" },
  { name: "Other Pools", value: 16.88, color: "#64748b" },
];

export function MiningCentralization() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="container mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-mono mb-4">Mining Power Distribution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bitcoin hashrate is currently controlled by a handful of mining pools who get to decide which transactions go into a block. It has also been <a href="https://b10c.me/observations/12-template-similarity/#stratum-jobs-and-merkle-branches" className="text-cyan-500 hover:underline">proven</a> that smaller pools act as a proxy for larger pools which increases the centralization risk even further.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Mining Pool Distribution Chart */}
          <div className="relative h-[400px] w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={poolData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {poolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Explanation Text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-mono">Why This Matters</h3>
            <p className="text-lg text-muted-foreground">
              This high concentration of mining power in a few pools creates significant risks:
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl">•</span>
                <span>Pools can potentially censor transactions by choosing which ones to include in blocks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl">•</span>
                <span>A small group of entities could collude to enforce transaction filtering</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl">•</span>
                <span>This undermines Bitcoin's fundamental promise of censorship resistance</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}