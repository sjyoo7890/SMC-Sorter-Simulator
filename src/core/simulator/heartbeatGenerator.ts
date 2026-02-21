import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';

const HEARTBEAT_INTERVAL_MS = 3000;
const HEARTBEAT_TIMEOUT_MS = 6000;

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

function resetTimeout() {
  if (timeoutTimer) clearTimeout(timeoutTimer);
  timeoutTimer = setTimeout(() => {
    useSystemStore.getState().heartbeat.active &&
      useSystemStore.setState({
        heartbeat: { ...useSystemStore.getState().heartbeat, active: false },
      });
  }, HEARTBEAT_TIMEOUT_MS);
}

function tick() {
  // PLC→SMC HeartBeat
  sendTelegram(TelegramNumber.HeartBeat, { ActiveStatus: 1 });
  useSystemStore.getState().updateHeartbeat();
  resetTimeout();

  // SMC→PLC HeartBeat 응답 (약간의 지연)
  setTimeout(() => {
    sendTelegram(TelegramNumber.HeartBeat, { ActiveStatus: 1 });
  }, 100);
}

export function startHeartbeat(speed: number) {
  stopHeartbeat();
  const interval = HEARTBEAT_INTERVAL_MS / speed;
  tick();
  heartbeatTimer = setInterval(tick, interval);
}

export function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
}

export function updateHeartbeatSpeed(speed: number) {
  if (heartbeatTimer) {
    startHeartbeat(speed);
  }
}
