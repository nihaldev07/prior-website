"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";

interface Outlet {
  id: string;
  name: string;
  image: string;
  mapUrl: string;
  address?: string;
  location?: string;
}

interface PriorOutletSectionProps {
  outlets?: Outlet[];
  sectionLabel?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  buttonText?: string;
}

const DEFAULT_OUTLETS: Outlet[] = [
  {
    id: "outlet-2",
    name: "Wari",
    image: "/images/stores/wari.jpg",
    mapUrl: "https://maps.app.goo.gl/56iuM1DmTCZzpptZ7",
    address: "",
    location:
      "Rankin Square, Shop 05, Rankin Street (Opposite Bata, Men's World Building)",
  },
  {
    id: "outlet-3",
    name: "Uttara",
    image: "/images/stores/uttara.jpg",
    mapUrl: "https://maps.app.goo.gl/xTXgxXLNzRs3Hiwg9",
    address: "",
    location:
      "Uttara Square Shopping Complex, Shop 12 (Semi Basement), Beside Zam Zam Tower, Sector 13",
  },
  {
    id: "outlet-1",
    name: "Dhanmondi",
    image: "/images/stores/dhanmondi.jpg",
    mapUrl: "https://maps.app.goo.gl/rTq3eNZ872pMMxqA7",
    address: "",
    location: "Dhanmondi 27, Genetic Plaza, Shop 134",
  },
];

