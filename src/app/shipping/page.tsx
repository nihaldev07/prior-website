"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  Shield,
  Phone,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Globe,
  Headphones,
  ArrowRight,
} from "lucide-react";

const deliveryZones = [
  {
    zone: "Inside Dhaka",
    charge: "BDT 80",
    time: "24-48 Hours",
    description:
      "Fast delivery within Dhaka city. Orders placed before 2 PM are dispatched same day.",
    highlight: true,
  },
  {
    zone: "Outside Dhaka",
    charge: "BDT 150",
    time: "48-168 Hours",
    description:
      "Delivery to all districts outside Dhaka. 150 BDT advance via bKash required.",
    highlight: false,
  },
  {
    zone: "Premium Orders (5000+ BDT)",
    charge: "BDT 150 + 10% Advance",
    time: "48-168 Hours",
    description:
      "For orders above 5000 BDT, a 10% advance payment is required via bKash.",
    highlight: false,
  },
];

const features = [
  {
    icon: Truck,
    title: "Reliable Couriers",
    description:
      "We partner with Pathao, SteadFast, and other trusted courier services.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Orders are processed and dispatched within 24 hours of confirmation.",
  },
  {
    icon: Package,
    title: "Secure Packaging",
    description:
      "Every order is carefully packaged to ensure it arrives in perfect condition.",
  },
  {
    icon: Shield,
    title: "Order Protection",
    description:
      "Full coverage for lost or damaged products during transit.",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description:
      "We deliver to all 64 districts across Bangladesh.",
  },
  {
    icon: Headphones,
    title: "Live Tracking",
    description:
      "Track your order status through our customer support team.",
  },
];

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery within Dhaka takes 24-48 hours. Outside Dhaka, it takes 48-168 hours depending on your location.",
  },
  {
    question: "Is Cash on Delivery available?",
    answer:
      "Yes, Cash on Delivery (COD) is available all over Bangladesh. For orders outside Dhaka, a 150 BDT advance via bKash is required.",
  },
  {
    question: "What courier services do you use?",
    answer:
      "We partner with Pathao, SteadFast, and other reputable courier services to ensure reliable delivery.",
  },
  {
    question: "Can I change my delivery address after ordering?",
    answer:
      "Please contact us immediately at +880-1700534317 if you need to change your delivery address. We can update it before the order is dispatched.",
  },
  {
    question: "What if my order is lost during delivery?",
    answer:
      "If your order is lost during transit, we will reship the product or provide a full refund. Contact our support team for assistance.",
  },
];

const Shipping = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] bg-neutral-950 overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(11,51,147,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(80,40,120,0.3) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 border border-blue-400/30 backdrop-blur-sm rounded-full">
            <Truck className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              All 64 Districts
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Shipping{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Information
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            Fast, reliable delivery across Bangladesh. Learn about our shipping
            zones, rates, and delivery timelines.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Delivery Zones */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Rates & Timelines
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Delivery Zones & Rates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <div
                key={index}
                className={`group rounded-2xl p-8 sm:p-10 border transition-all duration-500 ${
                  zone.highlight
                    ? "bg-gradient-to-br from-[#0b3393] to-blue-800 border-blue-600 shadow-xl shadow-blue-900/20 text-white"
                    : "bg-white border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      zone.highlight
                        ? "bg-white/20"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-[#0b3393] group-hover:to-blue-800 transition-all duration-500"
                    }`}
                  >
                    <MapPin
                      className={`w-5 h-5 ${
                        zone.highlight
                          ? "text-white"
                          : "text-[#0b3393] group-hover:text-white transition-colors duration-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-serif font-bold tracking-wide ${
                      zone.highlight ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {zone.zone}
                  </h3>
                </div>
                <div className="space-y-3 mb-6">
                  <div
                    className={`flex justify-between items-center py-3 border-b ${
                      zone.highlight ? "border-white/20" : "border-blue-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-serif ${
                        zone.highlight ? "text-blue-200" : "text-neutral-500"
                      }`}
                    >
                      Delivery Charge
                    </span>
                    <span
                      className={`font-serif font-bold ${
                        zone.highlight ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {zone.charge}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center py-3 border-b ${
                      zone.highlight ? "border-white/20" : "border-blue-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-serif ${
                        zone.highlight ? "text-blue-200" : "text-neutral-500"
                      }`}
                    >
                      Estimated Time
                    </span>
                    <span
                      className={`font-serif font-bold ${
                        zone.highlight ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {zone.time}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-sm font-serif leading-relaxed ${
                    zone.highlight ? "text-blue-100" : "text-neutral-500"
                  }`}
                >
                  {zone.description}
                </p>
                {zone.highlight && (
                  <div className="mt-6 flex items-center gap-2 text-blue-200 text-xs font-serif tracking-[0.15em] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Why Shop With Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 p-6 sm:p-8 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:from-[#0b3393] group-hover:to-blue-800 transition-all duration-500">
                    <Icon className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif font-bold text-neutral-900 tracking-wide mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Got Questions?
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-500 overflow-hidden ${
                  openFaq === index
                    ? "border-blue-200 shadow-lg shadow-blue-900/10"
                    : "border-blue-50 shadow-md shadow-blue-900/5 hover:shadow-lg hover:shadow-blue-900/10"
                }`}
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left group"
                >
                  <span className="font-serif font-bold text-neutral-900 tracking-wide pr-4 group-hover:text-[#0b3393] transition-colors duration-300">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openFaq === index
                        ? "bg-[#0b3393] text-white rotate-0"
                        : "bg-blue-50 text-[#0b3393] rotate-0"
                    }`}
                  >
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 ${
                    openFaq === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0">
                    <div className="h-px bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 mb-4" />
                    <p className="text-neutral-500 font-serif leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#0b3393] via-blue-900 to-blue-950 rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
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
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight mb-4">
              Need Help With Your Order?
            </h2>
            <p className="text-blue-200/70 font-serif tracking-wide mb-10 max-w-xl mx-auto text-sm sm:text-base">
              Our customer support team is available to assist you with shipping
              inquiries, order tracking, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-3 bg-white text-[#0b3393] px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                Contact Us
                <Phone className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/8801700534317"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
