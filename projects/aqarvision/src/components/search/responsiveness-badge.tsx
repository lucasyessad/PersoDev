import { Zap } from 'lucide-react';
import type { ResponsivenessLevel } from '@/types/database';

interface ResponsivenessBadgeProps {
  level: ResponsivenessLevel;
  locale?: 'fr' | 'ar' | 'en';
}

const labels = {
  fr: { fast: 'Répond rapidement', moderate: 'Répond en quelques heures' },
  ar: { fast: 'يرد بسرعة', moderate: 'يرد في غضون ساعات' },
  en: { fast: 'Responds quickly', moderate: 'Responds in a few hours' },
} as const;

export function ResponsivenessBadge({ level, locale = 'fr' }: ResponsivenessBadgeProps) {
  if (level !== 'fast' && level !== 'moderate') return null;

  const label = labels[locale][level];
  const colorClass = level === 'fast'
    ? 'bg-blue-50 text-blue-700'
    : 'bg-gray-50 text-gray-600';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${colorClass}`}>
      <Zap className="h-2.5 w-2.5" />
      {label}
    </span>
  );
}
