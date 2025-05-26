// import { colors } from "@/utils";
import { motion } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";
import PieChartBgLines from "/public/assets/svgs/PieChartBgLines.svg";
import PillarSvg from "/public/assets/svgs/Pillar.svg";

// Types
type HashRateType = {
  timestamp: number;
  avgHashrate: number;
  share: number;
  poolName: string;
};

type PoolDataType = {
  name: string;
  value: number;
  color: string;
};

type ChartDimensions = {
  innerRadius: number;
  outerRadius: number;
  iconSize: number;
  fontSize: string;
};

// Constants
const DONUT_COLORS = [
  "#7de2d1", // light cyan
  "#4ecdc4", // teal
  "#38b2ac", // blue-green
  "#2c7a7b", // dark teal
  "#285e61", // deep blue
  "#1a4040", // very dark teal
];

const API_URL = "https://mempool.space/api/v1/mining/hashrate/pools/1y";

// Extracted sub-components
const SolutionCard = memo(({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="bg-[#060607] border border-[#4A4A4F] rounded-lg p-6 md:p-8 flex flex-col w-full border-[0.5px] h-full">
    {/* <div className="bg-black border border-[#232425] rounded w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-center mb-4">
      <span className="text-white font-dm-mono">{number}</span>
    </div> */}
    <div className="font-dm-mono py-4 text-base md:text-lg text-white mb-3">{title}</div>
    <div className="font-dm-mono py-2 font-normal text-sm md:text-base leading-5 md:leading-6 text-[#b5b5b5]">{description}</div>
  </div>
));

// Custom chart tooltip component
const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as PoolDataType;
  return (
    <div
      className="custom-tooltip"
      style={{
        backgroundColor: "#1a1a1a",
        padding: "8px 12px",
        border: `2px solid ${data.color}`,
        borderRadius: "4px",
      }}
    >
      <p className="font-medium text-[15px]" style={{ color: data.color }}>
        {data.name}
      </p>
      <p className="text-white text-[15px]">{`Share: ${data.value.toFixed(2)}%`}</p>
    </div>
  );
});

// Helper function to calculate chart dimensions based on screen width
const getChartDimensions = (width: number): ChartDimensions => {
  if (width < 640) {
    return {
      innerRadius: 40,
      outerRadius: 70,
      iconSize: 8,
      fontSize: "10px"
    };
  } else if (width < 768) {
    return {
      innerRadius: 60,
      outerRadius: 100,
      iconSize: 10,
      fontSize: "11px"
    };
  } else if (width < 1024) {
    return {
      innerRadius: 70,
      outerRadius: 115,
      iconSize: 12,
      fontSize: "12px"
    };
  } else {
    return {
      innerRadius: 90,
      outerRadius: 140,
      iconSize: 13,
      fontSize: "13px"
    };
  }
};

// Chart Component - Extracted for better separation of concerns
const MiningChart = memo(({ 
  poolData, 
  chartDimensions,
  // legendPayload,
  // renderLegendText,
  // width
}: { 
  poolData: PoolDataType[], 
  chartDimensions: ChartDimensions,
  legendPayload: Array<{value: string, type: 'circle', id: string, color: string}>,
  renderLegendText: (value: string) => React.ReactNode,
  width: number
}) => {
  // Legend wrapper style - memoized to prevent recalculation
  // const legendWrapperStyle = useMemo(() => ({
  //   display: "flex" as const,
  //   flexDirection: "row" as const,
  //   alignItems: "center" as const,
  //   justifyContent: "center" as const,
  //   flexWrap: "wrap" as const,
  //   gap: width < 640 ? "4px" : "8px",
  //   fontSize: chartDimensions.fontSize,
  //   color: "#b5b5b5",
  //   width: "100%",
  //   marginTop: width < 640 ? "30px" : "40px",
  //   marginBottom: width < 640 ? "20px" : "30px",
  //   paddingLeft: "20px",
  //   paddingRight: "20px",
  //   lineHeight: "1.2",
  // }), [width, chartDimensions.fontSize]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center pt-6 pb-6 md:pt-6 md:pb- px-4">
      <div className="h-[240px] sm:h-[280px] md:h-[300px] w-full">
        {poolData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={poolData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={chartDimensions.innerRadius}
                outerRadius={chartDimensions.outerRadius}
                strokeWidth={0}
              >
                {poolData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* <div className="mt-12 md:mt-16 w-full text-center">
        {poolData.length > 0 && (
          <Legend
            payload={legendPayload}
            layout="horizontal"
            align="center"
            iconSize={chartDimensions.iconSize}
            wrapperStyle={legendWrapperStyle}
            formatter={renderLegendText}
          />
        )}
      </div> */}
    </div>
  );
});

// Problem Statement component - extracted for better organization
const ProblemStatement = memo(() => (
  <motion.div
    className="w-full lg:w-2/5 p-6 md:p-8 bg-black border-t lg:border-t-0 lg:border-l border-[#232425]"
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
  >
   <p className="font-dm-mono font-normal text-md md:text-base leading-6 text-[#b5b5b5] mb-4">
      A few mining pools now dominate Bitcoin's block space, with some smaller pools <a href="https://b10c.me/blog/015-bitcoin-mining-centralization/" className="text-[#4ecdc4] underline" target="_blank" rel="noopener noreferrer">provenly acting</a> as their proxies. Pools have the ability to selectively include or exclude transactions, creating the risk of a permissioned system where some transactions could be blacklisted, undermining Bitcoin's core properties.
    </p>
    <p className="font-dm-mono font-normal text-md md:text-base leading-6 text-[#b5b5b5] mb-4">
      Proprietary mining software and hardware vendor lock-ins further worsen the issue, stifling innovation and trapping miners within closed, centralized ecosystems.
    </p>
  </motion.div>
));


// Solution Section Title component
const SolutionSectionTitle = memo(() => (
  <motion.div 
    className="flex justify-center mb-6 md:mb-0 mt-16 md:mt-20" 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
  >
    <div className="bg-black px-4 md:px-8 py-4 md:py-4 w-full shadow-lg border border-[#232425]">
      <h2 className="text-2xl md:text-2xl font-dm-mono text-white mb-0 text-center">
        Accelerating Mining with Stratum V2
      </h2>
    </div>
  </motion.div>
));

// PillarImages component - extracted for better organization
const PillarImages = memo(() => (
  <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-0 mt-0">
    <div className="flex justify-center">
      <img src={PillarSvg} alt="Pillar" className="w-auto h-auto" />
    </div>
    <div className="flex justify-center">
      <img src={PillarSvg} alt="Pillar" className="w-auto h-auto" />
    </div>
    <div className="flex justify-center">
      <img src={PillarSvg} alt="Pillar" className="w-auto h-auto" />
    </div>
  </div>
));

// SolutionCards component – extracted for better organization
const SolutionCards = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 md:mt-0">
    <SolutionCard 
      number={1} 
      title="Miners Select Transaction" 
      description="Stratum V2 empowers miners to choose which transactions to include, shifting them from passive hashers to active participants in securing the network."
    />
    
    <SolutionCard 
      number={2} 
      title="Modular & Developer-Friendly" 
      description="Stratum V2 offers a free, open-source, modular infrastructure with permissive license, empowering developers to build and innovate."
    />
    
    <SolutionCard 
      number={3} 
      title="Interoperable & Neutral" 
        description="Community-driven governance and clear specifications ensure interoperability, preventing vendor lock-ins and fragmentation."

    />
  </div>
));


