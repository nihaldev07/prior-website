import { useEffect } from "react";

// Custom hook to throttle the execution of useEffect
const useThrottledEffect = (
  effect: () => void,
  deps: any[],
  throttleTime: number
) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const throttledEffect = () => {
      if (!timeoutId) {
        effect(); // Execute the effect
        timeoutId = setTimeout(() => {
          timeoutId = null;
        }, throttleTime); // Set a timeout to clear the flag after throttleTime
      }
    };

    throttledEffect(); // Initial execution

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear timeout if component unmounts
      }
    };
    //eslint-disable-next-line
  }, deps); // Only re-run if any of the dependencies change
};

export default useThrottledEffect;
