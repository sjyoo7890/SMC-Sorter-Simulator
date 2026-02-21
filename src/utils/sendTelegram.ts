import type { TelegramLog } from '../types/log';
import { telegramMeta } from '../constants/telegramMeta';
import { encodeTelegram } from '../core/protocol/encoder';
import { decodeTelegram } from '../core/protocol/decoder';
import { useLogStore } from '../stores/useLogStore';
import { useStatsStore } from '../stores/useStatsStore';

const MACHINE_ID = 'PSM001';
let logIdCounter = 1000;

function nextLogId(): string {
  return String(++logIdCounter).padStart(6, '0');
}

/**
 * 텔레그램을 인코딩 → 디코딩 → 로그 추가 → 통계 기록
 * 반복 필드가 없는 일반 텔레그램용
 */
export function sendTelegram(
  telegramNo: number,
  fields: Record<string, number | string>,
): TelegramLog {
  const meta = telegramMeta[telegramNo];
  const rawBytes = encodeTelegram(telegramNo, MACHINE_ID, fields);
  const decoded = decodeTelegram(rawBytes);

  const decodedFields: Record<string, { value: number | string; description: string }> = {};
  for (const [key, field] of Object.entries(decoded.fields)) {
    decodedFields[key] = { value: field.value, description: field.description };
  }

  const log: TelegramLog = {
    id: nextLogId(),
    timestamp: new Date(),
    direction: meta.direction,
    telegramNo,
    telegramName: meta.name,
    machineId: MACHINE_ID,
    port: meta.port,
    rawBytes,
    decodedFields,
    dataTypeChar: meta.dataTypeChar,
  };

  useLogStore.getState().addLog(log);

  if (meta.direction === 'SMC_TO_PLC') {
    useStatsStore.getState().recordSent(telegramNo);
  } else {
    useStatsStore.getState().recordReceived(telegramNo);
  }

  return log;
}

/**
 * 반복 필드 텔레그램용 (InductionStatus/InductionMode)
 * encoder가 내부적으로 처리하므로 동일한 함수 사용 가능
 */
export function sendRepeatingTelegram(
  telegramNo: number,
  fields: Record<string, number | string>,
): TelegramLog {
  return sendTelegram(telegramNo, fields);
}

export { MACHINE_ID };
