import type { Direction, DataTypeChar, PortNumber } from './protocol';

export interface TelegramLog {
  id: string;
  timestamp: Date;
  direction: Direction;
  telegramNo: number;
  telegramName: string;
  machineId: string;
  port: PortNumber;
  rawBytes: number[];
  decodedFields: Record<string, { value: number | string; description: string }>;
  dataTypeChar: DataTypeChar;
}
