import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStatsStore } from '../../stores/useStatsStore';

const COLORS = {
  inducted: '#f59e0b',
  discharged: '#3b82f6',
  confirmed: '#10b981',
  errors: '#ef4444',
};

const LABELS: Record<string, string> = {
  inducted: '투입',
  discharged: '배출',
  confirmed: '확인',
  errors: '에러',
};

export default function ItemProcessingChart() {
  const itemStats = useStatsStore((s) => s.itemStats);

  const data = Object.entries(itemStats)
    .map(([key, value]) => ({
      name: LABELS[key] ?? key,
      value,
      key,
    }))
    .filter((d) => d.value > 0);

  const total = Object.values(itemStats).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-[var(--color-text-secondary)]">
        화물 처리 데이터 없음
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry) => (
            <Cell
              key={entry.key}
              fill={COLORS[entry.key as keyof typeof COLORS]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a2332',
            border: '1px solid #2a3a4e',
            borderRadius: 8,
            fontSize: 12,
            color: '#e2e8f0',
          }}
          formatter={(value, name) => [`${value}건`, name]}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
        />
        {/* 중앙 총 건수 텍스트 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e2e8f0"
          fontSize={18}
          fontWeight="bold"
        >
          {total}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#94a3b8"
          fontSize={10}
        >
          총 건수
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
