import { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { useToastStore } from '../../stores/useToastStore';

export default function ManualItemDischargedForm() {
  const [cellIndexNo, setCellIndexNo] = useState(42);
  const [inductionNo, setInductionNo] = useState(1);
  const [mode, setMode] = useState(0);
  const [pid, setPid] = useState(100001);
  const [chuteNumber, setChuteNumber] = useState(15);
  const [recircCount, setRecircCount] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.ItemDischarged, {
      CellIndexNo: cellIndexNo,
      InductionNo: inductionNo,
      Mode: mode,
      PID: pid,
      ChuteNumber: chuteNumber,
      RecirculationCount: recircCount,
    });

    useSystemStore.getState().updateItemStatus(pid, 'discharged');
    useStatsStore.getState().recordItemEvent('discharged');

    useToastStore.getState().addToast(`ItemDischarged 생성 (PID: ${pid})`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <PackageOpen className="h-4 w-4 text-[var(--color-smc-to-plc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          화물 배출 (21)
        </span>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">CellIndexNo</label>
            <input
              type="number"
              value={cellIndexNo}
              onChange={(e) => setCellIndexNo(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">InductionNo</label>
            <select
              value={inductionNo}
              onChange={(e) => setInductionNo(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            >
              <option value={0}>0: BCR</option>
              <option value={1}>1: 타건</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">PID</label>
            <input
              type="number"
              value={pid}
              onChange={(e) => setPid(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 font-mono text-xs text-[var(--color-text-primary)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Chute Number</label>
            <input
              type="number"
              value={chuteNumber}
              onChange={(e) => setChuteNumber(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Recirc Count</label>
            <input
              type="number"
              value={recircCount}
              onChange={(e) => setRecircCount(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          className="w-full rounded-md bg-[var(--color-smc-to-plc)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
        >
          생성
        </button>
      </div>
    </div>
  );
}
