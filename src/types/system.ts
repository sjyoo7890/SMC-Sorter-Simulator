import type { SorterStatus, InductionStatus, InductionMode } from './protocol';

export interface SystemState {
  sorterStatus: SorterStatus;
  inductions: Array<{ no: number; status: InductionStatus; mode: InductionMode }>;
  heartbeat: { lastReceived: Date | null; active: boolean };
  overflowConfig: { chute1: number; chute2: number; maxRecirculation: number };
  activeItems: Map<number, ActiveItem>;
}

export interface ActiveItem {
  pid: number;
  cellIndexNo: number;
  inductionNo: number;
  mode: number;
  destinations: number[];
  inductedAt: Date;
  status: 'inducted' | 'destination_set' | 'discharged' | 'confirmed';
}
