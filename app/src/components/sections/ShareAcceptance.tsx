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
} from 'recharts';

const data = [
  {
    setup: 'SV1',
    sv1: 99.8,
    sv2_no_jd: null,
    sv2_with_jd: null,
  },
  {
    setup: 'SV2 (No JD)',
    sv1: null,
    sv2_no_jd: 99.9,
    sv2_with_jd: null,
  },
  {
    setup: 'SV2 (With JD)',
    sv1: null,
    sv2_no_jd: null,
    sv2_with_jd: 100.0,
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { payload: item } = payload[0];
    let label = '';
    let value = 0;
    let color = '';
    if (item.sv1 != null) {
      label = 'SV1';
      value = item.sv1;
      color = '#ef4444';
    } else if (item.sv2_no_jd != null) {
      label = 'SV2 (No JD)';
      value = item.sv2_no_jd;
      color = '#3b82f6';
    } else {
      label = 'SV2 (With JD)';
      value = item.sv2_with_jd;
      color = '#22c55e';
    }
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <div className="text-xs font-mono mb-1">{label}</div>
        <div className="text-xs font-mono" style={{ color }}>
          Acceptance rate: {value}%
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
            barCategoryGap="40%"
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
              formatter={(value: string) => {
                // Hardcode legend label/color order
                if (value === 'sv1') {
                  return <span style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 13 }}>SV1</span>;
                }
                if (value === 'sv2_no_jd') {
                  return <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: 13 }}>SV2 (No JD)</span>;
                }
                if (value === 'sv2_with_jd') {
                  return <span style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: 13 }}>SV2 (With JD)</span>;
                }
                return value;
              }}
            />
            <Bar dataKey="sv1" name="SV1" fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sv2_no_jd" name="SV2 (No JD)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sv2_with_jd" name="SV2 (With JD)" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}