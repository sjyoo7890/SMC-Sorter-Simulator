import { create } from 'zustand';
import type { TelegramLog } from '../types/log';
import type { Direction } from '../types/protocol';

const MAX_LOGS = 10_000;

export interface LogFilter {
  direction: Direction | 'ALL';
  telegramNos: number[];
  searchText: string;
}

interface LogState {
  logs: TelegramLog[];
  selectedLogId: string | null;
  filter: LogFilter;

  addLog: (log: TelegramLog) => void;
  addLogs: (logs: TelegramLog[]) => void;
  selectLog: (id: string | null) => void;
  setFilter: (filter: Partial<LogFilter>) => void;
  clearLogs: () => void;
  exportLogs: (format: 'csv' | 'json') => string;
}

/** 필터 적용 (컴포넌트에서 useMemo로 호출) */
export function filterLogs(logs: TelegramLog[], filter: LogFilter): TelegramLog[] {
  return logs.filter((log) => {
    if (filter.direction !== 'ALL' && log.direction !== filter.direction) return false;
    if (filter.telegramNos.length > 0 && !filter.telegramNos.includes(log.telegramNo)) return false;
    if (filter.searchText) {
      const text = filter.searchText.toLowerCase();
      const haystack = `${log.telegramName} ${log.machineId} ${JSON.stringify(log.decodedFields)}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}

export const useLogStore = create<LogState>((set, get) => ({
  logs: [],
  selectedLogId: null,
  filter: {
    direction: 'ALL',
    telegramNos: [],
    searchText: '',
  },

  addLog: (log) =>
    set((state) => {
      const next = [log, ...state.logs];
      if (next.length > MAX_LOGS) next.length = MAX_LOGS;
      return { logs: next };
    }),

  addLogs: (newLogs) =>
    set((state) => {
      const next = [...newLogs, ...state.logs];
      if (next.length > MAX_LOGS) next.length = MAX_LOGS;
      return { logs: next };
    }),

  selectLog: (id) => set({ selectedLogId: id }),

  setFilter: (partial) =>
    set((state) => ({ filter: { ...state.filter, ...partial } })),

  clearLogs: () => set({ logs: [], selectedLogId: null }),

  exportLogs: (format) => {
    const { logs, filter } = get();
    const filtered = filterLogs(logs, filter);
    if (format === 'json') {
      return JSON.stringify(filtered, null, 2);
    }
    const header = 'id,timestamp,direction,telegramNo,telegramName,machineId,port,dataTypeChar';
    const rows = filtered.map((l) =>
      [l.id, l.timestamp.toISOString(), l.direction, l.telegramNo, l.telegramName, l.machineId, l.port, l.dataTypeChar].join(','),
    );
    return [header, ...rows].join('\n');
  },
}));
