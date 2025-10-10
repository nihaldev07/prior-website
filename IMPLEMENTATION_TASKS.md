# Implementation Task List
## Based on Investigation Report - Prior Website

**Project:** Prior Website (Next.js E-commerce)
**Version:** 2.0.2
**Date:** 2025-10-10

---

## 🔴 CRITICAL TASKS (Fix Immediately - Blocking Production Issues)

### Task 1: Fix Aggressive Cache Headers
**Priority:** CRITICAL 🚨
**Impact:** Production-breaking - Users seeing stale data
**File:** `next.config.mjs`
**Effort:** 10 minutes

**Changes:**
```javascript
// REMOVE this:
headers: async () => [
  {
    source: "/(.*)",
    headers: [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ],
  },
],

// REPLACE with:
headers: async () => [
  {
    source: '/static/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  {
    source: '/_next/static/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
  {
    source: '/:path*',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ],
  },
],
```

**Verification:**
- [ ] Test dynamic pages update immediately
- [ ] Test cart updates reflect in real-time
- [ ] Test product price changes show correctly
- [ ] Deploy and verify in production

---

### Task 2: Remove SSR Disabled from ProductCard
**Priority:** CRITICAL 🚨
**Impact:** Main cause of scrolling stuttering
**File:** `src/components/pages/Home/products.tsx`
**Effort:** 15 minutes

**Changes:**
```typescript
// REMOVE this (lines 14-18):
const ProductCard = dynamic(() => import("@/shared/simpleProductCard"), {
  ssr: false,
  loading: () => <LoaderCircle className='w-5 h-5 text-black' />,
});

// REPLACE with:
import ProductCard from "@/shared/simpleProductCard";
```

**Verification:**
- [ ] Products render on server-side
- [ ] No loading spinner flashing
- [ ] Scroll is smooth
- [ ] Test with 100+ products
- [ ] Check Lighthouse score improvement

---

### Task 3: Fix Cart Context Mutation Bug
**Priority:** CRITICAL 🚨
**Impact:** Cart quantity updates may fail silently
**File:** `src/context/CartContext.tsx`
**Effort:** 20 minutes

**Changes:**
```typescript
// REPLACE entire addToCart function (lines 75-108):
const addToCart = (item: CartItem) => {
  trackEvent("add_to_cart", {
    item_id: item?.id,
    item_name: item?.name,
    price: item?.unitPrice,
    currency: "BDT",
  });

  setCart((prevCart) => {
    const existingIndex = prevCart.findIndex((itemY) => {
      if (itemY.id === item.id) {
        if (itemY.hasVariation && item?.hasVariation) {
          return itemY.variation?.id === item?.variation?.id;
        }
        return !itemY.hasVariation;
      }
      return false;
    });

    if (existingIndex !== -1) {
      // Create new array with updated item (immutable)
      return prevCart.map((itemX, idx) => {
        if (idx === existingIndex) {
          const newQuantity = itemX.quantity + 1;
          const totalPrice = itemX.unitPrice * newQuantity;
          const discount = (itemX.unitPrice - (itemX.updatedPrice ?? 0)) * newQuantity;

          return {
            ...itemX,
            quantity: newQuantity,
            totalPrice,
            discount,
          };
        }
        return itemX;
      });
    }

    // Add new item
    return [...prevCart, item];
  });
};
```

**Verification:**
- [ ] Add same product multiple times
- [ ] Verify quantity increments correctly
- [ ] Test with variations
- [ ] Test cart persistence after refresh
- [ ] Check cart total calculations

---

### Task 4: Add React.memo to ProductCard
**Priority:** CRITICAL 🚨
**Impact:** Prevents unnecessary re-renders causing stuttering
**File:** `src/shared/simpleProductCard.tsx`
**Effort:** 10 minutes

**Changes:**
```typescript
// At the end of file (replace export default):
// REMOVE:
export default ProductCard;

// REPLACE with:
export default React.memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.quantity === nextProps.product.quantity &&
    prevProps.product.updatedPrice === nextProps.product.updatedPrice
  );
});
```

**Verification:**
- [ ] Products don't re-render on scroll
- [ ] Products update when wishlist changes
- [ ] Products update when quantity changes
- [ ] Test React DevTools Profiler

