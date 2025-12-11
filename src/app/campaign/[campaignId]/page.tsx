"use client";
import React, { useEffect, useState } from "react";

import ProductCard from "@/shared/simpleProductCard";

import { ProductType } from "@/data/types";
import { LoaderCircle, Sparkles, Flame, Clock, Zap, TrendingUp, Heart, Star, Gift } from "lucide-react";
import Head from "next/head";
import useCampaign from "@/hooks/useCampaign";
import { ICampaign } from "@/lib/interface";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const SingleCampaignPage = ({
  params: { campaignId },
}: {
  params: { campaignId: string };
}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [campaign, setCampaign] = useState<ICampaign | null>(null);

  const { fetchActiveCampaignById } = useCampaign();

  const getCampaignById = async () => {
    setLoading(true);
    const response = await fetchActiveCampaignById(campaignId);
    if (!!response) {
      const { campaign, products } = response;
      if (!!campaign) {
        setCampaign(campaign);
      }
      if (!!products) setProducts(products);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (campaign) {
      updateCountdown(campaign.endDate);
      const interval = setInterval(
        () => updateCountdown(campaign.endDate),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [campaign]);

  useEffect(() => {
    getCampaignById();
    //eslint-disable-next-line
  }, [campaignId]);

  const updateCountdown = (endDate: string) => {
    const now = dayjs();
    const end = dayjs(endDate);
    const diff = end.diff(now);

    if (diff > 0) {
      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays()).toString().padStart(2, "0");
      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");

      setTimeLeft(`${days}:${hours}:${minutes}:${seconds}`);
    } else {
      setTimeLeft("Expired");
    }
  };

  return (
    <>
      <Head>
        <title>{!!campaign ? campaign?.title : "Prior Campaign"}</title>
        <meta
          name='description'
          content={campaign?.description || "Campaign description"}
        />
        <meta property='og:title' content={campaign?.title || "Campaign"} />
        <meta
          property='og:description'
          content={campaign?.description || "Campaign description"}
        />
        <meta
          property='og:image'
          content={campaign?.image || "/default-image.jpg"}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <div className='container my-6 md:my-10 relative overflow-hidden'>
        {/* Floating Background Decorations */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
          <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-200/30 via-red-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse' />
          <div className='absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-200/30 via-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Section with Campaign Title */}
        <div className='relative mb-8 md:mb-12'>
          <div className='relative overflow-hidden rounded-3xl md:rounded-[2.5rem] group'>
            {/* Gradient Background */}
            <div className='absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20' />

            {/* Glass Effect */}
            <div className='absolute inset-0 bg-white/60 dark:bg-white/10 backdrop-blur-xl border-2 border-white/40 dark:border-white/20' />

            {/* Animated Border Glow */}
            <div className='absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-700' />

            {/* Content */}
            <div className='relative p-6 md:p-10 text-center'>
              {/* Cute Icon Badge */}
              <div className='flex justify-center mb-4 md:mb-6'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl blur-lg opacity-60 animate-pulse' />
                  <div className='relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-3 md:p-4 rounded-2xl shadow-2xl'>
                    <Flame className='w-8 h-8 md:w-10 md:h-10 text-white animate-pulse' />
                  </div>
                  <Sparkles className='absolute -top-2 -right-2 w-5 h-5 text-yellow-400 fill-yellow-400 animate-bounce' />
                  <Star className='absolute -bottom-1 -left-2 w-4 h-4 text-orange-400 fill-orange-400 animate-ping' />
                </div>
              </div>

              {/* Title */}
              <h1 className='text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-3 md:mb-4 uppercase tracking-tight'>
                {campaign?.title}
              </h1>

              {/* Description */}
              <p className='text-sm md:text-lg text-gray-700 dark:text-gray-300 font-medium max-w-3xl mx-auto flex items-center justify-center gap-2 flex-wrap'>
                <Gift className='w-4 h-4 md:w-5 md:h-5 text-pink-500 inline-block' />
                {campaign?.description}
                <TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-orange-500 inline-block' />
              </p>
            </div>

            {/* Floating Decorations */}
            <div className='absolute top-4 right-4 md:top-6 md:right-8 opacity-60 group-hover:opacity-100 transition-opacity'>
              <span className='text-2xl md:text-4xl animate-bounce inline-block'>🔥</span>
            </div>
            <div className='absolute bottom-4 left-4 md:bottom-6 md:left-8 opacity-60 group-hover:opacity-100 transition-opacity' style={{ animationDelay: '0.5s' }}>
              <span className='text-xl md:text-3xl animate-bounce inline-block'>⚡</span>
            </div>
            <div className='absolute top-1/2 left-1/4 opacity-40 group-hover:opacity-80 transition-opacity hidden md:block' style={{ animationDelay: '1s' }}>
              <span className='text-2xl animate-bounce inline-block'>💝</span>
            </div>

            {/* Shimmer Effect */}
            <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
          </div>
        </div>

        {/* Countdown Timer Section */}
        <div className='flex flex-col justify-center items-center px-4 md:px-8 mb-8 md:mb-12'>
          {/* Timer Badge */}
          <div className='flex items-center gap-2 mb-4 md:mb-6'>
            <Clock className='w-5 h-5 md:w-6 md:h-6 text-red-500 animate-pulse' />
            <span className='text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
              {timeLeft.includes("Expired") ? "Campaign Ended" : "Hurry! Time's Running Out"}
            </span>
            <Zap className='w-5 h-5 md:w-6 md:h-6 text-orange-500 animate-pulse' />
          </div>

          {/* Countdown Boxes */}
          <div className='grid grid-cols-4 gap-2 md:gap-4 w-full max-w-2xl'>
            {/* Days */}
            <div className='flex flex-col gap-2'>
              <div className='relative group/timer'>
                <div className='absolute -inset-1 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl md:rounded-3xl opacity-60 group-hover/timer:opacity-100 blur-md transition-opacity' />
                <div className='relative bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl'>
                  <span className='text-2xl md:text-5xl font-black text-white drop-shadow-lg'>
                    {timeLeft.split(":")[0] || "00"}
                  </span>
                </div>
              </div>
              <span className='text-xs md:text-sm font-bold uppercase text-center text-gray-600 dark:text-gray-400 tracking-wider'>
                Days
              </span>
            </div>

            {/* Hours */}
            <div className='flex flex-col gap-2'>
              <div className='relative group/timer'>
                <div className='absolute -inset-1 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl md:rounded-3xl opacity-60 group-hover/timer:opacity-100 blur-md transition-opacity' />
                <div className='relative bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl'>
                  <span className='text-2xl md:text-5xl font-black text-white drop-shadow-lg'>
                    {timeLeft.split(":")[1] || "00"}
                  </span>
                </div>
              </div>
              <span className='text-xs md:text-sm font-bold uppercase text-center text-gray-600 dark:text-gray-400 tracking-wider'>
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className='flex flex-col gap-2'>
              <div className='relative group/timer'>
                <div className='absolute -inset-1 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl md:rounded-3xl opacity-60 group-hover/timer:opacity-100 blur-md transition-opacity' />
                <div className='relative bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl'>
                  <span className='text-2xl md:text-5xl font-black text-white drop-shadow-lg'>
                    {timeLeft.split(":")[2] || "00"}
                  </span>
                </div>
              </div>
              <span className='text-xs md:text-sm font-bold uppercase text-center text-gray-600 dark:text-gray-400 tracking-wider'>
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className='flex flex-col gap-2'>
              <div className='relative group/timer'>
                <div className='absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl md:rounded-3xl opacity-60 group-hover/timer:opacity-100 blur-md transition-opacity' />
                <div className='relative bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl'>
                  <span className='text-2xl md:text-5xl font-black text-white drop-shadow-lg'>
                    {timeLeft.split(":")[3] || "00"}
                  </span>
                </div>
              </div>
              <span className='text-xs md:text-sm font-bold uppercase text-center text-gray-600 dark:text-gray-400 tracking-wider'>
                Seconds
              </span>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className='relative'>
          {/* Section Header */}
          <div className='flex items-center justify-center gap-3 mb-6 md:mb-8'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent' />
            <div className='flex items-center gap-2'>
              <Sparkles className='w-5 h-5 md:w-6 md:h-6 text-pink-500' />
              <h2 className='text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent'>
                Featured Deals
              </h2>
              <Heart className='w-5 h-5 md:w-6 md:h-6 text-pink-500 fill-pink-500 animate-pulse' />
            </div>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-pink-300 to-transparent' />
          </div>

          {/* Products Grid */}
          <div className='relative'>
            {loading ? (
              <div className='flex flex-col justify-center items-center gap-4 py-16 md:py-24'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse' />
                  <LoaderCircle className='relative w-12 h-12 md:w-16 md:h-16 text-pink-500 animate-spin' />
                </div>
                <span className='text-base md:text-lg font-semibold text-gray-600 dark:text-gray-400 animate-pulse'>
                  Loading amazing deals...
                </span>
              </div>
            ) : timeLeft.includes("Expired") ? (
              <div className='flex flex-col justify-center items-center gap-4 py-16 md:py-24'>
                <div className='text-6xl md:text-8xl'>😢</div>
                <h3 className='text-xl md:text-3xl font-bold text-gray-700 dark:text-gray-300'>
                  Campaign Has Ended
                </h3>
                <p className='text-sm md:text-base text-gray-600 dark:text-gray-400'>
                  Stay tuned for more exciting campaigns!
                </p>
              </div>
            ) : (
              <div className='grid gap-4 md:gap-6 lg:gap-8 grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
                {products.map((item: ProductType, index: number) => (
                  <div
                    key={item.id}
                    className='transform transition-all duration-300 hover:scale-105'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Decorative Stars */}
          {!loading && !timeLeft.includes("Expired") && products.length > 0 && (
            <div className='flex justify-center gap-2 md:gap-3 mt-8 md:mt-12'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-4 h-4 md:w-6 md:h-6 text-yellow-400 fill-yellow-400 opacity-70 hover:opacity-100 hover:scale-110 transition-all cursor-pointer'
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Cute Message */}
        {!loading && !timeLeft.includes("Expired") && products.length > 0 && (
          <div className='text-center mt-8 md:mt-12'>
            <p className='text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium italic flex items-center justify-center gap-2 flex-wrap'>
              <span className='text-xl md:text-2xl'>🎁</span>
              Grab these deals before time runs out!
              <span className='text-xl md:text-2xl'>⏰</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleCampaignPage;
