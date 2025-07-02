import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Data for all three setups
const chartData = [
  {
    setup: 'SV1',
    block_latency: 325,
    job_latency: 228,
  },
  {
    setup: 'SV2 (No JD)',
    block_latency: 57.8,
    job_latency: 57.7,
  },
  {
    setup: 'SV2 (With JD)',
    block_latency: 1.42,
    job_latency: 2.44,
  },
];

// Color palette per setup
const BLOCK_COLORS = ['#ef4444', '#3b82f6', '#22c55e'];
const JOB_COLORS = ['#b91c1c', '#1e40af', '#166534'];

interface TooltipPayload {
  color: string;
  payload: {
    setup: string;
    block_latency: number;
    job_latency: number;
  };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  const { t } = useTranslation();
  
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <div className="text-xs font-mono mb-1">{item.setup}</div>
        <div className="text-xs font-mono" style={{ color: payload[0].color }}>
          {t('latencyJobBlockComparison.blockLatency')}: {item.block_latency} {t('latencyJobBlockComparison.milliseconds')}
        </div>
        <div className="text-xs font-mono" style={{ color: payload[1].color }}>
          {t('latencyJobBlockComparison.jobLatency')}: {item.job_latency} {t('latencyJobBlockComparison.milliseconds')}
        </div>
      </div>
    );
  }
  return null;
};

export function LatencyJobBlockComparison() {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">
          {t('latencyJobBlockComparison.title')}
        </h3>
      </div>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 32, bottom: 10 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="setup"
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: `${t('latencyJobBlockComparison.blockLatency')} (${t('latencyJobBlockComparison.milliseconds')})`,
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 12,
                fontFamily: 'monospace',
                dx: -12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Block latency bars with colors */}
            <Bar dataKey="block_latency" name={t('latencyJobBlockComparison.blockLatency')} radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={`block-cell-${idx}`} fill={BLOCK_COLORS[idx]} />
              ))}
            </Bar>
            {/* Job latency bars with colors */}
            <Bar dataKey="job_latency" name={t('latencyJobBlockComparison.jobLatency')} radius={[6, 6, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell key={`job-cell-${idx}`} fill={JOB_COLORS[idx]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}