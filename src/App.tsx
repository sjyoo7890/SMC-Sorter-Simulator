import { useState, useEffect, useCallback } from 'react';
import { Activity, Play, Square, Clock } from 'lucide-react';
import TimelinePanel from './components/timeline/TimelinePanel';
import DashboardPanel from './components/dashboard/DashboardPanel';
import PacketAnalyzer from './components/packet/PacketAnalyzer';
import ControlPanel from './components/control/ControlPanel';
import StatisticsPanel from './components/statistics/StatisticsPanel';
import ToastContainer from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import StatusIndicator from './components/common/StatusIndicator';
import { useLogStore } from './stores/useLogStore';
import { useSystemStore } from './stores/useSystemStore';
import { useToastStore } from './stores/useToastStore';
import { useSimulation } from './hooks/useSimulation';
import { allScenarios } from './core/simulator/scenarios';
import { startScenario } from './core/simulator/scenarioRunner';

const speedOptions = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 5, label: '5x' },
];

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function App() {
  const [activeTab, setActiveTab] = useState<'control' | 'statistics'>('control');
  const { isRunning, speed, elapsedTime, toggle, setSpeed } = useSimulation();
  const heartbeatActive = useSystemStore((s) => s.heartbeat.active);

  // CSV 내보내기 함수 (키보드 단축키용)
  const handleExportCsv = useCallback(() => {
    const csv = useLogStore.getState().exportLogs('csv');
    const ts = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telegram-logs-${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    useToastStore.getState().addToast('CSV 파일 내보내기 완료');
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // input/select/textarea 내에서는 무시
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      // Space: 시뮬레이션 토글
      if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggle();
        return;
      }

      // Ctrl+L: 로그 초기화
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        useLogStore.getState().clearLogs();
        useToastStore.getState().addToast('로그 초기화됨', 'info');
        return;
      }

      // Ctrl+E: CSV 내보내기
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportCsv();
        return;
      }

      // ↑/↓: 타임라인 이전/다음 로그 선택
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        const { logs, selectedLogId, selectLog } = useLogStore.getState();
        if (logs.length === 0) return;

        if (!selectedLogId) {
          selectLog(logs[0].id);
          return;
        }

        const currentIndex = logs.findIndex((l) => l.id === selectedLogId);
        if (currentIndex === -1) {
          selectLog(logs[0].id);
          return;
        }

        const nextIndex = e.code === 'ArrowUp'
          ? Math.max(0, currentIndex - 1)
          : Math.min(logs.length - 1, currentIndex + 1);
        selectLog(logs[nextIndex].id);
        return;
      }

      // 1~5: 시나리오 빠른 실행
      if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
        const index = Number(e.key) - 1;
        if (index < allScenarios.length) {
          startScenario(allScenarios[index]);
          useToastStore.getState().addToast(
            `시나리오 "${allScenarios[index].nameKo}" 시작`,
            'info',
          );
        }
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, handleExportCsv]);

  const connectionStatus = isRunning && heartbeatActive ? 'online'
    : isRunning ? 'error'
    : 'offline';

  const connectionLabel = isRunning && heartbeatActive ? 'Connected'
    : isRunning ? 'No HeartBeat'
    : 'Disconnected';

  return (
    <div className="flex h-screen min-w-[1024px] flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-3">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Activity className="h-5 w-5 text-[var(--color-plc-to-smc)]" />
          <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
            SMC-Sorter PLC Interface Simulator
          </h1>
        </div>

        {/* Center: Connection Status */}
        <StatusIndicator status={connectionStatus} label={connectionLabel} />

        {/* Right: Simulation Controls */}
        <div className="flex items-center gap-4">
          {/* Elapsed Time */}
          {(isRunning || elapsedTime > 0) && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-mono">{formatElapsed(elapsedTime)}</span>
            </div>
          )}

          {/* Speed Selector */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
          >
            {speedOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Simulation Toggle */}
          <button
            onClick={toggle}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              isRunning
                ? 'bg-[var(--color-error)] text-white hover:bg-red-600'
                : 'bg-[var(--color-success)] text-white hover:bg-emerald-600'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="h-3.5 w-3.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Start
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Timeline Panel — responsive width */}
        <div className="w-[35%] min-w-0 border-r border-[var(--color-border)] p-3 xl:w-[40%]">
          <ErrorBoundary fallbackTitle="타임라인 오류">
            <TimelinePanel />
          </ErrorBoundary>
        </div>

        {/* Right: Dashboard + Packet + Control/Stats */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          {/* Status Dashboard */}
          <ErrorBoundary fallbackTitle="대시보드 오류">
            <DashboardPanel />
          </ErrorBoundary>

          {/* Packet Analyzer */}
          <ErrorBoundary fallbackTitle="패킷 분석기 오류">
            <PacketAnalyzer />
          </ErrorBoundary>

          {/* Control / Statistics Tab */}
          <div>
            <div className="mb-3 flex gap-1">
              <button
                onClick={() => setActiveTab('control')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === 'control'
                    ? 'bg-[var(--color-plc-to-smc)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Control
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === 'statistics'
                    ? 'bg-[var(--color-plc-to-smc)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Statistics
              </button>
            </div>
            <ErrorBoundary fallbackTitle="패널 오류">
              {activeTab === 'control' ? <ControlPanel /> : <StatisticsPanel />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
