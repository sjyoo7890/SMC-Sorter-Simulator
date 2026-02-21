import { useMemo } from 'react';
import { useLogStore, filterLogs } from '../../stores/useLogStore';
import FilterBar from './FilterBar';
import TimelineList from './TimelineList';

export default function TimelinePanel() {
  const logs = useLogStore((s) => s.logs);
  const filter = useLogStore((s) => s.filter);

  const filteredLogs = useMemo(() => filterLogs(logs, filter), [logs, filter]);

  return (
    <div className="flex h-full flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      {/* Filter bar */}
      <FilterBar />

      {/* Timeline list */}
      <TimelineList filteredLogs={filteredLogs} />

      {/* Footer: log count */}
      <div className="border-t border-[var(--color-border)] px-3 py-1.5 text-[10px] text-[var(--color-text-secondary)]">
        표시 중: {filteredLogs.length.toLocaleString()} / 전체: {logs.length.toLocaleString()}
      </div>
    </div>
  );
}
