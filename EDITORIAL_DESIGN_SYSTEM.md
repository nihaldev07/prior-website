# Editorial Design System - Complete Style Guide

A comprehensive design system for creating magazine-quality UI components with sophisticated typography, refined spacing, and elegant interactions.

## 🎨 Core Design Principles

### 1. Editorial Typography
Magazine-inspired text hierarchy with serif fonts and generous letter spacing.

### 2. Refined Whitespace
Generous padding and margins create breathing room and sophistication.

### 3. Subtle Interactions
Restrained animations with focus on transitions and states.

### 4. Minimal Color Palette
Neutral grays with strategic accent colors for emphasis.

### 5. Clean Borders
Thin lines (1px) and subtle separators instead of heavy shadows.

---

## 📐 Typography System

### Font Families

```css
/* Primary - Serif for headers and key content */
font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

/* Secondary - Sans-serif for UI elements */
font-family: ui-sans-serif, system-ui, sans-serif;
```

**Tailwind Classes:**
```tsx
font-serif  // For headings, labels, body text, buttons
font-sans   // For navigation, small UI elements
```

### Type Scale

```tsx
// Extra Small - Labels, Metadata
text-xs tracking-[0.2em] uppercase
// Example: "SELECT SIZE", "CATEGORY", "COLOR"

// Small - Body Text, Descriptions
text-sm leading-relaxed
// Example: Product descriptions, helper text

// Base - Standard Text
text-base tracking-wide
// Example: Form inputs, default content

// Large - Subheadings
text-lg tracking-wide
// Example: Section titles, card headers

// XL - Headings
text-xl tracking-wide
// Example: Modal titles, page headings

// 2XL - Display
text-2xl tracking-wide leading-tight
// Example: Product names, hero text

// 3XL - Hero Prices
text-3xl
// Example: Prices, key numbers
```

### Letter Spacing Guide

```tsx
tracking-[0.15em]  // Buttons, CTAs (15% spacing)
tracking-[0.2em]   // Labels, categories (20% spacing)
tracking-wide      // General text (0.025em)
tracking-wider     // Emphasis (0.05em)
```

### Text Styles Quick Reference

```tsx
// Section Label
className="text-xs font-serif tracking-[0.2em] uppercase text-neutral-700"

// Product Title
className="text-2xl font-serif tracking-wide text-neutral-900 leading-tight"

// Body Text
className="text-sm font-serif leading-relaxed text-neutral-600"

// Price (Large)
className="text-3xl font-serif text-neutral-900"

// Price (Small)
className="text-lg font-serif text-neutral-400 line-through"

// Button Text
className="text-sm font-serif tracking-[0.15em] uppercase"
```

---

## 🎨 Color System

### Neutral Palette (Primary)

```tsx
// Backgrounds
bg-white           // #FFFFFF - Main background
bg-neutral-50      // #FAFAFA - Image containers, cards
bg-neutral-100     // #F5F5F5 - Hover states, disabled

// Borders
border-neutral-200 // #E5E5E5 - Default borders
border-neutral-300 // #D4D4D4 - Hover borders
border-neutral-900 // #171717 - Active/focused borders

// Text
text-neutral-900   // #171717 - Primary text
text-neutral-700   // #404040 - Labels
text-neutral-600   // #525252 - Body text
text-neutral-500   // #737373 - Metadata
text-neutral-400   // #A3A3A3 - Disabled, strikethrough
```

### Accent Colors (Minimal Use)

```tsx
// Special Offers
bg-amber-50        // #FFFBEB - Alert background
text-amber-900     // #78350F - Alert text
border-amber-300   // #FCD34D - Alert border

// Errors/Out of Stock
bg-red-50          // #FEF2F2 - Error background
text-red-600       // #DC2626 - Error text
border-red-300     // #FCA5A5 - Error border

// Success
bg-emerald-50      // #ECFDF5 - Success background
text-emerald-900   // #064E3B - Success text
border-emerald-300 // #6EE7B7 - Success border
```

### Color Usage Rules

**DO:**
- Use neutral-900 for primary text
- Use white/neutral-50 for backgrounds
- Keep accent colors minimal (5-10% of UI)
- Use borders instead of shadows

