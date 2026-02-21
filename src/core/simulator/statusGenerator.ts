import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import type { SorterStatus, InductionStatus } from '../../types/protocol';

let statusTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let currentSpeed = 1;

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 시뮬레이션 시작 시 초기 상태 메시지 전송 */
export function sendInitialStatus() {
  const sys = useSystemStore.getState();

  // SorterStatus(10) → 운전
  sendTelegram(TelegramNumber.SorterStatus, { SorterStatus: 1 });
  sys.updateSorterStatus(1);

  // InductionStatus(11) → 4개 모두 운전
  const indFields: Record<string, number> = { InductionCount: 4 };
  for (let i = 0; i < 4; i++) {
    indFields[`InductionNo_${i}`] = i + 1;
    indFields[`InductionStatus_${i}`] = 1;
    sys.updateInductionStatus((i + 1) as 1 | 2 | 3 | 4, 1);
  }
  sendTelegram(TelegramNumber.InductionStatus, indFields);

  // InductionMode(12) → 현재 모드 전송
  const inductions = useSystemStore.getState().inductions;
  const modeFields: Record<string, number> = { InductionCount: 4 };
  for (let i = 0; i < 4; i++) {
    modeFields[`InductionNo_${i}`] = inductions[i].no;
    modeFields[`InductionMode_${i}`] = inductions[i].mode;
  }
  sendTelegram(TelegramNumber.InductionMode, modeFields);
}

function scheduleStatusEvent() {
  if (!running) return;
  const delay = rand(30000, 60000) / currentSpeed;
  statusTimer = setTimeout(triggerStatusEvent, delay);
}

function triggerStatusEvent() {
  if (!running) return;

  const sys = useSystemStore.getState();
  const eventType = Math.random();

  if (eventType < 0.6) {
    // 인덕션 에러
    const indNo = rand(1, 4);
    sendTelegram(TelegramNumber.InductionStatus, {
      InductionCount: 1,
      InductionNo_0: indNo,
      InductionStatus_0: 2,
    });
    sys.updateInductionStatus(indNo as 1 | 2 | 3 | 4, 2 as InductionStatus);

    // 10초 후 자동 복구
    setTimeout(() => {
      if (!running) return;
      sendTelegram(TelegramNumber.InductionStatus, {
        InductionCount: 1,
        InductionNo_0: indNo,
        InductionStatus_0: 1,
      });
      useSystemStore.getState().updateInductionStatus(indNo as 1 | 2 | 3 | 4, 1 as InductionStatus);
    }, 10000 / currentSpeed);
  } else {
    // 소터 에러
    sendTelegram(TelegramNumber.SorterStatus, { SorterStatus: 2 });
    sys.updateSorterStatus(2 as SorterStatus);

    // 10초 후 자동 복구
    setTimeout(() => {
      if (!running) return;
      sendTelegram(TelegramNumber.SorterStatus, { SorterStatus: 1 });
      useSystemStore.getState().updateSorterStatus(1 as SorterStatus);
    }, 10000 / currentSpeed);
  }

  scheduleStatusEvent();
}

export function startStatusGenerator(speed: number) {
  stopStatusGenerator();
  running = true;
  currentSpeed = speed;
  sendInitialStatus();
  scheduleStatusEvent();
}

export function stopStatusGenerator() {
  running = false;
  if (statusTimer) {
    clearTimeout(statusTimer);
    statusTimer = null;
  }
}

export function updateStatusGeneratorSpeed(speed: number) {
  currentSpeed = speed;
}
