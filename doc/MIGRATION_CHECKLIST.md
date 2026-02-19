# Migration Checklist

## Overview
Track the progress of migrating from the current Next.js implementation to the new React UI design while preserving all business logic and API integrations.

**Start Date**: _____________
**Target Completion**: _____________
**Current Phase**: _____________

---

## Phase 1: Foundation Setup (Week 1)

### State Management Setup
- [ ] Install Zustand dependency (`npm install zustand`)
- [ ] Create `src/store/` directory structure
- [ ] Create `src/store/uiStore.ts`
  - [ ] Implement cart sidebar toggle
  - [ ] Implement mobile menu toggle
  - [ ] Implement filter sidebar toggle
  - [ ] Implement search dialog toggle
- [ ] Test uiStore in isolation
- [ ] Create Zustand DevTools setup

### Adapter Layer
- [ ] Create `src/lib/adapters/` directory
- [ ] Create `src/lib/adapters/productAdapter.ts`
  - [ ] Implement `adaptProductToNewFormat()` function
  - [ ] Implement `adaptVariationsToColors()` helper
  - [ ] Implement `adaptVariationsToSizes()` helper
  - [ ] Create color name to hex mapping utility
  - [ ] Handle edge cases (missing data, null values)
- [ ] Write unit tests for adapter functions
- [ ] Test adapter with real API responses
- [ ] Create `src/lib/adapters/categoryAdapter.ts` (if needed)
- [ ] Create `src/lib/adapters/userAdapter.ts` (if needed)

### Type Definitions
- [ ] Review existing types in `src/data/types.tsx`
- [ ] Add new types from new UI to `src/types/index.ts`:
  - [ ] `Color` interface
  - [ ] `Size` interface
  - [ ] `Banner` interface
  - [ ] `Review` interface
  - [ ] Update `CartItem` interface
- [ ] Ensure type compatibility between old and new

### Testing Setup
- [ ] Set up test files for adapters
- [ ] Verify TypeScript compilation with new types
- [ ] Document any type conflicts or issues

**Phase 1 Completion Criteria**:
- ✅ Zustand installed and configured
- ✅ Basic uiStore working
- ✅ Product adapter tested and functional
- ✅ All new types defined
- ✅ No TypeScript errors

---

## Phase 2: State Migration (Week 2)

### Cart Store Implementation
- [ ] Create `src/store/cartStore.ts`
- [ ] Implement Zustand persist middleware
- [ ] Port cart operations from `CartContext.tsx`:
  - [ ] `addItem` function
  - [ ] `updateQuantity` function
  - [ ] `removeItem` function
  - [ ] `clearCart` function
  - [ ] `bulkUpdate` function (for checkout verification)
- [ ] Add computed values:
  - [ ] `getTotalItems` function
  - [ ] `getTotalPrice` function
- [ ] Integrate Firebase Analytics tracking:
  - [ ] `add_to_cart` event
  - [ ] `remove_from_cart` event
  - [ ] Track product details in events
- [ ] Add variation support:
  - [ ] Handle size selection
  - [ ] Handle color selection
  - [ ] Generate unique item IDs
- [ ] Test localStorage persistence
- [ ] Test cart operations with variations
- [ ] Test analytics event firing

### Service Adapters
- [ ] Create `src/services/productServicesAdapter.ts`
- [ ] Implement adapter wrappers:
  - [ ] `getProducts()` with pagination
  - [ ] `getProductById()`
  - [ ] `getNewProducts()`
  - [ ] `getBestProducts()`
  - [ ] `getCategoryProducts()`
  - [ ] `searchProducts()`
  - [ ] `getFilterData()`
- [ ] Test API responses with adapters
- [ ] Verify pagination structure
- [ ] Handle API errors gracefully

### Component Migration Start
- [ ] Update a test component to use `cartStore` instead of `CartContext`
- [ ] Verify cart operations work with Zustand
- [ ] Test localStorage persistence in browser
- [ ] Ensure backwards compatibility (both stores working simultaneously)

### Testing
- [ ] Unit tests for cartStore operations
- [ ] Integration tests for cart flow
- [ ] Test cart persistence across page reloads
- [ ] Test Firebase Analytics events
- [ ] Test variation handling in cart

**Phase 2 Completion Criteria**:
- ✅ cartStore fully implemented
- ✅ Service adapters functional
- ✅ At least one component using new store
- ✅ All cart tests passing
- ✅ Analytics tracking verified

---

## Phase 3: Core Components (Week 2-3)

### Component Directory Setup
- [ ] Create `src/components/new-ui/` directory
- [ ] Set up component file structure

### ProductCard Component
- [ ] Create `src/components/new-ui/ProductCard.tsx`
- [ ] Port component from new UI
- [ ] Adapt to use Prior product data structure
- [ ] Add wishlist toggle functionality
- [ ] Integrate with `wishlistStore` (or Context temporarily)
- [ ] Add hover effects and animations
- [ ] Handle product variations display
- [ ] Add "New" and "Hot" badges
- [ ] Test with different product data
- [ ] Test responsive design
- [ ] Accessibility audit

### ProductGrid Component
- [ ] Create `src/components/new-ui/ProductGrid.tsx`
- [ ] Port component from new UI
- [ ] Integrate infinite scroll logic from `useProductFetch`
- [ ] Add loading skeleton states
- [ ] Add empty state handling
- [ ] Test responsive grid layouts (2/3/4 columns)
- [ ] Test with different data volumes
- [ ] Performance testing (re-renders)

