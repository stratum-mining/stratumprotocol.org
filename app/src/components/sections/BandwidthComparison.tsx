import { Card } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: {
      direction: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <p className="text-xs font-mono mb-1">{payload[0].payload.direction}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="text-xs font-mono" style={{ color: p.color }}>
            {p.dataKey === 'sv1'
              ? t('bandwidthComparison.sv1')
              : p.dataKey === 'sv2_no_jd'
              ? t('bandwidthComparison.sv2NoJd')
              : t('bandwidthComparison.sv2WithJd')}: {p.value} {t('bandwidthComparison.bytesPerSec')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const bandwidthBarData = [
  { direction: 'TX (Miner)', sv1: 101.0, sv2_no_jd: 40.1, sv2_with_jd: 114.0 },
  { direction: 'RX (Miner)', sv1: 66.6, sv2_no_jd: 26.0, sv2_with_jd: 118.0 },
  { direction: 'TX (Pool)', sv1: 126.0, sv2_no_jd: 74.0, sv2_with_jd: 99.1 },
  { direction: 'RX (Pool)', sv1: 170.0, sv2_no_jd: 100.0, sv2_with_jd: 135.0 },
];

export function BandwidthComparison() {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">{t('bandwidthComparison.title')}</h3>
      </div>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bandwidthBarData}
            margin={{ top: 10, right: 10, left: 32, bottom: 10 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="direction"
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: t('bandwidthComparison.bytesPerSec'),
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 12,
                fontFamily: 'monospace',
                dx: -12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="rect"
              formatter={(value) => (
                <span style={{
                  color:
                    value === 'sv1'
                      ? '#ef4444'
                      : value === 'sv2_no_jd'
                      ? '#3b82f6'
                      : '#22c55e',
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}>
                  {value === 'sv1'
                    ? t('bandwidthComparison.sv1')
                    : value === 'sv2_no_jd'
                    ? t('bandwidthComparison.sv2NoJd')
                    : t('bandwidthComparison.sv2WithJd')}
                </span>
              )}
            />
            <Bar dataKey="sv1" fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sv2_no_jd" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sv2_with_jd" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}