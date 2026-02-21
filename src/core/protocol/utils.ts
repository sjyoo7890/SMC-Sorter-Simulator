/** 바이트 배열 → "02 48 50 53 ..." 형태 */
export function bytesToHexString(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

/** Big Endian 바이트 → 정수 */
export function bytesToInt(bytes: number[]): number {
  let result = 0;
  for (const b of bytes) {
    result = (result << 8) | (b & 0xff);
  }
  return result >>> 0; // unsigned
}

/** 정수 → Big Endian 바이트 배열 */
export function intToBytes(value: number, size: number): number[] {
  const bytes: number[] = [];
  for (let i = size - 1; i >= 0; i--) {
    bytes.push((value >> (i * 8)) & 0xff);
  }
  return bytes;
}

/** 문자열 → ASCII 바이트 배열 */
export function stringToBytes(str: string): number[] {
  return Array.from(str).map((ch) => ch.charCodeAt(0));
}

/** ASCII 바이트 → 문자열 */
export function bytesToString(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}

type FieldColorType = 'stx' | 'etx' | 'dataType' | 'machineId' | 'telegramNo' | 'dataLength' | 'data';

const fieldColorMap: Record<FieldColorType, string> = {
  stx: 'text-red-400 bg-red-900/30',
  etx: 'text-red-400 bg-red-900/30',
  dataType: 'text-purple-400 bg-purple-900/30',
  machineId: 'text-cyan-400 bg-cyan-900/30',
  telegramNo: 'text-blue-400 bg-blue-900/30',
  dataLength: 'text-yellow-400 bg-yellow-900/30',
  data: 'text-green-400 bg-green-900/30',
};

/** 필드 타입별 CSS 클래스 반환 */
export function getFieldColorClass(fieldType: string): string {
  return fieldColorMap[fieldType as FieldColorType] ?? 'text-gray-400 bg-gray-900/30';
}
