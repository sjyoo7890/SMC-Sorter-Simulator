import { create } from 'zustand';

interface SimState {
  isRunning: boolean;
  speed: number;
  scenario: string | null;
  elapsedTime: number;

  start: () => void;
  stop: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  setScenario: (name: string | null) => void;
  tick: () => void;
}

export const useSimStore = create<SimState>((set) => ({
  isRunning: false,
  speed: 1,
  scenario: null,
  elapsedTime: 0,

  start: () => set({ isRunning: true }),
  stop: () => set({ isRunning: false, elapsedTime: 0 }),
  pause: () => set({ isRunning: false }),
  setSpeed: (speed) => set({ speed }),
  setScenario: (name) => set({ scenario: name }),
  tick: () => set((state) => ({ elapsedTime: state.elapsedTime + 1 })),
}));
