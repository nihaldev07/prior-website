/**
 * Trending Searches Hook
 * Fetches and caches trending search queries with SWR strategy
 */

import { useState, useEffect, useCallback } from "react";
import {
  getCachedTrending,
  setCachedTrending,
  isCacheStale,
} from "@/lib/trendingCache";

export interface TrendingItem {
  query: string;
  frequency: number;
  growth: string;
  rank: number;
  successRate?: number;
  calculatedAt?: string;
}

interface TrendingResponse {
  success: boolean;
  data: TrendingItem[];
  meta?: {
    source: string;
    cachedAt: string;
    cacheExpiresIn: number;
    period: string;
  };
}

interface UseTrendingSearchesResult {
  trending: TrendingItem[];
  loading: boolean;
  error: string | null;
  source: string;
  refresh: () => Promise<void>;
}

const STATIC_FALLBACK: TrendingItem[] = [
  // { query: "Baby rompers", frequency: 0, growth: "+0%", rank: 1 },
  // { query: "Feeding bottles", frequency: 0, growth: "+0%", rank: 2 },
  // { query: "Diaper bags", frequency: 0, growth: "+0%", rank: 3 },
  // { query: "Soft toys", frequency: 0, growth: "+0%", rank: 4 },
  // { query: "Nursing covers", frequency: 0, growth: "+0%", rank: 5 },
  // { query: "Baby shoes", frequency: 0, growth: "+0%", rank: 6 },
  // { query: "Strollers", frequency: 0, growth: "+0%", rank: 7 },
  // { query: "Baby monitors", frequency: 0, growth: "+0%", rank: 8 },
];

export function useTrendingSearches(): UseTrendingSearchesResult {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>("initial");

  // Fetch trending searches from API
  const fetchTrending = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://shop.priorbd.com";
      const refreshParam = forceRefresh ? "?refresh=true" : "";
      const response = await fetch(
        `${API_URL}/prior/search/trending${refreshParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TrendingResponse = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        setTrending(result.data);
        setSource(result.meta?.source || "api");
        setCachedTrending(result.data);
      } else {
        // Use cached data if API returns empty
        const cached = getCachedTrending();
        if (cached) {
          setTrending(cached);
          setSource("cache_fallback");
        } else {
          setTrending(STATIC_FALLBACK);
          setSource("static_fallback");
        }
      }
    } catch (err) {
      console.error("[useTrendingSearches] Error fetching trending:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch trending searches",
      );

      // Try to use cached data on error
      const cached = getCachedTrending();
      if (cached) {
        setTrending(cached);
        setSource("cache_fallback");
      } else {
        setTrending(STATIC_FALLBACK);
        setSource("static_fallback");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchTrending(true);
  }, [fetchTrending]);

  useEffect(() => {
    // SWR Strategy: Show cached data immediately, then refresh in background
    const cached = getCachedTrending();
    const shouldRefreshInBackground = isCacheStale();

    if (cached) {
      setTrending(cached);
      setSource("cache");
      setLoading(false);
    }

    // Fetch fresh data (either immediately if no cache, or in background if stale)
    if (!cached || shouldRefreshInBackground) {
      fetchTrending(false);
    }

    // Set up auto-refresh interval (every 5 minutes)
    const intervalId = setInterval(
      () => {
        fetchTrending(false);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchTrending]);

  return {
    trending,
    loading,
    error,
    source,
    refresh,
  };
}
