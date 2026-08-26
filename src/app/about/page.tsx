export const metadata = {
  title: "About Prior | Your Priority in Fashion",
  description:
    "Since 2021, Prior has grown from a small fashion startup into one of Bangladesh's most trusted online destinations for bags, shoes, and accessories.",
  openGraph: {
    title: "About Prior",
    description: "Your priority in fashion.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className='min-h-screen w-full flex items-center justify-center bg-[#fdfdfb] px-6 py-20'>
      <div className='w-full max-w-2xl'>
        <p className='font-sans text-xs font-medium tracking-[0.3em] uppercase text-neutral-400 mb-6'>
          Dhaka, Bangladesh — Est. 2021
        </p>

        <h1 className='font-serif font-bold text-[#14171f] leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl mb-5'>
          About Prior
        </h1>

        <p className='font-serif italic text-[#0b3393] text-lg sm:text-xl md:text-2xl mb-8'>
          Your priority in fashion.
        </p>

        <div className='w-12 h-[3px] rounded-full bg-[#0b3393] mb-10' />

        <p className='font-serif text-neutral-600 text-base sm:text-lg leading-relaxed mb-6'>
          Since 2021, Prior has grown from a small fashion startup into one of
          Bangladesh&rsquo;s most trusted online destinations for bags, shoes,
          and accessories.
        </p>

        <p className='font-serif text-neutral-600 text-base sm:text-lg leading-relaxed mb-6'>
          Every piece we curate reflects a commitment to craftsmanship, quality,
          and a style that blends modern design with a distinctly Bangladeshi
          elegance.
        </p>

        <blockquote className='font-serif italic text-[#14171f] text-xl sm:text-2xl leading-snug border-l-[3px] border-[#0b3393] pl-6 py-1 my-11'>
          Our mission is simple — to help every customer express who they are,
          with confidence.
        </blockquote>

        <p className='font-serif italic text-neutral-400 text-base mt-8'>
          — The Prior Team
        </p>
      </div>
    </main>
  );
}