### Skeleton Components
- [ ] Create `src/components/new-ui/skeletons/ProductCardSkeleton.tsx`
- [ ] Create `src/components/new-ui/skeletons/ProductGridSkeleton.tsx`
- [ ] Create reusable skeleton utilities
- [ ] Test skeleton display

### Empty State Component
- [ ] Create `src/components/new-ui/Empty.tsx`
- [ ] Port from new UI
- [ ] Customize messaging
- [ ] Add illustrations/icons
- [ ] Test in different contexts

### Integration Testing
- [ ] Update collections page to use new ProductCard
- [ ] Test product display on collections page
- [ ] Test infinite scroll
- [ ] Test loading states
- [ ] Visual regression testing
- [ ] Mobile responsive testing

**Phase 3 Completion Criteria**:
- ✅ ProductCard component complete
- ✅ ProductGrid component complete
- ✅ Skeleton components working
- ✅ Empty states implemented
- ✅ Components integrated on collections page
- ✅ All tests passing

---

## Phase 4: Layout Components (Week 3)

### Header Component
- [ ] Create `src/components/new-ui/Header.tsx`
- [ ] Port header from new UI
- [ ] Integrate with Prior category data:
  - [ ] Fetch categories from API
  - [ ] Build category menu structure
  - [ ] Handle nested categories
- [ ] Keep existing search command palette functionality
- [ ] Add cart sidebar toggle (integrate with `uiStore`)
- [ ] Add cart item count badge
- [ ] Implement user menu dropdown:
  - [ ] Show user avatar/name when logged in
  - [ ] Profile link
  - [ ] Orders link
  - [ ] Wishlist link
  - [ ] Logout action
- [ ] Implement mobile hamburger menu
- [ ] Test sticky header behavior
- [ ] Test responsive breakpoints
- [ ] Accessibility audit

### Footer Component
- [ ] Create `src/components/new-ui/Footer.tsx`
- [ ] Port footer from new UI
- [ ] Update with Prior branding:
  - [ ] Logo and brand name
  - [ ] Company description
  - [ ] Social media links
- [ ] Add necessary links:
  - [ ] About Us
  - [ ] Privacy Policy
  - [ ] Terms & Conditions
  - [ ] Shipping Info
  - [ ] Return Policy
  - [ ] Contact Us
- [ ] Add contact information
- [ ] Add newsletter signup (if applicable)
- [ ] Test responsive layout

### CartSidebar Component
- [ ] Create `src/components/new-ui/CartSidebar.tsx`
- [ ] Port sidebar from new UI
- [ ] Integrate with `cartStore`
- [ ] Integrate with `uiStore` for visibility
- [ ] Port cart logic:
  - [ ] Display cart items with images
  - [ ] Quantity adjustment (+/- buttons)
  - [ ] Item removal
  - [ ] Total price calculation
  - [ ] Empty cart state
- [ ] Add slide-in animation (from right)
- [ ] Add backdrop overlay
- [ ] Add "Checkout" button linking to checkout page
- [ ] Test animations and transitions
- [ ] Test on mobile devices
- [ ] Accessibility (focus trap, keyboard navigation)

### Banner Component
- [ ] Create `src/components/new-ui/Banner.tsx`
- [ ] Port banner carousel from new UI
- [ ] Integrate with existing banner system/API
- [ ] Implement auto-rotation (configurable interval)
- [ ] Add manual navigation (prev/next buttons)
- [ ] Add dot indicators
- [ ] Add image overlay with title/subtitle
- [ ] Add optional CTA buttons
- [ ] Test responsive sizing
- [ ] Test on mobile devices

### Root Layout Update
- [ ] Update `src/app/layout.tsx`
- [ ] Replace old header with new Header component
- [ ] Replace old footer with new Footer component
- [ ] Add CartSidebar as global component
- [ ] Test layout on all pages
- [ ] Ensure Providers are correctly wrapped

### Navigation Testing
- [ ] Test all navigation links
- [ ] Test category menu functionality
- [ ] Test mobile menu open/close
- [ ] Test cart sidebar open/close
- [ ] Test smooth transitions
- [ ] Test sticky header behavior on scroll

**Phase 4 Completion Criteria**:
- ✅ Header component complete and integrated
- ✅ Footer component complete and integrated
- ✅ CartSidebar working and integrated
- ✅ Banner carousel functional
- ✅ Root layout updated
- ✅ Navigation flow tested
- ✅ All layout tests passing

---

## Phase 5: Feature Pages (Week 4)

### Home Page Rebuild
- [ ] Update `src/app/page.tsx`
- [ ] Use new Banner component
- [ ] Add banner section with auto-rotation
- [ ] Add "New Products" section:
  - [ ] Use new ProductGrid component
  - [ ] Fetch new products with adapter
  - [ ] Add "View All" link
- [ ] Add "Hot Products" section:
  - [ ] Use new ProductGrid component
  - [ ] Fetch best/hot products
  - [ ] Add "View All" link
- [ ] Add brand story section:
  - [ ] Add image and text content
  - [ ] Style with new design patterns
- [ ] Add service features section:
  - [ ] Free shipping
  - [ ] 7-day returns
  - [ ] Customer service
  - [ ] Icons and descriptions
