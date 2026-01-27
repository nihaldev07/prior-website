# Migration Plan: From Current Next.js to New React UI

## Executive Summary

This document outlines the strategy to migrate the Prior e-commerce website from its current Next.js 14 implementation to integrate the new React UI design from the women-fashion-ecommerce project while maintaining all existing business logic, API integrations, and data flows.

**Timeline Estimate**: 4-6 weeks
**Risk Level**: Medium
**Recommended Approach**: Incremental component-by-component migration

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Target State Analysis](#target-state-analysis)
3. [Key Differences](#key-differences)
4. [Migration Strategy](#migration-strategy)
5. [Component Mapping](#component-mapping)
6. [State Management Migration](#state-management-migration)
7. [API Integration Plan](#api-integration-plan)
8. [Routing Strategy](#routing-strategy)
9. [Styling Migration](#styling-migration)
10. [Implementation Phases](#implementation-phases)
11. [Risk Assessment](#risk-assessment)
12. [Testing Strategy](#testing-strategy)

---

## Current State Analysis

### Technology Stack (Prior Website)
- **Framework**: Next.js 14.2.5 (App Router)
- **React**: 18.2.0
- **State Management**: React Context API (Cart, Auth, Wishlist, PageState)
- **Styling**: Tailwind CSS + shadcn/ui
- **UI Library**: Radix UI primitives
- **Icons**: Lucide React
- **Routing**: Next.js App Router with SSR/ISR
- **Data Fetching**: Axios + Next.js fetch with caching
- **Authentication**: JWT with refresh tokens
- **Analytics**: Firebase Analytics, Google Tag Manager
- **Payment**: bKash integration

### Key Features
1. Server-side rendering with ISR
2. Request deduplication system
3. District-based delivery pricing
4. Campaign prepayment system
5. Product variation support (size/color)
6. Wishlist with API sync
7. Real-time search with debouncing
8. Infinite scroll product listing
9. Image optimization via CloudFront
10. Multi-level category hierarchy

### Business Logic Complexity
- **High Complexity**: Checkout flow, payment integration, product verification
- **Medium Complexity**: Cart management, authentication, wishlist sync
- **Low Complexity**: Product display, search, filtering

---

## Target State Analysis

### Technology Stack (New UI)
- **Framework**: React 18.3.1 (SPA)
- **Build Tool**: Vite 6.3.5
- **State Management**: Zustand 5.0.3
- **Styling**: Tailwind CSS (minimal custom config)
- **Icons**: Lucide React
- **Routing**: React Router DOM 7.3.0
- **Data**: Mock data (no API integration)

### UI/UX Improvements
1. **Modern Design**: Cleaner, more spacious layouts
2. **Better Components**: Enhanced product cards with hover effects
3. **Improved Filters**: Advanced filtering sidebar with collapsible sections
4. **Cart Sidebar**: Sliding panel instead of separate page
5. **Better Product Detail**: Image gallery with thumbnails, tabbed content
6. **Enhanced Navigation**: Smoother mobile menu, better categorization
7. **Loading States**: Skeleton screens for better UX
8. **Empty States**: Better placeholder components

### Component Architecture Strengths
- Clean separation of concerns
- Reusable component patterns
- Props-based customization
- Responsive design patterns
- Better accessibility

---

## Key Differences

### 1. Framework Paradigm
| Aspect | Current (Next.js) | New (React + Vite) |
|--------|-------------------|-------------------|
| Rendering | SSR + ISR | CSR (Client-side only) |
| Routing | File-based | Component-based |
| Data Fetching | Server & Client | Client only |
| Build Output | Hybrid (static + server) | Static SPA |
| SEO | Excellent (SSR) | Poor (needs work) |

### 2. State Management
| Feature | Current (Context) | New (Zustand) |
|---------|------------------|---------------|
| Boilerplate | High | Low |
| Performance | Re-renders children | Selective subscriptions |
| DevTools | React DevTools | Zustand DevTools |
| Persistence | Manual localStorage | Built-in persist middleware |
| Complexity | Higher | Lower |

### 3. Component Patterns
| Pattern | Current | New |
|---------|---------|-----|
| Product Card | Basic grid item | Enhanced with hover, badges |
| Filter UI | Sheet component | Sidebar with collapsible sections |
| Cart | Separate page | Sliding sidebar |
| Product Detail | Single column | Gallery + tabs layout |
| Search | Command palette | Simple input (header + page) |
| Navigation | Mega menu | Standard dropdown |

### 4. Data Flow
| Layer | Current | New |
|-------|---------|-----|
| API | Real backend integration | Mock data functions |
| Caching | Next.js cache + deduper | None |
| Loading | SSR + loading.tsx | Local loading states |
| Error Handling | Error boundaries + API errors | Minimal |
| Validation | Backend + frontend | Frontend only |

---

## Migration Strategy

### Recommended Approach: **Hybrid Integration**

Instead of a complete rewrite, we will:
1. **Keep Next.js framework** for its SSR, SEO, and performance benefits
2. **Adopt new UI components** with enhanced designs
3. **Migrate to Zustand** for simpler state management
4. **Preserve all business logic** and API integrations
5. **Maintain existing routing** structure

### Why Hybrid?
- ✅ Preserves SEO advantages of SSR
- ✅ Keeps existing API integrations intact
- ✅ Reduces migration risk
- ✅ Allows incremental rollout
- ✅ Maintains performance optimizations
- ✅ Keeps Firebase Analytics and GTM
- ✅ Preserves payment integration

### Migration Principles
1. **Component-First**: Migrate UI components one at a time
2. **Preserve Logic**: Extract and maintain all business logic
3. **API Compatibility**: Keep existing API service layer unchanged
4. **Backwards Compatible**: Old and new components coexist during migration
5. **Feature Parity**: New components must match or exceed current features
6. **No Downtime**: Rolling deployment with feature flags

---

## Component Mapping

### Phase 1: Core UI Components (Week 1)

| Current Component | New Component | Action | Priority |
|-------------------|---------------|--------|----------|
| Product Card (basic) | ProductCard.tsx | Replace with enhanced version | High |
| Empty state (inline) | Empty.tsx | Import and adapt | High |
| Loading skeletons | Various | Standardize skeleton components | High |

### Phase 2: Layout Components (Week 2)

| Current Component | New Component | Action | Priority |
|-------------------|---------------|--------|----------|
| Header/Navbar | Header.tsx | Adapt with existing category data | High |
| Footer | Footer.tsx | Customize with Prior branding | Medium |
| Cart page | CartSidebar.tsx | Convert to sidebar, keep logic | High |
| Banner (home) | Banner.tsx | Integrate with existing banner system | Medium |

### Phase 3: Feature Components (Week 3)

| Current Component | New Component | Action | Priority |
|-------------------|---------------|--------|----------|
| Product listing | Products.tsx + ProductGrid.tsx | Merge with existing filters | High |
| Product filters | ProductFilter.tsx | Integrate with API filter data | High |
| Product detail | ProductDetail.tsx | Adapt with variation support | High |
| Search (command) | Search component | Keep command palette, improve UI | Medium |

### Phase 4: Pages & Flow (Week 4)

| Current Page | New Page | Action | Priority |
|--------------|----------|--------|----------|
| Home page | Home.tsx | Recreate layout with existing data | High |
| Collections page | Products.tsx | Merge infinite scroll logic | High |
| Checkout page | N/A (new) | Rebuild with new UI patterns | High |
| Auth pages | Auth.tsx | Adapt to JWT authentication | Medium |
| Account pages | N/A | Create new based on Auth.tsx patterns | Low |

---

## State Management Migration

### Current Context → Zustand Migration

#### 1. CartContext → cartStore

**Current Implementation**: `src/context/CartContext.tsx`
```typescript
// Context with localStorage persistence
// Operations: add, update, remove, clear, bulk
// Firebase analytics tracking
```

**New Zustand Store**: `src/store/cartStore.ts`
```typescript
interface CartStore {
  items: CartItem[];
  addItem: (product, quantity, variation) => void;
  updateQuantity: (id, quantity) => void;
  removeItem: (id) => void;
  clearCart: () => void;
  bulkUpdate: (items) => void; // For checkout verification
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // Keep existing: Firebase tracking
}
```

**Migration Steps**:
1. Create Zustand store with persist middleware
2. Add Firebase analytics to store actions
3. Map CartItem interface to match API structure
4. Add variation support (size/color combinations)
5. Implement bulk update for checkout verification
6. Test localStorage persistence
7. Replace Context usage with Zustand hooks

**Key Differences**:
- Add `variation` support (current: inline; new: separate fields)
- Keep `maxQuantity` validation
- Maintain `sku` tracking
- Add `productCode` field

#### 2. AuthContext → userStore

**Current Implementation**: `src/context/AuthContext.tsx`
```typescript
// JWT-based with refresh tokens
// Token expiry checking (5-min intervals)
// Auto-refresh logic
```

**New Zustand Store**: `src/store/userStore.ts`
```typescript
interface UserStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData) => void;
  refreshAccessToken: () => Promise<void>;
  checkTokenExpiry: () => void; // Auto-refresh logic
}
```

**Migration Steps**:
1. Create Zustand store with persist middleware
2. Implement JWT token refresh logic
3. Add token expiry checking (setInterval)
4. Integrate with existing auth API
5. Test token refresh flow
6. Replace Context with Zustand hooks

**Key Differences**:
- Keep JWT refresh mechanism
- Maintain token expiry checking
- Preserve user profile structure
- Add address management

#### 3. WishlistContext → wishlistStore

**Current Implementation**: `src/context/WishlistContext.tsx`
```typescript
// API-backed for authenticated users
// LocalStorage fallback for guests
// Sync on login
```

**New Zustand Store**: `src/store/wishlistStore.ts`
```typescript
interface WishlistStore {
  items: string[]; // Product IDs
  isLoading: boolean;
  addToWishlist: (productId) => Promise<void>;
  removeFromWishlist: (productId) => Promise<void>;
  clearWishlist: () => void;
  syncWithBackend: () => Promise<void>; // On login
  isInWishlist: (productId) => boolean;
}
```

**Migration Steps**:
1. Create Zustand store with conditional persistence
2. Implement API integration for auth users
3. Add guest fallback with localStorage
4. Create sync logic on login
5. Test guest → auth transition
6. Replace Context usage

#### 4. PageStateContext → Remove (Use URL state)

**Current Implementation**: Scroll position and filter state
**New Approach**: Use URL search params + Next.js router

#### 5. New: uiStore

**Purpose**: Manage UI visibility states
```typescript
interface UIStore {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isFilterOpen: boolean;
  isSearchOpen: boolean;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  toggleFilter: () => void;
  toggleSearch: () => void;
}
```

### Migration Timeline

| Week | Store | Status |
|------|-------|--------|
| Week 1 | uiStore | ✅ Simple, no dependencies |
| Week 2 | cartStore | 🟡 Medium complexity, add analytics |
| Week 3 | userStore | 🔴 High complexity, JWT logic |
| Week 3 | wishlistStore | 🟡 Medium complexity, API sync |

---

## API Integration Plan

### Challenge: New UI has mock data, Current has real API

### Solution: Create Adapter Layer

#### 1. Type Mapping

**Current Types** → **New Types**

```typescript
// Adapter: src/lib/adapters/productAdapter.ts

export const adaptProductToNewFormat = (
  currentProduct: ProductType
): Product => ({
  id: currentProduct.id,
  name: currentProduct.name,
  price: currentProduct.updatedPrice || currentProduct.unitPrice,
  originalPrice: currentProduct.hasDiscount ? currentProduct.unitPrice : undefined,
  image: currentProduct.thumbnail,
  images: currentProduct.images,
  category: currentProduct.categoryName,
  description: currentProduct.description || '',
  rating: currentProduct.rating?.average || 0,
  reviewCount: currentProduct.rating?.count || 0,
  inStock: currentProduct.quantity > 0,
  stock: currentProduct.quantity,
  isNew: checkIfNew(currentProduct.createdAt), // Logic to determine if new
  isHot: currentProduct.hasDiscount, // Or based on sales data
  colors: adaptVariationsToColors(currentProduct.variation),
  sizes: adaptVariationsToSizes(currentProduct.variation),
  tags: [], // Extract from description or category
  createdAt: currentProduct.createdAt,
});

// Helper functions
const adaptVariationsToColors = (variations?: Variation[]): Color[] => {
  if (!variations) return [];
  const uniqueColors = [...new Set(variations.map(v => v.color))];
  return uniqueColors.map((color, idx) => ({
    id: `color-${idx}`,
    name: color,
    hex: colorNameToHex(color), // Map color names to hex
  }));
};

const adaptVariationsToSizes = (variations?: Variation[]): Size[] => {
  if (!variations) return [];
  const uniqueSizes = [...new Set(variations.map(v => v.size))];
  return uniqueSizes.map(size => ({
    id: `size-${size}`,
    name: size,
  }));
};
```

#### 2. API Service Compatibility

**Keep existing services**, add adapter wrappers:

```typescript
// src/services/productServicesAdapter.ts
import * as productServices from './productServices';
import { adaptProductToNewFormat } from '@/lib/adapters/productAdapter';

export const getProducts = async (params: ProductFetchParams) => {
  const response = await productServices.getProductsAll(params);
  return {
    items: response.data.map(adaptProductToNewFormat),
    pagination: {
      page: params.page || 1,
      pageSize: params.limit || 12,
      total: response.total || response.data.length,
      totalPages: Math.ceil((response.total || response.data.length) / (params.limit || 12)),
    },
  };
};

export const getProductById = async (id: string) => {
  const response = await productServices.getProductById(id);
  return adaptProductToNewFormat(response.data);
};

// ... similar adapters for other services
```

#### 3. Replace Mock Data Usage

In new components, replace:
```typescript
// Before (in new UI)
import { products, getNewProducts } from '@/data/mockData';

// After (in migrated Next.js)
import { getProducts, getNewProducts } from '@/services/productServicesAdapter';
```

#### 4. Maintain Existing Business Logic

**Do NOT migrate** these features (keep as-is):
- ✅ Request deduplication system
- ✅ District-based delivery calculation
- ✅ Campaign prepayment logic
- ✅ Product verification on checkout
- ✅ bKash payment integration
- ✅ Firebase Analytics tracking
- ✅ Order creation flow

---

## Routing Strategy

### Keep Next.js App Router Structure

**No changes to routing**, only UI updates:

| Route | Current | New UI Component | Action |
|-------|---------|------------------|--------|
| `/` | `app/page.tsx` | `Home.tsx` layout | Rebuild page with new layout |
| `/collections` | `app/collections/page.tsx` | `Products.tsx` | Replace UI, keep data logic |
| `/collections/[id]` | `app/collections/[id]/page.tsx` | `ProductDetail.tsx` | Replace UI, keep SSR |
| `/category/[id]` | `app/category/[id]/page.tsx` | `Products.tsx` | Use same component |
| `/cart` | `app/cart/page.tsx` | `CartSidebar.tsx` | Convert to sidebar, keep route for direct access |
| `/checkout` | `app/checkout/page.tsx` | New checkout UI | Rebuild with new patterns |
| `/account/*` | `app/account/*` | Based on `Auth.tsx` | Rebuild account pages |
| `/login`, `/register` | Separate pages | `Auth.tsx` | Merge into single auth page |

### SSR/ISR Strategy

**Preserve SSR for SEO-critical pages**:
- ✅ Home page (ISR, 3s revalidation)
- ✅ Product detail (ISR, 10s revalidation)
- ✅ Category pages (ISR, 30s revalidation)

**Client-side for interactive pages**:
- Collections with filters (already client-side)
- Cart sidebar (client-side)
- Checkout (client-side with dynamic import)

---

## Styling Migration

### Tailwind Configuration

**Merge configurations**:

```javascript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Keep Prior brand colors
        primary: '#0b3393',
        border: 'hsl(var(--border))',
        // ... shadcn/ui CSS variables
      },
      fontFamily: {
        // Keep Prior fonts
        sans: ['Noto Sans Devanagari', 'sans-serif'],
        serif: ['Alegreya', 'serif'],
        display: ['Oswald', 'sans-serif'],
      },
      // Keep existing animations and utilities
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // ... existing plugins
  ],
};
```

### Component Styling

**Keep shadcn/ui components**, supplement with new patterns:
- ✅ Keep: Dialog, Sheet, Dropdown, Command, etc.
- ➕ Add: New skeleton components
- ➕ Add: Enhanced product card styles
- ➕ Add: Filter sidebar styles

### CSS Utility

**Use existing `cn()` utility** from `src/lib/utils.ts`:
```typescript
import { cn } from "@/lib/utils";
// Already compatible with new UI components
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up new state management and core utilities

**Tasks**:
1. ✅ Install Zustand and persist middleware
   ```bash
   npm install zustand
   ```
2. ✅ Create `src/store` directory structure
3. ✅ Implement `uiStore.ts` (simple, no dependencies)
4. ✅ Create adapter layer: `src/lib/adapters/`
5. ✅ Implement `productAdapter.ts` with type mapping
6. ✅ Add color name → hex mapping utility
7. ✅ Test adapter with sample data
8. ✅ Update type definitions if needed

**Deliverables**:
- ✅ Zustand stores folder
- ✅ Basic uiStore working
- ✅ Product adapter tested
- ✅ Type mapping validated

**Testing**:
- Unit tests for adapter functions
- Verify type compatibility

---

### Phase 2: State Migration (Week 2)
**Goal**: Migrate Context to Zustand stores

**Tasks**:
1. ✅ Implement `cartStore.ts`
   - Add persist middleware
   - Port cart operations from CartContext
   - Integrate Firebase Analytics
   - Add variation support
   - Test localStorage persistence
2. ✅ Create `src/services/productServicesAdapter.ts`
   - Wrap existing services with adapters
   - Test API responses
3. ✅ Start migrating components to use `cartStore`
   - Update imports from Context to Zustand
   - Test cart operations
4. ✅ Create parallel implementation (old Context + new Store)
   - Ensure backwards compatibility
5. ✅ Test cart functionality thoroughly

**Deliverables**:
- ✅ Working cartStore with all features
- ✅ Service adapters functional
- ✅ Some components using new store

**Testing**:
- Cart operations (add, update, remove)
- LocalStorage persistence
- Firebase Analytics events
- Variation handling

---

### Phase 3: Core Components (Week 2-3)
**Goal**: Migrate core UI components

**Tasks**:
1. ✅ Create `src/components/new-ui/` directory
2. ✅ Port ProductCard.tsx
   - Add hover effects
   - Integrate with Prior product data
   - Add wishlist toggle
   - Test with variations
3. ✅ Port ProductGrid.tsx
   - Add loading skeletons
   - Integrate infinite scroll
   - Test responsive layouts
4. ✅ Port Empty.tsx component
5. ✅ Create skeleton components library
6. ✅ Update product listing to use new ProductCard
7. ✅ Test on collections page

**Deliverables**:
- ✅ New product card component
- ✅ New product grid component
- ✅ Loading states
- ✅ Empty states

**Testing**:
- Visual regression testing
- Responsive design testing
- Performance testing (re-renders)

---

### Phase 4: Layout Components (Week 3)
**Goal**: Update layout and navigation

**Tasks**:
1. ✅ Port Header.tsx component
   - Adapt with Prior category hierarchy
   - Keep search command palette
   - Add cart sidebar toggle
   - Test mobile menu
2. ✅ Port Footer.tsx
   - Update with Prior branding
   - Add necessary links
3. ✅ Create CartSidebar.tsx
   - Port cart logic from cart page
   - Add slide-in animation
   - Integrate with uiStore
   - Keep checkout link
4. ✅ Port Banner.tsx for home page
   - Integrate with existing banner system
   - Test auto-rotation
5. ✅ Update root layout.tsx
6. ✅ Test navigation flow

**Deliverables**:
- ✅ New header/navbar
- ✅ New footer
- ✅ Working cart sidebar
- ✅ Banner carousel

**Testing**:
- Navigation flow
- Mobile responsiveness
- Cart sidebar animations
- Category menu functionality

---

### Phase 5: Feature Pages (Week 4)
**Goal**: Rebuild main pages with new UI

**Tasks**:
1. ✅ Rebuild home page (`app/page.tsx`)
   - Use new Banner component
   - Use new ProductGrid for featured sections
   - Add brand story section
   - Keep SSR and ISR
2. ✅ Update collections page (`app/collections/page.tsx`)
   - Port ProductFilter.tsx
   - Integrate with existing filter logic
   - Use new ProductGrid
   - Keep infinite scroll
   - Test filter operations
3. ✅ Update product detail page (`app/collections/[id]/page.tsx`)
   - Port ProductDetail.tsx layout
   - Adapt image gallery
   - Keep variation selection logic
   - Add related products section
   - Keep SSR
4. ✅ Merge login/register pages
   - Port Auth.tsx component
   - Integrate with JWT authentication
   - Update auth flow
5. ✅ Test all pages thoroughly

**Deliverables**:
- ✅ New home page design
- ✅ Updated collections page
- ✅ New product detail layout
- ✅ Unified auth page

**Testing**:
- SSR/ISR functionality
- Data fetching
- User flows (browse → detail → cart)
- Filter operations
- Search functionality

---

### Phase 6: Auth & User Store (Week 4-5)
**Goal**: Complete state migration

**Tasks**:
1. ✅ Implement `userStore.ts`
   - Port JWT logic from AuthContext
   - Add token refresh mechanism
   - Implement auto-refresh interval
   - Add persist middleware
2. ✅ Implement `wishlistStore.ts`
   - API integration for auth users
   - LocalStorage fallback for guests
   - Sync on login logic
3. ✅ Migrate all Context usage to Zustand
   - Update all components
   - Remove old Context providers
4. ✅ Test authentication flow
   - Login/logout
   - Token refresh
   - Auto-refresh timing
5. ✅ Test wishlist sync
   - Guest → auth transition
   - API sync

**Deliverables**:
- ✅ Complete userStore
- ✅ Complete wishlistStore
- ✅ All Context removed
- ✅ Zustand fully integrated

**Testing**:
- Authentication flow
- Token expiry and refresh
- Wishlist sync
- Guest to authenticated transition

---

### Phase 7: Checkout Flow (Week 5)
**Goal**: Rebuild checkout with new UI patterns

**Tasks**:
1. ✅ Design new checkout UI based on Auth.tsx patterns
2. ✅ Rebuild checkout page
   - Keep all business logic (district pricing, prepayment)
   - Use new form patterns
   - Improve mobile UX
3. ✅ Keep product verification logic
4. ✅ Keep bKash integration
5. ✅ Keep Firebase Analytics
6. ✅ Test complete checkout flow
   - Guest checkout
   - Authenticated checkout
   - Payment flow
   - Order creation

**Deliverables**:
- ✅ New checkout UI
- ✅ All business logic preserved
- ✅ Payment integration working

**Testing**:
- Complete checkout flow testing
- Payment integration testing
- District pricing validation
- Campaign prepayment testing
- Order creation verification
- Analytics tracking

---

### Phase 8: Account Pages (Week 5-6)
**Goal**: Rebuild account management pages

**Tasks**:
1. ✅ Create account layout based on new patterns
2. ✅ Rebuild profile page
3. ✅ Rebuild orders page
   - Keep order tracking
   - Use new UI patterns
4. ✅ Rebuild wishlist page
   - Integrate with wishlistStore
5. ✅ Add address management
6. ✅ Test all account features

**Deliverables**:
- ✅ New account pages
- ✅ Profile management
- ✅ Order history
- ✅ Wishlist page

**Testing**:
- Profile update
- Order viewing
- Address management
- Wishlist operations

---

### Phase 9: Polish & Optimization (Week 6)
**Goal**: Final touches and optimization

**Tasks**:
1. ✅ Add loading skeletons everywhere
2. ✅ Improve error handling
3. ✅ Add empty states for all lists
4. ✅ Optimize images (WebP, sizes)
5. ✅ Performance audit
   - Bundle size analysis
   - Lighthouse scores
   - Core Web Vitals
6. ✅ Accessibility audit
   - Keyboard navigation
   - Screen reader testing
   - ARIA labels
7. ✅ Mobile testing on real devices
8. ✅ Cross-browser testing
9. ✅ Final bug fixes

**Deliverables**:
- ✅ Polished UI
- ✅ Optimized performance
- ✅ Accessible interface
- ✅ Bug-free experience

**Testing**:
- Comprehensive QA testing
- User acceptance testing
- Performance benchmarks
- Accessibility compliance

---

### Phase 10: Deployment (Week 6)
**Goal**: Launch new UI

**Tasks**:
1. ✅ Staging deployment
2. ✅ Stakeholder review
3. ✅ Final adjustments
4. ✅ Production deployment
5. ✅ Monitor analytics and errors
6. ✅ Collect user feedback
7. ✅ Hot fixes if needed

**Deliverables**:
- ✅ Production deployment
- ✅ Monitoring setup
- ✅ Documentation

**Testing**:
- Production smoke tests
- Real user monitoring
- Error tracking

---

## Risk Assessment

### High Risks

#### 1. SSR vs CSR Mismatch
**Risk**: New UI components designed for CSR may break SSR
**Mitigation**:
- Mark client-only components with `'use client'`
- Test SSR rendering for all pages
- Use Next.js dynamic imports where needed

#### 2. State Management Migration
**Risk**: Complex Context logic may not transfer cleanly to Zustand
**Mitigation**:
- Parallel implementation period
- Extensive testing
- Gradual rollout

#### 3. Type Mismatches
**Risk**: API types and new UI types may conflict
**Mitigation**:
- Comprehensive adapter layer
- TypeScript strict mode
- Unit tests for adapters

#### 4. Business Logic Loss
**Risk**: Accidentally removing critical business logic
**Mitigation**:
- Detailed documentation of all business rules
- Feature-by-feature checklist
- Extensive testing of edge cases

### Medium Risks

#### 5. Performance Regression
**Risk**: New components may be less optimized
**Mitigation**:
- Performance testing at each phase
- Bundle size monitoring
- Lighthouse CI integration

#### 6. Mobile UX Issues
**Risk**: New UI may not work well on all devices
**Mitigation**:
- Mobile-first development
- Real device testing
- Responsive design review

#### 7. Accessibility Degradation
**Risk**: New components may have accessibility issues
**Mitigation**:
- Accessibility audit
- Screen reader testing
- WCAG 2.1 compliance check

### Low Risks

#### 8. Styling Conflicts
**Risk**: Tailwind classes may conflict
**Mitigation**:
- Use `cn()` utility consistently
- Review merged Tailwind config
- Visual regression testing

#### 9. Analytics Tracking Loss
**Risk**: Firebase events may not fire
**Mitigation**:
- Test all analytics events
- Compare event counts pre/post migration
- Analytics verification checklist

---

## Testing Strategy

### Unit Testing
**Focus**: Individual functions and utilities

```bash
# Test adapters
npm run test src/lib/adapters/**/*.test.ts

# Test stores
npm run test src/store/**/*.test.ts

# Test utilities
npm run test src/lib/**/*.test.ts
```

**Key Tests**:
- ✅ Product adapter type mapping
- ✅ Color name to hex conversion
- ✅ Variation to color/size conversion
- ✅ Cart operations in cartStore
- ✅ Token refresh logic in userStore
- ✅ Wishlist sync in wishlistStore

### Component Testing
**Focus**: Component rendering and interactions

**Tools**: React Testing Library, Jest

**Key Tests**:
- ✅ ProductCard renders correctly
- ✅ ProductGrid handles loading/empty states
- ✅ ProductFilter applies filters correctly
- ✅ CartSidebar opens/closes
- ✅ Auth form validation
- ✅ Checkout form validation

### Integration Testing
**Focus**: Feature flows

**Key Flows**:
1. ✅ Browse → Detail → Add to Cart → Checkout → Order
2. ✅ Search → Filter → View Product
3. ✅ Login → Add to Wishlist → Sync
4. ✅ Guest Cart → Login → Cart Merge
5. ✅ Product Verification on Checkout Load

### E2E Testing
**Focus**: Complete user journeys

**Tools**: Playwright or Cypress

**Key Scenarios**:
1. ✅ Guest purchase flow (COD)
2. ✅ Authenticated purchase flow (bKash)
3. ✅ Campaign product with prepayment
4. ✅ Outside Dhaka order (prepayment required)
5. ✅ Product with variations (size/color selection)
6. ✅ Wishlist sync on login
7. ✅ Cart persistence across sessions

### Performance Testing
**Focus**: Load times and Core Web Vitals

**Metrics**:
- ✅ Lighthouse scores (before/after)
- ✅ Bundle size (before/after)
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ TTI (Time to Interactive)

**Tools**: Lighthouse CI, WebPageTest, Bundle Analyzer

### Accessibility Testing
**Focus**: WCAG 2.1 Level AA compliance

**Checks**:
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast ratios
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Form error announcements

**Tools**: axe DevTools, WAVE, Lighthouse Accessibility Audit

### Browser Testing
**Focus**: Cross-browser compatibility

**Browsers**:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome (Android)
- ✅ Mobile Safari (iOS)

### Regression Testing
**Focus**: Ensure existing features still work

**Approach**:
- Visual regression with Percy or Chromatic
- Screenshot comparisons
- Automated smoke tests

---

## Success Metrics

### Performance Metrics
- ✅ Lighthouse Performance Score: 90+
- ✅ Bundle Size: < 500KB gzipped
- ✅ LCP: < 2.5s
- ✅ FID: < 100ms
- ✅ CLS: < 0.1

### Business Metrics
- ✅ Cart abandonment rate: Maintain or improve
- ✅ Checkout completion rate: Improve by 10%
- ✅ Page load time: Reduce by 20%
- ✅ Mobile conversion rate: Improve by 15%
- ✅ User engagement: Increase time on site by 10%

### Quality Metrics
- ✅ Zero critical bugs in production
- ✅ < 5 high-priority bugs in first week
- ✅ 95% test coverage for critical paths
- ✅ WCAG 2.1 Level AA compliance
- ✅ Browser compatibility: 99%+ users supported

---

## Rollout Strategy

### Feature Flags
Use feature flags for gradual rollout:

```typescript
// src/lib/featureFlags.ts
export const FEATURE_FLAGS = {
  NEW_PRODUCT_CARD: process.env.NEXT_PUBLIC_FF_NEW_PRODUCT_CARD === 'true',
  NEW_HEADER: process.env.NEXT_PUBLIC_FF_NEW_HEADER === 'true',
  CART_SIDEBAR: process.env.NEXT_PUBLIC_FF_CART_SIDEBAR === 'true',
  NEW_CHECKOUT: process.env.NEXT_PUBLIC_FF_NEW_CHECKOUT === 'true',
  ZUSTAND_STORES: process.env.NEXT_PUBLIC_FF_ZUSTAND_STORES === 'true',
};
```

### Rollout Plan

**Phase 1: Internal Testing (Week 6, Days 1-2)**
- Deploy to staging
- Internal QA team testing
- Stakeholder review
- Bug fixes

**Phase 2: Beta Testing (Week 6, Days 3-4)**
- Deploy to production with feature flags OFF
- Enable for 10% of users (A/B test)
- Monitor analytics and errors
- Collect user feedback

**Phase 3: Gradual Rollout (Week 6, Day 5 - Week 7)**
- 10% → 25% → 50% → 75% → 100%
- Monitor metrics at each stage
- Quick rollback capability
- Address issues before next stage

**Phase 4: Full Launch (Week 7+)**
- 100% rollout
- Remove old code
- Remove feature flags
- Update documentation

---

## Rollback Plan

### Triggers for Rollback
- Critical bug affecting checkout/payment
- Performance degradation > 30%
- Error rate increase > 5%
- Negative user feedback > 70%
- Cart abandonment increase > 20%

### Rollback Process
1. **Immediate**: Disable feature flags (< 5 minutes)
2. **Short-term**: Deploy previous build (< 30 minutes)
3. **Long-term**: Fix issues, re-test, re-deploy

### Rollback Testing
- Test rollback process in staging
- Document rollback steps
- Assign rollback decision-makers

---

## Post-Migration Tasks

### Cleanup (Week 7-8)
1. ✅ Remove old Context providers
2. ✅ Remove old components
3. ✅ Remove feature flags
4. ✅ Clean up unused dependencies
5. ✅ Update documentation
6. ✅ Archive old code

### Optimization (Week 8-9)
1. ✅ Further bundle size optimization
2. ✅ Image optimization improvements
3. ✅ Code splitting enhancements
4. ✅ Caching strategy review
5. ✅ Performance monitoring setup

### Documentation (Week 9)
1. ✅ Update component documentation
2. ✅ Create Storybook for new components
3. ✅ Document Zustand stores
4. ✅ Update README
5. ✅ Create developer guide
6. ✅ Record video tutorials

---

## Conclusion

This migration plan provides a comprehensive, phased approach to integrating the new React UI into the existing Next.js Prior e-commerce platform. By maintaining the Next.js framework and business logic while adopting the enhanced UI components and simpler Zustand state management, we achieve the best of both worlds:

**Preserved**:
- ✅ SEO advantages of SSR
- ✅ Performance optimizations
- ✅ All business logic and integrations
- ✅ Payment flows
- ✅ Analytics tracking

**Improved**:
- ✅ Modern, clean UI design
- ✅ Better component architecture
- ✅ Simpler state management
- ✅ Enhanced user experience
- ✅ Better mobile responsiveness

**Timeline**: 6 weeks for core migration + 2-3 weeks for polish and rollout

**Risk Level**: Medium - Mitigated through phased approach, parallel implementation, and comprehensive testing

**Recommended Next Steps**:
1. Review and approve this plan
2. Set up project tracking (Jira, Linear, etc.)
3. Begin Phase 1: Foundation setup
4. Schedule regular progress reviews
5. Set up monitoring and analytics

---

## Appendix

### A. Component Inventory

#### New UI Components to Port
```
✅ Banner.tsx
✅ CartSidebar.tsx
✅ Empty.tsx
✅ Footer.tsx
✅ Header.tsx
✅ ProductCard.tsx
✅ ProductFilter.tsx
✅ ProductGrid.tsx
✅ Auth.tsx (page)
✅ Home.tsx (page layout)
✅ ProductDetail.tsx (page)
✅ Products.tsx (page)
```

#### Existing Components to Update
```
🔄 src/app/navbar/ → Replace with new Header
🔄 src/app/page.tsx → Use new Home layout
🔄 src/app/collections/ → Use new Products components
🔄 src/app/cart/ → Replace with CartSidebar + keep route
🔄 src/shared/ProductCard.tsx → Replace with new version
🔄 src/components/ProductGrid.tsx → Use new version
```

#### Components to Keep As-Is
```
✅ src/shared/ProtectedRoute.tsx
✅ src/components/Providers.tsx
✅ src/components/Analytics/ (Firebase, GTM)
✅ All service files (src/services/)
✅ All hook files (src/hooks/) - may need small updates
```

### B. Type Definitions to Add/Update

```typescript
// Add to src/types/ or update existing

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface Size {
  id: string;
  name: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  link?: string;
  isActive: boolean;
}

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

// Update CartItem to include:
interface CartItem {
  // ... existing fields
  selectedSize: Size;
  selectedColor: Color;
  // Or keep as sizeId, colorId with separate lookups
}
```

### C. Environment Variables

No new environment variables required. Keep existing:

```env
NEXT_PUBLIC_API_URL=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_GTM_ID=...
# ... other existing vars

# Optional: Feature flags for gradual rollout
NEXT_PUBLIC_FF_NEW_PRODUCT_CARD=false
NEXT_PUBLIC_FF_NEW_HEADER=false
NEXT_PUBLIC_FF_CART_SIDEBAR=false
NEXT_PUBLIC_FF_NEW_CHECKOUT=false
NEXT_PUBLIC_FF_ZUSTAND_STORES=false
```

### D. Dependencies to Add

```json
{
  "dependencies": {
    "zustand": "^5.0.3"
  }
}
```

All other dependencies from new UI are already present in the current project (React, Tailwind, Lucide, etc.).

### E. Useful Commands

```bash
# Install new dependencies
npm install zustand

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Analyze bundle size
ANALYZE=true npm run build

# Run Lighthouse audit
npm run lighthouse

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### F. Key Files Reference

**Current Implementation**:
```
src/context/CartContext.tsx
src/context/AuthContext.tsx
src/context/WishlistContext.tsx
src/services/productServices.ts
src/services/orderService.ts
src/hooks/useProductFetch.tsx
src/app/checkout/page.tsx
src/lib/request-deduper.ts
```

**New UI Source**:
```
~/Haki/Lookup/women-fashion-ecommerce/src/components/
~/Haki/Lookup/women-fashion-ecommerce/src/pages/
~/Haki/Lookup/women-fashion-ecommerce/src/store/
~/Haki/Lookup/women-fashion-ecommerce/src/types/
```

**Migration Artifacts** (to be created):
```
src/store/ (new)
src/lib/adapters/ (new)
src/services/productServicesAdapter.ts (new)
src/components/new-ui/ (new, temporary)
MIGRATION_PLAN.md (this document)
MIGRATION_CHECKLIST.md (to be created)
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-18
**Author**: Claude (Anthropic)
**Status**: Draft - Awaiting Approval
