import type { Scenario } from './scenarios/types';
import { TelegramNumber } from '../../constants/telegramNumbers';
import { sendTelegram } from '../../utils/sendTelegram';
import { useSystemStore } from '../../stores/useSystemStore';
import { useStatsStore } from '../../stores/useStatsStore';
import { useSimStore } from '../../stores/useSimStore';
import { create } from 'zustand';
import type { SorterStatus, InductionStatus, InductionMode } from '../../types/protocol';

// 시나리오 실행 상태 스토어
interface ScenarioRunnerState {
  running: boolean;
  scenarioId: string | null;
  currentStep: number;
  totalSteps: number;
}

export const useScenarioRunnerStore = create<ScenarioRunnerState>(() => ({
  running: false,
  scenarioId: null,
  currentStep: 0,
  totalSteps: 0,
}));

let timeoutId: ReturnType<typeof setTimeout> | null = null;

function applySystemEffects(telegramNo: number, fields: Record<string, number | string>) {
  const sys = useSystemStore.getState();
  const stats = useStatsStore.getState();

  switch (telegramNo) {
    case TelegramNumber.SorterStatus:
      sys.updateSorterStatus(Number(fields['SorterStatus']) as SorterStatus);
      break;

    case TelegramNumber.HeartBeat:
      sys.updateHeartbeat();
      break;

    case TelegramNumber.InductionStatus: {
      const count = Number(fields['InductionCount'] ?? 0);
      for (let i = 0; i < count; i++) {
        const no = Number(fields[`InductionNo_${i}`]);
        const st = Number(fields[`InductionStatus_${i}`]);
        sys.updateInductionStatus(no, st as InductionStatus);
      }
      break;
    }

    case TelegramNumber.InductionMode: {
      const count = Number(fields['InductionCount'] ?? 0);
      for (let i = 0; i < count; i++) {
        const no = Number(fields[`InductionNo_${i}`]);
        const md = Number(fields[`InductionMode_${i}`]);
        sys.updateInductionMode(no, md as InductionMode);
      }
      break;
    }

    case TelegramNumber.SetControlSorterAck:
      if (Number(fields['Status']) === 0) {
        const req = Number(fields['Request']);
        const statusMap: Record<number, SorterStatus> = { 0: 0, 1: 1, 2: 1 };
        sys.updateSorterStatus(statusMap[req] ?? 0);
      }
      break;

    case TelegramNumber.SetControlInductionAck:
      if (Number(fields['Status']) === 0) {
        const req = Number(fields['Request']);
        if (req === 0 || req === 1) {
          sys.updateInductionStatus(Number(fields['InductionNo']), req as InductionStatus);
        }
      }
      break;

    case TelegramNumber.SetInductionModeAck:
      if (Number(fields['Reason']) === 0) {
        sys.updateInductionMode(Number(fields['InductionNo']), Number(fields['Mode']) as InductionMode);
      }
      break;

    case TelegramNumber.ItemInducted: {
      const pid = Number(fields['PID']);
      sys.addActiveItem({
        pid,
        cellIndexNo: Number(fields['CellIndexNo']),
        inductionNo: Number(fields['InductionNo']),
        mode: Number(fields['Mode']),
        destinations: [
          Number(fields['MainDestination'] ?? 0),
          Number(fields['Destination1'] ?? 0),
          Number(fields['Destination2'] ?? 0),
          Number(fields['Destination3'] ?? 0),
          Number(fields['Destination4'] ?? 0),
        ].filter((d) => d > 0),
        inductedAt: new Date(),
        status: 'inducted',
      });
      stats.recordItemEvent('inducted');
      break;
    }

    case TelegramNumber.DestinationRequest: {
      const itemNo = String(fields['ItemNo']).trim();
      const pid = Number(itemNo) || 0;
      if (pid) sys.updateItemStatus(pid, 'destination_set');
      break;
    }

    case TelegramNumber.ItemDischarged: {
      const pid = Number(fields['PID']);
      sys.updateItemStatus(pid, 'discharged');
      stats.recordItemEvent('discharged');
      break;
    }

    case TelegramNumber.ItemSortedConfirm: {
      const pid = Number(fields['PID']);
      sys.updateItemStatus(pid, 'confirmed');
      stats.recordItemEvent('confirmed');
      // 5초 후 제거
      setTimeout(() => {
        useSystemStore.getState().removeActiveItem(pid);
      }, 5000);
      break;
    }
  }
}

function executeStep(scenario: Scenario, stepIndex: number) {
  if (stepIndex >= scenario.steps.length) {
    // 시나리오 완료
    useScenarioRunnerStore.setState({ running: false, currentStep: scenario.steps.length });
    useSimStore.getState().setScenario(null);
    return;
  }

  const step = scenario.steps[stepIndex];

  useScenarioRunnerStore.setState({ currentStep: stepIndex + 1 });

  // 텔레그램 전송
  sendTelegram(step.telegramNo, step.fields);

  // 시스템 상태 반영
  applySystemEffects(step.telegramNo, step.fields);

  // 다음 단계 예약
  if (stepIndex + 1 < scenario.steps.length) {
    const nextDelay = scenario.steps[stepIndex + 1].delay;
    timeoutId = setTimeout(() => {
      executeStep(scenario, stepIndex + 1);
    }, nextDelay);
  } else {
    // 마지막 단계 완료
    useScenarioRunnerStore.setState({ running: false, currentStep: scenario.steps.length });
    useSimStore.getState().setScenario(null);
  }
}

export function startScenario(scenario: Scenario) {
  stopScenario();

  useScenarioRunnerStore.setState({
    running: true,
    scenarioId: scenario.id,
    currentStep: 0,
    totalSteps: scenario.steps.length,
  });
  useSimStore.getState().setScenario(scenario.id);

  // 첫 단계는 delay=0이더라도 약간의 지연 후 시작
  const firstDelay = scenario.steps[0]?.delay ?? 0;
  timeoutId = setTimeout(() => {
    executeStep(scenario, 0);
  }, firstDelay);
}

export function stopScenario() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  useScenarioRunnerStore.setState({
    running: false,
    scenarioId: null,
    currentStep: 0,
    totalSteps: 0,
  });
  useSimStore.getState().setScenario(null);
}
