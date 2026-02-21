import { useEffect, useRef, useCallback } from 'react';
import { simulationEngine } from '../core/simulator/SimulationEngine';
import { useSimStore } from '../stores/useSimStore';

export function useSimulation() {
  const isRunning = useSimStore((s) => s.isRunning);
  const speed = useSimStore((s) => s.speed);
  const elapsedTime = useSimStore((s) => s.elapsedTime);
  const engineRef = useRef(simulationEngine);

  // 컴포넌트 언마운트 시 자동 정리
  useEffect(() => {
    return () => {
      engineRef.current.stop();
    };
  }, []);

  const start = useCallback(() => {
    engineRef.current.start();
  }, []);

  const stop = useCallback(() => {
    engineRef.current.stop();
  }, []);

  const pause = useCallback(() => {
    engineRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    engineRef.current.resume();
  }, []);

  const setSpeed = useCallback((s: number) => {
    engineRef.current.setSpeed(s);
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current.isRunning) {
      engineRef.current.stop();
    } else {
      engineRef.current.start();
    }
  }, []);

  return {
    isRunning,
    speed,
    elapsedTime,
    start,
    stop,
    pause,
    resume,
    setSpeed,
    toggle,
  };
}