- [ ] Verify SSR and ISR still working
- [ ] Test revalidation (3s)
- [ ] Test loading states
- [ ] Mobile responsive testing
- [ ] Visual QA

### Collections Page Update
- [ ] Update `src/app/collections/page.tsx`
- [ ] Port ProductFilter component:
  - [ ] Create `src/components/new-ui/ProductFilter.tsx`
  - [ ] Integrate with existing filter logic
  - [ ] Connect to filter data from API
  - [ ] Category filter (radio buttons)
  - [ ] Price range filter (min/max inputs)
  - [ ] Size filter (multi-select)
  - [ ] Color filter (with swatches)
  - [ ] Sort options dropdown
  - [ ] "Clear All" functionality
  - [ ] Collapsible sections
  - [ ] Mobile sidebar with overlay
- [ ] Integrate ProductFilter with page
- [ ] Use new ProductGrid component
- [ ] Keep infinite scroll functionality
- [ ] Add view toggle (grid/list) if not present
- [ ] Add result count display
- [ ] Test filter operations:
  - [ ] Category filtering
  - [ ] Price range filtering
  - [ ] Size filtering
  - [ ] Color filtering
  - [ ] Sorting
  - [ ] Multiple filters combined
  - [ ] Clear all filters
- [ ] Test pagination/infinite scroll
- [ ] Test mobile filter sidebar
- [ ] Performance testing (filtering large datasets)

### Product Detail Page Update
- [ ] Update `src/app/collections/[id]/page.tsx`
- [ ] Port ProductDetail layout from new UI
- [ ] Implement image gallery:
  - [ ] Main image display
  - [ ] Thumbnail navigation
  - [ ] Click to change main image
  - [ ] Zoom on hover (optional)
- [ ] Keep SSR functionality
- [ ] Adapt product info section:
  - [ ] Product name
  - [ ] Rating and reviews
  - [ ] Price (with original price if discounted)
  - [ ] Description
- [ ] Keep variation selection logic:
  - [ ] Color swatches (adapt from variations)
  - [ ] Size buttons (adapt from variations)
  - [ ] Stock validation
  - [ ] Disable unavailable combinations
- [ ] Add quantity selector:
  - [ ] +/- buttons
  - [ ] Validate against stock
- [ ] Add "Add to Cart" button:
  - [ ] Require size and color selection
  - [ ] Validate stock before adding
  - [ ] Show success feedback
- [ ] Add favorite/wishlist toggle button
- [ ] Add share button
- [ ] Add service guarantees section
- [ ] Add tabbed content:
  - [ ] Description tab
  - [ ] Specifications tab (if applicable)
  - [ ] Reviews tab (if applicable)
- [ ] Add related products section:
  - [ ] Fetch related products
  - [ ] Use ProductGrid component
  - [ ] Limit to 4-8 products
- [ ] Add back button
- [ ] Verify SSR with dynamic metadata (OG tags)
- [ ] Test with products with/without variations
- [ ] Test stock validation
- [ ] Mobile responsive testing

### Auth Page Merge
- [ ] Create or update `src/app/auth/page.tsx`
- [ ] Port Auth component from new UI
- [ ] Implement login/register toggle
- [ ] Build login form:
  - [ ] Email input with validation
  - [ ] Password input with show/hide toggle
  - [ ] "Remember me" checkbox
  - [ ] "Forgot password" link
- [ ] Build register form:
  - [ ] Name input
  - [ ] Email input with validation
  - [ ] Phone number input (adapt format for Bangladesh)
  - [ ] Password input with show/hide
  - [ ] Password confirmation
  - [ ] Terms acceptance checkbox
- [ ] Integrate with JWT authentication:
  - [ ] Call login API
  - [ ] Store JWT token
  - [ ] Handle refresh token
  - [ ] Update userStore (or Context)
- [ ] Add social login buttons (if applicable):
  - [ ] Google OAuth
  - [ ] Facebook OAuth
- [ ] Add form validation:
  - [ ] Email format
  - [ ] Phone number format (Bangladesh)
  - [ ] Password minimum length
  - [ ] Required fields
  - [ ] Error messages
- [ ] Add loading states during API calls
- [ ] Add success/error feedback
- [ ] Redirect after successful login
- [ ] Handle redirect parameter (`?redirect=/checkout`)
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Test validation errors
- [ ] Test redirect after login

### Page Testing
- [ ] Test all pages for visual consistency
- [ ] Test navigation between pages
- [ ] Test SSR/ISR on applicable pages
- [ ] Test loading states
- [ ] Test error states
- [ ] Mobile responsive testing on all pages
- [ ] Cross-browser testing

**Phase 5 Completion Criteria**:
- ✅ Home page redesigned with new UI
- ✅ Collections page updated with new filter and grid
- ✅ Product detail page updated with new layout
- ✅ Auth pages merged and functional
- ✅ SSR/ISR preserved where needed
- ✅ All page tests passing

---

## Phase 6: Auth & User Store (Week 4-5)

### User Store Implementation
- [ ] Create `src/store/userStore.ts`
- [ ] Implement Zustand persist middleware
- [ ] Port JWT authentication logic from `AuthContext.tsx`:
  - [ ] `login` function (API call, store token)
  - [ ] `logout` function (clear token, clear user)
  - [ ] `updateUser` function (partial update)
  - [ ] `refreshAccessToken` function (refresh JWT)
