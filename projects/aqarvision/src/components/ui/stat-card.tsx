import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-caption uppercase tracking-wide text-neutral-500">{label}</span>
        {Icon && <Icon className="h-5 w-5 text-neutral-400" />}
      </div>

      <span className="font-mono text-heading-lg text-neutral-900">{value}</span>

      {trend && (
        <div className={['flex items-center gap-1 text-body-sm', isPositive ? 'text-success-600' : 'text-error-600'].join(' ')}>
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span>
            {isPositive ? '+' : ''}{trend.value}%
            {trend.label && <span className="text-neutral-500 ml-1">{trend.label}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
