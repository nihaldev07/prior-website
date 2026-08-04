"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  Shield,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const offerings = [
  {
    icon: ShoppingBag,
    title: "Premium Bags",
    description:
      "From everyday totes to statement clutches, our bag collection combines functionality with high-fashion design.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  },
  {
    icon: Star,
    title: "Designer Shoes",
    description:
      "Step out in style with our curated footwear range. From heels to flats, every pair is crafted for comfort and elegance.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
  },
  {
    icon: Award,
    title: "Accessories",
    description:
      "Complete your look with our accessories. Wallets, belts, and more — designed to complement your personal style.",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80",
  },
];

const values = [
  {
    icon: Heart,
    title: "Passion for Quality",
    description:
      "Every product undergoes rigorous quality checks to ensure it meets our high standards.",
  },
  {
    icon: Shield,
    title: "Customer Trust",
    description:
      "We build lasting relationships through transparent policies, secure payments, and reliable service.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We serve our community with dedication, offering nationwide delivery and responsive support.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Fast, secure delivery across all 64 districts of Bangladesh through trusted courier partners.",
  },
];

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "64", label: "Districts Served" },
  { number: "1000+", label: "Products" },
];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const story = useInView();
  const offeringsRef = useInView();
  const valuesRef = useInView();
  const missionRef = useInView();
  const statsRef = useInView();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] bg-neutral-950 overflow-hidden flex items-center justify-center">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(11,51,147,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(80,40,120,0.3) 0%, transparent 50%)",
          }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Parallax line accents */}
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 border border-blue-400/30 backdrop-blur-sm rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Est. 2021 — Bangladesh
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-8 leading-[0.9]">
            <span className="block">About</span>
            <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-white/60">
              Prior
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto leading-relaxed mb-12">
            Your priority in fashion. A rising fashion brand in Bangladesh,
            celebrated for its unique blend of modern style and traditional
            elegance.
          </p>

          <Link
            href="/collections"
            className="group inline-flex items-center gap-3 text-white font-serif text-sm tracking-[0.2em] uppercase border-b-2 border-blue-400/40 pb-1 hover:border-blue-300 transition-colors duration-500"
          >
            Explore Collections
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Stats Bar */}
      <div ref={statsRef.ref} className="relative -mt-16 z-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-100/60">
          <div className="grid grid-cols-3 divide-x divide-neutral-100">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="px-6 py-8 sm:py-10 text-center group"
              >
                <div
                  className={`text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight mb-2 transition-all duration-700 ${
                    statsRef.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {stat.number}
                </div>
                <div className="text-[11px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section ref={story.ref} className="py-24 sm:py-32 lg:py-40 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div
              className={`transition-all duration-1000 ${
                story.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-6">
                Our Story
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight leading-[1.1] mb-8">
                Fashion Meets{" "}
                <span className="italic text-[#0b3393]">Tradition</span>
              </h2>
              <div className="space-y-6 text-neutral-500 font-serif leading-relaxed text-base sm:text-lg">
                <p>
                  Since 2021, Prior has been a preferred online shopping
                  destination in Bangladesh. We&apos;ve grown from a small fashion
                  startup to a trusted brand loved by thousands of customers
                  across the country.
                </p>
                <p>
                  Renowned for our fashion authority, unique designs, and
                  superior craftsmanship, we are dedicated to delivering
                  exceptional quality and value. Our collections of bags, shoes,
                  and accessories are designed to make you stand out while
                  embracing ultimate style and elegance.
                </p>
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-200 ${
                story.isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Prior Fashion Store"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent rounded-2xl" />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl shadow-blue-900/10 border border-blue-50 max-w-[200px]">
                <div className="text-3xl font-serif font-bold text-neutral-900 mb-1">
                  2021
                </div>
                <div className="text-[10px] font-serif tracking-[0.2em] uppercase text-neutral-400">
                  Founded in Dhaka
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section ref={offeringsRef.ref} className="py-24 sm:py-32 bg-gradient-to-b from-blue-50/50 to-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-6">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight">
              Our Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {offerings.map((offering, index) => {
              const Icon = offering.icon;
              return (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-700 ${
                    offeringsRef.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="aspect-[3/4] overflow-hidden relative rounded-t-2xl">
                    <img
                      src={offering.image}
                      alt={offering.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="inline-flex items-center gap-2 text-white font-serif text-xs tracking-[0.2em] uppercase">
                        Shop Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0b3393] to-blue-800 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-blue-900/20">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-neutral-900 tracking-wide mb-3">
                      {offering.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef.ref} className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-6">
              Our Values
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border border-blue-50 shadow-md shadow-blue-900/5 p-8 sm:p-10 lg:p-12 group hover:bg-gradient-to-br hover:from-[#0b3393] hover:to-blue-900 transition-all duration-500 ${
                    valuesRef.isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 border border-blue-100 group-hover:border-white/20 rounded-full flex items-center justify-center mb-6 transition-all duration-500">
                    <Icon className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 group-hover:text-white tracking-wide mb-3 transition-colors duration-500">
                    {value.title}
                  </h3>
                  <p className="text-sm text-neutral-500 group-hover:text-neutral-400 font-serif leading-relaxed transition-colors duration-500">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionRef.ref} className="relative py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-[#0b3393] via-blue-900 to-blue-950 overflow-hidden">
        {/* Background accents */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 ${
              missionRef.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-500 mb-8">
              Our Mission
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-8">
              To deliver exceptional fashion that empowers every individual to
              express their unique style with{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                confidence.
              </span>
            </h2>
            <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              We believe fashion is more than just clothing — it&apos;s a statement
              of identity. Our mission is to provide high-quality, trendsetting
              products that make every customer feel their best.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-6">
              Visit Us
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight">
              Our Stores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Dhanmondi Store",
                address:
                  "Dhanmondi 27, Genetic Plaza Shop No: 134, Dhaka, Bangladesh",
                phone: "+880-1700534317",
                email: "prior.retailshop.info.bd@gmail.com",
                hours: "10:00 AM — 9:00 PM",
              },
              {
                name: "Wari Store",
                address:
                  "Shop 05, Rankin Street, Rankin Square, Wari, Dhaka",
                phone: "+880-1700534317",
                email: "prior.retailshop.info.bd@gmail.com",
                hours: "10:00 AM — 9:00 PM",
              },
              {
                name: "Uttara Store",
                address:
                  "Uttara Square Shopping Complex, Shop 12 (Semi Basement), Beside Zam Zam Tower, Sector 13, Dhaka",
                phone: "+880-1700534317",
                email: "prior.retailshop.info.bd@gmail.com",
                hours: "10:00 AM — 9:00 PM",
              },
            ].map((store, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500 p-8 sm:p-10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold text-neutral-900 tracking-wide">
                    {store.name}
                  </h3>
                  <span className="text-[10px] font-serif tracking-[0.2em] uppercase text-[#0b3393] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                    Open
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-4 h-4 text-[#0b3393] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                      {store.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-4 h-4 text-[#0b3393] flex-shrink-0" />
                    <p className="text-sm text-neutral-500 font-serif">
                      {store.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="w-4 h-4 text-[#0b3393] flex-shrink-0" />
                    <p className="text-sm text-neutral-500 font-serif">
                      {store.email}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-blue-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-serif tracking-[0.2em] uppercase text-neutral-400">
                      {store.hours}
                    </span>
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center gap-2 text-[11px] font-serif tracking-[0.2em] uppercase text-[#0b3393] hover:text-blue-800 transition-colors duration-300"
                    >
                      Get Directions
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              href="/contact-us"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#0b3393] to-blue-800 text-white px-10 py-4 rounded-full font-serif text-xs tracking-[0.2em] uppercase hover:from-blue-800 hover:to-[#0b3393] transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
