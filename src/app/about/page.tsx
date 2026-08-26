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
    <main className='relative min-h-screen w-full flex items-center justify-center px-6 py-16 md:py-4 bg-[#faf9f6]'>
      {/* SVG grain filter */}
      <svg className='absolute inset-0 w-0 h-0' aria-hidden='true'>
        <filter id='grain'>
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.65'
            numOctaves='3'
            stitchTiles='stitch'
          />
          <feColorMatrix type='saturate' values='0' />
        </filter>
      </svg>

      {/* Grain overlay */}
      <div
        className='pointer-events-none fixed inset-0 z-10 opacity-[0.35] mix-blend-multiply'
        style={{ filter: "url(#grain)", width: "100vw", height: "100vh" }}
      />

      <div className='w-full max-w-2xl md:max-w-4xl'>
        <p className='font-sans text-xs font-medium tracking-[0.3em] uppercase text-stone-400 mb-6'>
          Dhaka, Bangladesh — Est. 2021
        </p>

        <h1 className='font-serif font-bold text-stone-800 leading-[1.05] tracking-tight text-4xl sm:text-5xl md:text-6xl mb-5'>
          About Prior
        </h1>

        <p className='font-serif italic text-primary text-lg sm:text-xl md:text-2xl mb-8'>
          Your priority in fashion.
        </p>

        <div className='w-12 h-[3px] rounded-full bg-primary mb-10' />

        <p className='font-serif text-stone-600 text-base sm:text-lg leading-relaxed mb-6'>
          Prior is a rising fashion brand in Bangladesh, celebrated for its
          unique blend of modern style and traditional elegance. Since in 2021,
          we&rsquo;ve become a preferred online shopping destination.
        </p>

        <p className='font-serif text-stone-600 text-base sm:text-lg leading-relaxed mb-6'>
          Prior, renowned for its fashion authority, unique designs, and
          superior craftsmanship, we are dedicated to delivering exceptional
          quality and value. Experience the pinnacle of fashion with footwear
          that combines uniqueness and sophistication, crafted with the highest
          standards of craftsmanship. Join us to embrace ultimate style and
          elegance.
        </p>

        <p className='font-serif text-stone-600 text-base sm:text-lg leading-relaxed mb-6'>
          Explore our latest collections of bags, shoes, accessories, and more.
          We are dedicated to providing high-quality products and an exceptional
          shopping experience throughout Bangladesh.
        </p>

        <p className='font-serif text-stone-600 text-base sm:text-lg leading-relaxed mb-6'>
          Discover and shop with us online to experience the best in fashion.
        </p>

        <blockquote className='font-serif italic text-stone-800 text-xl sm:text-2xl leading-snug border-l-[3px] border-primary pl-6 py-1 my-11'>
          Our mission is simple — to help every customer express who they are,
          with confidence.
        </blockquote>

        <p className='font-serif italic text-stone-400 text-base mt-8'>
          — The Prior Team
        </p>
      </div>
    </main>
  );
}
