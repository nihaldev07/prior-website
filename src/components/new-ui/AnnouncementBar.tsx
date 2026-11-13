"use client";

import { useCampaignContext } from "@/context/CampaignContext";
import { useCountdown } from "@/hooks/useCountdown";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * Site-wide campaign announcement bar rendered above the header.
 * Hidden until mounted (no server HTML) and when no active campaign exists
 * or the campaign has expired.
 */
const AnnouncementBar: React.FC = () => {
  const { campaign, loading } = useCampaignContext();
  const { days, hours, minutes, seconds, expired, mounted } = useCountdown(
    campaign?.endDate
  );

  if (loading || !campaign || expired || !mounted) return null;

  const discountLabel =
    campaign.discount > 0
      ? campaign.discountType === "%"
        ? `${campaign.discount}% OFF`
        : `৳${campaign.discount} OFF`
      : null;

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className='block w-full bg-primary text-white hover:bg-primary/90 transition-colors duration-300 group'
      aria-label={`${campaign.title} — Shop the campaign`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 sm:gap-4 text-[11px] md:text-xs font-sans uppercase tracking-[0.15em]'>
        <span className='truncate max-w-[45%] sm:max-w-none'>{campaign.title}</span>

        {discountLabel && (
          <span className='hidden sm:inline-block bg-white/10 border border-white/30 rounded-none px-2 py-0.5 whitespace-nowrap'>
            {discountLabel}
          </span>
        )}

        <span className='flex items-center gap-1 sm:gap-1.5 tabular-nums whitespace-nowrap'>
          <span className='hidden md:inline'>
            {days}d&nbsp;{hours}:{minutes}:{seconds}
          </span>
          <span className='md:hidden'>
            {days}d&nbsp;{hours}:{minutes}
          </span>
        </span>

        <span className='hidden sm:inline-flex items-center gap-1 whitespace-nowrap'>
          Shop Now
          <ArrowRight
            className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300'
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
};

export default AnnouncementBar;
