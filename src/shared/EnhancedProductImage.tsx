"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EnhancedProductImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Gaussian blur radius for unsharp mask. 1 = subtle, 2 = stronger. Default: 1 */
  radius?: number;
  /** Unsharp mask strength 0–1.5. Default: 0.55 */
  sharpenStrength?: number;
  /** Clarity (local contrast / large-radius unsharp mask) 0–1. Default: 0.25 */
  clarity?: number;
  /** Contrast multiplier. 1.0 = unchanged. Default: 1.05 */
  contrast?: number;
  /** Brightness multiplier. 1.0 = unchanged. Default: 1.01 */
  brightness?: number;
  /** Saturation multiplier. 1.0 = unchanged. Default: 1.07 */
  saturation?: number;
  /** Disable canvas processing entirely (SVG filter still applies). Default: true */
  enableEnhancement?: boolean;
}

// ─── SVG Filter ───────────────────────────────────────────────────────────────
// Instant perceived-sharpness boost applied via CSS filter — zero processing
// cost. Visible during the "preview" phase while canvas is working.

const SVG_FILTER_ID = "prd-img-sharpen";

function SharpenFilterDef() {
  return (
    <svg
      aria-hidden='true'
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter
          id={SVG_FILTER_ID}
          x='0%'
          y='0%'
          width='100%'
          height='100%'
          colorInterpolationFilters='sRGB'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.5' result='blur' />
          <feComposite
            in='SourceGraphic'
            in2='blur'
            operator='arithmetic'
            k1='0'
            k2='1.8'
            k3='-0.8'
            k4='0'
            result='sharp'
          />
          <feComponentTransfer in='sharp' result='contrasted'>
            <feFuncR type='linear' slope='1.05' intercept='-0.025' />
            <feFuncG type='linear' slope='1.05' intercept='-0.025' />
            <feFuncB type='linear' slope='1.05' intercept='-0.025' />
          </feComponentTransfer>
          <feColorMatrix
            in='contrasted'
            type='matrix'
            values='1.09 -0.045 -0.045 0 0
                   -0.045  1.09 -0.045 0 0
                   -0.045 -0.045  1.09 0 0
                    0      0      0    1 0'
          />
        </filter>
      </defs>
    </svg>
  );
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function gaussianKernel(radius: number): number[] {
  const sigma = radius / 2 || 0.5;
  const k: number[] = [];
  for (let i = -radius; i <= radius; i++)
    k.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
  const sum = k.reduce((a, b) => a + b, 0);
  return k.map((v) => v / sum);
}

function gaussianBlur(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  radius: number,
): Uint8ClampedArray {
  const kern = gaussianKernel(radius);
  const tmp = new Float32Array(data.length);
  const out = new Uint8ClampedArray(data.length);

  // Horizontal pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let k = -radius; k <= radius; k++) {
        const nx = Math.min(Math.max(x + k, 0), w - 1);
        const idx = (y * w + nx) * 4;
        const wt = kern[k + radius];
        r += data[idx] * wt;
        g += data[idx + 1] * wt;
        b += data[idx + 2] * wt;
        a += data[idx + 3] * wt;
      }
      const ti = (y * w + x) * 4;
      tmp[ti] = r;
      tmp[ti + 1] = g;
      tmp[ti + 2] = b;
      tmp[ti + 3] = a;
    }
  }

  // Vertical pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let k = -radius; k <= radius; k++) {
        const ny = Math.min(Math.max(y + k, 0), h - 1);
        const ti = (ny * w + x) * 4;
        const wt = kern[k + radius];
        r += tmp[ti] * wt;
        g += tmp[ti + 1] * wt;
        b += tmp[ti + 2] * wt;
        a += tmp[ti + 3] * wt;
      }
      const oi = (y * w + x) * 4;
      out[oi] = r;
      out[oi + 1] = g;
      out[oi + 2] = b;
      out[oi + 3] = a;
    }
  }

  return out;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2 = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [
    Math.round(hue2(h + 1 / 3) * 255),
    Math.round(hue2(h) * 255),
    Math.round(hue2(h - 1 / 3) * 255),
  ];
}

// ─── Core enhancement pipeline ────────────────────────────────────────────────

