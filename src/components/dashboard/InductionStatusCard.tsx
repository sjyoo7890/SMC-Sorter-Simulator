import { ScanBarcode, Keyboard } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';
import Badge from '../common/Badge';

const statusVariant = {
  0: { label: '정지', variant: 'neutral' as const },
  1: { label: '운전', variant: 'success' as const },
  2: { label: '에러', variant: 'error' as const },
};

const modeInfo = {
  0: { label: 'BCR', icon: ScanBarcode },
  1: { label: '타건', icon: Keyboard },
};

export default function InductionStatusCard() {
  const inductions = useSystemStore((s) => s.inductions);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Inductions
      </div>

      <div className="grid grid-cols-2 gap-2">
        {inductions.map((ind) => {
          const st = statusVariant[ind.status];
          const md = modeInfo[ind.mode];
          const ModeIcon = md.icon;

          return (
            <div
              key={ind.no}
              className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2"
            >
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                IN{ind.no}
              </span>
              <Badge variant={st.variant} dot={ind.status === 1} size="sm">
                {st.label}
              </Badge>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
                <ModeIcon className="h-3 w-3" />
                {md.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