**DON'T:**
- Mix multiple accent colors in one component
- Use bright, saturated colors
- Overuse gradients or effects
- Use heavy box shadows

---

## 📏 Spacing System

### Spacing Scale

```tsx
// Editorial spacing uses larger gaps
space-y-2   // 8px  - Tight elements
space-y-3   // 12px - Related items
space-y-4   // 16px - Component sections
space-y-6   // 24px - Major sections
space-y-8   // 32px - Page sections
space-y-12  // 48px - Hero sections
```

### Component Spacing Patterns

**Card Padding:**
```tsx
p-4   // Mobile (16px)
p-6   // Tablet/Desktop (24px)
p-8   // Large components (32px)
```

**Section Gaps:**
```tsx
gap-4   // Related elements
gap-6   // Component groups
gap-8   // Major sections
gap-12  // Page sections
```

**Vertical Rhythm:**
```tsx
// Always use space-y-* for consistent vertical spacing
<div className="space-y-6">    // Between major sections
  <div className="space-y-3">  // Within sections
    <div className="space-y-2"> // Related elements
    </div>
  </div>
</div>
```

---

## 🔲 Border & Shadow System

### Borders

```tsx
// Standard Border
border border-neutral-200

// Hover Border
hover:border-neutral-900

// Active/Focus Border
focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900

// Top/Bottom Separators
border-t border-neutral-200  // Top
border-b border-neutral-200  // Bottom

// Divider Line
<div className="h-px bg-neutral-200" />
```

### Border Radius

```tsx
rounded-none  // Editorial style - no rounding
rounded-sm    // 2px - Minimal rounding for images
rounded       // 4px - Occasional use for badges/tags
```

**DO:**
- Use rounded-none for buttons and containers
- Use rounded-sm for images only
- Keep borders thin (1px)

**DON'T:**
- Use heavy rounded corners
- Mix different border radii
- Use thick borders (>2px)

### Shadows (Minimal)

```tsx
// Only use shadows for floating elements
shadow-sm     // Subtle shadow for badges
shadow        // Cards/modals (use sparingly)

// Prefer borders over shadows
border border-neutral-200  // Instead of shadow-lg
```

---

## 🎯 Component Patterns

### Button Styles

```tsx
// Primary Button - Editorial
<Button className="
  h-14 
  w-full 
  text-sm 
  font-serif 
  tracking-[0.15em] 
  uppercase 
  bg-neutral-900 
  hover:bg-neutral-800 
  text-white 
  border-0 
  rounded-none 
  transition-colors 
  duration-300
">
  Button Text
</Button>

// Secondary Button - Editorial
<Button className="
  h-12 
  w-full 
  text-sm 
  font-serif 
  tracking-[0.15em] 
  uppercase 
  bg-white 
  hover:bg-neutral-900 
  text-neutral-900 
  hover:text-white 
  border 
  border-neutral-300 
  rounded-none 
  transition-all 
  duration-300
">
  Button Text
</Button>

// Icon Button - Editorial
<button className="
  w-10 
  h-10 
  flex 
  items-center 
  justify-center 
  border 
  border-neutral-300 
  hover:border-neutral-900 
  transition-colors
">
  <Icon className="h-4 w-4 text-neutral-900" />
</button>
```

### Card/Container Styles

```tsx
// Editorial Card
<div className="
  bg-white 
  border 
  border-neutral-200 
  rounded-sm 
  p-6 
  space-y-4
">
  {/* Content */}
</div>

// Image Container
<div className="
  relative 
  w-full 
  aspect-square 
  bg-neutral-50 
  rounded-sm 
  overflow-hidden
">
  <Image 
    src={src} 
    alt={alt} 
    fill 
    className="object-contain" 
  />
</div>
```

### Form Elements

