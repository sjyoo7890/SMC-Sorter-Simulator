import { useState } from 'react';
import { Package } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { useToastStore } from '../../stores/useToastStore';
import { pidRanges } from '../../constants/pidRanges';

// PID 자동생성 카운터
const pidCounters: Record<string, number> = {};

function getNextPid(inductionNo: number, mode: number): number {
  const key = mode === 0
    ? `induction${inductionNo}Auto`
    : `induction${inductionNo}Manual`;
  const range = pidRanges[key as keyof typeof pidRanges];
  if (!range) return 100001;

  if (!(key in pidCounters)) {
    pidCounters[key] = range.min;
  }

  const pid = pidCounters[key];
  pidCounters[key] = pid >= range.max ? range.min : pid + 1;
  return pid;
}

export default function ManualItemInductedForm() {
  const [cellIndexNo, setCellIndexNo] = useState(42);
  const [cellCount, setCellCount] = useState(1);
  const [autoPid, setAutoPid] = useState(true);
  const [manualPid, setManualPid] = useState(100001);
  const [inductionNo, setInductionNo] = useState(1);
  const [mode, setMode] = useState(0);
  const [mainDest, setMainDest] = useState(0);
  const [dest1, setDest1] = useState(0);
  const [dest2, setDest2] = useState(0);
  const [dest3, setDest3] = useState(0);
  const [dest4, setDest4] = useState(0);

  const handleSend = () => {
    const pid = autoPid ? getNextPid(inductionNo, mode) : manualPid;

    sendTelegram(TelegramNumber.ItemInducted, {
      CellIndexNo: cellIndexNo,
      CellCount: cellCount,
      PID: pid,
      InductionNo: inductionNo,
      Mode: mode,
      MainDestination: mainDest,
      Destination1: dest1,
      Destination2: dest2,
      Destination3: dest3,
      Destination4: dest4,
    });

    // 시스템 상태 업데이트
    useSystemStore.getState().addActiveItem({
      pid,
      cellIndexNo,
      inductionNo,
      mode,
      destinations: [mainDest, dest1, dest2, dest3, dest4].filter((d) => d > 0),
      inductedAt: new Date(),
      status: 'inducted',
    });
    useStatsStore.getState().recordItemEvent('inducted');

    useToastStore.getState().addToast(`ItemInducted 생성 (PID: ${pid})`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Package className="h-4 w-4 text-[var(--color-smc-to-plc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          화물 투입 (20)
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
            <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">CellCount</label>
            <input
              type="number"
              value={cellCount}
              onChange={(e) => setCellCount(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2">
            <label className="text-[10px] text-[var(--color-text-secondary)]">PID</label>
            <label className="flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={autoPid}
                onChange={(e) => setAutoPid(e.target.checked)}
                className="h-3 w-3"
              />
              자동생성
            </label>
          </div>
          {!autoPid && (
            <input
              type="number"
              value={manualPid}
              onChange={(e) => setManualPid(Number(e.target.value))}
              className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 font-mono text-xs text-[var(--color-text-primary)]"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
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
        </div>

        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Main Destination</label>
          <input
            type="number"
            value={mainDest}
            onChange={(e) => setMainDest(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Dest 1', value: dest1, setter: setDest1 },
            { label: 'Dest 2', value: dest2, setter: setDest2 },
            { label: 'Dest 3', value: dest3, setter: setDest3 },
            { label: 'Dest 4', value: dest4, setter: setDest4 },
          ].map((d) => (
            <div key={d.label}>
              <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">{d.label}</label>
              <input
                type="number"
                value={d.value}
                onChange={(e) => d.setter(Number(e.target.value))}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
              />
            </div>
          ))}
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
