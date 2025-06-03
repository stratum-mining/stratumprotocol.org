import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    setup: 'SV1',
    block_sv1: 325,
    job_sv1: 228,
    block_sv2_nojd: 0,
    job_sv2_nojd: 0,
    block_sv2_jd: 0,
    job_sv2_jd: 0,
  },
  {
    setup: 'SV2 (No JD)',
    block_sv1: 0,
    job_sv1: 0,
    block_sv2_nojd: 57.8,
    job_sv2_nojd: 57.7,
    block_sv2_jd: 0,
    job_sv2_jd: 0,
  },
  {
    setup: 'SV2 (With JD)',
    block_sv1: 0,
    job_sv1: 0,
    block_sv2_nojd: 0,
    job_sv2_nojd: 0,
    block_sv2_jd: 1.42,
    job_sv2_jd: 2.44,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    let setup, block, job, blockColor, jobColor;
    if (item.setup === 'SV1') {
      setup = 'SV1';
      block = item.block_sv1;
      job = item.job_sv1;
      blockColor = '#ef4444';
      jobColor = '#b91c1c';
    } else if (item.setup === 'SV2 (No JD)') {
      setup = 'SV2 (No JD)';
      block = item.block_sv2_nojd;
      job = item.job_sv2_nojd;
      blockColor = '#3b82f6';
      jobColor = '#1e40af';
    } else {
      setup = 'SV2 (With JD)';
      block = item.block_sv2_jd;
      job = item.job_sv2_jd;
      blockColor = '#22c55e';
      jobColor = '#166534';
    }
    return (
      <div className="bg-background/95 border border-border p-2 rounded-sm">
        <div className="text-xs font-mono mb-1">{setup}</div>
        <div className="text-xs font-mono" style={{ color: blockColor }}>
          Block latency: {block} ms
        </div>
        <div className="text-xs font-mono" style={{ color: jobColor }}>
          Job latency: {job} ms
        </div>
      </div>
    );
  }
  return null;
};

export function LatencyJobBlockComparison() {
  return (
    <Card className="p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-5 h-5 text-cyan-500" />
        <h3 className="text-xl font-mono">Latency Comparison: Block vs Job Latency</h3>
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
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Latency (ms)',
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
                    value.includes('block_sv1') || value.includes('block_sv2')
                      ? '#94a3b8'
                      : '#94a3b8',
                  fontFamily: 'monospace',
                  fontSize: 13,
                }}>
                  {value === 'block_sv1' || value === 'block_sv2_nojd' || value === 'block_sv2_jd'
                    ? 'Block latency'
                    : 'Job latency'}
                </span>
              )}
            />
            {/* SV1 bars */}
            <Bar dataKey="block_sv1" name="Block latency" fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="job_sv1" name="Job latency" fill="#b91c1c" radius={[6, 6, 0, 0]} />
            {/* SV2 (No JD) bars */}
            <Bar dataKey="block_sv2_nojd" name="Block latency" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="job_sv2_nojd" name="Job latency" fill="#1e40af" radius={[6, 6, 0, 0]} />
            {/* SV2 (With JD) bars */}
            <Bar dataKey="block_sv2_jd" name="Block latency" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="job_sv2_jd" name="Job latency" fill="#166534" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}