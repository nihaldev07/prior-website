# URGENT: Hero Image Optimization Required

## Problem
Hero images are causing LCP of 5.2s (target: <2.5s)

**Current image sizes:**
- `lucide.jpg` - **1.1MB** ❌
- `new_gpt_collection_img.png` - **3.2MB** ❌
- `rainy_gpt.png` - Unknown (likely large)

## Solution: Compress Images by 80-90%

### Step 1: Download Images
```bash
curl -O https://d38c45qguy2pwg.cloudfront.net/lucide.jpg
curl -O https://d38c45qguy2pwg.cloudfront.net/new_gpt_collection_img.png
curl -O https://d38c45qguy2pwg.cloudfront.net/rainy_gpt.png
```

### Step 2: Compress Images

**Option A: Online Tools (Easiest)**
1. Go to https://squoosh.app/
2. Upload each image
3. Settings:
   - Format: **WebP**
   - Quality: **60-70%**
   - Resize: Width **1920px** (if larger)
4. Download compressed version
5. Target: **150-250KB per image**

**Option B: Command Line (If you have tools)**
```bash
# Using ImageMagick
convert lucide.jpg -quality 60 -resize 1920x -format webp lucide-optimized.webp
convert new_gpt_collection_img.png -quality 60 -resize 1920x -format webp new_gpt_collection_img-optimized.webp
convert rainy_gpt.png -quality 60 -resize 1920x -format webp rainy_gpt-optimized.webp

# Or using cwebp
cwebp -q 60 -resize 1920 0 lucide.jpg -o lucide-optimized.webp
cwebp -q 60 -resize 1920 0 new_gpt_collection_img.png -o new_gpt_collection_img-optimized.webp
cwebp -q 60 -resize 1920 0 rainy_gpt.png -o rainy_gpt-optimized.webp
```

### Step 3: Upload to CloudFront
Upload the optimized WebP files to your CloudFront bucket with new names.

### Step 4: Update Code
Once uploaded, update the image URLs in `src/components/pages/Home/HeroCarousel.tsx`:

```tsx
const heroSlides = [
  {
    id: 1,
    image: "https://d38c45qguy2pwg.cloudfront.net/lucide-optimized.webp",  // Changed
    title: "Rainy Season Collection 2025",
    subtitle: "Discover the latest trends for the season",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: "https://d38c45qguy2pwg.cloudfront.net/new_gpt_collection_img-optimized.webp",  // Changed
    title: "Carry Your Story",
    subtitle: "Modern essentials for women who carry confidence everywhere.",
    cta: "View Offers",
  },
  {
    id: 3,
    image: "https://d38c45qguy2pwg.cloudfront.net/rainy_gpt-optimized.webp",  // Changed
    title: "New Arrivals",
    subtitle: "Be the first to shop our latest collection",
    cta: "Explore",
  },
];
```

## Expected Results After Optimization

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **LCP** | 5.2s | **1.5-2.0s** ✅ | <2.5s |
| **Image Size** | 1.1-3.2MB | **150-250KB** | <300KB |
| **Performance** | 69 | **85-90** | 90+ |

## Alternative: Use Cloudinary (If Available)

If you have Cloudinary account, upload there and use auto-optimization:

```tsx
// Example Cloudinary URL with auto-optimization
image: "https://res.cloudinary.com/YOUR_CLOUD/image/upload/f_auto,q_auto:good,w_1920/hero-image.jpg"
```

Benefits:
- `f_auto` - Automatic format (WebP/AVIF)
- `q_auto:good` - Smart quality optimization
- `w_1920` - Resize to 1920px width

## Verification

After uploading optimized images:

```bash
# Check new file sizes
curl -I https://d38c45qguy2pwg.cloudfront.net/lucide-optimized.webp | grep content-length
curl -I https://d38c45qguy2pwg.cloudfront.net/new_gpt_collection_img-optimized.webp | grep content-length
curl -I https://d38c45qguy2pwg.cloudfront.net/rainy_gpt-optimized.webp | grep content-length
```

Each should be **<300KB** (ideally 150-250KB).

## Timeline
- **Compression:** 10 minutes
- **Upload:** 5 minutes
- **Code update:** 2 minutes
- **Test:** 5 minutes
- **Total:** ~25 minutes

## Priority
**URGENT** - This single change will give you the biggest performance improvement:
- LCP: 5.2s → ~2.0s ✅
- Performance Score: 69 → ~85+ ✅
- Speed Index: Will also improve

---

**Note:** All the code optimizations are done. The only bottleneck now is the image file sizes on CloudFront.
