import { useState } from 'react';
import { Activity } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';
import type { SorterStatus } from '../../types/protocol';

const statusOptions = [
  { value: 0, label: '0: 정지' },
  { value: 1, label: '1: 운전' },
  { value: 2, label: '2: 에러' },
];

export default function ManualSorterStatusForm() {
  const [status, setStatus] = useState(1);

  const handleSend = () => {
    sendTelegram(TelegramNumber.SorterStatus, { SorterStatus: status });
    useSystemStore.getState().updateSorterStatus(status as SorterStatus);
    useToastStore.getState().addToast(`SorterStatus 생성 (${statusOptions[status]?.label})`);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-[var(--color-smc-to-plc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          소터 상태 (10)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
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
