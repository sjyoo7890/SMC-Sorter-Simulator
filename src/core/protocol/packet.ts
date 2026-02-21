/**
 * 공통 패킷 구조
 * [STX(1)] [DataType(1)] [MachineID(6)] [TelegramNo(2)] [DataLength(2)] [Data(가변)] [ETX(1)]
 */

export const STX = 0x02;
export const ETX = 0x03;

export const HEADER_SIZE = 12; // STX(1) + DataType(1) + MachineID(6) + TelegramNo(2) + DataLength(2)
export const FOOTER_SIZE = 1;  // ETX(1)

export const MACHINE_ID_LENGTH = 6;

export interface PacketHeader {
  dataTypeChar: string;
  machineId: string;
  telegramNo: number;
  dataLength: number;
}