- [ ] Implement token expiry checking:
  - [ ] Decode JWT to get expiry
  - [ ] Set up interval check (5 minutes)
  - [ ] Auto-refresh if expiring soon
- [ ] Implement auto-refresh mechanism:
  - [ ] Call refresh API before token expires
  - [ ] Update token in store
  - [ ] Handle refresh failure (logout)
- [ ] Add loading states
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test token refresh
- [ ] Test auto-refresh timing
- [ ] Test token expiry handling

### Wishlist Store Implementation
- [ ] Create `src/store/wishlistStore.ts`
- [ ] Implement conditional persistence:
  - [ ] For authenticated users: sync with API
  - [ ] For guest users: localStorage only
- [ ] Implement wishlist operations:
  - [ ] `addToWishlist` function
  - [ ] `removeFromWishlist` function
  - [ ] `clearWishlist` function
  - [ ] `isInWishlist` function (O(1) lookup with Set)
- [ ] Implement API integration:
  - [ ] Fetch wishlist on login
  - [ ] Sync local wishlist with backend on login
  - [ ] Call add/remove APIs for auth users
- [ ] Implement sync logic:
  - [ ] Merge local and backend wishlists on login
  - [ ] Handle conflicts (prefer backend)
  - [ ] Clear local wishlist after sync
- [ ] Add loading states
- [ ] Test guest wishlist (localStorage)
- [ ] Test authenticated wishlist (API)
- [ ] Test guest → auth transition (sync)
- [ ] Test add/remove operations
- [ ] Test persistence

### Context to Zustand Migration
- [ ] Identify all Context usage in components:
  - [ ] CartContext usage
  - [ ] AuthContext usage
  - [ ] WishlistContext usage
  - [ ] PageStateContext usage (may remove)
- [ ] Update components to use Zustand stores:
  - [ ] Replace `useCart()` with `useCartStore()`
  - [ ] Replace `useAuth()` with `useUserStore()`
  - [ ] Replace `useWishlist()` with `useWishlistStore()`
- [ ] Update imports throughout the codebase
- [ ] Test each component after migration
- [ ] Remove old Context providers from `layout.tsx`
- [ ] Delete old Context files (after thorough testing)

### Testing
- [ ] Unit tests for userStore
- [ ] Unit tests for wishlistStore
- [ ] Integration tests for auth flow
- [ ] Integration tests for wishlist sync
- [ ] Test token refresh mechanism
- [ ] Test auto-refresh timing
- [ ] Test guest to authenticated transition
- [ ] E2E test: login → add to wishlist → logout → login → verify sync

**Phase 6 Completion Criteria**:
- ✅ userStore fully implemented
- ✅ wishlistStore fully implemented
- ✅ All Context usage replaced with Zustand
- ✅ Old Context providers removed
- ✅ Authentication flow working
- ✅ Wishlist sync working
- ✅ All tests passing

---

## Phase 7: Checkout Flow (Week 5)

### Checkout UI Design
- [ ] Review current checkout page (`src/app/checkout/page.tsx`)
- [ ] Design new checkout UI based on new UI patterns
- [ ] Create wireframes/mockups for new checkout
- [ ] Get stakeholder approval on new design

### Checkout Page Rebuild
- [ ] Update `src/app/checkout/page.tsx`
- [ ] Implement new form layout
- [ ] Customer information section:
  - [ ] Name input
  - [ ] Phone number input
  - [ ] Email input (optional)
  - [ ] Auto-fill for logged-in users
- [ ] Shipping address section:
  - [ ] Division dropdown
  - [ ] District dropdown (filter by division)
  - [ ] Detailed address textarea
  - [ ] Postal code input
  - [ ] Address validation
- [ ] Order summary section:
  - [ ] Cart items list with images
  - [ ] Quantity for each item
  - [ ] Price breakdown
  - [ ] Subtotal calculation
  - [ ] Delivery charge (based on district)
  - [ ] Discount (if applicable)
  - [ ] Total amount
- [ ] Payment method section:
  - [ ] Cash on Delivery (COD) option
  - [ ] bKash payment option
  - [ ] Prepayment requirement indicator (outside Dhaka)
  - [ ] Campaign prepayment handling
- [ ] Terms and conditions checkbox
- [ ] Place order button

### Business Logic Integration
- [ ] Keep product verification on load:
  - [ ] Fetch latest product data
  - [ ] Compare with cart prices/stock
  - [ ] Show dialog if changes detected
  - [ ] Update cart with latest info
- [ ] Keep district-based delivery charge:
  - [ ] Dhaka city: 80 BDT
  - [ ] Dhaka suburbs: 130 BDT
  - [ ] Outside Dhaka: 150 BDT
  - [ ] Auto-calculate based on selected district
- [ ] Keep prepayment logic:
  - [ ] Check if outside Dhaka
  - [ ] Check if campaign requires prepayment
  - [ ] Disable COD if prepayment required
  - [ ] Show prepayment message
- [ ] Implement form validation:
  - [ ] Required fields
  - [ ] Phone number format (Bangladesh)
  - [ ] Email format
  - [ ] District selection
- [ ] Keep order creation flow:
  - [ ] Build order object
  - [ ] Call order creation API
  - [ ] Handle API errors
  - [ ] Show success/error feedback

### bKash Payment Integration
- [ ] Keep bKash checkout integration
- [ ] Test bKash payment flow:
  - [ ] Initiate payment
  - [ ] Redirect to bKash
  - [ ] Handle callback
  - [ ] Verify payment
  - [ ] Create order on success
