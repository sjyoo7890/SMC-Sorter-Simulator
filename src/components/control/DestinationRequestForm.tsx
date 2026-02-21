import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useToastStore } from '../../stores/useToastStore';

export default function DestinationRequestForm() {
  const [itemNo, setItemNo] = useState('ABC123');
  const [cellIndexNo, setCellIndexNo] = useState(42);
  const [inductionNo, setInductionNo] = useState(1);
  const [mainDest, setMainDest] = useState(15);
  const [dest1, setDest1] = useState(0);
  const [dest2, setDest2] = useState(0);
  const [dest3, setDest3] = useState(0);
  const [dest4, setDest4] = useState(0);

  const handleSend = () => {
    sendTelegram(TelegramNumber.DestinationRequest, {
      ItemNo: itemNo.padEnd(6, ' ').slice(0, 6),
      CellIndexNo: cellIndexNo,
      InductionNo: inductionNo,
      MainDestination: mainDest,
      Destination1: dest1,
      Destination2: dest2,
      Destination3: dest3,
      Destination4: dest4,
    });
    useToastStore.getState().addToast('DestinationRequest 전송됨');
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-[var(--color-plc-to-smc)]" />
        <span className="text-xs font-bold text-[var(--color-text-primary)]">
          목적지 요청 (30)
        </span>
      </div>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] text-[var(--color-text-secondary)]">ItemNo (6자리)</label>
          <input
            type="text"
            value={itemNo}
            onChange={(e) => setItemNo(e.target.value)}
            maxLength={6}
            className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-card)] px-2 py-1.5 font-mono text-xs text-[var(--color-text-primary)]"
          />
        </div>

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
          className="w-full rounded-md bg-[var(--color-plc-to-smc)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}