---

### Task 5: Replace img with Next.js Image Component
**Priority:** CRITICAL 🚨
**Impact:** Large images causing layout shifts and slow loading
**File:** `src/shared/simpleProductCard.tsx`
**Effort:** 15 minutes

**Changes:**
```typescript
// Add import at top:
import Image from 'next/image';

// REPLACE <img> tag (lines 123-127):
<img
  alt={product?.name ?? "product"}
  src={product?.thumbnail ?? imagePlaceHolder}
  className='aspect-square w-full object-cover rounded-t-sm transition-transform duration-300 group-hover:scale-105 bg-gray-100'
/>

// REPLACE with:
<Image
  alt={product?.name || `${product?.id} product image`}
  src={product?.thumbnail || imagePlaceHolder}
  width={400}
  height={400}
  className='aspect-square w-full object-cover rounded-t-sm transition-transform duration-300 group-hover:scale-105 bg-gray-100'
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
/>
```

**Verification:**
- [ ] Images load progressively
- [ ] No layout shift on load
- [ ] Images optimized for different screen sizes
- [ ] Check WebP format is being used
- [ ] Test on slow 3G connection

---

### Task 6: Fix Scroll Restoration Timing
**Priority:** CRITICAL 🚨
**Impact:** Page jumps on navigation
**File:** `src/components/pages/Home/products.tsx`
**Effort:** 15 minutes

**Changes:**
```typescript
// REPLACE useEffect (lines 38-50):
useEffect(() => {
  // Restore scroll position
  window.scrollTo(0, state.scrollPosition);

  // Restore filter and pagination data
  //@ts-ignore
  setFilterData(state.filterData);
  if (state.currentPage > 1) {
    //@ts-ignore
    handleLoadMore(state.currentPage - 1);
  }
  //eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// REPLACE with:
useEffect(() => {
  // Restore filter data first
  if (state.filterData && Object.keys(state.filterData).length > 0) {
    setFilterData(state.filterData);
  }
}, []); // Run once on mount

useEffect(() => {
  // Only restore scroll after products are loaded
  if (products.length > 0 && state.scrollPosition > 0) {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: state.scrollPosition,
        behavior: 'instant'
      });
      // Clear the saved position to avoid repeated scrolling
      setState(prev => ({ ...prev, scrollPosition: 0 }));
    });
  }
}, [products.length]); // Depend on products being loaded
```

**Verification:**
- [ ] No page jump on navigation back
- [ ] Scroll position restored correctly
- [ ] Products loaded before scroll
- [ ] Test with different scroll positions

---

## 🟠 MAJOR TASKS (Fix Within 1 Week - Significant Impact)

### Task 7: Optimize Wishlist Context with Set
**Priority:** MAJOR
**Impact:** Improves performance with many products
**File:** `src/context/WishlistContext.tsx`
**Effort:** 30 minutes

**Changes:**
```typescript
// Add new state after wishlist state (after line 60):
const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set()); // ADD THIS
const [isLoading, setIsLoading] = useState(false);

// REPLACE isInWishlist function (line 240-242):
const isInWishlist = (itemId: string): boolean => {
  return wishlist.some((item) => item.id === itemId);
};

// REPLACE with:
const isInWishlist = useCallback((itemId: string): boolean => {
  return wishlistIds.has(itemId); // O(1) lookup instead of O(n)
}, [wishlistIds]);

// UPDATE loadWishlist function to also set wishlistIds:
const loadWishlist = async () => {
  if (!authState.token) return;

  setIsLoading(true);
  try {
    const response = await wishlistService.getWishlist(authState.token);

    if (response.success) {
      const items: WishlistItem[] = response.data.map(/* existing mapping */);
      setWishlist(items);
      setWishlistIds(new Set(items.map(item => item.id))); // ADD THIS
    }
  } catch (error) {
    console.error("Failed to load wishlist:", error);
    loadGuestWishlist();
  } finally {
    setIsLoading(false);
  }
};

// UPDATE addToWishlist to also update wishlistIds:
// After: setWishlist((prev) => [...prev, newItem]);
// ADD: setWishlistIds(prev => new Set(prev).add(item.id));

// UPDATE removeFromWishlist to also update wishlistIds:
// After: setWishlist((prev) => prev.filter((item) => item.id !== itemId));
// ADD: setWishlistIds(prev => {
//   const newSet = new Set(prev);
//   newSet.delete(itemId);
//   return newSet;
// });
```

