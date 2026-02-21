import type { Direction } from '../../../types/protocol';

export interface ScenarioStep {
  delay: number;
  telegramNo: number;
  direction: Direction;
  fields: Record<string, number | string>;
  description: string;
}

export interface Scenario {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  steps: ScenarioStep[];
}
