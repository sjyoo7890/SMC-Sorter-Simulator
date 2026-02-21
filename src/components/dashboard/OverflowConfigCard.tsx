import { RotateCcw, Inbox } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';

export default function OverflowConfigCard() {
  const config = useSystemStore((s) => s.overflowConfig);

  const items = [
    { icon: Inbox, label: 'Overflow 1', value: `Chute #${config.chute1}` },
    { icon: Inbox, label: 'Overflow 2', value: `Chute #${config.chute2}` },
    { icon: RotateCcw, label: 'Max Recirc', value: `${config.maxRecirculation}회` },
  ];

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Overflow Config
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <item.icon className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
            <span className="text-xs text-[var(--color-text-secondary)]">{item.label}</span>
            <span className="ml-auto font-mono text-xs font-semibold text-[var(--color-text-primary)]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
