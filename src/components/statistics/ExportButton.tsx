import { Download } from 'lucide-react';
import { useLogStore } from '../../stores/useLogStore';
import { useToastStore } from '../../stores/useToastStore';

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton() {
  const exportLogs = useLogStore((s) => s.exportLogs);

  const handleExportCsv = () => {
    const csv = exportLogs('csv');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(csv, `telegram-logs-${timestamp}.csv`, 'text/csv');
    useToastStore.getState().addToast('CSV 파일 내보내기 완료');
  };

  const handleExportJson = () => {
    const json = exportLogs('json');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(json, `telegram-logs-${timestamp}.json`, 'application/json');
    useToastStore.getState().addToast('JSON 파일 내보내기 완료');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportCsv}
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-card)]"
      >
        <Download className="h-3.5 w-3.5" />
        CSV 내보내기
      </button>
      <button
        onClick={handleExportJson}
        className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-card)]"
      >
        <Download className="h-3.5 w-3.5" />
        JSON 내보내기
      </button>
    </div>
  );
}
