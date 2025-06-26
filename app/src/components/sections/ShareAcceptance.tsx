import { Card } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

// Data for all three setups, one value per row
const data = [
  { setup: 'SV1', value: 99.8 },
  { setup: 'SV2 (No JD)', value: 99.9 },
  { setup: 'SV2 (With JD)', value: 100.0 },
];

// Color by index (order matters)
const BAR_COLORS = ['#ef4444', '#3b82f6', '#22c55e'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <div className="text-xs font-mono mb-1">{item.setup}</div>
        <div className="text-xs font-mono" style={{ color: payload[0].color }}>
          Acceptance rate: {item.value}%
        </div>
      </div>
    );
  }
  return null;
};

export function ShareAcceptance() {
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">Share Acceptance Rate</h3>
      </div>
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 32, bottom: 10 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="setup"
              tick={{ fill: '#94a3b8', fontSize: 13, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              domain={[99.75, 100]}
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Acceptance rate',
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
              formatter={value => {
                if (value === 'value') return (
                  <span style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 13 }}>SV1</span>
                );
                return value;
              }}
            />
            <Bar dataKey="value" name="Acceptance Rate" radius={[6, 6, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={BAR_COLORS[idx]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}