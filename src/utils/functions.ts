import { Variation } from "@/data/types";

export const  formatVariant=(variant:Variation)=> {
  if (!variant || (!variant.color && !variant.size)) {
    return "No variant";
  }

  const { color, size } = variant;

  if (color && size) {
    return `${color} - ${size}`;
  }

  return color || size || "No variant";
}