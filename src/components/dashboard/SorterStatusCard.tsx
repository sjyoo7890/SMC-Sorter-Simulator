import { Power, AlertTriangle, CircleStop } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';

const statusConfig = {
  0: { label: '정지', icon: CircleStop, color: 'text-gray-400', bg: 'bg-gray-500/15', pulse: false },
  1: { label: '운전 중', icon: Power, color: 'text-emerald-400', bg: 'bg-emerald-500/15', pulse: true },
  2: { label: '에러', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15', pulse: true },
} as const;

export default function SorterStatusCard() {
  const sorterStatus = useSystemStore((s) => s.sorterStatus);
  const cfg = statusConfig[sorterStatus];
  const Icon = cfg.icon;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Sorter
      </div>
      <div className="flex items-center gap-3">
        <div className={`relative flex h-10 w-10 items-center justify-center rounded-lg ${cfg.bg}`}>
          {cfg.pulse && (
            <span className={`absolute inset-0 animate-ping rounded-lg ${cfg.bg} opacity-40`} />
          )}
          <Icon className={`h-5 w-5 ${cfg.color}`} />
        </div>
        <span className={`text-lg font-bold ${cfg.color}`}>{cfg.label}</span>
      </div>
    </div>
  );
}
