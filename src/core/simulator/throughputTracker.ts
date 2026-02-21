import { useLogStore } from '../../stores/useLogStore';
import { useStatsStore } from '../../stores/useStatsStore';

let trackerTimer: ReturnType<typeof setInterval> | null = null;
let lastLogCount = 0;

function tick() {
  const currentCount = useLogStore.getState().logs.length;
  const delta = Math.max(0, currentCount - lastLogCount);
  lastLogCount = currentCount;
  useStatsStore.getState().updateThroughput(delta);
}

export function startThroughputTracker() {
  stopThroughputTracker();
  lastLogCount = useLogStore.getState().logs.length;
  trackerTimer = setInterval(tick, 1000);
}

export function stopThroughputTracker() {
  if (trackerTimer) {
    clearInterval(trackerTimer);
    trackerTimer = null;
  }
}