**Verification:**
- [ ] Wishlist check is instant
- [ ] No performance degradation with 100+ products
- [ ] Add/remove still works correctly
- [ ] Test with React DevTools Profiler

---

### Task 8: Debounce LocalStorage Writes
**Priority:** MAJOR
**Impact:** Reduces main thread blocking
**File:** `src/context/CartContext.tsx`
**Effort:** 20 minutes

**Changes:**
```typescript
// Add imports at top:
import { useMemo, useCallback } from 'react';

// ADD this function before the useEffect (after line 68):
const debouncedSave = useMemo(() => {
  let timeoutId: NodeJS.Timeout;
  return (cartData: CartItem[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.setItem("cart", JSON.stringify(cartData));
    }, 500); // Save after 500ms of no changes
  };
}, []);

// REPLACE useEffect (lines 70-73):
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);

// REPLACE with:
useEffect(() => {
  debouncedSave(cart);
}, [cart, debouncedSave]);

// ADD cleanup on unmount:
useEffect(() => {
  return () => {
    // Save immediately on unmount
    localStorage.setItem("cart", JSON.stringify(cart));
  };
}, []);
```

**Verification:**
- [ ] Cart saves after 500ms
- [ ] Multiple rapid updates don't block
- [ ] Cart persists on page close
- [ ] No lost data on refresh

---

### Task 9: Memoize Intersection Observer Callback
**Priority:** MAJOR
**Impact:** Prevents observer recreation on every render
**File:** `src/components/pages/Home/products.tsx`
**Effort:** 15 minutes

**Changes:**
```typescript
// ADD import at top:
import { useCallback } from 'react';

// REPLACE handleLoadMore inline with useCallback (before IntersectionObserver useEffect):
const handleLoadMoreCallback = useCallback(() => {
  if (currentPage < totalPages && !loading) {
    handleLoadMore();
  }
}, [currentPage, totalPages, loading, handleLoadMore]);

// UPDATE IntersectionObserver useEffect (lines 64-84):
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        handleLoadMoreCallback(); // Use memoized callback
      }
    },
    {
      root: null,
      rootMargin: "100px", // Load earlier (was "0px")
      threshold: 0.1 // Lower threshold (was 1.0)
    }
  );

  if (observerRef.current) {
    observer.observe(observerRef.current);
  }

  return () => {
    if (observerRef.current) {
      observer.unobserve(observerRef.current);
    }
  };
}, [handleLoadMoreCallback]); // Only recreate when callback changes
```

**Verification:**
- [ ] Observer not recreated on scroll
- [ ] Pagination triggers earlier
- [ ] No duplicate API calls
- [ ] Test with fast scrolling

---

### Task 10: Split Context Providers (Optimize Re-renders)
**Priority:** MAJOR
**Impact:** Prevents unnecessary re-renders
**Files:** `src/context/CartContext.tsx`, `src/context/WishlistContext.tsx`
**Effort:** 45 minutes

**Changes for CartContext:**
```typescript
// CREATE two separate contexts:
const CartStateContext = createContext<CartItem[] | undefined>(undefined);
const CartActionsContext = createContext<CartActions | undefined>(undefined);

interface CartActions {
  addToCart: (item: CartItem) => void;
  updateToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

// UPDATE CartProvider:
export const CartProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(/* ... */);

  // Memoize actions to prevent recreation
  const actions = useMemo<CartActions>(() => ({
    addToCart,
    updateToCart,
    removeFromCart,
    clearCart,
  }), []); // Empty deps - functions are stable

  return (
    <CartStateContext.Provider value={cart}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
};

// CREATE two hooks:
export const useCartState = () => {
  const context = useContext(CartStateContext);
  if (!context) {
    throw new Error("useCartState must be used within CartProvider");
  }
  return context;
};

export const useCartActions = () => {
  const context = useContext(CartActionsContext);
  if (!context) {
    throw new Error("useCartActions must be used within CartProvider");
  }
  return context;
};

// KEEP old useCart for backward compatibility:
export const useCart = () => {
  return {
    cart: useCartState(),
    ...useCartActions(),
  };
};
```

