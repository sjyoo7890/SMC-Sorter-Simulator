import { startHeartbeat, stopHeartbeat, updateHeartbeatSpeed } from './heartbeatGenerator';
import { startItemCycle, stopItemCycle, updateItemCycleSpeed } from './itemCycleGenerator';
import { startStatusGenerator, stopStatusGenerator, updateStatusGeneratorSpeed } from './statusGenerator';
import { startThroughputTracker, stopThroughputTracker } from './throughputTracker';
import { useSimStore } from '../../stores/useSimStore';

let elapsedTimer: ReturnType<typeof setInterval> | null = null;

class SimulationEngine {
  private speed: number = 1;
  private _running = false;

  get isRunning() {
    return this._running;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this.speed = useSimStore.getState().speed;

    useSimStore.getState().start();

    startHeartbeat(this.speed);
    startItemCycle(this.speed);
    startStatusGenerator(this.speed);
    startThroughputTracker();

    // 경과 시간 타이머
    elapsedTimer = setInterval(() => {
      useSimStore.getState().tick();
    }, 1000);
  }

  stop() {
    this._running = false;

    stopHeartbeat();
    stopItemCycle();
    stopStatusGenerator();
    stopThroughputTracker();

    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      elapsedTimer = null;
    }

    useSimStore.getState().stop();
  }

  pause() {
    if (!this._running) return;
    this._running = false;

    stopHeartbeat();
    stopItemCycle();
    stopStatusGenerator();
    stopThroughputTracker();

    if (elapsedTimer) {
      clearInterval(elapsedTimer);
      elapsedTimer = null;
    }

    useSimStore.getState().pause();
  }

  resume() {
    if (this._running) return;
    this._running = true;
    this.speed = useSimStore.getState().speed;

    useSimStore.getState().start();

    startHeartbeat(this.speed);
    startItemCycle(this.speed);
    startStatusGenerator(this.speed);
    startThroughputTracker();

    elapsedTimer = setInterval(() => {
      useSimStore.getState().tick();
    }, 1000);
  }

  setSpeed(speed: number) {
    this.speed = speed;
    useSimStore.getState().setSpeed(speed);

    if (this._running) {
      updateHeartbeatSpeed(speed);
      updateItemCycleSpeed(speed);
      updateStatusGeneratorSpeed(speed);
    }
  }
}

// 싱글톤 인스턴스
export const simulationEngine = new SimulationEngine();
