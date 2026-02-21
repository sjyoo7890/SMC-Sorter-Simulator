import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useLogStore } from '../../stores/useLogStore';
import { telegramMeta } from '../../constants/telegramMeta';
import type { Direction } from '../../types/protocol';

const directions: Array<{ value: Direction | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'PLC_TO_SMC', label: 'PLC→SMC' },
  { value: 'SMC_TO_PLC', label: 'SMC→PLC' },
];

const telegramOptions = Object.entries(telegramMeta)
  .map(([no, m]) => ({ value: Number(no), label: `#${no} ${m.name}` }))
  .sort((a, b) => a.value - b.value);

export default function FilterBar() {
  const filter = useLogStore((s) => s.filter);
  const setFilter = useLogStore((s) => s.setFilter);
  const [showTelegramDropdown, setShowTelegramDropdown] = useState(false);

  const resetFilter = () => {
    setFilter({ direction: 'ALL', telegramNos: [], searchText: '' });
    setShowTelegramDropdown(false);
  };

  const toggleTelegramNo = (no: number) => {
    const current = filter.telegramNos;
    const next = current.includes(no)
      ? current.filter((n) => n !== no)
      : [...current, no];
    setFilter({ telegramNos: next });
  };

  const hasActiveFilter =
    filter.direction !== 'ALL' || filter.telegramNos.length > 0 || filter.searchText !== '';

  return (
    <div className="space-y-2 border-b border-[var(--color-border)] p-3">
      {/* Direction toggle */}
      <div className="flex gap-1">
        {directions.map((d) => (
          <button
            key={d.value}
            onClick={() => setFilter({ direction: d.value })}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              filter.direction === d.value
                ? 'bg-[var(--color-plc-to-smc)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)]'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Search + Telegram filter + Reset */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search PID, MachineID..."
            value={filter.searchText}
            onChange={(e) => setFilter({ searchText: e.target.value })}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] py-1 pl-7 pr-2 text-xs text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)]/50 focus:border-[var(--color-plc-to-smc)]"
          />
        </div>

        {/* Telegram type dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTelegramDropdown(!showTelegramDropdown)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
              filter.telegramNos.length > 0
                ? 'border-[var(--color-plc-to-smc)] text-[var(--color-plc-to-smc)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
            }`}
          >
            <Filter className="h-3 w-3" />
            {filter.telegramNos.length > 0 ? filter.telegramNos.length : 'Type'}
          </button>

          {showTelegramDropdown && (
            <div className="absolute right-0 top-full z-30 mt-1 max-h-60 w-56 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] p-1 shadow-xl">
              {telegramOptions.map((opt) => {
                const checked = filter.telegramNos.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs hover:bg-[var(--color-bg-card-hover)]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTelegramNo(opt.value)}
                      className="h-3 w-3 accent-[var(--color-plc-to-smc)]"
                    />
                    <span className={checked ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Reset */}
        {hasActiveFilter && (
          <button
            onClick={resetFilter}
            className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-error)]"
            title="Clear filters"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
