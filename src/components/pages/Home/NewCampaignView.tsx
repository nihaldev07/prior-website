import React from "react";
import { Clock, Tag, Zap } from "lucide-react";

interface CampaignBannerProps {
  title?: string;
  description?: string;
  timeLeft?: string;
  onNavigate?: () => void;
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({
  title = "MEGA FLASH SALE",
  description = "Up to 70% off on selected items. Don't miss out!",
  timeLeft = "00:00:00:00",
  onNavigate,
}) => {
  const parseTimeLeft = (time: string) => {
    if (time.includes("Expired")) {
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

  const time = parseTimeLeft(timeLeft);
  const isExpired = timeLeft.includes("Expired");

  return (
    <div
      className='relative w-full overflow-hidden rounded-none shadow-2xl cursor-pointer transition-transform hover:scale-[1.01] duration-300'
      onClick={onNavigate}>
      {/* Gradient Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' />

      {/* Animated overlay pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.05) 10px,
            rgba(255,255,255,.05) 20px
          )`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
          {/* Left Side - Text Content */}
          <div className='flex flex-col justify-center space-y-5 sm:space-y-7 lg:space-y-8 max-w-full items-center'>
            {/* Flash Sale Badge */}
            <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/30 w-fit'>
              <Zap className='w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse' />
              <span className='text-white text-xs sm:text-sm font-semibold uppercase tracking-wider'>
                Limited Time Offer
              </span>
            </div>

            {/* Title */}
            <h1 className='text-4xl text-center sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight'>
              {title}
            </h1>

            {/* Description */}
            <p className='text-base text-center sm:text-lg lg:text-xl text-white/95 font-normal leading-relaxed max-w-xl'>
              {description}
            </p>

            {/* CTA Button */}
            <div className='pt-2'>
              <button className='group inline-flex items-center gap-3 bg-white text-purple-600 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300'>
                <Tag className='w-5 h-5 sm:w-6 sm:h-6' />
                <span>Shop Now</span>
                <span className='group-hover:translate-x-1 transition-transform duration-300'>
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Countdown Timer */}
          <div className='flex justify-center lg:justify-end'>
            <div className='bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl'>
              <div className='flex items-center gap-2 mb-4 justify-center'>
                <Clock className='w-5 h-5 text-white' />
                <span className='text-white font-semibold text-sm sm:text-base uppercase tracking-wide'>
                  {isExpired ? "Sale Ended" : "Ends In"}
                </span>
              </div>

              {!isExpired ? (
                <div className='grid grid-cols-4 gap-3 sm:gap-4'>
                  {/* Days */}
                  <div className='flex flex-col items-center'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg min-w-[60px] sm:min-w-[80px]'>
                      <div className='text-2xl sm:text-4xl lg:text-5xl font-black text-purple-600 text-center'>
                        {time.days}
                      </div>
                    </div>
                    <span className='text-white/80 text-xs sm:text-sm font-medium mt-2 uppercase'>
                      Days
                    </span>
                  </div>

                  {/* Hours */}
                  <div className='flex flex-col items-center'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg min-w-[60px] sm:min-w-[80px]'>
                      <div className='text-2xl sm:text-4xl lg:text-5xl font-black text-pink-500 text-center'>
                        {time.hours}
                      </div>
                    </div>
                    <span className='text-white/80 text-xs sm:text-sm font-medium mt-2 uppercase'>
                      Hours
                    </span>
                  </div>

                  {/* Minutes */}
                  <div className='flex flex-col items-center'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg min-w-[60px] sm:min-w-[80px]'>
                      <div className='text-2xl sm:text-4xl lg:text-5xl font-black text-orange-500 text-center'>
                        {time.minutes}
                      </div>
                    </div>
                    <span className='text-white/80 text-xs sm:text-sm font-medium mt-2 uppercase'>
                      Mins
                    </span>
                  </div>

                  {/* Seconds */}
                  <div className='flex flex-col items-center'>
                    <div className='bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg min-w-[60px] sm:min-w-[80px]'>
                      <div className='text-2xl sm:text-4xl lg:text-5xl font-black text-yellow-500 text-center'>
                        {time.seconds}
                      </div>
                    </div>
                    <span className='text-white/80 text-xs sm:text-sm font-medium mt-2 uppercase'>
                      Secs
                    </span>
                  </div>
                </div>
              ) : (
                <div className='text-center py-8'>
                  <p className='text-white text-2xl font-bold'>
                    Campaign Ended
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32' />
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-48 translate-y-48' />
    </div>
  );
};

export default CampaignBanner;