```tsx
// Input - Editorial
<input className="
  w-full 
  h-12 
  px-4 
  text-sm 
  font-serif 
  border 
  border-neutral-300 
  rounded-none 
  focus:border-neutral-900 
  focus:ring-1 
  focus:ring-neutral-900 
  focus:outline-none 
  transition-colors
" />

// Label - Editorial
<label className="
  text-xs 
  font-serif 
  tracking-[0.2em] 
  uppercase 
  text-neutral-700
">
  Label Text
</label>

// Select - Editorial
<select className="
  w-full 
  h-12 
  px-4 
  text-sm 
  font-serif 
  border 
  border-neutral-300 
  rounded-none 
  focus:border-neutral-900 
  focus:outline-none 
  bg-white 
  cursor-pointer
">
  <option>Option</option>
</select>
```

### Badge Styles

```tsx
// Editorial Badge - Info
<div className="
  bg-white/95 
  backdrop-blur-sm 
  px-4 
  py-2 
  shadow-sm
">
  <p className="text-xs font-serif italic text-neutral-900">
    Special Offer
  </p>
</div>

// Editorial Badge - Minimal
<span className="
  text-xs 
  font-serif 
  tracking-wide 
  text-neutral-900 
  font-medium
">
  Badge Text
</span>
```

### Separator Styles

```tsx
// Horizontal Line
<div className="h-px bg-neutral-200" />

// Section Border
<div className="border-b border-neutral-200 pb-6" />

// Separator with Text
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-neutral-200" />
  </div>
  <div className="relative flex justify-center">
    <span className="bg-white px-4 text-xs font-serif text-neutral-600 tracking-wide">
      OR
    </span>
  </div>
</div>
```

---

## 🎬 Animation & Transitions

### Transition Timing

```tsx
// Fast - UI Elements
transition-colors duration-200

// Standard - Interactions
transition-all duration-300

// Slow - Emphasis
transition-all duration-500
```

### Hover Effects

```tsx
// Border Hover
hover:border-neutral-900 transition-colors

// Background Hover (Buttons)
hover:bg-neutral-800 transition-colors duration-300

// Color Invert Hover
hover:bg-neutral-900 hover:text-white transition-all duration-300

// Scale (Subtle)
hover:scale-[1.02] transition-transform duration-300
```

### Focus States

```tsx
// Standard Focus
focus:outline-none 
focus:ring-1 
focus:ring-neutral-900 
focus:border-neutral-900

// Visible Focus (Accessibility)
focus-visible:ring-2 
focus-visible:ring-offset-2 
focus-visible:ring-neutral-900
```

---

## 📱 Responsive Patterns

### Mobile-First Approach

```tsx
// Base (Mobile)
text-sm p-4 gap-4

// Tablet (md: 768px)
md:text-base md:p-6 md:gap-6

// Desktop (lg: 1024px)
lg:text-lg lg:p-8 lg:gap-8
```

### Common Responsive Patterns

```tsx
// Responsive Spacing
space-y-6 md:space-y-8 lg:space-y-12

// Responsive Text
text-xl md:text-2xl lg:text-3xl

// Responsive Containers
max-w-sm md:max-w-md lg:max-w-lg

// Responsive Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## 🧩 Common Component Examples

### Product Card - Editorial

```tsx
<div className="group relative">
  {/* Image */}
  <div className="relative aspect-square bg-neutral-50 rounded-sm overflow-hidden">
    <Image 
      src={image} 
      alt={name} 
      fill 
      className="object-contain transition-transform duration-700 group-hover:scale-[1.02]" 
    />
  </div>
  
  {/* Info */}
  <div className="mt-6 space-y-2">
    <p className="text-xs font-serif tracking-[0.2em] uppercase text-neutral-500">
      {category}
    </p>
    <h3 className="text-base font-serif tracking-wide text-neutral-900">
      {name}
    </h3>
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-serif text-neutral-900">
        ৳{price}
      </span>
    </div>
  </div>
</div>
```

### Modal/Sheet Header - Editorial

```tsx
<div className="pb-6 border-b border-neutral-200">
  <h2 className="text-xl font-serif tracking-wide text-neutral-900">
    Modal Title
  </h2>
  <p className="mt-2 text-sm font-serif text-neutral-600 tracking-wide">
    Subtitle or description text
  </p>
</div>
```

### Alert/Notice - Editorial

```tsx
{/* Success */}
<div className="border border-neutral-300 bg-neutral-50 rounded-sm p-4">
  <p className="text-sm font-serif text-center text-neutral-700 tracking-wide">
    Your message here
  </p>
