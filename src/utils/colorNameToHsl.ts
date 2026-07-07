// ─────────────────────────────────────────────
// colorNameToHsl.ts
// Semantic color name → HSL resolver
// Strategy: keyword scan across all words in the
// name, find the best base color match, then apply
// modifier adjustments (lightness/saturation/hue shift).
// ─────────────────────────────────────────────

export type HSL = { h: number; s: number; l: number };
export type ColorResult =
  | { kind: "hsl"; hsl: HSL }
  | { kind: "achromatic"; css: string };

// ── 1. BASE COLOR MAP ────────────────────────────────────────────────────────
// Map keyword → true perceptual HSL (not just hue).
// s and l are real values, not invented — these match
// how these colors actually look in products.
const BASE_COLORS: Record<string, HSL> = {
  // Reds / Pinks
  red: { h: 4, s: 86, l: 50 },
  crimson: { h: 348, s: 83, l: 38 },
  scarlet: { h: 10, s: 90, l: 45 },
  ruby: { h: 345, s: 78, l: 38 },
  rose: { h: 345, s: 60, l: 60 },
  pink: { h: 333, s: 70, l: 65 },
  blush: { h: 345, s: 55, l: 72 },
  magenta: { h: 300, s: 75, l: 50 },
  fuchsia: { h: 300, s: 80, l: 52 },
  maroon: { h: 345, s: 70, l: 25 },
  burgundy: { h: 345, s: 68, l: 28 },
  wine: { h: 350, s: 65, l: 30 },

  // Oranges / Corals
  orange: { h: 28, s: 95, l: 53 },
  coral: { h: 16, s: 85, l: 63 },
  salmon: { h: 8, s: 80, l: 68 },
  peach: { h: 22, s: 75, l: 74 },
  terracotta: { h: 18, s: 65, l: 45 },
  rust: { h: 18, s: 72, l: 38 },
  sienna: { h: 20, s: 68, l: 40 },
  copper: { h: 22, s: 60, l: 48 },
  amber: { h: 38, s: 95, l: 50 },

  // Yellows / Golds
  yellow: { h: 52, s: 98, l: 52 },
  gold: { h: 43, s: 88, l: 50 },
  mustard: { h: 44, s: 82, l: 45 },
  khaki: { h: 54, s: 45, l: 58 },
  sand: { h: 45, s: 40, l: 70 },
  lemon: { h: 58, s: 95, l: 60 },
  cream: { h: 48, s: 60, l: 88 }, // NOTE: still in achromatic check
  butter: { h: 50, s: 72, l: 80 },

  // Greens
  green: { h: 125, s: 65, l: 42 },
  lime: { h: 88, s: 80, l: 50 },
  olive: { h: 68, s: 55, l: 35 },
  sage: { h: 100, s: 28, l: 55 },
  mint: { h: 152, s: 55, l: 65 },
  emerald: { h: 146, s: 62, l: 38 },
  forest: { h: 130, s: 55, l: 28 },
  hunter: { h: 132, s: 52, l: 24 },
  moss: { h: 90, s: 45, l: 38 },
  fern: { h: 118, s: 40, l: 45 },
  jade: { h: 155, s: 60, l: 42 },
  pine: { h: 140, s: 50, l: 28 },

  // Teals / Cyans
  teal: { h: 174, s: 65, l: 40 },
  cyan: { h: 190, s: 80, l: 50 },
  turquoise: { h: 175, s: 68, l: 50 },
  aqua: { h: 185, s: 75, l: 52 },
  seafoam: { h: 162, s: 50, l: 65 },

  // Blues
  blue: { h: 221, s: 82, l: 52 },
  navy: { h: 225, s: 72, l: 22 },
  cobalt: { h: 225, s: 80, l: 40 },
  royal: { h: 228, s: 74, l: 44 },
  sky: { h: 200, s: 72, l: 60 },
  denim: { h: 213, s: 45, l: 40 },
  powder: { h: 210, s: 55, l: 75 },
  steel: { h: 210, s: 22, l: 52 },
  slate: { h: 210, s: 18, l: 45 },
  ocean: { h: 210, s: 72, l: 40 },
  ice: { h: 200, s: 50, l: 82 },

  // Purples / Violets
  purple: { h: 270, s: 65, l: 48 },
  violet: { h: 278, s: 72, l: 52 },
  indigo: { h: 240, s: 65, l: 42 },
  lavender: { h: 265, s: 50, l: 72 },
  plum: { h: 300, s: 45, l: 35 },
  mauve: { h: 300, s: 22, l: 60 },
  lilac: { h: 275, s: 48, l: 72 },
  orchid: { h: 302, s: 55, l: 62 },
  grape: { h: 282, s: 55, l: 35 },
  eggplant: { h: 285, s: 48, l: 25 },
  amethyst: { h: 272, s: 50, l: 58 },

  // Browns / Tans / Nudes
  brown: { h: 24, s: 55, l: 35 },
  tan: { h: 34, s: 52, l: 62 },
  taupe: { h: 34, s: 18, l: 55 },
  beige: { h: 40, s: 38, l: 78 },
  camel: { h: 32, s: 58, l: 52 },
  chocolate: { h: 22, s: 62, l: 28 },
  mocha: { h: 26, s: 48, l: 38 },
  nude: { h: 30, s: 38, l: 72 },
  latte: { h: 30, s: 35, l: 60 },
  espresso: { h: 20, s: 55, l: 22 },
  cognac: { h: 26, s: 72, l: 38 },
};