- [ ] Test prepayment scenarios
- [ ] Handle payment failures gracefully

### Firebase Analytics Integration
- [ ] Keep Firebase Analytics tracking:
  - [ ] `begin_checkout` event on page load
  - [ ] `add_payment_info` event on payment method selection
  - [ ] `purchase` event on successful order
- [ ] Verify events are firing correctly
- [ ] Test with Firebase DebugView

### Testing
- [ ] Test complete checkout flow (guest)
- [ ] Test complete checkout flow (authenticated)
- [ ] Test product verification on load
- [ ] Test delivery charge calculation (all districts)
- [ ] Test prepayment requirement (outside Dhaka)
- [ ] Test campaign prepayment
- [ ] Test COD order creation
- [ ] Test bKash payment order creation
- [ ] Test form validation (all fields)
- [ ] Test error handling (API failures)
- [ ] Test success/error feedback
- [ ] Test analytics events
- [ ] Mobile responsive testing
- [ ] Cross-browser testing

**Phase 7 Completion Criteria**:
- ✅ New checkout UI implemented
- ✅ All business logic preserved
- ✅ Product verification working
- ✅ District pricing working
- ✅ Prepayment logic working
- ✅ bKash integration working
- ✅ Analytics tracking verified
- ✅ All checkout tests passing

---

## Phase 8: Account Pages (Week 5-6)

### Account Layout
- [ ] Create account layout component
- [ ] Design sidebar navigation (desktop)
- [ ] Design tab navigation (mobile)
- [ ] Navigation items:
  - [ ] Profile
  - [ ] Orders
  - [ ] Wishlist
  - [ ] Addresses
  - [ ] Settings
- [ ] Implement layout routing

### Profile Page
- [ ] Create or update `src/app/account/profile/page.tsx`
- [ ] Display user information:
  - [ ] Name
  - [ ] Email
  - [ ] Phone number
  - [ ] Date of birth
  - [ ] Gender
  - [ ] Profile picture
- [ ] Implement edit mode:
  - [ ] Toggle edit/view mode
  - [ ] Editable form fields
  - [ ] Form validation
- [ ] Implement profile update:
  - [ ] Call update user API
  - [ ] Update userStore
  - [ ] Show success/error feedback
- [ ] Add profile picture upload (if applicable)
- [ ] Test profile view
- [ ] Test profile update
- [ ] Test validation

### Orders Page
- [ ] Create or update `src/app/account/orders/page.tsx`
- [ ] Fetch user orders from API
- [ ] Display orders list:
  - [ ] Order ID
  - [ ] Order date
  - [ ] Total amount
  - [ ] Status (pending, paid, shipped, delivered, cancelled)
  - [ ] Items count
- [ ] Implement order card:
  - [ ] Product images
  - [ ] Product names and quantities
  - [ ] Total price
  - [ ] Status badge
  - [ ] "View Details" link
- [ ] Add order status filtering (optional)
- [ ] Add pagination or infinite scroll
- [ ] Add empty state (no orders)
- [ ] Test orders display
- [ ] Test pagination
- [ ] Test order status filtering

### Order Detail Page
- [ ] Create or update `src/app/order/[id]/page.tsx`
- [ ] Fetch order details by ID
- [ ] Display order information:
  - [ ] Order ID and date
  - [ ] Status with timeline
  - [ ] Shipping address
  - [ ] Payment method
  - [ ] Items list with images, names, quantities, prices
  - [ ] Price breakdown (subtotal, delivery, discount, total)
- [ ] Add order tracking (if applicable)
- [ ] Add cancel order button (if status allows)
- [ ] Add download invoice button (optional)
- [ ] Test order detail display
- [ ] Test order cancellation (if applicable)

### Wishlist Page
- [ ] Create or update `src/app/account/wishlist/page.tsx`
- [ ] Fetch wishlist from `wishlistStore`
- [ ] Fetch product details for wishlist items
- [ ] Display wishlist products:
  - [ ] Use ProductGrid or ProductCard
  - [ ] Show remove button
  - [ ] Show "Add to Cart" button
- [ ] Implement remove from wishlist
- [ ] Implement add to cart from wishlist
- [ ] Add empty state (no wishlist items)
- [ ] Test wishlist display
- [ ] Test remove from wishlist
- [ ] Test add to cart from wishlist

### Addresses Page (Optional)
- [ ] Create `src/app/account/addresses/page.tsx`
- [ ] Fetch user addresses from API or userStore
- [ ] Display addresses list:
  - [ ] Name
  - [ ] Phone
  - [ ] Address details
  - [ ] Default address indicator
- [ ] Add "Add New Address" button
- [ ] Implement address form:
  - [ ] Name, phone
  - [ ] Division, district, detailed address, postal code
  - [ ] Set as default checkbox
- [ ] Implement add/edit/delete address
- [ ] Test address management

### Protected Routes
- [ ] Ensure all account pages are protected:
  - [ ] Redirect to login if not authenticated
  - [ ] Pass redirect parameter (`?redirect=/account/...`)
  - [ ] Redirect back after login
- [ ] Test protected routes
- [ ] Test redirect flow

