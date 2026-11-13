"use client";

import { adaptCampaignProductToNewFormat } from "@/lib/adapters/productAdapter";
import useCampaign from "@/hooks/useCampaign";
import { useCountdown } from "@/hooks/useCountdown";
import { ICampaign, ICampaingProducts } from "@/lib/interface";
import ProductGrid from "@/components/new-ui/ProductGrid";
import { ArrowLeft, CalendarClock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CampaignLandingProps {
  campaignId: string;
}

const CampaignLanding: React.FC<CampaignLandingProps> = ({ campaignId }) => {
  const { fetchActiveCampaignById } = useCampaign();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [products, setProducts] = useState<ICampaingProducts[]>([]);
  const router = useRouter();

  const { days, hours, minutes, seconds, expired, mounted } =
    useCountdown(campaign?.endDate);

  useEffect(() => {
    let cancelled = false;

    const getCampaignById = async () => {
      setLoading(true);
      const response = await fetchActiveCampaignById(campaignId);
      if (!cancelled && response) {
        setCampaign(response.campaign ?? null);
        setProducts(response.products ?? []);
      }
      if (!cancelled) setLoading(false);
    };

    getCampaignById();
    return () => {
      cancelled = true;
    };
  }, [campaignId, fetchActiveCampaignById]);

  const discountLabel =
    campaign && campaign.discount > 0
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

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6'>
        <div className='w-16 h-16 bg-neutral-100 animate-pulse' />
        <p className='text-xs font-serif uppercase tracking-[0.2em] text-neutral-500'>
          Loading Campaign
        </p>
      </div>
    );
  }

  /* ---------- Not found state ---------- */
  if (!campaign) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center'>
        <div className='w-20 h-20 bg-neutral-100 flex items-center justify-center'>
          <CalendarClock className='w-10 h-10 text-neutral-400' strokeWidth={1.5} />
        </div>
        <h1 className='text-2xl md:text-3xl font-serif tracking-wide text-neutral-900'>
          Campaign Not Found
        </h1>
        <p className='text-sm md:text-base font-serif text-neutral-600 tracking-wide max-w-md'>
          This campaign is no longer available. Explore our latest collection
          instead.
        </p>
        <Link
          href='/'
          className='inline-flex items-center gap-2 h-11 px-8 text-xs font-serif tracking-[0.15em] uppercase bg-neutral-900 hover:bg-neutral-800 text-white rounded-none transition-colors duration-300'>
          <ArrowLeft className='w-4 h-4' />
          Back to Home
        </Link>
      </div>
    );
  }

  /* ---------- Campaign landing ---------- */
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='relative h-[45vh] md:h-[60vh] overflow-hidden'>
        {campaign.image ? (
          <>
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              priority
              className='object-cover'
              sizes='100vw'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10' />
          </>
        ) : (
          <div className='absolute inset-0 bg-neutral-900' />
        )}

        {/* Discount badge */}
        {discountLabel && (
          <div className='absolute top-6 left-4 sm:left-6 lg:left-8 bg-primary text-white px-4 py-2 font-sans text-sm md:text-base uppercase tracking-[0.15em]'>
            {discountLabel}
          </div>
        )}

        {/* Content */}
        <div className='absolute inset-x-0 bottom-0'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 space-y-3 md:space-y-4'>
            <p className='text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase text-white/80'>
              Limited Time Campaign
            </p>
            <h1 className='font-serif tracking-wide text-white text-3xl md:text-5xl lg:text-6xl leading-tight max-w-3xl'>
              {campaign.title}
            </h1>
            {campaign.description && (
              <p className='hidden md:block font-serif text-white/90 text-sm md:text-base leading-relaxed tracking-wide max-w-xl'>
                {campaign.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Countdown strip */}
      {!expired && mounted && (
        <section className='border-b border-neutral-200 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col items-center gap-4 md:gap-5'>
            <p className='text-[10px] md:text-xs font-serif uppercase tracking-[0.2em] text-neutral-500'>
              Offer Ends In
            </p>
            <div className='grid grid-cols-4 gap-2 md:gap-4'>
              {countdownTiles.map((tile) => (
                <div
                  key={tile.label}
                  className='bg-neutral-900 text-white rounded-none w-20 md:w-24 py-3 md:py-4 flex flex-col items-center'>
                  <span className='font-sans text-xl md:text-3xl lg:text-4xl tabular-nums'>
                    {tile.value}
                  </span>
                  <span className='text-[9px] md:text-[10px] font-serif uppercase tracking-[0.15em] text-white/60 mt-1'>
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {!expired && (
        <ProductGrid
          products={products.map(adaptCampaignProductToNewFormat)}
          title='Campaign Picks'
          subtitle='Handpicked styles from this limited-time campaign.'
          showViewAll={false}
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-24'
        />
      )}

      {/* Expired state */}
      {expired && (
        <section className='py-16 md:py-24'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-6'>
            <div className='w-20 h-20 bg-neutral-100 flex items-center justify-center'>
              <CalendarClock className='w-10 h-10 text-neutral-400' strokeWidth={1.5} />
            </div>
            <h2 className='text-xl md:text-2xl font-serif tracking-wide text-neutral-900'>
              This Campaign Has Ended
            </h2>
            <p className='text-sm md:text-base font-serif text-neutral-600 tracking-wide max-w-md leading-relaxed'>
              Thank you for your interest. Explore our latest arrivals to find
              something you love.
            </p>
            <button
              onClick={() => router.push("/collections?sort=newest")}
              className='inline-flex items-center gap-2 h-11 px-8 text-xs font-serif tracking-[0.15em] uppercase bg-neutral-900 hover:bg-neutral-800 text-white rounded-none transition-colors duration-300'>
              Shop New Arrivals
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default CampaignLanding;
