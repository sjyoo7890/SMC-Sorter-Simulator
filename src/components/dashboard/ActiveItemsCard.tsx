import { Package } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';
import type { ActiveItem } from '../../types/system';

const statusConfig: Record<ActiveItem['status'], { label: string; color: string }> = {
  inducted: { label: '투입됨', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  destination_set: { label: '목적지설정', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
  discharged: { label: '배출됨', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  confirmed: { label: '완료', color: 'text-gray-400 bg-gray-500/15 border-gray-500/30' },
};

export default function ActiveItemsCard() {
  const activeItems = useSystemStore((s) => s.activeItems);
  const items = Array.from(activeItems.values()).slice(-10).reverse();
  const total = activeItems.size;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Active Items
        </span>
        <span className="rounded-full bg-[var(--color-plc-to-smc)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--color-plc-to-smc)]">
          {total}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex h-16 items-center justify-center text-xs text-[var(--color-text-secondary)]">
          <Package className="mr-2 h-4 w-4 opacity-40" />
          활성 화물 없음
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item) => {
            const cfg = statusConfig[item.status];
            return (
              <div
                key={item.pid}
                className="flex items-center gap-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5"
              >
                <span className="font-mono text-[10px] font-bold text-[var(--color-text-primary)]">
                  PID:{item.pid}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">
                  Cell:{item.cellIndexNo}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">
                  IN:{item.inductionNo}
                </span>
                <span className={`ml-auto rounded-full border px-1.5 py-0 text-[9px] font-medium ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
