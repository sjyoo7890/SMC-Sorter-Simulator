import { create } from 'zustand';
import type { SorterStatus, InductionStatus, InductionMode } from '../types/protocol';
import type { ActiveItem } from '../types/system';

interface InductionState {
  no: number;
  status: InductionStatus;
  mode: InductionMode;
}

interface SystemState {
  sorterStatus: SorterStatus;
  inductions: InductionState[];
  heartbeat: { lastReceived: Date | null; active: boolean };
  overflowConfig: { chute1: number; chute2: number; maxRecirculation: number };
  activeItems: Map<number, ActiveItem>;

  updateSorterStatus: (status: SorterStatus) => void;
  updateInductionStatus: (no: number, status: InductionStatus) => void;
  updateInductionMode: (no: number, mode: InductionMode) => void;
  updateHeartbeat: () => void;
  updateOverflowConfig: (config: { chute1: number; chute2: number; maxRecirculation: number }) => void;
  addActiveItem: (item: ActiveItem) => void;
  updateItemStatus: (pid: number, status: ActiveItem['status']) => void;
  removeActiveItem: (pid: number) => void;
  resetAll: () => void;
}

const initialInductions: InductionState[] = [
  { no: 1, status: 0, mode: 0 },
  { no: 2, status: 0, mode: 0 },
  { no: 3, status: 0, mode: 0 },
  { no: 4, status: 0, mode: 0 },
];

const initialState = {
  sorterStatus: 0 as SorterStatus,
  inductions: initialInductions,
  heartbeat: { lastReceived: null as Date | null, active: false },
  overflowConfig: { chute1: 200, chute2: 202, maxRecirculation: 2 },
  activeItems: new Map<number, ActiveItem>(),
};

export const useSystemStore = create<SystemState>((set) => ({
  ...initialState,

  updateSorterStatus: (status) => set({ sorterStatus: status }),

  updateInductionStatus: (no, status) =>
    set((state) => ({
      inductions: state.inductions.map((ind) =>
        ind.no === no ? { ...ind, status } : ind,
      ),
    })),

  updateInductionMode: (no, mode) =>
    set((state) => ({
      inductions: state.inductions.map((ind) =>
        ind.no === no ? { ...ind, mode } : ind,
      ),
    })),

  updateHeartbeat: () =>
    set({ heartbeat: { lastReceived: new Date(), active: true } }),

  updateOverflowConfig: (config) => set({ overflowConfig: config }),

  addActiveItem: (item) =>
    set((state) => {
      const next = new Map(state.activeItems);
      next.set(item.pid, item);
      return { activeItems: next };
    }),

  updateItemStatus: (pid, status) =>
    set((state) => {
      const next = new Map(state.activeItems);
      const existing = next.get(pid);
      if (existing) {
        next.set(pid, { ...existing, status });
      }
      return { activeItems: next };
    }),

  removeActiveItem: (pid) =>
    set((state) => {
      const next = new Map(state.activeItems);
      next.delete(pid);
      return { activeItems: next };
    }),

  resetAll: () =>
    set({
      ...initialState,
      inductions: initialInductions.map((i) => ({ ...i })),
      activeItems: new Map(),
    }),
}));
