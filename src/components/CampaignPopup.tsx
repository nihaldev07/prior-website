"use client";

import { useCampaignContext } from "@/context/CampaignContext";
import { useCountdown } from "@/hooks/useCountdown";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * Homepage campaign popup, shown once per day.
 * Reads the shared campaign from CampaignContext (no props, no own fetch).
 * Mobile renders as a bottom drawer, desktop as a centered modal.
 */
const CampaignPopup: React.FC = () => {
  const { campaign } = useCampaignContext();
  const { days, hours, minutes, seconds, expired } = useCountdown(
    campaign?.endDate
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Only show on the homepage, once per day
    if (pathname !== "/") return;

    const lastSeen = localStorage.getItem("campaignPopupLastSeen");
    const today = new Date().toDateString();

    if (!lastSeen || lastSeen !== today) {
      // Show popup after 1 second delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
    // Store that user has seen the popup today
    localStorage.setItem("campaignPopupLastSeen", new Date().toDateString());
  };

  const handleShopNow = () => {
    handleClose();
    router.push(`/campaign/${campaign?.id}`);
  };

  if (!campaign?.image || expired) {
    return null;
  }

  const discountLabel =
    campaign.discount > 0
      ? campaign.discountType === "%"
        ? `${campaign.discount}% OFF`
        : `৳${campaign.discount} OFF`
      : null;

  const countdownTiles = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Mins" },
    { value: seconds, label: "Secs" },
  ];

  const Countdown = () => (
    <div className='grid grid-cols-4 gap-2 md:gap-3'>
      {countdownTiles.map((tile) => (
        <div key={tile.label} className='flex flex-col items-center'>
          <div className='bg-neutral-900 rounded-none p-2 md:p-3 w-full'>
            <div className='font-sans text-lg md:text-2xl lg:text-3xl text-white text-center tabular-nums'>
              {tile.value}
            </div>
          </div>
          <span className='text-neutral-500 text-[9px] md:text-[10px] font-serif uppercase tracking-[0.15em] mt-1'>
            {tile.label}
          </span>
        </div>
      ))}
    </div>
  );

  const Eyebrow = () => (
    <p className='text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
      Limited Time Offer
    </p>
  );

  // Mobile Drawer View
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className='max-h-[90vh] rounded-none'>
          {/* Close Button */}
          <DrawerClose
            onClick={handleClose}
            className='absolute top-4 right-4 z-50 bg-black/60 p-2 hover:bg-black/80 transition-colors duration-200'>
            <X className='h-4 w-4 text-white' />
          </DrawerClose>

          <div className='overflow-y-auto max-h-[90vh]'>
            {/* Image Section */}
            <div className='relative h-[40vh] bg-neutral-100'>
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className='object-cover'
                sizes='100vw'
              />

              {/* Discount Badge */}
              {discountLabel && (
                <div className='absolute top-6 left-4 bg-primary text-white px-3 py-1.5 font-sans text-xs uppercase tracking-[0.15em]'>
                  {discountLabel}
                </div>
              )}
            </div>

            {/* Content Section */}
            <DrawerHeader className='text-left px-6 pt-6'>
              <DrawerTitle className='font-serif text-xl md:text-2xl tracking-wide text-neutral-900 leading-tight'>
                {campaign.title}
              </DrawerTitle>
              <DrawerDescription className='font-serif text-neutral-600 text-sm leading-relaxed mt-2 tracking-wide'>
                {campaign.description}
              </DrawerDescription>
            </DrawerHeader>

            <div className='px-6 pb-8'>
              {/* Countdown Timer */}
              <div className='mb-6'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='text-[10px] font-serif uppercase tracking-[0.2em] text-neutral-500'>
                    Offer Ends In
                  </span>
                </div>
                <Countdown />
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col gap-3'>
                <button
                  onClick={handleShopNow}
                  className='w-full bg-primary hover:bg-primary/90 text-white px-6 py-4 font-sans text-sm uppercase tracking-[0.15em] transition-colors duration-200 flex items-center justify-center gap-2 group'>
                  Shop Now
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </button>
                <button
                  onClick={handleClose}
                  className='w-full px-6 py-3 font-sans text-xs uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors duration-200 border border-neutral-300'>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Modal View
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='max-w-4xl p-0 overflow-hidden border-0 bg-white shadow-2xl rounded-none'>
        <div className='relative'>
          {/* Close Button */}
          <DialogClose
            onClick={handleClose}
            className='absolute top-4 right-4 z-50 bg-white/90 p-2.5 hover:bg-white transition-colors duration-200'>
            <X className='h-5 w-5 text-neutral-700' />
          </DialogClose>

          <div className='grid md:grid-cols-2'>
            {/* Image Section */}
            <div className='relative h-[300px] md:h-[550px] bg-neutral-100'>
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
                priority
              />

              {/* Discount Badge */}
              {discountLabel && (
                <div className='absolute top-6 left-6 bg-primary text-white px-4 py-2 font-sans text-sm md:text-base uppercase tracking-[0.15em]'>
                  {discountLabel}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className='p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white'>
              <Eyebrow />

              {/* Title */}
              <h2 className='font-serif text-2xl md:text-3xl lg:text-4xl tracking-wide text-neutral-900 mt-3 mb-4 leading-tight'>
                {campaign.title}
              </h2>

              {/* Description */}
              <p className='font-serif text-neutral-600 text-sm md:text-base mb-6 leading-relaxed tracking-wide'>
                {campaign.description}
              </p>

              {/* Countdown Timer */}
              <div className='mb-6'>
                <p className='text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-neutral-500 mb-3'>
                  Offer Ends In
                </p>
                <Countdown />
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-3'>
                <button
                  onClick={handleShopNow}
                  className='flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-4 font-sans text-sm uppercase tracking-[0.15em] transition-colors duration-200 flex items-center justify-center gap-2 group'>
                  Shop Now
                  <ArrowRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
                </button>
                <button
                  onClick={handleClose}
                  className='sm:w-auto px-6 py-4 font-sans text-xs uppercase tracking-[0.15em] text-neutral-600 hover:bg-neutral-50 transition-colors duration-200 border border-neutral-300'>
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPopup;