</div>

{/* Warning */}
<div className="border border-amber-300 bg-amber-50 rounded-sm p-4">
  <p className="text-sm font-serif text-center text-amber-900 tracking-wide">
    Warning message here
  </p>
</div>

{/* Error */}
<div className="border border-red-300 bg-red-50 rounded-sm p-4">
  <p className="text-sm font-serif text-center text-red-700 tracking-wide">
    Error message here
  </p>
</div>
```

### Navigation - Editorial

```tsx
<nav className="border-b border-neutral-200 bg-white">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <a href="/" className="text-xl font-serif tracking-wide text-neutral-900">
        Brand Name
      </a>
      
      {/* Links */}
      <div className="flex items-center gap-8">
        <a href="/shop" className="text-sm font-serif tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors">
          Shop
        </a>
        <a href="/about" className="text-sm font-serif tracking-wide text-neutral-900 hover:text-neutral-600 transition-colors">
          About
        </a>
      </div>
    </div>
  </div>
</nav>
```

### Footer - Editorial

```tsx
<footer className="border-t border-neutral-200 bg-white mt-24">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {/* Column */}
      <div className="space-y-4">
        <h3 className="text-xs font-serif tracking-[0.2em] uppercase text-neutral-700">
          Shop
        </h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-sm font-serif text-neutral-600 hover:text-neutral-900 transition-colors">
              New Arrivals
            </a>
          </li>
        </ul>
      </div>
    </div>
    
    {/* Copyright */}
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <p className="text-xs font-serif text-neutral-500 tracking-wide text-center">
        © 2024 Brand Name. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

---

## ✅ Editorial Design Checklist

### Typography
- [ ] Use font-serif for all headings and key content
- [ ] Add tracking-[0.2em] uppercase to labels
- [ ] Use tracking-wide for body text
- [ ] Keep line-height relaxed (leading-relaxed)

### Colors
- [ ] Primary text: neutral-900
- [ ] Secondary text: neutral-600
- [ ] Backgrounds: white or neutral-50
- [ ] Borders: neutral-200 (1px)
- [ ] Minimal accent colors (<10% of UI)

### Spacing
- [ ] Use space-y-6 or space-y-8 between sections
- [ ] Generous padding (p-6, p-8)
- [ ] Consistent gaps (gap-4, gap-6)

### Components
- [ ] Buttons: h-12 or h-14, rounded-none, font-serif
- [ ] Borders: 1px, neutral-200
- [ ] Shadows: minimal or none
- [ ] Border radius: rounded-none or rounded-sm

### Interactions
- [ ] Smooth transitions (duration-300)
- [ ] Subtle hover effects
- [ ] Clear focus states
- [ ] No jarring animations

---

## 🎯 Quick Reference

### DO's
✅ Use serif fonts (font-serif)
✅ Add letter-spacing (tracking-wide, tracking-[0.2em])
✅ Use neutral colors (neutral-900, neutral-600)
✅ Add generous spacing (space-y-6, space-y-8)
✅ Keep borders thin (border, border-neutral-200)
✅ Use rounded-none for containers
✅ Smooth transitions (duration-300)

### DON'Ts
❌ Mix font families inconsistently
❌ Use bright, saturated colors
❌ Tight spacing or margins
❌ Heavy box shadows
❌ Thick borders (>2px)
❌ Heavy border radius
❌ Jarring animations

---

## 🔄 Migration from Other Styles

### From Bold → Editorial

```tsx
// Before (Bold)
className="font-black text-2xl uppercase"

// After (Editorial)
className="font-serif text-2xl tracking-wide"
```

### From Material → Editorial

```tsx
// Before (Material)
className="rounded-lg shadow-lg p-4"

// After (Editorial)
className="rounded-sm border border-neutral-200 p-6"
```

### From Default → Editorial

```tsx
// Before (Default)
className="text-base font-medium"

// After (Editorial)
className="text-base font-serif tracking-wide"
```

---

This design system creates a cohesive, sophisticated editorial aesthetic throughout your entire application!