**Same pattern for WishlistContext**

**Verification:**
- [ ] Components using only actions don't re-render on state change
- [ ] Components using only state don't re-render on action calls
- [ ] Existing code using useCart() still works
- [ ] Test with React DevTools Profiler

---

### Task 11: Add Loading and Error Boundaries
**Priority:** MAJOR
**Impact:** Better UX and error handling
**Files:** Create new files
**Effort:** 30 minutes

**Create `src/app/loading.tsx`:**
```typescript
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="w-12 h-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
```

**Create `src/app/error.tsx`:**
```typescript
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
```

**Create `src/app/collections/loading.tsx`:**
```typescript
export default function ProductsLoading() {
  return (
    <div className="px-3 lg:mx-20 mb-4">
      <div className="grid gap-3 sm:gap-3 md:gap-4 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-sm mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Verification:**
- [ ] Loading state shows during navigation
- [ ] Error boundary catches runtime errors
- [ ] Skeleton screens show during data loading
- [ ] Test error recovery

---

### Task 12: Add Environment Variables Configuration
**Priority:** MAJOR
**Impact:** Security and configuration management
**Files:** Create `.env.example`, update `src/lib/config.ts`
**Effort:** 20 minutes

**Create `.env.example`:**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://app.priorbd.com

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-T2HZLQ22

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT_WIDGET=true
```

**Update `src/lib/config.ts`:**
```typescript
// REPLACE line 1:
const hostName = "https://app.priorbd.com";

// REPLACE with:
const hostName = process.env.NEXT_PUBLIC_API_URL || "https://app.priorbd.com";
```

**Update `.gitignore`:**
```
# Environment variables
.env*.local
.env
```

**Create `.env.local`** (for development)

**Verification:**
- [ ] App works with env variables
- [ ] App works without env variables (fallback)
- [ ] .env files not committed to git
- [ ] Document all env vars in .env.example

---

### Task 13: Fix Throttle Hook Implementation
**Priority:** MAJOR
**Impact:** Removes artificial delays, improves responsiveness
**File:** `src/hooks/useThrottleEffect.tsx`
**Effort:** 25 minutes

**Changes:**
```typescript
// REPLACE entire file content:
import { useEffect, useRef } from "react";

/**
 * Properly implemented throttle hook
 * Ensures effect runs at most once per throttleTime period
 */
const useThrottledEffect = (
  effect: () => void,
  deps: any[],
  throttleTime: number
) => {
  const lastRan = useRef(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      const timeSinceLastRan = now - lastRan.current;

      if (timeSinceLastRan >= throttleTime) {
        // Enough time has passed, run immediately
        effect();
        lastRan.current = now;
      } else {
        // Schedule for later
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        const timeRemaining = throttleTime - timeSinceLastRan;
        timeoutId.current = setTimeout(() => {
          effect();
          lastRan.current = Date.now();
          timeoutId.current = null;
        }, timeRemaining);
      }
    };

    handler();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, deps);
};

export default useThrottledEffect;
```

**Update throttle delays in `useProductFetch.tsx`:**
```typescript
// Change throttle times from 1000ms to 300ms (lines 87, 101, 110):
useThrottledEffect(
  () => {
    fetchProducts();
  },
  [currentPage],
  300  // Reduced from 1000ms
);

useThrottledEffect(
  () => {
    changeCurrentpageToFetchProduct();
  },
  [filterData],
  300  // Reduced from 1000ms
);

useThrottledEffect(
  () => {
    fetchFilterData(filterData?.categoryId);
  },
  [filterData?.categoryId],
  300  // Reduced from 1000ms
);
```

**Verification:**
- [ ] Filters respond within 300ms
- [ ] No duplicate API calls
- [ ] Pagination feels responsive
- [ ] Test rapid filter changes

---

### Task 14: Remove Console.logs from Production
**Priority:** MAJOR
**Impact:** Security and performance
**Files:** Multiple service files
**Effort:** 15 minutes

**Update `next.config.mjs`:**
```javascript
module.exports = {
  // ... existing config
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}
```

**Remove specific console.logs:**

