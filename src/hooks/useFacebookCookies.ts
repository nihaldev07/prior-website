"use client";

import { useEffect, useCallback } from "react";

/**
 * Captures fbc and fbp cookies for CAPI Advanced Matching
 *
 * fbc (Facebook Click ID): Set when user arrives via a Facebook ad
 * fbp (Facebook Browser ID): Set by the pixel to identify the browser
 *
 * Both are needed for server-side CAPI event matching.
 */

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 90): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function generateFbp(): string {
  const subdomainIndex = 1;
  const randomNum = Math.floor(Math.random() * 2147483647);
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.${subdomainIndex}.${randomNum}.${timestamp}`;
}

function extractFbcFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  if (!fbclid) return null;

  const subdomainIndex = 1;
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.${subdomainIndex}.${fbclid}.${timestamp}`;
}

export interface FacebookCookieData {
  fbc: string | null;
  fbp: string | null;
}

export function useFacebookCookies(): FacebookCookieData {
  const ensureCookies = useCallback(() => {
    // Extract fbc from URL fbclid param if present
    const urlFbc = extractFbcFromUrl();
    if (urlFbc) {
      setCookie("_fbc", urlFbc);
    }

    // Ensure _fbp exists
    if (!getCookie("_fbp")) {
      setCookie("_fbp", generateFbp());
    }
  }, []);

  useEffect(() => {
    ensureCookies();
  }, [ensureCookies]);

  return {
    fbc: getCookie("_fbc"),
    fbp: getCookie("_fbp"),
  };
}

/**
 * Get Facebook cookies without the hook (for use outside components)
 */
export function getFacebookCookies(): FacebookCookieData {
  return {
    fbc: getCookie("_fbc"),
    fbp: getCookie("_fbp"),
  };
}
