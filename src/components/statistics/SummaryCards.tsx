import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStatsStore } from '../../stores/useStatsStore';

const cards = [
  {
    key: 'sent' as const,
    label: '총 송신',
    icon: ArrowUp,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
  },
  {
    key: 'received' as const,
    label: '총 수신',
    icon: ArrowDown,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
  },
  {
    key: 'error' as const,
    label: '에러',
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
  },
  {
    key: 'confirmed' as const,
    label: '처리 화물',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
  },
];

export default function SummaryCards() {
  const totalSent = useStatsStore((s) => s.totalSent);
  const totalReceived = useStatsStore((s) => s.totalReceived);
  const errorCount = useStatsStore((s) => s.errorCount);
  const confirmed = useStatsStore((s) => s.itemStats.confirmed);

  const values: Record<string, number> = {
    sent: totalSent,
    received: totalReceived,
    error: errorCount,
    confirmed,
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`rounded-lg border ${card.border} ${card.bg} p-3`}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${card.color}`} />
              <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">
                {card.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>
              {values[card.key].toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
