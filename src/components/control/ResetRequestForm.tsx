import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useToastStore } from '../../stores/useToastStore';

const moduleOptions = [
  { value: 1, label: '1: Sorter Reset' },
  { value: 2, label: '2: Conveyor Reset' },
];

const ackOptions = [
  { value: 0, label: '자동 (정상 응답)' },
  { value: 1, label: '에러 응답 (Reason=1)' },
];

export default function ResetRequestForm() {
  const [resetModule, setResetModule] = useState(1);
  const [ackMode, setAckMode] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.SetResetRequest, { ResetModule: resetModule });
    useToastStore.getState().addToast('SetResetRequest 전송됨');

    const reason = ackMode;
    setTimeout(() => {
      sendTelegram(TelegramNumber.SetResetRequestAck, {
        ResetModule: resetModule,
        Reason: reason,
      });

      useToastStore.getState().addToast(
        `SetResetRequestAck 수신 (Reason=${reason})`,
        reason === 0 ? 'success' : 'error',
      );
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <RotateCcw className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          리셋 요청 (140)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Reset Module</label>
          <select
            value={resetModule}
            onChange={(e) => setResetModule(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {moduleOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Ack 응답 모드</label>
          <select
            value={ackMode}
            onChange={(e) => setAckMode(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {ackOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSend}
          className="w-full rounded-md bg-[var(--color-plc-to-smc)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}