**File: `src/services/accountService.ts`** (line 116):
```typescript
// REMOVE this line:
console.log("User Orders Response:", data);
```

**Search for other console.logs:**
```bash
# Run this to find all console.logs:
grep -r "console.log" src/ --exclude-dir=node_modules
```

**Verification:**
- [ ] No console.logs in production build
- [ ] console.error and console.warn still work
- [ ] Check browser console in production

---

### Task 15: Add TypeScript Types for Filter
**Priority:** MAJOR
**Impact:** Better type safety and DX
**Files:** Create `src/types/filter.ts`, update components
**Effort:** 30 minutes

**Create `src/types/filter.ts`:**
```typescript
import { Category } from "@/data/types";

export interface FilterData {
  categoryId: string;
  color: string;
  size: string;
  price: string;
}

export interface FilterProps {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: FilterData;
  handleFilterChange: (filterData: FilterData) => void;
}

export interface ProductFetchParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  color?: string;
  size?: string;
  price?: string;
}
```

**Update `src/components/Filter.tsx`:**
```typescript
// REPLACE lines 9-15:
interface Props {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: any;  // ❌
  handleFilterChange: (filterData: any) => void;  // ❌
}

// REPLACE with:
import { FilterProps } from "@/types/filter";

const Filter: React.FC<FilterProps> = ({
  sizes,
  colors,
  categories,
  filterData,
  handleFilterChange,
}) => {
  // ... rest of component
```

**Update `src/hooks/useProductFetch.tsx`:**
```typescript
import { FilterData } from "@/types/filter";

const useProductFetch = (
  initialPage = 1,
  initialFilters: FilterData = {
    categoryId: "",
    color: "",
    size: "",
    price: ""
  }
) => {
  // ... rest of hook
```

**Update `src/components/pages/Home/products.tsx`:**
```typescript
// REMOVE //@ts-ignore comments (lines 43-44, 47):
// @ts-ignore  // ❌ REMOVE THIS
setFilterData(state.filterData);

// Just use:
setFilterData(state.filterData as FilterData);
```

**Verification:**
- [ ] No TypeScript errors
- [ ] Type autocomplete works
- [ ] No //@ts-ignore comments
- [ ] Run `npm run build` successfully

---

## 🟡 MINOR TASKS (Fix Within 2 Weeks - Quality Improvements)

### Task 16: Optimize Next.js Bundle
**Priority:** MINOR
**Impact:** Faster page loads
**File:** `next.config.mjs`
**Effort:** 15 minutes

**Changes:**
```javascript
module.exports = {
  // ... existing config

  swcMinify: true, // Use faster SWC minifier

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'framer-motion',
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}
```

**Verification:**
- [ ] Run `npm run build`
- [ ] Check bundle size reduced
- [ ] Test all Radix UI components work
- [ ] Verify no runtime errors

---

### Task 17: Add Request Caching Utility
**Priority:** MINOR
**Impact:** Reduces duplicate API calls
**Files:** Create `src/lib/api-cache.ts`
**Effort:** 40 minutes

