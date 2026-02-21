import type { ReactNode } from 'react';

interface Tab {
  key: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-[var(--color-border)]">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-[var(--color-plc-to-smc)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {tab.icon}
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-[var(--color-plc-to-smc)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
