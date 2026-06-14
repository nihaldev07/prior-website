"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EnhancedProductImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** 0–1. How strong the sharpening is. Default: 0.45 */
  sharpenStrength?: number;
  /** Whether to run canvas unsharp mask. Default: true */
  enableSharpening?: boolean;
}

// ─── SVG Filter (injected once, no canvas needed for basic pass) ──────────────
// Used as a lightweight first-pass enhancer while canvas processes.

const SVG_FILTER_ID = "product-sharpen-filter";

function SharpenFilterDef() {
  return (
    <svg
      aria-hidden='true'
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        {/*
          Unsharp mask via SVG:
          1. Blur the image (feGaussianBlur)
          2. Subtract it from the original (feComposite / feBlend)
          This is the same algorithm as Photoshop's Unsharp Mask.
        */}
        <filter
          id={SVG_FILTER_ID}
          x='0%'
          y='0%'
          width='100%'
          height='100%'
          colorInterpolationFilters='sRGB'>
          {/* Step 1 — create a blurred copy */}
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.6' result='blur' />
          {/* Step 2 — subtract blur from source to get the high-freq edge signal */}
          <feComposite
            in='SourceGraphic'
            in2='blur'
            operator='arithmetic'
            k1='0'
            k2='1.7'
            k3='-0.7'
            k4='0'
            result='sharpened'
          />
          {/* Step 3 — slight contrast + saturation lift */}
          <feComponentTransfer in='sharpened' result='contrasted'>
            <feFuncR type='linear' slope='1.04' intercept='-0.02' />
            <feFuncG type='linear' slope='1.04' intercept='-0.02' />
            <feFuncB type='linear' slope='1.04' intercept='-0.02' />
          </feComponentTransfer>
          {/* Step 4 — subtle saturation boost to recover WebP warmth */}
          <feColorMatrix
            in='contrasted'
            type='matrix'
            values='1.08 -0.04 -0.04 0 0
                   -0.04  1.08 -0.04 0 0
                   -0.04 -0.04  1.08 0 0
                    0     0     0    1 0'
          />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Canvas Unsharp Mask ──────────────────────────────────────────────────────
// Full unsharp mask on the pixel buffer:
// sharpened = original + strength * (original − gaussian_blur(original))

function applyUnsharpMask(
  imageData: ImageData,
  radius: number,
  strength: number,
): ImageData {
  const { data, width, height } = imageData;
  const blurred = gaussianBlur(data, width, height, radius);
  const output = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    // Alpha channel — copy unchanged
    output[i + 3] = data[i + 3];
    // RGB channels — unsharp mask formula
    for (let c = 0; c < 3; c++) {
      const orig = data[i + c];
      const blur = blurred[i + c];
      const sharpened = orig + strength * (orig - blur);
      output[i + c] = Math.max(0, Math.min(255, sharpened));
    }
  }

  return new ImageData(output, width, height);
}

// Fast separable Gaussian blur (horizontal then vertical pass)
function gaussianBlur(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
): Uint8ClampedArray {
  const kernel = gaussianKernel(radius);
  const tmp = new Float32Array(data.length);
  const out = new Uint8ClampedArray(data.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const nx = Math.min(Math.max(x + k, 0), width - 1);
        const idx = (y * width + nx) * 4;
        const w = kernel[k + radius];
        r += data[idx] * w;
        g += data[idx + 1] * w;
        b += data[idx + 2] * w;
        a += data[idx + 3] * w;
        wSum += w;
      }
      const tidx = (y * width + x) * 4;
      tmp[tidx] = r / wSum;
      tmp[tidx + 1] = g / wSum;
      tmp[tidx + 2] = b / wSum;
      tmp[tidx + 3] = a / wSum;
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        wSum = 0;
      for (let k = -radius; k <= radius; k++) {
        const ny = Math.min(Math.max(y + k, 0), height - 1);
        const tidx = (ny * width + x) * 4;
        const w = kernel[k + radius];
        r += tmp[tidx] * w;
        g += tmp[tidx + 1] * w;
        b += tmp[tidx + 2] * w;
        a += tmp[tidx + 3] * w;
        wSum += w;
      }
      const oidx = (y * width + x) * 4;
      out[oidx] = Math.round(r / wSum);
      out[oidx + 1] = Math.round(g / wSum);
      out[oidx + 2] = Math.round(b / wSum);
      out[oidx + 3] = Math.round(a / wSum);
    }
  }

  return out;
}

function gaussianKernel(radius: number): number[] {
  const sigma = radius / 2;
  const kernel: number[] = [];
  for (let i = -radius; i <= radius; i++) {
    kernel.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
  }
  return kernel;
}

// ─── Worker-safe canvas processing ───────────────────────────────────────────
// Runs on a hidden OffscreenCanvas (if available) or regular canvas.
// Returns a blob URL so we can swap the <img> src without re-requesting the network.

