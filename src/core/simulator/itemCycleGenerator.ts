import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { pidRanges } from '../../constants/pidRanges';

// PID 순차 카운터
const pidCounters: Record<string, number> = {};

function getNextPid(inductionNo: number, mode: number): number {
  const key = mode === 0
    ? `induction${inductionNo}Auto`
    : `induction${inductionNo}Manual`;
  const range = pidRanges[key as keyof typeof pidRanges];
  if (!range) return 100001;

  if (!(key in pidCounters)) {
    pidCounters[key] = range.min;
  }

  const pid = pidCounters[key];
  pidCounters[key] = pid >= range.max ? range.min : pid + 1;
  return pid;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChute(): number {
  return rand(1, 100);
}

let cycleTimer: ReturnType<typeof setTimeout> | null = null;
let running = false;
let currentSpeed = 1;

function scheduleNext() {
  if (!running) return;
  const delay = rand(2000, 5000) / currentSpeed;
  cycleTimer = setTimeout(runCycle, delay);
}

function runCycle() {
  if (!running) return;

  const sys = useSystemStore.getState();
  const stats = useStatsStore.getState();

  // 운전 중인 인덕션만 선택
  const activeInductions = sys.inductions.filter((ind) => ind.status === 1);
  if (activeInductions.length === 0) {
    scheduleNext();
    return;
  }

  const ind = activeInductions[rand(0, activeInductions.length - 1)];
  const mode = ind.mode;
  const pid = getNextPid(ind.no, mode);
  const cellIndexNo = rand(1, 200);

  // 수동 모드이면 목적지를 미리 설정
  const isManual = mode === 1;
  const mainDest = isManual ? randChute() : 0;
  const dest1 = isManual ? randChute() : 0;
  const dest2 = isManual ? (Math.random() < 0.3 ? randChute() : 0) : 0;
  const dest3 = 0;
  const dest4 = 0;

  // 1. ItemInducted(20)
  sendTelegram(TelegramNumber.ItemInducted, {
    CellIndexNo: cellIndexNo,
    CellCount: 1,
    PID: pid,
    InductionNo: ind.no,
    Mode: mode,
    MainDestination: mainDest,
    Destination1: dest1,
    Destination2: dest2,
    Destination3: dest3,
    Destination4: dest4,
  });

  sys.addActiveItem({
    pid,
    cellIndexNo,
    inductionNo: ind.no,
    mode,
    destinations: [mainDest, dest1, dest2, dest3, dest4].filter((d) => d > 0),
    inductedAt: new Date(),
    status: 'inducted',
  });
  stats.recordItemEvent('inducted');
  stats.recordReceived(TelegramNumber.ItemInducted);

  // 2. DestinationRequest(30) — 자동 모드일 때만
  const autoMainDest = isManual ? mainDest : randChute();
  const autoDest1 = isManual ? dest1 : randChute();
  const autoDest2 = isManual ? dest2 : (Math.random() < 0.3 ? randChute() : 0);

  if (!isManual) {
    const destDelay = rand(500, 1000) / currentSpeed;
    setTimeout(() => {
      if (!running) return;
      sendTelegram(TelegramNumber.DestinationRequest, {
        ItemNo: String(pid).padStart(6, ' '),
        CellIndexNo: cellIndexNo,
        InductionNo: ind.no,
        MainDestination: autoMainDest,
        Destination1: autoDest1,
        Destination2: autoDest2,
        Destination3: 0,
        Destination4: 0,
      });
      useSystemStore.getState().updateItemStatus(pid, 'destination_set');
    }, destDelay);
  } else {
    // 수동 모드도 destination_set으로 전환
    setTimeout(() => {
      if (!running) return;
      useSystemStore.getState().updateItemStatus(pid, 'destination_set');
    }, rand(300, 600) / currentSpeed);
  }

  // 3. ItemDischarged(21)
  const dischargeDelay = rand(1000, 3000) / currentSpeed + (isManual ? 0 : rand(500, 1000) / currentSpeed);
  const recircCount = Math.random() < 0.05 ? rand(1, 2) : 0;
  const chuteNumber = isManual ? mainDest : autoMainDest;

  setTimeout(() => {
    if (!running) return;
    sendTelegram(TelegramNumber.ItemDischarged, {
      CellIndexNo: cellIndexNo,
      InductionNo: ind.no,
      Mode: mode,
      PID: pid,
      ChuteNumber: chuteNumber,
      RecirculationCount: recircCount,
    });
    useSystemStore.getState().updateItemStatus(pid, 'discharged');
    useStatsStore.getState().recordItemEvent('discharged');
  }, dischargeDelay);

  // 4. ItemSortedConfirm(22)
  const confirmDelay = dischargeDelay + rand(300, 500) / currentSpeed;
  const isError = Math.random() < 0.05;
  const sortStatus = isError ? rand(2, 14) : 1;

  setTimeout(() => {
    if (!running) return;
    sendTelegram(TelegramNumber.ItemSortedConfirm, {
      CellIndexNo: cellIndexNo,
      InductionNo: ind.no,
      Mode: mode,
      PID: pid,
      ChuteNumber: chuteNumber,
      RecirculationCount: recircCount,
      Status: sortStatus,
    });
    useSystemStore.getState().updateItemStatus(pid, 'confirmed');
    useStatsStore.getState().recordItemEvent('confirmed');

    if (isError) {
      useStatsStore.getState().recordItemEvent('errors');
      useStatsStore.getState().recordError();
    }

    // 5초 후 activeItem 제거
    setTimeout(() => {
      useSystemStore.getState().removeActiveItem(pid);
    }, 5000 / currentSpeed);
  }, confirmDelay);

  scheduleNext();
}

export function startItemCycle(speed: number) {
  stopItemCycle();
  running = true;
  currentSpeed = speed;
  scheduleNext();
}

export function stopItemCycle() {
  running = false;
  if (cycleTimer) {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }
}

export function updateItemCycleSpeed(speed: number) {
  currentSpeed = speed;
}
