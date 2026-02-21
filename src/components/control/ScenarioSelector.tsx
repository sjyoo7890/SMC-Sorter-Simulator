import { PlayCircle, StopCircle, ListOrdered, Clock } from 'lucide-react';
import { allScenarios } from '../../core/simulator/scenarios';
import { startScenario, stopScenario, useScenarioRunnerStore } from '../../core/simulator/scenarioRunner';

function getTotalDuration(steps: { delay: number }[]): number {
  return steps.reduce((sum, s) => sum + s.delay, 0);
}

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}초` : `${Math.floor(s / 60)}분 ${s % 60}초`;
}

export default function ScenarioSelector() {
  const { running, scenarioId, currentStep, totalSteps } = useScenarioRunnerStore();

  return (
    <div className="mb-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="border-b border-[var(--color-border)] px-4 py-2.5">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          사전 정의 시나리오
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3">
        {allScenarios.map((scenario) => {
          const isActive = running && scenarioId === scenario.id;
          const duration = getTotalDuration(scenario.steps);

          return (
            <div
              key={scenario.id}
              className={`rounded-lg border p-3 transition-colors ${
                isActive
                  ? 'border-[var(--color-plc-to-smc)] bg-[var(--color-plc-to-smc)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-text-secondary)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      {scenario.nameKo}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">
                      {scenario.name}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-[var(--color-text-secondary)]">
                    {scenario.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-[var(--color-text-secondary)]">
                    <span className="flex items-center gap-1">
                      <ListOrdered className="h-3 w-3" />
                      {scenario.steps.length}단계
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(duration)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isActive ? (
                    <button
                      onClick={stopScenario}
                      className="flex items-center gap-1 rounded-md bg-[var(--color-error)] px-2.5 py-1 text-[10px] font-medium text-white transition-colors hover:bg-red-600"
                    >
                      <StopCircle className="h-3 w-3" />
                      중단
                    </button>
                  ) : (
                    <button
                      onClick={() => startScenario(scenario)}
                      disabled={running}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        running
                          ? 'cursor-not-allowed bg-[var(--color-bg-card)] text-[var(--color-text-secondary)]'
                          : 'bg-[var(--color-plc-to-smc)] text-white hover:bg-blue-600'
                      }`}
                    >
                      <PlayCircle className="h-3 w-3" />
                      실행
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {isActive && totalSteps > 0 && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="text-[var(--color-plc-to-smc)]">
                      진행 중... {currentStep}/{totalSteps}
                    </span>
                    <span className="text-[var(--color-text-secondary)]">
                      {Math.round((currentStep / totalSteps) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-card)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-plc-to-smc)] transition-all duration-300"
                      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
