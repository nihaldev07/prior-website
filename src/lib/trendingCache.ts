/**
 * Trending Search Cache Utilities
 * Manages localStorage caching for trending search data with SWR strategy
 */

export interface TrendingItem {
  query: string;
  frequency: number;
  growth: string;
  rank: number;
}

export interface TrendingCacheData {
  trending: TrendingItem[];
  cachedAt: string;
  expiresAt: string;
}

const CACHE_KEY = 'trending_searches_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached trending searches from localStorage
 */
export function getCachedTrending(): TrendingItem[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as TrendingCacheData;
    const now = Date.now();

    // Check if cache is still valid
    if (now < new Date(parsed.expiresAt).getTime()) {
      return parsed.trending;
    }

    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('[TrendingCache] Error reading cache:', error);
    return null;
  }
}

/**
 * Set cached trending searches in localStorage
 */
export function setCachedTrending(trending: TrendingItem[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION);

    const cacheData: TrendingCacheData = {
      trending,
      cachedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error('[TrendingCache] Error setting cache:', error);
    return false;
  }
}

/**
 * Check if cached data is stale and should be refreshed
 */
export function isCacheStale(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return true;

    const parsed = JSON.parse(cached) as TrendingCacheData;
    const cachedAt = new Date(parsed.cachedAt);
    const now = new Date();

    // Consider cache stale if it's older than 4 minutes (background refresh)
    const staleThreshold = 4 * 60 * 1000; // 4 minutes
    return now.getTime() - cachedAt.getTime() > staleThreshold;
  } catch (error) {
    console.error('[TrendingCache] Error checking staleness:', error);
    return true;
  }
}

/**
 * Clear cached trending data
 */
export function clearCachedTrending(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('[TrendingCache] Error clearing cache:', error);
  }
}

/**
 * Get cache age in seconds
 */
export function getCacheAge(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as TrendingCacheData;
    const cachedAt = new Date(parsed.cachedAt);
    const now = new Date();

    return Math.floor((now.getTime() - cachedAt.getTime()) / 1000);
  } catch (error) {
    console.error('[TrendingCache] Error getting cache age:', error);
    return null;
  }
}
