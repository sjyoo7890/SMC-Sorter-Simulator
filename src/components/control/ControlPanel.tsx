import { useState } from 'react';
import { Send, Radio } from 'lucide-react';
import ScenarioSelector from './ScenarioSelector';
import SorterControlForm from './SorterControlForm';
import InductionControlForm from './InductionControlForm';
import InductionModeForm from './InductionModeForm';
import OverflowConfigForm from './OverflowConfigForm';
import ResetRequestForm from './ResetRequestForm';
import DestinationRequestForm from './DestinationRequestForm';
import ManualItemInductedForm from './ManualItemInductedForm';
import ManualItemDischargedForm from './ManualItemDischargedForm';
import ManualSorterStatusForm from './ManualSorterStatusForm';
import ManualInductionStatusForm from './ManualInductionStatusForm';

type Tab = 'smc_to_plc' | 'plc_to_smc';

export default function ControlPanel() {
  const [tab, setTab] = useState<Tab>('smc_to_plc');

  return (
    <div>
      <ScenarioSelector />

      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="flex items-center gap-1 border-b border-[var(--color-border)] px-4 py-2">
        <button
          onClick={() => setTab('smc_to_plc')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'smc_to_plc'
              ? 'bg-[var(--color-plc-to-smc)] text-white'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Send className="h-3 w-3" />
          SMC → PLC 제어
        </button>
        <button
          onClick={() => setTab('plc_to_smc')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            tab === 'plc_to_smc'
              ? 'bg-[var(--color-smc-to-plc)] text-white'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Radio className="h-3 w-3" />
          PLC → SMC 수동 전송
        </button>
      </div>

      <div className="p-4">
        {tab === 'smc_to_plc' ? (
          <div className="grid grid-cols-2 gap-3">
            <SorterControlForm />
            <InductionControlForm />
            <InductionModeForm />
            <OverflowConfigForm />
            <ResetRequestForm />
            <DestinationRequestForm />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ManualItemInductedForm />
            <ManualItemDischargedForm />
            <ManualSorterStatusForm />
            <ManualInductionStatusForm />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