async function enhanceImageToBlob(
  src: string,
  opts: {
    radius: number;
    sharpenStrength: number;
    clarity: number;
    contrast: number;
    brightness: number;
    saturation: number;
  },
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
        const {
          data,
          width: w,
          height: h,
        } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const src32 = new Uint8ClampedArray(data);
        const out = new Uint8ClampedArray(src32.length);

        // Pass 1 — unsharp mask (edge sharpening, small radius)
        const blurred = gaussianBlur(src32, w, h, opts.radius);

        // Pass 2 — clarity / local contrast (larger radius, lower strength)
        const clarityBlur =
          opts.clarity > 0
            ? gaussianBlur(src32, w, h, Math.min(opts.radius + 1, 3))
            : null;

        for (let i = 0; i < src32.length; i += 4) {
          let r = src32[i],
            g = src32[i + 1],
            b = src32[i + 2];
          const a = src32[i + 3];

          // Unsharp mask
          r = Math.max(
            0,
            Math.min(255, r + opts.sharpenStrength * (r - blurred[i])),
          );
          g = Math.max(
            0,
            Math.min(255, g + opts.sharpenStrength * (g - blurred[i + 1])),
          );
          b = Math.max(
            0,
            Math.min(255, b + opts.sharpenStrength * (b - blurred[i + 2])),
          );

          // Clarity
          if (clarityBlur) {
            r = Math.max(
              0,
              Math.min(255, r + opts.clarity * (r - clarityBlur[i])),
            );
            g = Math.max(
              0,
              Math.min(255, g + opts.clarity * (g - clarityBlur[i + 1])),
            );
            b = Math.max(
              0,
              Math.min(255, b + opts.clarity * (b - clarityBlur[i + 2])),
            );
          }

          // Brightness
          r = Math.max(0, Math.min(255, r * opts.brightness));
          g = Math.max(0, Math.min(255, g * opts.brightness));
          b = Math.max(0, Math.min(255, b * opts.brightness));

          // Contrast around midpoint 128
          r = Math.max(0, Math.min(255, (r - 128) * opts.contrast + 128));
          g = Math.max(0, Math.min(255, (g - 128) * opts.contrast + 128));
          b = Math.max(0, Math.min(255, (b - 128) * opts.contrast + 128));

          // Saturation via HSL
          if (opts.saturation !== 1) {
            const [hh, s, l] = rgbToHsl(r, g, b);
            const [nr, ng, nb] = hslToRgb(
              hh,
              Math.max(0, Math.min(1, s * opts.saturation)),
              l,
            );
            r = nr;
            g = ng;
            b = nb;
          }

          out[i] = r;
          out[i + 1] = g;
          out[i + 2] = b;
          out[i + 3] = a;
        }

        ctx.putImageData(new ImageData(out, w, h), 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("toBlob failed"));
            resolve(URL.createObjectURL(blob));
          },
          "image/webp",
          0.95,
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = reject;
    img.src = src;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

type Phase = "loading" | "preview" | "enhanced" | "error";

export function EnhancedProductImage({
  src,
  alt,
  className,
  sizes,
  radius = 1,
  sharpenStrength = 0.55,
  clarity = 0.25,
  contrast = 1.05,
  brightness = 1.01,
  saturation = 1.07,
  enableEnhancement = true,
}: EnhancedProductImageProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [displaySrc, setDisplaySrc] = useState(src);
  const blobRef = useRef<string | null>(null);
  const processingRef = useRef(false);

  // Revoke old blob on unmount or src change
  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, [src]);

  // Reset state when src changes (e.g. thumbnail switch)
  useEffect(() => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    processingRef.current = false;
    setDisplaySrc(src);
    setPhase("loading");
  }, [src]);

  const handleImageLoaded = useCallback(async () => {
    if (phase !== "loading") return;
    setPhase("preview"); // show compressed image immediately

    if (!enableEnhancement || processingRef.current) return;
    processingRef.current = true;

    try {
      const blob = await enhanceImageToBlob(src, {
        radius,
        sharpenStrength,
        clarity,
        contrast,
        brightness,
        saturation,
      });
      blobRef.current = blob;
      setDisplaySrc(blob);
      setPhase("enhanced");
    } catch {
      setPhase("error");
    }
  }, [
    src,
    phase,
    enableEnhancement,
    radius,
    sharpenStrength,
    clarity,
    contrast,
    brightness,
    saturation,
  ]);

  const filterStyle: React.CSSProperties = (() => {
    switch (phase) {
      case "loading":
        return {};
      // While canvas is working: SVG unsharp mask + CSS contrast/sat for instant boost
      case "preview":
        return {
          filter: `url(#${SVG_FILTER_ID}) contrast(${contrast}) brightness(${brightness}) saturate(${saturation})`,
        };
      // Canvas done: just a tiny polish pass (canvas already did the heavy work)
      case "enhanced":
        return {
          filter: `contrast(1.01) brightness(1.005) saturate(1.02)`,
          transition: "filter 0.5s ease",
        };
      case "error":
        // Canvas failed — stay on SVG filter permanently
        return {
          filter: `url(#${SVG_FILTER_ID}) contrast(${contrast}) brightness(${brightness}) saturate(${saturation})`,
        };
    }
  })();

  return (
    <>
      <SharpenFilterDef />

      <div className='relative w-full h-full'>
        {/* Shimmer while image downloads */}
        {phase === "loading" && (
          <div
            className='absolute inset-0 z-10 pointer-events-none'
            style={{
              background:
                "linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "prd-shimmer 1.4s ease-in-out infinite",
            }}
          />
        )}

        {/* "Enhancing" pill — visible while canvas runs */}
        {phase === "preview" && enableEnhancement && (
          <div
            className='absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-neutral-500 text-[10px] font-serif tracking-widest px-2.5 py-1 rounded-full pointer-events-none select-none'
            style={{ animation: "prd-fadeup 0.3s ease both" }}>
            <span
              className='inline-block w-1.5 h-1.5 rounded-full bg-amber-400'
              style={{ animation: "prd-pulse 1s ease-in-out infinite" }}
            />
            Enhancing…
          </div>
        )}

        {/* HD badge — appears after canvas finishes */}
        {phase === "enhanced" && (
          <div
            className='absolute bottom-3 left-3 z-10 text-[10px] font-serif tracking-widest text-emerald-600 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none select-none'
            style={{ animation: "prd-fadeup 0.4s ease both" }}>
            ✦ HD
          </div>
        )}

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

      <style>{`
        @keyframes prd-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes prd-fadeup {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes prd-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}

export default EnhancedProductImage;
