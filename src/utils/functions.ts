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


export const  isValidBDPhoneNumber=(number: string): boolean => {
  // Regular Expression for BD phone numbers
  const bdNumberRegex = /^(?:\+88)?01[3-9]\d{8}$/;

  // Remove extra spaces or dashes if any
  const sanitizedNumber = number.trim();

  // Test the number with regex
  return bdNumberRegex.test(sanitizedNumber);
}