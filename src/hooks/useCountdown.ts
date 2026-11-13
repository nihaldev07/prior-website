"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface CountdownState {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
  mounted: boolean;
}

/**
 * Shared hydration-safe countdown hook.
 * Interval starts only in useEffect; `mounted` stays false until then so
 * consumers can render placeholders and avoid server/client mismatches.
 */
export const useCountdown = (endDate?: string): CountdownState => {
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
    expired: false,
    mounted: false,
  });

  useEffect(() => {
    if (!endDate) return;

    const tick = () => {
      const diff = dayjs(endDate).diff(dayjs());

      if (diff > 0) {
        const durationObj = dayjs.duration(diff);
        setTimeLeft({
          days: Math.floor(durationObj.asDays()).toString().padStart(2, "0"),
          hours: durationObj.hours().toString().padStart(2, "0"),
          minutes: durationObj.minutes().toString().padStart(2, "0"),
          seconds: durationObj.seconds().toString().padStart(2, "0"),
          expired: false,
          mounted: true,
        });
      } else {
        setTimeLeft((prev) => ({ ...prev, expired: true, mounted: true }));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return timeLeft;
};

export default useCountdown;
