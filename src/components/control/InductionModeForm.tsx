import { useState } from 'react';
import { ScanBarcode } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';
import type { InductionMode } from '../../types/protocol';

const modeOptions = [
  { value: 0, label: '0: BCR' },
  { value: 1, label: '1: 타건' },
];

const ackOptions = [
  { value: 0, label: '자동 (정상 응답)' },
  { value: 1, label: '에러 응답 (Reason=1)' },
];

export default function InductionModeForm() {
  const [inductionNo, setInductionNo] = useState(1);
  const [mode, setMode] = useState(0);
  const [ackMode, setAckMode] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.SetInductionMode, {
      InductionNo: inductionNo,
      Mode: mode,
    });
    useToastStore.getState().addToast('SetInductionMode 전송됨');

    const reason = ackMode;
    setTimeout(() => {
      sendTelegram(TelegramNumber.SetInductionModeAck, {
        InductionNo: inductionNo,
        Mode: mode,
        Reason: reason,
      });

      if (reason === 0) {
        useSystemStore.getState().updateInductionMode(inductionNo, mode as InductionMode);
      }

      useToastStore.getState().addToast(
        `SetInductionModeAck 수신 (Reason=${reason})`,
        reason === 0 ? 'success' : 'error',
      );
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ScanBarcode className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          인덕션 모드 설정 (120)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Induction No</label>
          <select
            value={inductionNo}
            onChange={(e) => setInductionNo(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>인덕션 {n}</option>
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
            {modeOptions.map((o) => (
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
