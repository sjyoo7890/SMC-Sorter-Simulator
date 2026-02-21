import { normalSortCycle } from './normalSortCycle';
import { systemStartup } from './systemStartup';
import { overflowHandling } from './overflowHandling';
import { errorRecovery } from './errorRecovery';
import { modeChange } from './modeChange';
import type { Scenario } from './types';

export const allScenarios: Scenario[] = [
  normalSortCycle,
  systemStartup,
  overflowHandling,
  errorRecovery,
  modeChange,
];

export type { Scenario, ScenarioStep } from './types';
