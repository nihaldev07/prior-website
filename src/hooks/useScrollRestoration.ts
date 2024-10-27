"use client";
// src/hooks/useScrollRestoration.ts
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const useScrollRestoration = () => {
  const pathname = usePathname();
  const scrollPositions = useRef<{ [key: string]: number }>({});

  // Function to save scroll position
  const saveScrollPosition = () => {
    scrollPositions.current[pathname] = window.scrollY;
    sessionStorage.setItem("scrollPositions", JSON.stringify(scrollPositions.current));
  };

  // Function to restore scroll position
  const restoreScrollPosition = () => {
    const savedPositions = JSON.parse(sessionStorage.getItem("scrollPositions") || "{}");
    const scrollY = savedPositions[pathname] ?? 0;
    window.scrollTo(0, scrollY);
  };

  useEffect(() => {
    // Restore scroll position when the component mounts or pathname changes
    restoreScrollPosition();

    // Save scroll position when navigating away
    window.addEventListener("beforeunload", saveScrollPosition);
    window.addEventListener("popstate", restoreScrollPosition);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("beforeunload", saveScrollPosition);
      window.removeEventListener("popstate", restoreScrollPosition);
    };
    //eslint-disable-next-line
  }, [pathname]); // Re-run effect when pathname changes
};