**Create `src/lib/api-cache.ts`:**
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  async fetch<T>(
    url: string,
    options: RequestInit = {},
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cacheKey = `${url}${JSON.stringify(options)}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    // Check if request is pending
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Make new request
    const promise = fetch(url, options)
      .then(res => res.json())
      .then(data => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        this.pendingRequests.delete(cacheKey);
        return data as T;
      })
      .catch(err => {
        this.pendingRequests.delete(cacheKey);
        throw err;
      });

    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }

  invalidate(pattern: string) {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export const apiCache = new APICache();
```

**Update `src/services/productServices.ts`:**
```typescript
import { apiCache } from '@/lib/api-cache';

export const fetchProductById = async (
  productId: string
): Promise<SingleProductType | null> => {
  try {
    const productData = await apiCache.fetch(
      config.product.getProductById(productId),
      { next: { revalidate: 30 } },
      30000 // 30 second cache
    );
    return productData.product as SingleProductType;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
```

**Verification:**
- [ ] Duplicate requests return cached data
- [ ] Cache expires after TTL
- [ ] Invalidation works
- [ ] No stale data issues

---

### Task 18: Improve Product Service Error Handling
**Priority:** MINOR
**Impact:** Better error recovery
**File:** `src/services/productServices.ts`
**Effort:** 30 minutes

**Changes:**
```typescript
// Create error classes first
class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Update fetchProductById with retry logic:
export const fetchProductById = async (
  productId: string,
  retries = 3
): Promise<SingleProductType | null> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        config.product.getProductById(productId),
        { next: { revalidate: 30 } }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Don't retry on 404
          return null;
        }
        throw new APIError(
          response.status,
          `Failed to fetch product: ${response.statusText}`
        );
      }

      const productData = await response.json();
      return productData.product as SingleProductType;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof APIError && error.status === 404) {
        // Don't retry 404s
        return null;
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries - 1) {
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  console.error(`Failed to fetch product after ${retries} attempts:`, lastError);
  return null;
};
```

**Apply same pattern to other service functions**

**Verification:**
- [ ] Retries on network failure
- [ ] Doesn't retry on 404
- [ ] Exponential backoff works
- [ ] Errors logged properly

---

### Task 19: Add SEO Metadata Generation
**Priority:** MINOR
**Impact:** Better SEO
**File:** `src/app/collections/[collectionId]/page.tsx`
**Effort:** 25 minutes

**Changes:**
```typescript
import { Metadata } from 'next';
import { fetchProductById } from '@/services/productServices';

export async function generateMetadata({
  params,
}: {
  params: { collectionId: string };
}): Promise<Metadata> {
  const product = await fetchProductById(params.collectionId);

  if (!product) {
    return {
      title: 'Product Not Found | Prior',
    };
  }

  const price = product.updatedPrice || product.unitPrice;

  return {
    title: `${product.name} | Prior`,
    description: product.description || `Buy ${product.name} at Prior`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.thumbnail,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.thumbnail],
    },
    alternates: {
      canonical: `/collections/${params.collectionId}`,
    },
  };
}

// Add JSON-LD structured data
export default async function ProductPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const product = await fetchProductById(params.collectionId);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name,
    image: product?.thumbnail,
    description: product?.description,
    offers: {
      '@type': 'Offer',
      price: product?.updatedPrice || product?.unitPrice,
      priceCurrency: 'BDT',
      availability: product?.quantity
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Rest of page */}
    </>
  );
}
```

**Verification:**
- [ ] Check meta tags in page source
- [ ] Test with Google Rich Results Test
- [ ] Validate OpenGraph with Facebook Debugger
- [ ] Check Twitter Card validator

---

### Task 20: Add Accessibility Improvements
**Priority:** MINOR
**Impact:** Better accessibility
**Files:** Multiple component files
**Effort:** 45 minutes

**Update `src/components/pages/Home/products.tsx`:**
```typescript
// Add ARIA live region for loading state:
{loading && (
  <div
    className='w-full p-12 bg-gray-200 flex justify-center items-center'
    role="status"
    aria-live="polite"
    aria-label="Loading more products"
  >
    <span className='flex justify-center items-center gap-2 text-black'>
      Loading... <LoaderCircle className='w-5 h-5 ml-2 text-black' />
    </span>
  </div>
)}

// Add ARIA label to product grid:
<div
  className='grid gap-3 sm:gap-3 md:gap-4 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:container'
  role="list"
  aria-label="Product list"
>
  {!!products &&
    products?.map((product: ProductType) => (
      <div
        key={product?.id}
        role="listitem"
        onClick={() => handleProductClick(product.id)}>
        <ProductCard product={product} />
      </div>
    ))}
</div>
```

**Update `src/shared/simpleProductCard.tsx`:**
```typescript
// Better alt text for images:
alt={product?.name || `Product ${product?.id}`}

// Add aria-label to wishlist button:
<Button
  variant='ghost'
  size='sm'
  onClick={handleWishlistClick}
  disabled={isAddingToWishlist || isLoading}
  aria-label={
    isInUserWishlist
      ? `Remove ${product.name} from wishlist`
      : `Add ${product.name} to wishlist`
  }
  className={/* ... */}
>
  <Heart className={/* ... */} />
</Button>

// Add aria-label to product link:
<a
  href={`/collections/${product?.slug}`}
  className='block'
  aria-label={`View details for ${product.name}`}
>
  <span aria-hidden='true' className='absolute inset-0' />
  {product.name}
</a>
```

**Update `src/components/Filter.tsx`:**
```typescript
// Add labels to selects:
<Select
  sizeClass='h-12'
  className='text-center sm:text-left sm:pl-2'
  value={filterData?.categoryId}
  onChange={(e) => {
    handleFilterChange({ ...filterData, categoryId: e.target.value });
  }}
  aria-label="Filter by category"
>
  <option value=''>All Category</option>
  {/* ... */}
</Select>
```

**Verification:**
- [ ] Test with screen reader
- [ ] Check keyboard navigation
- [ ] Run Lighthouse accessibility audit
- [ ] Test with axe DevTools

---

### Task 21: Improve Product Fetch Hook Dependencies
**Priority:** MINOR
**Impact:** Prevents stale closures
**File:** `src/hooks/useProductFetch.tsx`
**Effort:** 20 minutes

**Changes:**
```typescript
// REMOVE eslint-disable comments and fix dependencies:

// Line 81-88 - Fix dependencies:
useThrottledEffect(
  () => {
    fetchProducts();
  },
  [currentPage, filterData, limit], // ADD missing deps
  300
);

// Make fetchProducts stable with useCallback:
const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axios.get(config.product.getProducts(), {
      params: {
        page: currentPage,
        limit,
        ...filterData,
      },
    });
    if (response?.status < 300) {
      setProducts(
        currentPage > 1
          ? [...products, ...response.data.products]
          : response.data.products
      );
      setTotalPages(Math.ceil(response.data.totalProducts / limit));
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
}, [currentPage, limit, filterData]); // Proper deps
```

**Verification:**
- [ ] No ESLint warnings
- [ ] No stale closure bugs
- [ ] Filters work correctly
- [ ] Pagination works correctly

---

### Task 22: Add Performance Monitoring
**Priority:** MINOR
**Impact:** Track performance metrics
**Files:** Create `src/lib/performance.ts`, update components
**Effort:** 30 minutes

**Create `src/lib/performance.ts`:**
```typescript
export function measurePerformance(metricName: string) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();

  return {
    end: () => {
      const duration = performance.now() - startTime;

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${metricName}: ${duration.toFixed(2)}ms`);
      }

      // Send to analytics in production
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          name: metricName,
          value: Math.round(duration),
          event_category: 'Performance',
        });
      }

      return duration;
    },
  };
}

