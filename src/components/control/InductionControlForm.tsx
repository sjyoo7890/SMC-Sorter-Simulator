import { useState } from 'react';
import { Zap } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useToastStore } from '../../stores/useToastStore';
import type { InductionStatus } from '../../types/protocol';

const requestOptions = [
  { value: 0, label: '0: 정지' },
  { value: 1, label: '1: 가동' },
  { value: 2, label: '2: 알람 해제' },
  { value: 3, label: '3: 타건 재요청' },
];

const ackOptions = [
  { value: 0, label: '자동 (정상 응답)' },
  { value: 1, label: '에러 응답 (Status=1)' },
  { value: 2, label: '블록 응답 (Status=2)' },
];

export default function InductionControlForm() {
  const [inductionNo, setInductionNo] = useState(1);
  const [request, setRequest] = useState(1);
  const [ackMode, setAckMode] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.SetControlInduction, {
      InductionNo: inductionNo,
      Request: request,
    });
    useToastStore.getState().addToast('SetControlInduction 전송됨');

    const ackStatus = ackMode;
    setTimeout(() => {
      sendTelegram(TelegramNumber.SetControlInductionAck, {
        InductionNo: inductionNo,
        Request: request,
        Status: ackStatus,
      });

      if (ackStatus === 0 && (request === 0 || request === 1)) {
        useSystemStore.getState().updateInductionStatus(
          inductionNo,
          request as InductionStatus,
        );
      }

      useToastStore.getState().addToast(
        `SetControlInductionAck 수신 (Status=${ackStatus})`,
        ackStatus === 0 ? 'success' : 'error',
      );
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          인덕션 제어 (110)
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
