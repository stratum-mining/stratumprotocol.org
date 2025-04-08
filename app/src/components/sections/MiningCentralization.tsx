import { colors } from "@/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type HashRateType = {
  timestamp: number;
  avgHashrate: number;
  share: number;
  poolName: string;
};

export function MiningCentralization() {
  const [miningData, setMiningData] = useState<HashRateType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // get mining pool data ordered by hashrate found in one year
    const fetchMiningDataByHashrate = async () => {
      try {
        const res = await fetch("https://mempool.space/api/v1/mining/hashrate/pools/1y");
        const data = await res.json();
        setMiningData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : error instanceof Object
            ? JSON.stringify(error)
            : "Opps! An unknown error occured when fetching mining data, please try again later";
        setError(errorMessage);
      }
    };

    fetchMiningDataByHashrate();
  }, []);

  // group mining data by pool name
  // add avgHashRate and share of each pool
  const groupMiningDataByPoolName = () => {
    return miningData.reduce((acc, curr) => {
      if (acc[curr.poolName]) {
        acc[curr.poolName].avgHashRate += curr.avgHashrate;
        acc[curr.poolName].share += curr.share;
      } else {
        acc[curr.poolName] = { avgHashRate: curr.avgHashrate, share: curr.share };
      }

      return acc;
    }, {} as Record<string, { avgHashRate: number; share: number }>);
  };

  // create pool data for  pie chart
  const createPoolData = () => {
    const miningDataByPoolName = groupMiningDataByPoolName();
    return Object.entries(miningDataByPoolName).map(([poolName, data], index) => ({
      name: poolName,
      value: data.share,
      color: colors[index % colors.length],
    }));
  };

  const poolData = createPoolData();

  return (
    <section className='relative py-24 px-4 overflow-hidden'>
      <div className='container mx-auto relative'>
        <motion.div className='text-center mb-16' initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className='text-4xl font-mono mb-4'>Mining Power Distribution</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Bitcoin hashrate is currently controlled by a handful of mining pools who get to decide which transactions go into a block. It has also
            been{" "}
            <a href='https://b10c.me/observations/12-template-similarity/#stratum-jobs-and-merkle-branches' className='text-cyan-500 hover:underline'>
              proven
            </a>{" "}
            that smaller pools act as a proxy for larger pools which increases the centralization risk even further.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-16 items-center'>
          {/* Mining Pool Distribution Chart */}
          <div className='relative h-[600px] w-full'>
            {error ? (
              <p className='text-red-500 text-center'>{error}</p>
            ) : (
              <>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={poolData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      innerRadius={90}
                      outerRadius={170}
                      fill='#8884d8'
                      paddingAngle={2}
                    >
                      {poolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className='transition-opacity duration-300 hover:opacity-80 cursor-pointer' />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div
                              className='custom-tooltip'
                              style={{
                                backgroundColor: "#1a1a1a",
                                padding: "8px 12px",
                                border: `2px solid ${data.color}`,
                                borderRadius: "4px",
                              }}
                            >
                              <p className='font-medium text-[15px]' style={{ color: data.color }}>
                                {data.name}
                              </p>
                              <p className='text-white text-[15px]'>{`Share: ${data.value.toFixed(2)}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      layout='horizontal'
                      verticalAlign='bottom'
                      align='center'
                      wrapperStyle={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "10px",
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <p className='text-base text-white text-center mt-4'>Mining data with hashrate found in the last 365 days</p>
              </>
            )}
          </div>

          {/* Explanation Text */}
          <motion.div className='space-y-6' initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className='text-2xl font-mono'>Why This Matters</h3>
            <p className='text-lg text-muted-foreground'>This high concentration of mining power in a few pools creates significant risks:</p>
            <ul className='space-y-4 text-muted-foreground'>
              <li className='flex items-start gap-3'>
                <span className='text-cyan-500 text-xl'>•</span>
                <span>Pools can potentially censor transactions by choosing which ones to include in blocks</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-cyan-500 text-xl'>•</span>
                <span>A small group of entities could collude to enforce transaction filtering</span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-cyan-500 text-xl'>•</span>
                <span>This undermines Bitcoin's fundamental promise of censorship resistance</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
