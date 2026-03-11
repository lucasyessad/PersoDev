import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
}

export function Skeleton({ variant = 'rect', width, height, className = '', style, ...props }: SkeletonProps) {
  return (
    <div
      className={[
        'skeleton',
        variant === 'circle' ? 'rounded-full' : 'rounded-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

/* Pre-built skeleton cards */

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200">
      <Skeleton className="w-full aspect-[4/3]" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-neutral-200">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
