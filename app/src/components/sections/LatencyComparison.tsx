import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        {payload.map((p) => (
          <p key={p.dataKey} className="text-xs font-mono" style={{ color: p.color }}>
            {p.dataKey === 'sv1'
              ? t('latencyComparison.sv1')
              : p.dataKey === 'sv2_no_jd'
              ? t('latencyComparison.sv2NoJd')
              : t('latencyComparison.sv2WithJd')}: {p.value}ms
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Flat line for all samples, for visual effect
const timeData = Array.from({ length: 5 }).map(() => ({
  sv1: 228,
  sv2_no_jd: 57.7,
  sv2_with_jd: 2.44,
  name: '', // no x-labels
}));

export function LatencyComparison() {
  const { t } = useTranslation();
  
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">{t('latencyComparison.title')}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <div className="space-y-2 text-center">
          <div className="text-base font-mono text-muted-foreground">{t('latencyComparison.sv1')}</div>
          <div className="text-2xl font-mono font-bold" style={{ color: '#ef4444' }}>228&nbsp;ms</div>
        </div>
        <div className="space-y-2 text-center">
          <div className="text-base font-mono text-muted-foreground">{t('latencyComparison.sv2NoJd')}</div>
          <div className="text-2xl font-mono font-bold" style={{ color: '#3b82f6' }}>57.7&nbsp;ms</div>
        </div>
        <div className="space-y-2 text-center">
          <div className="text-base font-mono text-muted-foreground">{t('latencyComparison.sv2WithJd')}</div>
          <div className="text-2xl font-mono font-bold" style={{ color: '#22c55e' }}>2.44&nbsp;ms</div>
        </div>
      </div>

      <div className="h-48 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData} margin={{ top: 10, right: 10, left: 48, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: t('latencyComparison.milliseconds'),
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 12,
                fontFamily: 'monospace',
                dx: -26,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="sv1" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
            <Line type="monotone" dataKey="sv2_no_jd" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            <Line type="monotone" dataKey="sv2_with_jd" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}