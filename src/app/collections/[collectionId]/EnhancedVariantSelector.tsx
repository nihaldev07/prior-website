"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SingleProductType, Variation } from "@/data/types";
import Swal from "sweetalert2";

interface Props {
  type: "size" | "color";
  selectedProduct: SingleProductType;
  list: string[];
  selected: string;
  selectedVariant: Variation | null;
  onVariantChange: (variant: Variation) => void;
  onImageGroupChange?: (
    attribute: string,
    value: string,
    groupId: string,
  ) => void;
}

const EnhancedVariantSelector: React.FC<Props> = ({
  type,
  selectedProduct,
  list,
  selected,
  selectedVariant,
  onVariantChange,
}) => {
  const [variations, setVariations] = React.useState<Variation[]>([]);

  React.useEffect(() => {
    if (selectedProduct?.variation) {
      setVariations(selectedProduct.variation);
    }
  }, [selectedProduct]);

  const getVariantInfo = React.useCallback(
    (value: string) => {
      const rType = type === "color" ? "size" : "color";
      const selectedRev = selectedVariant?.[rType] ?? "";

      const matched = variations.filter((v) => {
        const typeMatch =
          value === "" || v[type] === "" || v[type].includes(value);
        const reverseMatch =
          selectedRev === "" ||
          v[rType] === "" ||
          v[rType].includes(selectedRev);
        return typeMatch && reverseMatch;
      });

      const qty = matched.reduce((s, v) => s + (v.quantity || 0), 0);
      return { quantity: qty, isAvailable: qty > 0 };
    },
    [variations, type, selectedVariant],
  );

  const handleSelect = React.useCallback(
    (value: string) => {
      const rType = type === "color" ? "size" : "color";
      const selectedRev = selectedVariant?.[rType] ?? "";

      const matched = variations.filter((v) => {
        const typeMatch =
          value === "" || v[type] === "" || v[type].includes(value);
        const reverseMatch =
          selectedRev === "" ||
          v[rType] === "" ||
          v[rType].includes(selectedRev);
        return typeMatch && reverseMatch;
      });

      if (matched.length > 0) {
        onVariantChange(matched[0]);
      } else {
        Swal.fire({
          title: "Out of Stock",
          text: "This variant is currently unavailable.",
          icon: "error",
          confirmButtonColor: "#111111",
          confirmButtonText: "Got it",
        });
      }
    },
    [variations, type, selectedVariant, onVariantChange],
  );

  if (!list || list.length === 0) return null;

  const visibleList = list.filter((v) => v.trim() !== "");
  if (visibleList.length === 0) return null;

  const label = type === "color" ? "Color" : "Size";
  const selectedLabel = selected?.trim() !== "" ? selected : null;

  return (
    <div className='space-y-2.5'>
      {/* Header row */}
      <div className='items-baseline gap-1.5 hidden'>
        <span className='text-[11px] font-semibold uppercase tracking-widest text-zinc-400'>
          {label}
        </span>
        {selectedLabel && (
          <span className='text-[13px] font-medium text-zinc-700'>
            : <span className='text-zinc-900'>{selectedLabel}</span>
          </span>
        )}
      </div>

      {/* Chips */}
      <div className='flex flex-wrap gap-2'>
        {visibleList.map((value) => {
          const { isAvailable } = getVariantInfo(value);
          const isSelected = selected === value;

          return (
            <Chip
              key={value}
              value={value}
              isSelected={isSelected}
              isAvailable={isAvailable}
              isColor={type === "color"}
              onSelect={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Shared Chip — used for both color and size
   Color chips get a small dot accent derived
   from the name using CSS currentColor hashing.
───────────────────────────────────────────── */
interface ChipProps {
  value: string;
  isSelected: boolean;
  isAvailable: boolean;
  isColor: boolean;
  onSelect: (v: string) => void;
}

// Generate a deterministic hue from any arbitrary color name string
// so long multi-word names like "Dusty Rose Mauve" still get a
// recognisable tint without relying on a finite lookup table.
function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h) % 360;
}

// Known exact overrides for the most common single-word names
const HUE_OVERRIDES: Record<string, number> = {
  red: 0,
  orange: 25,
  yellow: 50,
  green: 130,
  teal: 175,
  cyan: 190,
  blue: 220,
  indigo: 240,
  purple: 270,
  violet: 280,
  pink: 330,
  rose: 345,
  coral: 16,
  maroon: 355,
  brown: 20,
  olive: 65,
  navy: 225,
  gold: 45,
  lime: 90,
  mint: 155,
  sky: 200,
  lavender: 265,
  khaki: 48,
  beige: 40,
};

function dotHue(name: string): number {
  const key = name.toLowerCase().split(/\s+/)[0]; // first word
  return HUE_OVERRIDES[key] ?? hueFromName(name);
}

// Special cases that should render as neutral (no color dot)
const ACHROMATIC = new Set([
  "black",
  "white",
  "gray",
  "grey",
  "silver",
  "charcoal",
  "cream",
  "ivory",
  "off-white",
]);

function isAchromatic(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    ACHROMATIC.has(lower) || ACHROMATIC.has(lower.split(/\s+/).pop() ?? "")
  );
}

const Chip: React.FC<ChipProps> = ({
  value,
  isSelected,
  isAvailable,
  isColor,
  onSelect,
}) => {
  const handleClick = () => {
    if (!isAvailable) {
      toast.error(`${value} is currently out of stock`, {
        description: "Try a different option or check back later.",
      });
      return;
    }
    onSelect(value);
  };

  // Derive dot color for color chips
  const hue = isColor ? dotHue(value) : 0;
  const achromatic = isColor && isAchromatic(value);

  // dot style — vivid HSL for chromatic, gradient for black/white/gray
  const dotStyle: React.CSSProperties = achromatic
    ? {
        background:
          value.toLowerCase().includes("black") ||
          value.toLowerCase().includes("charcoal")
            ? "#1a1a1a"
            : value.toLowerCase().includes("white") ||
                value.toLowerCase().includes("cream") ||
                value.toLowerCase().includes("ivory")
              ? "linear-gradient(135deg,#f5f5f5,#d4d4d4)"
              : "linear-gradient(135deg,#d1d5db,#9ca3af)",
        border: "1px solid rgba(0,0,0,0.12)",
      }
    : {
        background: `hsl(${hue},72%,52%)`,
      };

  return (
    <button
      type='button'
      aria-label={`${value}${!isAvailable ? " — out of stock" : ""}`}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cn(
        // base
        "group relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
        "text-[11.5px] font-medium leading-none tracking-wide",
        "transition-all duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",

        // available + selected
        isSelected &&
          isAvailable &&
          "border-zinc-900 bg-zinc-900 text-white shadow-sm",

        // available + not selected
        !isSelected &&
          isAvailable &&
          "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",

        // out of stock
        !isAvailable &&
          "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300",
      )}>
      {/* Color dot — only for color type */}
      {isColor && (
        <span
          aria-hidden
          className={cn(
            "inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full",
            !isAvailable && "opacity-40",
          )}
          style={dotStyle}
        />
      )}

      {/* Label */}
      <span
        className={cn(
          !isAvailable && "line-through decoration-zinc-300 decoration-1",
        )}>
        {value}
      </span>

      {/* OOS label */}
      {!isAvailable && (
        <span className='text-[10px] font-normal text-zinc-400 ml-0.5'>
          · out of stock
        </span>
      )}
    </button>
  );
};

export default EnhancedVariantSelector;
