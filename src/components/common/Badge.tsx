import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  error:   'bg-red-500/15 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  info:    'bg-blue-500/15 text-blue-400 border-blue-500/30',
  neutral: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-emerald-400',
  error:   'bg-red-400',
  warning: 'bg-amber-400',
  info:    'bg-blue-400',
  neutral: 'bg-gray-400',
};

export default function Badge({ variant, children, dot, size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeClass}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotColors[variant]}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
