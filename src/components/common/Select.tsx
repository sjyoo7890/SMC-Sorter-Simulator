import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({ options, value, onChange, placeholder, className = '' }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 pr-8 text-sm text-[var(--color-text-primary)] outline-none transition-colors hover:border-[var(--color-plc-to-smc)]/50 focus:border-[var(--color-plc-to-smc)] focus:ring-1 focus:ring-[var(--color-plc-to-smc)]/30"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
    </div>
  );
}