**Phase 8 Completion Criteria**:
- ✅ Account layout implemented
- ✅ Profile page functional
- ✅ Orders page functional
- ✅ Order detail page functional
- ✅ Wishlist page functional
- ✅ Address management (if applicable)
- ✅ Protected routes working
- ✅ All account tests passing

---

## Phase 9: Polish & Optimization (Week 6)

### Loading States
- [ ] Add loading skeletons to all pages:
  - [ ] Home page sections
  - [ ] Collections page (product grid)
  - [ ] Product detail page
  - [ ] Account pages
  - [ ] Cart sidebar
- [ ] Add loading spinners for buttons:
  - [ ] Add to cart button
  - [ ] Place order button
  - [ ] Login/register buttons
- [ ] Test loading states throughout the app

### Error Handling
- [ ] Implement error boundaries:
  - [ ] Page-level error boundaries
  - [ ] Component-level error boundaries (if needed)
- [ ] Add error states for failed API calls:
  - [ ] Product fetch errors
  - [ ] Order creation errors
  - [ ] Payment errors
  - [ ] Auth errors
- [ ] Add user-friendly error messages
- [ ] Add retry functionality where applicable
- [ ] Test error scenarios

### Empty States
- [ ] Add empty states for all lists:
  - [ ] Empty cart
  - [ ] Empty wishlist
  - [ ] No orders
  - [ ] No search results
  - [ ] No products in category
- [ ] Add helpful messages and CTAs
- [ ] Add illustrations (optional)
- [ ] Test all empty states

### Image Optimization
- [ ] Audit image usage throughout the app
- [ ] Ensure Next.js Image component is used everywhere
- [ ] Optimize image sizes and formats:
  - [ ] Use WebP format
  - [ ] Use AVIF format where supported
  - [ ] Set appropriate sizes prop
  - [ ] Use responsive image sizes
- [ ] Test image loading on slow networks
- [ ] Measure image impact on performance

### Performance Audit
- [ ] Run Lighthouse audit on all major pages:
  - [ ] Home page
  - [ ] Collections page
  - [ ] Product detail page
  - [ ] Checkout page
- [ ] Analyze bundle size:
  - [ ] Run `ANALYZE=true npm run build`
  - [ ] Review bundle analyzer report
  - [ ] Identify large dependencies
  - [ ] Implement code splitting if needed
- [ ] Measure Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Optimize where needed:
  - [ ] Lazy load components
  - [ ] Reduce bundle size
  - [ ] Optimize images further
  - [ ] Minimize CSS/JS
- [ ] Re-run Lighthouse after optimizations
- [ ] Compare before/after metrics

### Accessibility Audit
- [ ] Run axe DevTools on all pages
- [ ] Check keyboard navigation:
  - [ ] Tab through all interactive elements
  - [ ] Ensure focus is visible
  - [ ] Ensure logical tab order
  - [ ] Test Escape key (close modals/sidebars)
- [ ] Check screen reader compatibility:
  - [ ] Test with NVDA/JAWS (Windows)
  - [ ] Test with VoiceOver (Mac/iOS)
  - [ ] Ensure all content is announced
  - [ ] Ensure buttons/links have descriptive labels
- [ ] Check color contrast:
  - [ ] Text on background
  - [ ] Button text
  - [ ] Link text
- [ ] Add ARIA labels where needed:
  - [ ] Icon buttons
  - [ ] Complex widgets
  - [ ] Live regions (cart updates, notifications)
- [ ] Test form error announcements
- [ ] Fix all accessibility issues
- [ ] Re-run accessibility audit

### Mobile Testing
- [ ] Test on real iOS devices:
  - [ ] iPhone 13/14/15 (various sizes)
  - [ ] Safari browser
- [ ] Test on real Android devices:
  - [ ] Samsung, Google Pixel
  - [ ] Chrome browser
- [ ] Test responsive breakpoints:
  - [ ] 320px (small phones)
  - [ ] 375px (iPhone SE)
  - [ ] 414px (iPhone Plus)
  - [ ] 768px (tablets)
  - [ ] 1024px (small desktops)
- [ ] Test touch interactions:
  - [ ] Tap targets (minimum 44x44px)
  - [ ] Swipe gestures (if applicable)
  - [ ] Pinch to zoom (product images)
- [ ] Test mobile-specific features:
  - [ ] Mobile menu
  - [ ] Filter sidebar
  - [ ] Cart sidebar
- [ ] Fix mobile-specific issues

### Cross-Browser Testing
- [ ] Test on Chrome (latest):
  - [ ] Desktop
  - [ ] Mobile
- [ ] Test on Firefox (latest):
  - [ ] Desktop
  - [ ] Mobile
- [ ] Test on Safari (latest):
  - [ ] Desktop (Mac)
  - [ ] Mobile (iOS)
- [ ] Test on Edge (latest):
  - [ ] Desktop
- [ ] Test on older browsers (if supported):
  - [ ] Safari 14+
  - [ ] Chrome 90+
  - [ ] Firefox 90+
- [ ] Fix browser-specific issues

### Final Bug Fixes
- [ ] Review all open issues
- [ ] Prioritize critical and high-priority bugs
- [ ] Fix all critical bugs
- [ ] Fix high-priority bugs
- [ ] Test bug fixes
- [ ] Close resolved issues

**Phase 9 Completion Criteria**:
- ✅ Loading states added everywhere
- ✅ Error handling comprehensive
- ✅ Empty states implemented
- ✅ Images optimized
- ✅ Lighthouse score 90+ on all pages
- ✅ Core Web Vitals meeting targets
- ✅ Accessibility audit passing
- ✅ Mobile testing complete
- ✅ Cross-browser testing complete
- ✅ All critical bugs fixed

