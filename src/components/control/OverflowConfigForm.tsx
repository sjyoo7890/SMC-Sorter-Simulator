import { useState } from 'react';
import { Inbox } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';

const ackOptions = [
  { value: 0, label: '자동 (정상 응답)' },
  { value: 1, label: '에러 응답 (Reason=1)' },
];

export default function OverflowConfigForm() {
  const [chute1, setChute1] = useState(200);
  const [chute2, setChute2] = useState(202);
  const [maxRecirc, setMaxRecirc] = useState(2);
  const [ackMode, setAckMode] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.SetOverflowConfiguration, {
      OverflowChute1: chute1,
      OverflowChute2: chute2,
      MaxRecirculation: maxRecirc,
    });
    useToastStore.getState().addToast('SetOverflowConfiguration 전송됨');

    const reason = ackMode;
    setTimeout(() => {
      sendTelegram(TelegramNumber.SetOverflowConfigurationAck, {
        OverflowChute1: chute1,
        OverflowChute2: chute2,
        MaxRecirculation: maxRecirc,
        Reason: reason,
      });

      if (reason === 0) {
        useSystemStore.getState().updateOverflowConfig({
          chute1,
          chute2,
          maxRecirculation: maxRecirc,
        });
      }

      useToastStore.getState().addToast(
        `SetOverflowConfigurationAck 수신 (Reason=${reason})`,
        reason === 0 ? 'success' : 'error',
      );
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Inbox className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          오버플로우 설정 (130)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Overflow Chute 1</label>
          <input
            type="number"
            value={chute1}
            onChange={(e) => setChute1(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Overflow Chute 2</label>
          <input
            type="number"
            value={chute2}
            onChange={(e) => setChute2(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Max Recirculation</label>
          <input
            type="number"
            value={maxRecirc}
            onChange={(e) => setMaxRecirc(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          />
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