// ── 2. ACHROMATIC TABLE ───────────────────────────────────────────────────────
// These map to literal CSS colors, no hue dot.
const ACHROMATIC_MAP: Record<string, string> = {
  black: "#111111",
  jet: "#1a1a1a",
  onyx: "#1c1c1c",
  charcoal: "#3d3d3d",
  graphite: "#4a4a4a",
  dark: "#3d3d3d", // "dark" alone → near-black
  smoke: "#8a8a8a",
  gray: "#9ca3af",
  grey: "#9ca3af",
  ash: "#b0b0b0",
  silver: "#c0c0c0",
  stone: "#a8a29e",
  pebble: "#b0b0aa",
  white: "#f5f5f5",
  snow: "#fafafa",
  ivory: "#fffff0",
  "off-white": "#f5f2ec",
  pearl: "#f0ede6",
  eggshell: "#f2eedf",
  cream: "#fffdd0",
};

// ── 3. MODIFIER TABLE ─────────────────────────────────────────────────────────
// Each modifier can shift h (hue), s (saturation), l (lightness).
// Applied additively in order; first match wins per word.
type Modifier = { dh?: number; ds?: number; dl?: number };

const MODIFIERS: Record<string, Modifier> = {
  // Lightness
  light: { dl: +18, ds: -10 },
  pale: { dl: +22, ds: -18 },
  pastel: { dl: +25, ds: -20 },
  soft: { dl: +15, ds: -12 },
  muted: { dl: +8, ds: -20 },
  faded: { dl: +12, ds: -22 },
  bleached: { dl: +25, ds: -25 },
  powder: { dl: +18, ds: -15 },
  baby: { dl: +22, ds: -15 },
  icy: { dl: +25, ds: -12 },
  bright: { dl: +10, ds: +12 },
  vivid: { dl: +5, ds: +18 },
  neon: { dl: +10, ds: +30 },
  electric: { dl: +5, ds: +25 },
  deep: { dl: -15, ds: +10 },
  dark: { dl: -20, ds: +5 },
  rich: { dl: -12, ds: +12 },
  midnight: { dl: -28, ds: -5 },
  charcoal: { dl: -25 }, // used as modifier: "charcoal blue"
  smoky: { dl: -10, ds: -15 },
  dusty: { dl: +5, ds: -22 },
  antique: { dl: -5, ds: -18 },
  vintage: { dl: -5, ds: -15 },

  // Warmth / hue shifts
  warm: { dh: -8, ds: +8 },
  cool: { dh: +8, ds: +5 },
  cold: { dh: +10 },
  golden: { dh: -12, ds: +10, dl: +5 },
  earthy: { dh: +5, ds: -15, dl: -8 },

  // Saturation
  washed: { ds: -25, dl: +10 },
  saturated: { ds: +20 },
  bold: { ds: +15, dl: -5 },
};

// ── 4. RESOLVER ───────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Resolve a product color name string to a displayable color.
 *
 * Strategy:
 * 1. Tokenise: lowercase, split on whitespace and hyphens.
 * 2. Check if any token is a known achromatic. If so, return its CSS value
 *    (a multi-word like "charcoal blue" will have "charcoal" as a modifier
 *    and "blue" as base — handled before achromatic short-circuit).
 * 3. Find the first token that matches a BASE_COLORS key.
 * 4. Collect all tokens that match MODIFIERS keys.
 * 5. Apply modifiers to the base HSL.
 * 6. Return the resulting HSL.
 */
export function resolveColorName(name: string): ColorResult {
  const tokens = name
    .toLowerCase()
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Check for a base color first — "charcoal blue" should resolve as blue
  // with a darkening modifier, NOT as achromatic charcoal.
  const baseToken = tokens.find((t) => t in BASE_COLORS);

  // If no chromatic base, check for achromatic
  if (!baseToken) {
    const achromaticToken = tokens.find((t) => t in ACHROMATIC_MAP);
    if (achromaticToken) {
      return { kind: "achromatic", css: ACHROMATIC_MAP[achromaticToken] };
    }
    // Completely unknown name — fall back to a mid-gray
    return { kind: "achromatic", css: "#9ca3af" };
  }

  // Start from base HSL
  let { h, s, l } = { ...BASE_COLORS[baseToken] };

  // Collect and apply modifiers (all tokens except the base)
  for (const token of tokens) {
    if (token === baseToken) continue;
    const mod = MODIFIERS[token];
    if (mod) {
      if (mod.dh) h = (h + mod.dh + 360) % 360;
      if (mod.ds) s = clamp(s + mod.ds, 5, 98);
      if (mod.dl) l = clamp(l + mod.dl, 8, 92);
    }
  }

  return { kind: "hsl", hsl: { h, s, l } };
}

/** Convert a ColorResult to a CSS color string for the dot. */
export function colorResultToCss(result: ColorResult): string {
  if (result.kind === "achromatic") return result.css;
  const { h, s, l } = result.hsl;
  return `hsl(${h} ${s}% ${l}%)`;
}

/** True if the name resolves to an achromatic swatch. */
export function isAchromaticName(name: string): boolean {
  return resolveColorName(name).kind === "achromatic";
}
