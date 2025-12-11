"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { X, ArrowRight, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ICampaign } from "@/lib/interface";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface CampaignPopupProps {
  campaign: ICampaign;
}

const CampaignPopup: React.FC<CampaignPopupProps> = ({ campaign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Check if user has already seen the popup today
    const lastSeen = localStorage.getItem("campaignPopupLastSeen");
    const today = new Date().toDateString();

    if (!lastSeen || lastSeen !== today) {
      // Show popup after 1 second delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (campaign && isOpen) {
      updateCountdown(campaign.endDate);
      const interval = setInterval(
        () => updateCountdown(campaign.endDate),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [campaign, isOpen]);

  const updateCountdown = (endDate: string) => {
    const now = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(now);

    if (diff > 0) {
      const durationObj = dayjs.duration(diff);
      const days = Math.floor(durationObj.asDays()).toString().padStart(2, "0");
      const hours = durationObj.hours().toString().padStart(2, "0");
      const minutes = durationObj.minutes().toString().padStart(2, "0");
      const seconds = durationObj.seconds().toString().padStart(2, "0");

      setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
    } else {
      setTimeLeft("Expired");
    }
  };

  const parseTimeLeft = (time: string) => {
    if (time.includes("Expired") || !time) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }
    const parts = time.split(":");
    return {
      days: parts[0] || "00",
      hours: parts[1] || "00",
      minutes: parts[2] || "00",
      seconds: parts[3] || "00",
    };
  };

  const handleClose = () => {
    setIsOpen(false);
    // Store that user has seen the popup today
    localStorage.setItem("campaignPopupLastSeen", new Date().toDateString());
  };

  const handleShopNow = () => {
    handleClose();
    router.push(`/campaign/${campaign.id}`);
  };

  if (!campaign?.image) {
    return null; // Don't show popup if no image
  }

  // Mobile Drawer View
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className='max-h-[90vh]'>
          {/* Close Button */}
          <DrawerClose
            onClick={handleClose}
            className='absolute top-4 right-4 z-50 rounded-full bg-black/60 backdrop-blur-sm p-2 hover:bg-black/80 transition-all duration-200'>
            <X className='h-4 w-4 text-white' />
          </DrawerClose>

          <div className='overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300'>
            {/* Image Section */}
            <div className='relative h-[45vh] bg-white'>
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className='object-cover'
                priority
              />

              {/* Discount Badge */}
              {campaign.discount > 0 && (
                <div className='absolute top-6 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1 animate-pulse'>
                  <Sparkles className='h-3 w-3' />
                  {campaign.discountType === "%"
                    ? `${campaign.discount}% OFF`
                    : `৳${campaign.discount} OFF`}
                </div>
              )}
            </div>

            {/* Content Section */}
            <DrawerHeader className='text-left px-6 pt-6'>
              <DrawerTitle className='text-2xl font-bold text-gray-900 leading-tight'>
                {campaign.title}
              </DrawerTitle>
              <DrawerDescription className='text-gray-600 text-sm leading-relaxed mt-2'>
                {campaign.description}
              </DrawerDescription>
            </DrawerHeader>

            <div className='px-6 pb-8'>
              {/* Countdown Timer */}
              {timeLeft && timeLeft !== "Expired" && (
                <div className='mb-5'>
                  <div className='flex items-center gap-2 mb-3 justify-center'>
                    <Clock className='h-4 w-4 text-orange-600' />
                    <span className='text-orange-600 font-semibold text-xs uppercase tracking-wide'>
                      Offer Ends In
                    </span>
                  </div>

                  <div className='grid grid-cols-4 gap-2'>
                    {/* Days */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 shadow-md w-full'>
                        <div className='text-xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).days}
                        </div>
                      </div>
                      <span className='text-gray-500 text-[10px] font-medium mt-1 uppercase'>
                        Days
                      </span>
                    </div>

                    {/* Hours */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-2 shadow-md w-full'>
                        <div className='text-xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).hours}
                        </div>
                      </div>
                      <span className='text-gray-500 text-[10px] font-medium mt-1 uppercase'>
                        Hours
                      </span>
                    </div>

                    {/* Minutes */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2 shadow-md w-full'>
                        <div className='text-xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).minutes}
                        </div>
                      </div>
                      <span className='text-gray-500 text-[10px] font-medium mt-1 uppercase'>
                        Mins
                      </span>
                    </div>

                    {/* Seconds */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-2 shadow-md w-full'>
                        <div className='text-xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).seconds}
                        </div>
                      </div>
                      <span className='text-gray-500 text-[10px] font-medium mt-1 uppercase'>
                        Secs
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className='mb-5 flex flex-wrap items-center gap-3 text-xs text-gray-500'>
                <div className='flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200'>
                  <svg
                    className='w-3 h-3 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='font-medium text-green-700'>
                    Limited Time
                  </span>
                </div>
                <div className='flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200'>
                  <svg
                    className='w-3 h-3 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  <span className='font-medium text-blue-700'>Trending</span>
                </div>
                <div className='flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200'>
                  <svg
                    className='w-3 h-3 text-purple-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='font-medium text-purple-700'>
                    Special Deal
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col gap-3'>
                <button
                  onClick={handleShopNow}
                  className='w-full bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-base hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group active:scale-95'>
                  <Sparkles className='h-5 w-5' />
                  Shop Now
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </button>
                <button
                  onClick={handleClose}
                  className='w-full px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200 border border-gray-200 active:scale-95'>
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
      <DialogContent className='max-w-4xl p-0 overflow-hidden border-0 bg-transparent shadow-2xl rounded-none'>
        <div className='relative bg-white overflow-hidden'>
          {/* Close Button */}
          <DialogClose
            onClick={handleClose}
            className='absolute top-4 right-4 z-50 rounded-full bg-white/90 backdrop-blur-sm p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl'>
            <X className='h-5 w-5 text-gray-700' />
          </DialogClose>

          <div className='grid md:grid-cols-2 gap-0'>
            {/* Image Section */}
            <div className='relative h-[300px] md:h-[550px] bg-white'>
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className='object-cover'
                priority
              />

              {/* Overlay Badge */}
              {campaign.discount > 0 && (
                <div className='absolute top-6 left-6 bg-red-500 text-white px-5 py-2.5 rounded-full font-bold text-lg shadow-lg flex items-center gap-2 animate-pulse'>
                  <Sparkles className='h-5 w-5' />
                  {campaign.discountType === "%"
                    ? `${campaign.discount}% OFF`
                    : `৳${campaign.discount} OFF`}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className='p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50'>
              {/* Title */}
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight'>
                {campaign.title}
              </h2>

              {/* Description */}
              <p className='text-gray-600 text-base md:text-lg mb-6 leading-relaxed'>
                {campaign.description}
              </p>

              {/* Countdown Timer */}
              {timeLeft && timeLeft !== "Expired" && (
                <div className='mb-6'>
                  <div className='flex items-center gap-2 mb-4 justify-center'>
                    <Clock className='h-5 w-5 text-orange-600' />
                    <span className='text-orange-600 font-semibold text-sm uppercase tracking-wide'>
                      Offer Ends In
                    </span>
                  </div>

                  <div className='grid grid-cols-4 gap-3'>
                    {/* Days */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 shadow-lg w-full'>
                        <div className='text-2xl sm:text-3xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).days}
                        </div>
                      </div>
                      <span className='text-gray-500 text-xs font-medium mt-2 uppercase'>
                        Days
                      </span>
                    </div>

                    {/* Hours */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-3 shadow-lg w-full'>
                        <div className='text-2xl sm:text-3xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).hours}
                        </div>
                      </div>
                      <span className='text-gray-500 text-xs font-medium mt-2 uppercase'>
                        Hours
                      </span>
                    </div>

                    {/* Minutes */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 shadow-lg w-full'>
                        <div className='text-2xl sm:text-3xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).minutes}
                        </div>
                      </div>
                      <span className='text-gray-500 text-xs font-medium mt-2 uppercase'>
                        Mins
                      </span>
                    </div>

                    {/* Seconds */}
                    <div className='flex flex-col items-center'>
                      <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-3 shadow-lg w-full'>
                        <div className='text-2xl sm:text-3xl font-black text-white text-center'>
                          {parseTimeLeft(timeLeft).seconds}
                        </div>
                      </div>
                      <span className='text-gray-500 text-xs font-medium mt-2 uppercase'>
                        Secs
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 mb-6'>
                <button
                  onClick={handleShopNow}
                  className='flex-1 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group'>
                  <Sparkles className='h-5 w-5' />
                  Shop Now
                  <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </button>
                <button
                  onClick={handleClose}
                  className='sm:w-auto px-6 py-4 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-200 border border-gray-200'>
                  Maybe Later
                </button>
              </div>

              {/* Trust Badges */}
              <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500'>
                <div className='flex items-center gap-1.5 bg-green-50 px-3 py-2 rounded-lg border border-green-200'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='font-medium text-green-700'>
                    Limited Time Only
                  </span>
                </div>
                <div className='flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200'>
                  <svg
                    className='w-4 h-4 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  <span className='font-medium text-blue-700'>
                    Popular Choice
                  </span>
                </div>
                <div className='flex items-center gap-1.5 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200'>
                  <svg
                    className='w-4 h-4 text-purple-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='font-medium text-purple-700'>
                    Special Deal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignPopup;
