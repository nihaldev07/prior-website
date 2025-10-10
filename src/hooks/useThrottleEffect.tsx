import { useEffect, useRef } from "react";

/**
 * Properly implemented throttle hook
 * Ensures effect runs at most once per throttleTime period
 */
const useThrottledEffect = (
  effect: () => void,
  deps: any[],
  throttleTime: number
) => {
  const lastRan = useRef(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = () => {
      const now = Date.now();
      const timeSinceLastRan = now - lastRan.current;

      if (timeSinceLastRan >= throttleTime) {
        // Enough time has passed, run immediately
        effect();
        lastRan.current = now;
      } else {
        // Schedule for later
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }

        const timeRemaining = throttleTime - timeSinceLastRan;
        timeoutId.current = setTimeout(() => {
          effect();
          lastRan.current = Date.now();
          timeoutId.current = null;
        }, timeRemaining);
      }
    };

    handler();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
    //eslint-disable-next-line
  }, deps);
};

export default useThrottledEffect;