---

## Phase 10: Deployment (Week 6)

### Staging Deployment
- [ ] Deploy to staging environment
- [ ] Verify staging build is successful
- [ ] Test staging deployment:
  - [ ] All pages load correctly
  - [ ] API connections working
  - [ ] Payment integration working
  - [ ] Analytics tracking working
- [ ] Invite QA team to test staging
- [ ] Invite stakeholders to review staging

### QA Testing on Staging
- [ ] Run full QA test suite
- [ ] Test all user flows:
  - [ ] Browse products
  - [ ] Search and filter
  - [ ] Add to cart
  - [ ] Checkout (COD)
  - [ ] Checkout (bKash)
  - [ ] Login/register
  - [ ] Wishlist
  - [ ] Account management
- [ ] Test on multiple devices
- [ ] Test on multiple browsers
- [ ] Document any issues found
- [ ] Fix staging issues
- [ ] Re-test after fixes

### Stakeholder Review
- [ ] Schedule stakeholder demo
- [ ] Present new UI and features
- [ ] Collect feedback
- [ ] Address critical feedback
- [ ] Get approval for production deployment

### Feature Flags Setup (Optional)
- [ ] Set up feature flag system (if not already)
- [ ] Add environment variables for flags:
  - [ ] `NEXT_PUBLIC_FF_NEW_PRODUCT_CARD`
  - [ ] `NEXT_PUBLIC_FF_NEW_HEADER`
  - [ ] `NEXT_PUBLIC_FF_CART_SIDEBAR`
  - [ ] `NEXT_PUBLIC_FF_NEW_CHECKOUT`
  - [ ] `NEXT_PUBLIC_FF_ZUSTAND_STORES`
- [ ] Implement feature flag checks in code
- [ ] Test feature flags on/off
- [ ] Default all flags to `false` initially

### Production Deployment (Initial)
- [ ] Deploy to production with feature flags OFF
- [ ] Verify production build
- [ ] Test production deployment (with flags off)
- [ ] Ensure no disruption to existing users

### Beta Testing (10% Users)
- [ ] Enable feature flags for 10% of users (A/B test)
- [ ] Set up monitoring:
  - [ ] Error tracking (Sentry, Bugsnag, etc.)
  - [ ] Analytics monitoring (Google Analytics, Firebase)
  - [ ] Performance monitoring (Lighthouse CI, Speedcurve)
- [ ] Monitor key metrics:
  - [ ] Error rate
  - [ ] Conversion rate
  - [ ] Page load times
  - [ ] Cart abandonment rate
  - [ ] Checkout completion rate
- [ ] Collect user feedback
- [ ] Monitor for 2-3 days
- [ ] Address any critical issues

### Gradual Rollout
- [ ] If beta successful, increase to 25% of users
- [ ] Monitor for 1-2 days
- [ ] If stable, increase to 50% of users
- [ ] Monitor for 1-2 days
- [ ] If stable, increase to 75% of users
- [ ] Monitor for 1 day
- [ ] If stable, increase to 100% of users
- [ ] Monitor for 1 week

### Full Launch
- [ ] Remove feature flags (or set to 100%)
- [ ] Announce new UI to users (email, social media, banner)
- [ ] Monitor analytics closely
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Address any issues promptly

### Rollback Plan (If Needed)
- [ ] Document rollback triggers:
  - [ ] Critical bug affecting checkout/payment
  - [ ] Error rate increase > 5%
  - [ ] Conversion rate drop > 20%
  - [ ] Negative user feedback > 70%
- [ ] Test rollback process:
  - [ ] Disable feature flags (< 5 min)
  - [ ] Deploy previous build (< 30 min)
- [ ] Assign rollback decision-makers
- [ ] Keep old code available for quick rollback

**Phase 10 Completion Criteria**:
- ✅ Staging deployment successful
- ✅ QA testing complete
- ✅ Stakeholder approval obtained
- ✅ Production deployment successful
- ✅ Beta testing complete
- ✅ Gradual rollout complete
- ✅ 100% of users on new UI
- ✅ Monitoring in place
- ✅ No critical issues

---

## Post-Migration Tasks (Week 7-9)

### Code Cleanup (Week 7-8)
- [ ] Remove old Context providers:
  - [ ] Delete `src/context/CartContext.tsx`
  - [ ] Delete `src/context/AuthContext.tsx`
  - [ ] Delete `src/context/WishlistContext.tsx`
  - [ ] Delete `src/context/PageStateContext.tsx` (if applicable)
- [ ] Remove old components:
  - [ ] Delete old ProductCard component
  - [ ] Delete old Header/Navbar component
  - [ ] Delete old Footer component
  - [ ] Delete old cart page (if not needed)
- [ ] Remove feature flags:
  - [ ] Remove feature flag checks from code
  - [ ] Remove feature flag environment variables
- [ ] Remove temporary directories:
  - [ ] Delete `src/components/new-ui/` (move to proper locations)
  - [ ] Reorganize component structure
- [ ] Clean up unused dependencies:
  - [ ] Review package.json
  - [ ] Remove unused packages
  - [ ] Run `npm prune`
