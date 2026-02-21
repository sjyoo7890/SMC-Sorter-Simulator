import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useStatsStore } from '../../stores/useStatsStore';
import { telegramMeta } from '../../constants/telegramMeta';

const shortNames: Record<number, string> = {
  1: 'HB',
  10: 'SrtSt',
  11: 'IndSt',
  12: 'IndMd',
  20: 'Induct',
  21: 'Disch',
  22: 'Confirm',
  30: 'DestReq',
  100: 'CtrlSrt',
  101: 'CtrlSrtA',
  110: 'CtrlInd',
  111: 'CtrlIndA',
  120: 'SetMd',
  121: 'SetMdA',
  130: 'OvfCfg',
  131: 'OvfCfgA',
  140: 'Reset',
  141: 'ResetA',
};

export default function TelegramDistributionChart() {
  const byTelegram = useStatsStore((s) => s.byTelegram);

  const data = Object.entries(byTelegram).map(([no, counts]) => {
    const num = Number(no);
    const meta = telegramMeta[num];
    return {
      name: shortNames[num] ?? String(num),
      fullName: meta?.name ?? `Telegram ${num}`,
      sent: counts.sent,
      received: counts.received,
    };
  });

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-[var(--color-text-secondary)]">
        텔레그램 통계 데이터 없음
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a3a4e" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          stroke="#2a3a4e"
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 10 }}
          stroke="#2a3a4e"
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1a2332',
            border: '1px solid #2a3a4e',
            borderRadius: 8,
            fontSize: 12,
            color: '#e2e8f0',
          }}
          labelFormatter={(_, payload) => {
            const item = payload?.[0]?.payload;
            return item?.fullName ?? '';
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
        />
        <Bar dataKey="sent" name="송신" fill="#f59e0b" radius={[2, 2, 0, 0]} />
        <Bar dataKey="received" name="수신" fill="#3b82f6" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