// Web Vitals reporting
export function reportWebVitals(metric: any) {
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      non_interaction: true,
    });
  }
}
```

**Update `src/hooks/useProductFetch.tsx`:**
```typescript
import { measurePerformance } from '@/lib/performance';

const fetchProducts = async () => {
  const perf = measurePerformance('Product Fetch');

  try {
    setLoading(true);
    const response = await axios.get(config.product.getProducts(), {
      params: { page: currentPage, limit, ...filterData },
    });

    if (response?.status < 300) {
      setProducts(/* ... */);
      setTotalPages(/* ... */);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
    perf.end();
  }
};
```

**Verification:**
- [ ] Performance metrics logged in dev
- [ ] Metrics sent to GTM in production
- [ ] Check Google Analytics events
- [ ] Monitor slow API calls

---

### Task 23: Add Product List Virtualization (Optional Advanced)
**Priority:** MINOR
**Impact:** Handle 1000+ products smoothly
**Files:** `src/components/pages/Home/products.tsx`
**Effort:** 90 minutes

**Install dependency:**
```bash
npm install react-window react-window-infinite-loader
```

**Update `src/components/pages/Home/products.tsx`:**
```typescript
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Inside SectionProducts component:
const COLUMN_COUNT = 4;
const ROW_HEIGHT = 450;
const COLUMN_WIDTH = 300;

const Cell = ({ columnIndex, rowIndex, style }: any) => {
  const index = rowIndex * COLUMN_COUNT + columnIndex;

  if (index >= products.length) {
    return null;
  }

  const product = products[index];

  return (
    <div style={style} className="p-2">
      <div onClick={() => handleProductClick(product.id)}>
        <ProductCard product={product} />
      </div>
    </div>
  );
};

return (
  <div className='px-3 lg:mx-20 mb-4'>
    <Heading isCenter isMain desc={productsSection.description}>
      {productsSection.heading}
    </Heading>

    <Filter {/* ... */} />

    <div style={{ height: '800px' }}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnCount={COLUMN_COUNT}
            columnWidth={width / COLUMN_COUNT}
            height={height}
            rowCount={Math.ceil(products.length / COLUMN_COUNT)}
            rowHeight={ROW_HEIGHT}
            width={width}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
    </div>

    {/* Keep IntersectionObserver for infinite scroll */}
  </div>
);
```

**Note:** This is optional and more complex. Only implement if handling 500+ products.

**Verification:**
- [ ] Smooth scrolling with 1000+ products
- [ ] Only visible items rendered
- [ ] Infinite scroll still works
- [ ] Test on mobile devices

---

### Task 24: Update Image Optimization Config
**Priority:** MINOR
**Impact:** Better image loading
**File:** `next.config.mjs`
**Effort:** 10 minutes

**Changes:**
```javascript
module.exports = {
  images: {
    remotePatterns: [/* ... existing ... */],
    deviceSizes: [320, 420, 768, 1024, 1200], // Keep existing
    formats: ['image/avif', 'image/webp'], // ADD THIS
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // ... rest of config
}
```

**Verification:**
- [ ] Images serve in AVIF/WebP
- [ ] SVG images work
- [ ] Check Network tab for format
- [ ] Test on different browsers

---

### Task 25: Add .editorconfig for Consistency
**Priority:** MINOR
**Impact:** Code consistency across team
**Files:** Create `.editorconfig`
**Effort:** 5 minutes

**Create `.editorconfig`:**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2

[*.ts{,x}]
indent_size = 2
```

**Verification:**
- [ ] Editor respects settings
- [ ] Team members install EditorConfig plugin
- [ ] Consistent formatting across files

---

## Summary Checklist

### Critical (Do Immediately)
- [ ] Task 1: Fix cache headers
- [ ] Task 2: Remove SSR disabled from ProductCard
- [ ] Task 3: Fix cart mutation bug
- [ ] Task 4: Add React.memo to ProductCard
- [ ] Task 5: Replace img with Image component
- [ ] Task 6: Fix scroll restoration

### Major (Complete in Week 1-2)
- [ ] Task 7: Optimize wishlist with Set
- [ ] Task 8: Debounce localStorage writes
- [ ] Task 9: Memoize intersection observer
- [ ] Task 10: Split context providers
- [ ] Task 11: Add loading/error boundaries
- [ ] Task 12: Add environment variables
- [ ] Task 13: Fix throttle implementation
- [ ] Task 14: Remove console.logs
- [ ] Task 15: Add TypeScript types

### Minor (Complete in Week 3-4)
- [ ] Task 16: Optimize bundle
- [ ] Task 17: Add request caching
- [ ] Task 18: Improve error handling
- [ ] Task 19: Add SEO metadata
- [ ] Task 20: Accessibility improvements
- [ ] Task 21: Fix hook dependencies
- [ ] Task 22: Add performance monitoring
- [ ] Task 23: Add virtualization (optional)
- [ ] Task 24: Image optimization config
- [ ] Task 25: Add .editorconfig

---

## Testing Protocol

After each task:
1. **Local Testing:** Test functionality locally
2. **Build Test:** Run `npm run build` successfully
3. **Type Check:** Run `npm run type-check` (if available)
4. **Visual Test:** Check UI for regressions
5. **Performance:** Test scroll performance
6. **Mobile:** Test on mobile device/emulator

After completing all critical tasks:
1. Run Lighthouse audit
2. Test on production-like environment
3. Load test with heavy traffic simulation
4. Monitor performance metrics

---

## Estimated Timeline

- **Critical Tasks:** 2-3 hours (do in one session)
- **Major Tasks:** 6-8 hours (spread over 1 week)
- **Minor Tasks:** 5-7 hours (spread over 2 weeks)

**Total:** ~15-20 hours of focused development work

---

## Notes

- Test each task before moving to the next
- Commit after each completed task
- Create feature branch for changes
- Review with team before deploying critical fixes
- Monitor production metrics after deployment

---

**Created:** 2025-10-10
**Based on:** INVESTIGATION_REPORT.md
**Priority Order:** Critical → Major → Minor
