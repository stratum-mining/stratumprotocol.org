import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Simple statistics display component
const StatDisplay = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="space-y-2">
    <span className="text-sm font-mono text-muted-foreground">{label}</span>
    <div className={`text-2xl font-mono`} style={{ color }}>
      {value}
    </div>
  </div>
);

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <p className="text-xs font-mono mb-1">{`Time: ${payload[0].payload.name}`}</p>
        {payload.map((p: any) => (
          <p
            key={p.dataKey}
            className="text-xs font-mono"
            style={{ color: p.color }}
          >
            {`${p.dataKey === 'sv1' ? 'SV1' : 'SV2'}: ${p.value}ms`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Sample time-series data
const timeData = [
  { name: '0s', sv1: 165, sv2: 2.5 },
  { name: '1s', sv1: 170, sv2: 2.7 },
  { name: '2s', sv1: 168, sv2: 2.4 },
  { name: '3s', sv1: 175, sv2: 2.6 },
  { name: '4s', sv1: 172, sv2: 2.5 },
];

export function LatencyComparison() {
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">Ultra-Low Job Latency</h3>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <StatDisplay label="Stratum V1" value="~320ms" color="#ef4444" />
        <StatDisplay label="Stratum V2" value="~1.38" color="#22d3ee" />
      </div>

      <div className="h-48 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              stroke="#1e293b"
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              stroke="#1e293b"
              label={{
                value: 'milliseconds',
                angle: -90,
                position: 'insideLeft',
                fill: '#94a3b8',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="sv1"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444' }}
            />
            <Line
              type="monotone"
              dataKey="sv2"
              stroke="#22d3ee"
              strokeWidth={2}
              dot={{ fill: '#22d3ee' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
