import { useState } from 'react';
import { Layers } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';
import type { InductionStatus } from '../../types/protocol';

const statusOptions = [
  { value: 0, label: '0: 정지' },
  { value: 1, label: '1: 운전' },
  { value: 2, label: '2: 에러' },
];

interface InductionEntry {
  no: number;
  status: number;
}

export default function ManualInductionStatusForm() {
  const [count, setCount] = useState(2);
  const [entries, setEntries] = useState<InductionEntry[]>([
    { no: 1, status: 1 },
    { no: 2, status: 0 },
    { no: 3, status: 0 },
    { no: 4, status: 0 },
  ]);

  const updateEntry = (index: number, field: keyof InductionEntry, value: number) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  };

  const handleSend = () => {
    const fields: Record<string, number> = { InductionCount: count };
    for (let i = 0; i < count; i++) {
      fields[`InductionNo_${i}`] = entries[i].no;
      fields[`InductionStatus_${i}`] = entries[i].status;
    }

    sendTelegram(TelegramNumber.InductionStatus, fields);

    // 시스템 상태 반영
    for (let i = 0; i < count; i++) {
      useSystemStore.getState().updateInductionStatus(
        entries[i].no,
        entries[i].status as InductionStatus,
      );
    }

    useToastStore.getState().addToast(`InductionStatus 생성 (${count}개)`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-[var(--color-smc-to-plc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          인덕션 상태 (11)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">인덕션 개수</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}개</option>
            ))}
          </select>
        </div>

        {entries.slice(0, count).map((entry, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2">
            <div>
              <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">번호</label>
              <select
                value={entry.no}
                onChange={(e) => updateEntry(i, 'no', Number(e.target.value))}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">상태</label>
              <select
                value={entry.status}
                onChange={(e) => updateEntry(i, 'status', Number(e.target.value))}
                className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

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