const PriorOutletSection: React.FC<PriorOutletSectionProps> = ({
  outlets = DEFAULT_OUTLETS,
  sectionLabel = "Our Locations",
  sectionTitle = "Visit Our Outlets",
  sectionDescription = "Experience our collections in person at any of our three conveniently located outlets. Find your nearest destination and visit us today.",
  buttonText = "Get Directions",
}) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const [activeOutlet, setActiveOutlet] = useState<string>(
    outlets[0]?.id || "",
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedOutlet, setDisplayedOutlet] = useState<string>(
    outlets[0]?.id || "",
  );

  const currentOutlet =
    outlets.find((o) => o.id === displayedOutlet) || outlets[0];

  const handleOutletChange = (id: string) => {
    if (id === activeOutlet) return;
    setIsTransitioning(true);
    setActiveOutlet(id);
    setTimeout(() => {
      setDisplayedOutlet(id);
      setIsTransitioning(false);
    }, 350);
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }
        .outlet-img-enter {
          animation: scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .outlet-img-exit {
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .directions-btn {
          position: relative;
          overflow: hidden;
        }
        .directions-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #171717;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .directions-btn:hover::before {
          transform: translateY(0);
        }
        .directions-btn:hover .btn-text,
        .directions-btn:hover .btn-icon {
          color: white;
        }
        .btn-text, .btn-icon {
          position: relative;
          z-index: 1;
          transition: color 0.4s ease;
        }
        .tab-indicator {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #171717;
          transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tab-btn.active .tab-indicator {
          transform: scaleX(1);
        }
        .outlet-counter {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200 bg-white'>
        <div className='w-full'>
          {/* Section Header */}
          <div className='text-center mb-8 sm:mb-10 md:mb-14 space-y-2 sm:space-y-3 px-4'>
            <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
              {sectionLabel}
            </p>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide text-neutral-900 leading-tight'>
              {sectionTitle}
            </h2>
            {sectionDescription && (
              <p className='text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed'>
                {sectionDescription}
              </p>
            )}
          </div>

          {/* ─── SHOWCASE LAYOUT ─────────────────────────────── */}
          {/* ─── TAB NAVIGATION ─────────────────────────────── */}
          <div className='hidden md:block border border-b-0 border-neutral-200'>
            <nav className='grid grid-cols-3'>
              {outlets.map((outlet, idx) => (
                <button
                  key={outlet.id}
                  onClick={() => handleOutletChange(outlet.id)}
                  className={`
                      tab-btn relative py-4 sm:py-5 px-2
                      text-sm sm:text-base font-serif tracking-[0.12em]
                      transition-colors duration-300
                      border-r border-neutral-200 last:border-r-0
                      ${
                        activeOutlet === outlet.id
                          ? "active text-neutral-900"
                          : "text-neutral-400 hover:text-neutral-700"
                      }
                    `}>
                  {/* Subtle top accent on active */}
                  <span
                    className={`absolute top-0 left-0 right-0 h-px bg-neutral-900 transition-opacity duration-300 ${activeOutlet === outlet.id ? "opacity-100" : "opacity-0"}`}
                  />
                  {outlet.name}
                  <span className='tab-indicator' />
                </button>
              ))}
            </nav>
          </div>
          <div className='w-full'>
            {/* IMAGE SHOWCASE */}
            <div
              className='relative w-full overflow-hidden bg-neutral-800'
              style={{
                /* Mobile: tall portrait. Desktop: wide cinematic */
                aspectRatio: "auto",
              }}>
              {/* The image wrapper — different aspect ratios via class */}
              <div
                className={`
                  relative
                  aspect-[3/4]
                  md:aspect-[16/9]
                  overflow-hidden
                  w-full md:max-w-[1440px] md:max-h-[1000px] mx-auto
                  ${isTransitioning ? "outlet-img-exit" : "outlet-img-enter"}
                `}>
                {currentOutlet?.image ? (
                  <Image
                    src={currentOutlet.image}
                    alt={currentOutlet.name}
                    fill
                    priority
                    quality={95}
                    className='object-cover object-center'
                    sizes='(max-width: 768px) 100vw, 1440px' // ✅ Match intrinsic size
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200'>
                    <div className='text-center space-y-3'>
                      <MapPin className='w-12 h-12 text-neutral-400 mx-auto' />
                      <p className='text-sm font-serif text-neutral-500 tracking-wide'>
                        {currentOutlet?.name || "Outlet Image"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Subtle luminosity gradient — doesn't darken, just adds depth */}
                {/* <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none' /> */}

                {/* Title and Location - Mobile: 30% from top, Desktop: middle */}
                <div className='absolute inset-x-0 flex flex-col items-center justify-center text-white px-4 top-[15%] md:top-[40%]'>
                  <div className='text-center space-y-2 md:space-y-3 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full'>
                    <p className='text-xl sm:text-2xl md:text-3xl lg:text-4xl !font-serif tracking-wide  uppercase text-white'>
                      VISIT OUR
                    </p>
                    <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl !font-serif  uppercase tracking-wide  text-white'>
                      {currentOutlet?.name} SHOWROOM
                    </h3>
                    {currentOutlet?.location && (
                      <p className='text-sm sm:text-base md:text-lg text-white !font-serif tracking-wide'>
                        {currentOutlet.location}
                      </p>
                    )}
                    <a
                      href={currentOutlet?.mapUrl || "#"}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='directions-btn group inline-flex items-center gap-2 sm:gap-3 bg-transparent border border-white/80 text-white cursor-pointer select-none'
                      style={{
                        /* Mobile: compact, full-width feel via padding */
                        padding:
                          "clamp(10px, 2.5vw, 16px) clamp(20px, 5vw, 48px)",
                        marginTop: "clamp(12px, 3vw, 20px)",
                      }}
                      onClick={(e) => {
                        if (
                          !currentOutlet?.mapUrl ||
                          currentOutlet.mapUrl === "#"
                        ) {
                          e.preventDefault();
                        }
                      }}>
                      {/* Icon */}
                      <MapPin className='btn-icon w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0' />
                      {/* Label */}
                      <span className='btn-text font-serif tracking-[0.18em] uppercase text-[11px] sm:text-sm whitespace-nowrap'>
                        {buttonText}
                      </span>
                      {/* Arrow */}
                      <ArrowUpRight className='btn-icon w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </a>
                  </div>
                </div>

                {/* Top-left: outlet name label */}
                <div className='absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8'>
                  <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2'>
                    <span className='block w-1.5 h-1.5 rounded-full bg-white' />
                    <span className='text-white font-serif tracking-[0.15em] uppercase text-[10px] sm:text-xs'>
                      {currentOutlet?.name}
                    </span>
                  </div>
                </div>

                {/* Top-right: outlet counter */}
                <div className='absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8'>
                  <span className='outlet-counter text-white/50 font-serif text-xs sm:text-sm tracking-widest'>
                    {String(
                      outlets.findIndex((o) => o.id === displayedOutlet) + 1,
                    ).padStart(2, "0")}
                    <span className='mx-1'>/</span>
                    {String(outlets.length).padStart(2, "0")}
                  </span>
                </div>

                {/* ─── GET DIRECTIONS BUTTON ─── */}
                {/* <div className='absolute bottom-5 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-auto sm:inset-x-0 flex justify-center items-end lg:bottom-10'>
                  
                </div> */}
              </div>
            </div>

            {/* ─── TAB NAVIGATION ─────────────────────────────── */}
            <div className=' md:hidden border border-t-0 border-neutral-200'>
              <nav className='grid grid-cols-3'>
                {outlets.map((outlet, idx) => (
                  <button
                    key={outlet.id}
                    onClick={() => handleOutletChange(outlet.id)}
                    className={`
                      tab-btn relative py-4 sm:py-5 px-2
                      text-sm sm:text-base font-serif tracking-[0.12em]
                      transition-colors duration-300
                      border-r border-neutral-200 last:border-r-0
                      ${
                        activeOutlet === outlet.id
                          ? "active text-neutral-900"
                          : "text-neutral-400 hover:text-neutral-700"
                      }
                    `}>
                    {/* Subtle top accent on active */}
                    <span
                      className={`absolute top-0 left-0 right-0 h-px bg-neutral-900 transition-opacity duration-300 ${activeOutlet === outlet.id ? "opacity-100" : "opacity-0"}`}
                    />
                    {outlet.name}
                    <span className='tab-indicator' />
                  </button>
                ))}
              </nav>
            </div>

            {/* Address */}
            {currentOutlet?.address && (
              <div className='mt-6 text-center px-4'>
                <p className='text-sm text-neutral-500 font-serif tracking-wide'>
                  {currentOutlet.address}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PriorOutletSection;