async function enhanceImageToBlob(
  src: string,
  strength: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return reject(new Error("No 2d context"));

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Unsharp mask — radius 1 is enough for display-level sharpening
        // Stronger radius = sharper but slower
        const enhanced = applyUnsharpMask(imageData, 1, strength);
        ctx.putImageData(enhanced, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("toBlob failed"));
            resolve(URL.createObjectURL(blob));
          },
          "image/webp",
          0.95, // high quality for the canvas output
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = reject;
    img.src = src;
  });
}

// ─── State machine ────────────────────────────────────────────────────────────
type Phase = "loading" | "preview" | "enhanced" | "error";

// ─── Main Component ───────────────────────────────────────────────────────────

export function EnhancedProductImage({
  src,
  alt,
  className,
  sizes,
  sharpenStrength = 0.45,
  enableSharpening = true,
}: EnhancedProductImageProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [displaySrc, setDisplaySrc] = useState(src);
  const enhancedBlobRef = useRef<string | null>(null);
  const processingRef = useRef(false);

  // Cleanup blob URL on unmount or src change
  useEffect(() => {
    return () => {
      if (enhancedBlobRef.current) {
        URL.revokeObjectURL(enhancedBlobRef.current);
        enhancedBlobRef.current = null;
      }
    };
  }, [src]);

  // Reset when src changes (thumbnail switch)
  useEffect(() => {
    if (enhancedBlobRef.current) {
      URL.revokeObjectURL(enhancedBlobRef.current);
      enhancedBlobRef.current = null;
    }
    processingRef.current = false;
    setDisplaySrc(src);
    setPhase("loading");
  }, [src]);

  // Once compressed image is shown, kick off canvas sharpening
  const handleImageLoaded = useCallback(async () => {
    if (phase !== "loading") return; // already processed
    setPhase("preview"); // show compressed version immediately

    if (!enableSharpening || processingRef.current) return;
    processingRef.current = true;

    try {
      const blobUrl = await enhanceImageToBlob(src, sharpenStrength);
      enhancedBlobRef.current = blobUrl;
      setDisplaySrc(blobUrl);
      setPhase("enhanced");
    } catch {
      // Enhancement failed silently — compressed version stays visible
      setPhase("error");
    }
  }, [src, phase, enableSharpening, sharpenStrength]);

  // CSS filters applied during each phase:
  // - loading   → nothing (shimmer overlay)
  // - preview   → SVG sharpen filter + slight CSS contrast to "pre-enhance" while canvas works
  // - enhanced  → clean (canvas already did the work) + slight brightness to pop
  // - error     → same as preview (SVG filter stays on)
  const filterStyle: React.CSSProperties = (() => {
    switch (phase) {
      case "loading":
        return {};
      case "preview":
        return {
          filter: `url(#${SVG_FILTER_ID}) contrast(1.04) brightness(1.01)`,
          // SVG filter gives immediate perceived sharpness boost
          // while canvas processes in the background
        };
      case "enhanced":
        return {
          // Canvas already sharpened — just a tiny brightness lift
          filter: "contrast(1.03) brightness(1.01) saturate(1.04)",
          transition: "filter 0.4s ease",
        };
      case "error":
        return {
          filter: `url(#${SVG_FILTER_ID}) contrast(1.04)`,
        };
    }
  })();

  return (
    <>
      {/* SVG filter definition — injected once, referenced by CSS filter */}
      <SharpenFilterDef />

      <div className='relative w-full h-full'>
        {/* Shimmer skeleton — only during initial network load */}
        {phase === "loading" && (
          <div
            className='absolute inset-0 z-10 pointer-events-none'
            style={{
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #fafafa 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s ease-in-out infinite",
            }}
          />
        )}

        {/* "Enhancing…" pill — visible during canvas processing phase */}
        {phase === "preview" && enableSharpening && (
          <div
            className='absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-neutral-500 text-[10px] font-serif tracking-widest px-2.5 py-1 rounded-full pointer-events-none select-none'
            style={{ animation: "fadeInUp 0.3s ease both" }}>
            <span
              className='inline-block w-1.5 h-1.5 rounded-full bg-amber-400'
              style={{ animation: "pulse 1s ease-in-out infinite" }}
            />
            Enhancing…
          </div>
        )}

        {/* "HD" badge — appears once canvas sharpening is done */}
        {phase === "enhanced" && (
          <div
            className='absolute bottom-3 left-3 z-10 text-[10px] font-serif tracking-widest text-emerald-600 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none select-none'
            style={{ animation: "fadeInUp 0.4s ease both" }}>
            ✦ HD
          </div>
        )}

        {/* The actual image */}
        <img
          src={displaySrc}
          alt={alt}
          className={cn(
            className,
            "transition-opacity duration-300",
            phase === "loading" ? "opacity-0" : "opacity-100",
          )}
          style={{
            ...filterStyle,
            // Smooth crossfade when src swaps from compressed → enhanced blob
            transition:
              phase === "enhanced"
                ? "opacity 0.4s ease, filter 0.5s ease"
                : "opacity 0.3s ease",
          }}
          sizes={sizes}
          onLoad={handleImageLoaded}
          draggable={false}
        />
      </div>

      {/* Keyframes injected inline (no Tailwind plugin needed) */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}

export default EnhancedProductImage;
