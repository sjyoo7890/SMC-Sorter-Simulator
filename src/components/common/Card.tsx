import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
  dotColor?: string;
}

export default function Card({ title, children, className = '', headerRight, dotColor }: CardProps) {
  return (
    <div className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] ${className}`}>
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {dotColor && (
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: dotColor }}
            />
          )}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            {title}
          </h3>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      {/* Body */}
      <div className="p-4">{children}</div>
    </div>
  );
}
