'use client';

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'aqarsearch_viewed';

/**
 * Hook to track and check which properties the user has viewed.
 * Works with localStorage for all users (no account needed).
 * For authenticated users, also syncs with server via viewed_properties table.
 */
export function useViewedProperties(serverViewedIds?: string[]) {
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const localIds: string[] = stored ? JSON.parse(stored) : [];
      // Merge server + local
      const merged = new Set([...localIds, ...(serverViewedIds ?? [])]);
      setViewedIds(merged);
    } catch {
      setViewedIds(new Set(serverViewedIds ?? []));
    }
  }, [serverViewedIds]);

  const markAsViewed = useCallback((propertyId: string) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(propertyId);
      // Persist to localStorage (keep last 500)
      try {
        const arr = Array.from(next).slice(-500);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      } catch {
        // localStorage full or unavailable
      }
      return next;
    });
  }, []);

  const isViewed = useCallback(
    (propertyId: string) => viewedIds.has(propertyId),
    [viewedIds]
  );

  return { viewedIds, isViewed, markAsViewed };
}
