import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PillarSvg from "/public/assets/svgs/Pillar.svg";
import PieChartBgLines from "/public/assets/svgs/PieChartBgLines.svg";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

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

type MiningData = {
  poolId: number;
  name: string;
  link: string;
  blockCount: number;
  rank: number;
  emptyBlocks: number;
  slug: string;
  avgMatchRate: number;
  avgFeeDelta: string;
  poolUniqueId: number;
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

const API_URL = "https://mempool.space/api/v1/mining/pools/1w";

// Extracted sub-components
const SolutionCard = memo(({ title, description }: { number: number; title: string; description: string }) => (
  <div className='bg-[#060607] border border-[#4A4A4F] rounded-lg p-6 md:p-8 flex flex-col w-full border-[0.5px] h-full'>
    <div className='font-dm-mono py-2 text-base md:text-lg text-white mb-3'>{title}</div>
    <div className='font-dm-mono py-2 font-normal text-sm md:text-base leading-5 md:leading-6 text-[#b5b5b5]'>{description}</div>
  </div>
));

// Custom chart tooltip component
const CustomTooltip = memo(({ active, payload }: TooltipProps<number, string>) => {
  const { t } = useTranslation();
  
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
      <p className='text-white text-[15px]'>
        {t("miningCentralization.tooltip.share")}: {data.value.toFixed(2)}%
      </p>
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
const MiningChart = memo(
  ({
    poolData,
    chartDimensions,
  }: {
    poolData: PoolDataType[];
    chartDimensions: ChartDimensions;
    renderLegendText: (value: string) => React.ReactNode;
    width: number;
  }) => {
    return (
      <div className='relative z-10 flex flex-col items-center justify-center pt-6 pb-6 md:pt-6 md:pb- px-4'>
        <div className='h-[240px] sm:h-[280px] md:h-[300px] w-full'>
          {poolData.length > 0 && (
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={poolData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={chartDimensions.innerRadius}
                  outerRadius={chartDimensions.outerRadius}
                  strokeWidth={0}
                >
                  {poolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className='transition-opacity duration-300 hover:opacity-80 cursor-pointer' />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }
);

// Problem Statement component - extracted for better organization
const ProblemStatement = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="w-full lg:w-2/5 p-6 md:p-8 bg-black border-t lg:border-t-0 lg:border-l border-[#232425]"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
     <p className="font-dm-mono p-2 font-normal text-md md:text-base leading-6 text-[#b5b5b5] mb-4">
        {t('miningCentralization.problemStatement.firstParagraph')} <a href="https://b10c.me/blog/015-bitcoin-mining-centralization/" className="text-[#4ecdc4] underline" target="_blank" rel="noopener noreferrer">{t('miningCentralization.problemStatement.provenlyActing')}</a> {t('miningCentralization.problemStatement.firstParagraphContinued')}
      </p>
      <p className="font-dm-mono p-2 font-normal text-md md:text-base leading-6 text-[#b5b5b5] mb-4">
        {t('miningCentralization.problemStatement.secondParagraph')}
      </p>
    </motion.div>
  );
});

// Solution Section Title component
const SolutionSectionTitle = memo(() => {
  const { t } = useTranslation();
  
  return (
    <motion.div 
      className="flex justify-center mb-6 md:mb-0 mt-16 md:mt-20" 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
    >
      <div className="bg-black px-4 md:px-8 py-4 md:py-4 w-full shadow-lg border border-[#232425]">
        <h2 className="text-2xl md:text-2xl font-dm-mono text-white mb-0 text-center">
          {t('miningCentralization.solutionTitle')}
        </h2>
      </div>
    </motion.div>
  );
});

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
const SolutionCards = memo(() => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 md:mt-0">
      <SolutionCard 
        number={1} 
        title={t('miningCentralization.solutions.minersSelect.title')} 
        description={t('miningCentralization.solutions.minersSelect.description')}
      />
      
      <SolutionCard 
        number={2} 
        title={t('miningCentralization.solutions.modular.title')} 
        description={t('miningCentralization.solutions.modular.description')}
      />
      
      <SolutionCard 
        number={3} 
        title={t('miningCentralization.solutions.interoperable.title')} 
        description={t('miningCentralization.solutions.interoperable.description')}
      />
    </div>
  );
});


export function MiningCentralization() {
  const { t } = useTranslation();
  const [miningData, setMiningData] = useState<MiningData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  // Fetch mining data once on component mount
  useEffect(() => {
    const abortController = new AbortController();
    const fetchMiningDataByHashrate = async () => {
      try {
        const res = await fetch(API_URL, { signal: abortController.signal });
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
        const data = await res.json();
        setMiningData(data.pools);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : error instanceof Object
            ? JSON.stringify(error)
            : "Oops! An unknown error occurred when fetching mining data, please try again later";

        setError(errorMessage);
      }
    };

    fetchMiningDataByHashrate();

    return () => abortController.abort();
  }, []);

  // Responsive window size detection - only track width
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateMinersLuck = (blockCount: number) => 100 * (blockCount / 1008);
  // Pool data for pie chart - memoized
  const poolData = useMemo(() => {
    const majorMiningPools = miningData.filter((pool) => pool?.rank <= 12);
    const minorMiningPools = miningData.filter((pool) => pool?.rank > 12);

    const calculateBlockCountOfMinorMiningPools = minorMiningPools.reduce((acc, pool) => acc + pool?.blockCount, 0);

    const aggregateMinorMiningPools = {
      name: "Others",
      value: calculateMinersLuck(calculateBlockCountOfMinorMiningPools),
      blockCount: calculateBlockCountOfMinorMiningPools,
      color: "#b1b1b1",
    };

    return majorMiningPools
      .map((pool, index) => ({
        name: pool?.name,
        value: calculateMinersLuck(pool?.blockCount),
        blockCount: pool?.blockCount,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      }))
      .concat(aggregateMinorMiningPools)
      .sort((a, b) => a.value - b.value);
  }, [miningData]);

  // Legend formatter - truncate long pool names
  const renderLegendText = useCallback(
    (value: string) => {
      const displayValue = width < 640 && value.length > 12 ? `${value.substring(0, 10)}...` : value;
      return <span style={{ color: "#b5b5b5", textAlign: "center" }}>{displayValue}</span>;
    },
    [width]
  );

  // Chart dimensions based on screen size
  const chartDimensions = useMemo(() => getChartDimensions(width), [width]);

  return (
    <section className='relative py-16 md:py-24 px-4 md:px-6 overflow-hidden bg-[#0D0D0D] font-dm-mono'>
      <div className='container mx-auto relative max-w-6xl'>
        <motion.div
          className='text-center mb-8 md:mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className='text-2xl md:text-4xl font-dm-mono text-white'>{t("miningCentralization.title")}</h2>
        </motion.div>

        {/* Problem Statement Section - Combined Card with Chart and Explanation */}
        {error ? (
          <p className='text-red-500 text-center'>
            {t("miningCentralization.errorMessage")}: {error}
          </p>
        ) : (
          <div className='relative w-full mx-auto mb-8 md:mb-0 border border-[#232425] rounded-lg overflow-hidden'>
            <div className='flex flex-col lg:flex-row'>
              {/* Chart Section */}
              <div className='w-full lg:w-3/5 bg-[#060607] relative'>
                <div className='absolute inset-0 z-0'>
                  <img src={PieChartBgLines} alt='' className='w-full object-cover' />
                </div>
                <MiningChart poolData={poolData} chartDimensions={chartDimensions} renderLegendText={renderLegendText} width={width} />
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
