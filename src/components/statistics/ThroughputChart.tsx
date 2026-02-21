import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useStatsStore } from '../../stores/useStatsStore';

export default function ThroughputChart() {
  const recentThroughput = useStatsStore((s) => s.recentThroughput);

  const data = recentThroughput.map((value, i) => ({
    time: `${recentThroughput.length - i}s`,
    value,
  })).reverse();

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-[var(--color-text-secondary)]">
        처리량 데이터 수집 중... 시뮬레이션을 시작하세요
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          stroke="#2a3a4e"
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          stroke="#2a3a4e"
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a2332',
            border: '1px solid #2a3a4e',
            borderRadius: 8,
            fontSize: 12,
            color: '#e2e8f0',
          }}
          formatter={(value) => [`${value} 건/초`, '처리량']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#throughputGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
