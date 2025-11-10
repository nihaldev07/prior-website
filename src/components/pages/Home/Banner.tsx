"use client";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner has been dismissed
    const dismissed = sessionStorage.getItem("bannerDismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Check if current time is before November 12, 2025, 1:00 AM
    const endDate = new Date("2025-11-12T01:00:00");
    const now = new Date();

    if (now < endDate) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("bannerDismissed", "true");
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className='relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-[#0b3393] via-[#1a4dbc] to-[#0b3393] px-6 py-2.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5 sm:before:flex-1'>
      <div
        aria-hidden='true'
        className='absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl'>
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className='aspect-577/310 w-144.25 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-40'
        />
      </div>
      <div
        aria-hidden='true'
        className='absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl'>
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className='aspect-577/310 w-144.25 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-40'
        />
      </div>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <p className='text-sm/6 text-white'>
          <strong className='font-semibold'>🔥 11.11 Flash Sale</strong>
          <svg
            viewBox='0 0 2 2'
            aria-hidden='true'
            className='mx-2 inline size-0.5 fill-current'>
            <circle r={1} cx={1} cy={1} />
          </svg>
          Unlock Unbeatable Deals - Save Big on Your Favorites Today!
        </p>
        <a
          href='/collections'
          className='flex-none rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-[#0b3393] shadow-sm hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors'>
          Shop Now <span aria-hidden='true'>&rarr;</span>
        </a>
      </div>
      <div className='flex flex-1 justify-end'>
        <button
          type='button'
          onClick={handleDismiss}
          className='-m-3 p-3 focus-visible:-outline-offset-4 hover:bg-white/10 rounded-md transition-colors'>
          <span className='sr-only'>Dismiss</span>
          <X aria-hidden='true' className='size-5 text-white' />
        </button>
      </div>
    </div>
  );
}
