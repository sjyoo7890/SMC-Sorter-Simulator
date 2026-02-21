import { useState } from 'react';
import { Power } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';
import type { SorterStatus } from '../../types/protocol';

const requestOptions = [
  { value: 0, label: '0: 정지' },
  { value: 1, label: '1: 가동' },
  { value: 2, label: '2: 구분완료시 정지' },
];

const ackOptions = [
  { value: 0, label: '자동 (정상 응답)' },
  { value: 1, label: '에러 응답 (Status=1)' },
  { value: 2, label: '블록 응답 (Status=2)' },
];

export default function SorterControlForm() {
  const [request, setRequest] = useState(1);
  const [ackMode, setAckMode] = useState(0);

  const handleSend = () => {
    // 1. 제어 명령 전송
    sendTelegram(TelegramNumber.SetControlSorter, { Request: request });
    useToastStore.getState().addToast('SetControlSorter 전송됨');

    // 2. 1초 후 Ack 응답 생성
    const ackStatus = ackMode;
    setTimeout(() => {
      sendTelegram(TelegramNumber.SetControlSorterAck, {
        Request: request,
        Status: ackStatus,
      });

      // 정상 응답이면 상태 반영
      if (ackStatus === 0) {
        const statusMap: Record<number, SorterStatus> = { 0: 0, 1: 1, 2: 1 };
        useSystemStore.getState().updateSorterStatus(statusMap[request] ?? 0);
      }

      useToastStore.getState().addToast(
        `SetControlSorterAck 수신 (Status=${ackStatus})`,
        ackStatus === 0 ? 'success' : 'error',
      );
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Power className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          소터 제어 (100)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">Request</label>
          <select
            value={request}
            onChange={(e) => setRequest(Number(e.target.value))}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 text-xs text-[var(--color-text-primary)]"
          >
            {requestOptions.map((o) => (
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