export function MiningCentralization() {
  const [miningData, setMiningData] = useState<HashRateType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Fetch mining data once on component mount
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchMiningDataByHashrate = async () => {
      try {
        const res = await fetch(API_URL, { signal: abortController.signal });
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
        const data = await res.json();
        setMiningData(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        
        const errorMessage =
          error instanceof Error ? error.message :
          typeof error === "string" ? error :
          error instanceof Object ? JSON.stringify(error) :
          "Oops! An unknown error occurred when fetching mining data, please try again later";
            
        setError(errorMessage);
      }
    };

    fetchMiningDataByHashrate();
    
    return () => abortController.abort();
  }, []);

  // Responsive window size detection - only track width
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group mining data by pool name - memoized
  const groupedMiningData = useMemo(() => {
    if (!miningData.length) return {};
    
    return miningData.reduce((acc, curr) => {
      if (!acc[curr.poolName]) {
        acc[curr.poolName] = { avgHashRate: 0, share: 0 };
      }
      
      acc[curr.poolName].avgHashRate += curr.avgHashrate;
      acc[curr.poolName].share += curr.share;
      
      return acc;
    }, {} as Record<string, { avgHashRate: number; share: number }>);
  }, [miningData]);

  // Pool data for pie chart - memoized
  const poolData = useMemo(() => {
    if (Object.keys(groupedMiningData).length === 0) return [];
    
    return Object.entries(groupedMiningData)
      .map(([poolName, data], index) => ({
        name: poolName,
        value: data.share,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [groupedMiningData]);

  // Legend formatter - truncate long pool names
  const renderLegendText = useCallback((value: string) => {
    const displayValue = width < 640 && value.length > 12 
      ? `${value.substring(0, 10)}...` 
      : value;
    return <span style={{ color: "#b5b5b5", textAlign: "center" }}>{displayValue}</span>;
  }, [width]);

  // Chart dimensions based on screen size
  const chartDimensions = useMemo(() => getChartDimensions(width), [width]);

  // Pre-create legend payload for performance
  const legendPayload = useMemo(() => 
    poolData.map(item => ({
      value: item.name,
      type: 'circle' as const,
      id: item.name,
      color: item.color
    })), 
  [poolData]);

  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden bg-[#0D0D0D] font-dm-mono">
      <div className="container mx-auto relative max-w-6xl">
        <motion.div 
          className="text-center mb-8 md:mb-16" 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-4xl font-dm-mono text-white">
            The Centralization Crisis in Bitcoin Mining
          </h2>
        </motion.div>
        
        {/* Problem Statement Section - Combined Card with Chart and Explanation */}
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="relative w-full mx-auto mb-8 md:mb-0 border border-[#232425] rounded-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Chart Section */}
              <div className="w-full lg:w-3/5 bg-[#060607] relative">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={PieChartBgLines} 
                    alt="" 
                    className="w-full object-cover"
                  />
                </div>
                <MiningChart 
                  poolData={poolData}
                  chartDimensions={chartDimensions}
                  legendPayload={legendPayload}
                  renderLegendText={renderLegendText}
                  width={width}
                />
              </div>
              
              {/* Problem Statement Text Section */}
              <ProblemStatement />
            </div>
          </div>
        )}
        
        {/* Solution Section Title */}
        <SolutionSectionTitle />
        
        {/* Three Pillars SVG */}
        <PillarImages />
        
        {/* Solution Cards */}
        <SolutionCards />
      </div>
    </section>
  );
}