- [ ] Archive old code:
  - [ ] Create git branch with old implementation
  - [ ] Tag release before migration
  - [ ] Document where to find old code
- [ ] Update imports throughout codebase:
  - [ ] Fix any broken imports
  - [ ] Ensure all imports are correct
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Fix any linting issues
- [ ] Commit cleanup changes

### Optimization (Week 8-9)
- [ ] Further bundle size optimization:
  - [ ] Review bundle analyzer again
  - [ ] Implement dynamic imports for large components
  - [ ] Tree-shake unused code
  - [ ] Remove console.log statements
- [ ] Image optimization improvements:
  - [ ] Audit image usage again
  - [ ] Optimize any missed images
  - [ ] Implement lazy loading for below-fold images
- [ ] Code splitting enhancements:
  - [ ] Split large pages into smaller chunks
  - [ ] Lazy load non-critical components
  - [ ] Test code splitting effectiveness
- [ ] Caching strategy review:
  - [ ] Review ISR revalidation times
  - [ ] Optimize cache headers
  - [ ] Test caching behavior
- [ ] Performance monitoring setup:
  - [ ] Set up continuous Lighthouse CI
  - [ ] Set up performance budgets
  - [ ] Set up alerts for performance regressions
- [ ] Run performance tests again
- [ ] Compare before/after metrics
- [ ] Document performance improvements

### Documentation (Week 9)
- [ ] Update component documentation:
  - [ ] Document new components
  - [ ] Add JSDoc comments
  - [ ] Add usage examples
- [ ] Create Storybook for new components (optional):
  - [ ] Set up Storybook
  - [ ] Add stories for ProductCard
  - [ ] Add stories for ProductGrid
  - [ ] Add stories for ProductFilter
  - [ ] Add stories for other components
- [ ] Document Zustand stores:
  - [ ] Document store structure
  - [ ] Document store methods
  - [ ] Add usage examples
- [ ] Update README:
  - [ ] Update project description
  - [ ] Update tech stack section
  - [ ] Add migration notes
  - [ ] Update setup instructions
- [ ] Create developer guide:
  - [ ] How to add new components
  - [ ] How to use Zustand stores
  - [ ] How to integrate with API
  - [ ] Code style guide
  - [ ] Testing guide
- [ ] Record video tutorials (optional):
  - [ ] Project setup
  - [ ] Adding new features
  - [ ] Using Zustand stores
  - [ ] Running tests
- [ ] Update CHANGELOG.md
- [ ] Document known issues (if any)

**Post-Migration Completion Criteria**:
- ✅ All old code removed
- ✅ Codebase clean and organized
- ✅ Further optimizations applied
- ✅ Documentation complete
- ✅ No technical debt from migration

---

## Success Metrics Review

### Performance Metrics
- [ ] Lighthouse Performance Score: _____ (target: 90+)
- [ ] Bundle Size: _____ KB gzipped (target: < 500KB)
- [ ] LCP: _____ s (target: < 2.5s)
- [ ] FID: _____ ms (target: < 100ms)
- [ ] CLS: _____ (target: < 0.1)

### Business Metrics (Measure after 2-4 weeks)
- [ ] Cart abandonment rate: _____ % (baseline: _____ %)
- [ ] Checkout completion rate: _____ % (baseline: _____ %)
- [ ] Page load time: _____ s (baseline: _____ s)
- [ ] Mobile conversion rate: _____ % (baseline: _____ %)
- [ ] Time on site: _____ min (baseline: _____ min)

### Quality Metrics
- [ ] Critical bugs in production: _____ (target: 0)
- [ ] High-priority bugs in first week: _____ (target: < 5)
- [ ] Test coverage: _____ % (target: 95%+)
- [ ] WCAG 2.1 compliance: _____ (target: Level AA)
- [ ] Browser compatibility: _____ % (target: 99%+)

### User Feedback
- [ ] User satisfaction score: _____ / 10
- [ ] Net Promoter Score (NPS): _____
- [ ] Positive feedback percentage: _____ %
- [ ] Negative feedback percentage: _____ %
- [ ] Common user complaints: _____

---

## Sign-Off

### Phase Approvals

**Phase 1 - Foundation Setup**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 2 - State Migration**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 3 - Core Components**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 4 - Layout Components**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 5 - Feature Pages**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 6 - Auth & User Store**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 7 - Checkout Flow**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 8 - Account Pages**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 9 - Polish & Optimization**
- [ ] Approved by: _______________
- [ ] Date: _______________

**Phase 10 - Deployment**
- [ ] Approved by: _______________
- [ ] Date: _______________

### Final Sign-Off

**Migration Complete**
- [ ] Technical Lead: _______________
- [ ] Product Manager: _______________
- [ ] Date: _______________

---

## Notes and Issues

### Issues Log
Use this section to track any issues or blockers encountered during migration:

| Date | Phase | Issue Description | Status | Resolution |
|------|-------|-------------------|--------|------------|
|      |       |                   |        |            |
|      |       |                   |        |            |
|      |       |                   |        |            |

### Decisions Log
Use this section to document important decisions made during migration:

| Date | Decision | Rationale | Impact |
|------|----------|-----------|--------|
|      |          |           |        |
|      |          |           |        |
|      |          |           |        |

### Risks and Mitigation
Use this section to track risks and mitigation strategies:

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
|      |            |        |            |        |
|      |            |        |            |        |
|      |            |        |            |        |

---

**End of Migration Checklist**
