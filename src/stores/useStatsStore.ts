import { create } from 'zustand';

interface ItemStats {
  inducted: number;
  discharged: number;
  confirmed: number;
  errors: number;
}

interface StatsState {
  totalSent: number;
  totalReceived: number;
  byTelegram: Record<number, { sent: number; received: number }>;
  errorCount: number;
  itemStats: ItemStats;
  recentThroughput: number[];

  recordSent: (telegramNo: number) => void;
  recordReceived: (telegramNo: number) => void;
  recordError: () => void;
  recordItemEvent: (type: keyof ItemStats) => void;
  updateThroughput: (count: number) => void;
  resetStats: () => void;
}

const MAX_THROUGHPUT_ENTRIES = 60;

const initialState = {
  totalSent: 0,
  totalReceived: 0,
  byTelegram: {} as Record<number, { sent: number; received: number }>,
  errorCount: 0,
  itemStats: { inducted: 0, discharged: 0, confirmed: 0, errors: 0 },
  recentThroughput: [] as number[],
};

export const useStatsStore = create<StatsState>((set) => ({
  ...initialState,

  recordSent: (telegramNo) =>
    set((state) => {
      const entry = state.byTelegram[telegramNo] ?? { sent: 0, received: 0 };
      return {
        totalSent: state.totalSent + 1,
        byTelegram: {
          ...state.byTelegram,
          [telegramNo]: { ...entry, sent: entry.sent + 1 },
        },
      };
    }),

  recordReceived: (telegramNo) =>
    set((state) => {
      const entry = state.byTelegram[telegramNo] ?? { sent: 0, received: 0 };
      return {
        totalReceived: state.totalReceived + 1,
        byTelegram: {
          ...state.byTelegram,
          [telegramNo]: { ...entry, received: entry.received + 1 },
        },
      };
    }),

  recordError: () =>
    set((state) => ({ errorCount: state.errorCount + 1 })),

  recordItemEvent: (type) =>
    set((state) => ({
      itemStats: { ...state.itemStats, [type]: state.itemStats[type] + 1 },
    })),

  updateThroughput: (count) =>
    set((state) => {
      const next = [...state.recentThroughput, count];
      if (next.length > MAX_THROUGHPUT_ENTRIES) next.shift();
      return { recentThroughput: next };
    }),

  resetStats: () => set({ ...initialState, byTelegram: {}, recentThroughput: [], itemStats: { inducted: 0, discharged: 0, confirmed: 0, errors: 0 } }),
}));
