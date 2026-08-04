"use client";

import Link from "next/link";
import {
  Banknote,
  Smartphone,
  CheckCircle,
  Shield,
  Lock,
  Eye,
  MapPin,
  ArrowRight,
  Package,
  Truck,
  CreditCard,
  Sparkles,
} from "lucide-react";

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    shortName: "COD",
    description:
      "Pay when your order arrives. Available across all of Bangladesh.",
    available: true,
    icon: Banknote,
    features: [
      "Pay only when you receive your product",
      "Available in all 64 districts",
      "No advance payment required inside Dhaka",
      "Inspect before paying",
    ],
    badge: "Most Popular",
  },
  {
    id: "bkash",
    name: "bKash",
    shortName: "bKash",
    description:
      "Send advance payment instantly via bKash mobile financial service.",
    available: true,
    icon: Smartphone,
    features: [
      "Instant payment confirmation",
      "Required for outside Dhaka orders (150 BDT)",
      "Required for orders above 5000 BDT (10% advance)",
      "Secure mobile financial service",
    ],
    badge: "Required for Outside Dhaka",
  },
  {
    id: "nagad",
    name: "Nagad",
    shortName: "Nagad",
    description: "Nagad mobile financial service is currently not available.",
    available: false,
    icon: CreditCard,
    features: [
      "Currently disabled",
      "May be enabled in the future",
    ],
    badge: "Coming Soon",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Place Your Order",
    description:
      "Browse our collections, add items to cart, and proceed to checkout. Select your preferred payment method.",
    icon: Package,
  },
  {
    step: 2,
    title: "Confirm & Pay",
    description:
      "For COD, no payment needed now. For bKash, our team will send you the payment number. Send the amount and share the transaction ID.",
    icon: CreditCard,
  },
  {
    step: 3,
    title: "Receive & Pay (COD)",
    description:
      "When your order arrives via COD, inspect the product and pay the delivery agent the full order amount.",
    icon: Truck,
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: "Data Protection",
    description:
      "Your personal and payment information is encrypted and never shared with third parties.",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description:
      "All bKash transactions are processed through secure channels. We never store your financial details.",
  },
  {
    icon: Eye,
    title: "Transparent Pricing",
    description:
      "No hidden charges. The price you see at checkout is the final price you pay.",
  },
  {
    icon: CheckCircle,
    title: "Verified Merchants",
    description:
      "Prior is a verified merchant on all payment platforms, ensuring secure and legitimate transactions.",
  },
];

const PaymentContent = () => {
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
            <Lock className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Secure & Easy
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Payment{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Methods
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            We offer secure and convenient payment options to make your shopping
            experience seamless.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Payment Methods */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Your Options
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Available Payment Methods
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.id}
                  className={`group relative rounded-2xl p-8 sm:p-10 border transition-all duration-500 ${
                    !method.available
                      ? "bg-neutral-50 border-neutral-200 opacity-70"
                      : method.id === "cod"
                        ? "bg-gradient-to-br from-[#0b3393] to-blue-800 border-blue-600 shadow-xl shadow-blue-900/20"
                        : "bg-white border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200"
                  }`}
                >
                  {method.badge && (
                    <span
                      className={`absolute top-5 right-5 text-[10px] font-serif font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full ${
                        method.available
                          ? method.id === "cod"
                            ? "bg-white/20 text-white"
                            : method.id === "bkash"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-neutral-200 text-neutral-500"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {method.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method.available
                          ? method.id === "cod"
                            ? "bg-white/20"
                            : method.id === "bkash"
                              ? "bg-pink-50 group-hover:bg-pink-100"
                              : "bg-neutral-100"
                          : "bg-neutral-100"
                      } transition-all duration-500`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          method.available
                            ? method.id === "cod"
                              ? "text-white"
                              : method.id === "bkash"
                                ? "text-pink-600"
                                : "text-neutral-400"
                            : "text-neutral-400"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-lg font-serif font-bold tracking-wide ${
                        method.available && method.id === "cod"
                          ? "text-white"
                          : "text-neutral-900"
                      }`}
                    >
                      {method.name}
                    </h3>
                  </div>

                  <p
                    className={`text-sm font-serif leading-relaxed mb-6 ${
                      method.available && method.id === "cod"
                        ? "text-blue-100"
                        : method.available
                          ? "text-neutral-500"
                          : "text-neutral-400"
                    }`}
                  >
                    {method.description}
                  </p>

                  <ul className="space-y-3">
                    {method.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 text-sm font-serif ${
                          method.available && method.id === "cod"
                            ? "text-blue-100"
                            : method.available
                              ? "text-neutral-600"
                              : "text-neutral-400"
                        }`}
                      >
                        <CheckCircle
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            method.available
                              ? method.id === "cod"
                                ? "text-blue-300"
                                : method.id === "bkash"
                                  ? "text-pink-500"
                                  : "text-neutral-300"
                              : "text-neutral-300"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!method.available && (
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <span className="text-[10px] font-serif font-bold tracking-[0.2em] uppercase text-neutral-400">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Step by Step
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 p-8 sm:p-10 text-center hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0b3393] to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-serif font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 tracking-wide mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-500 font-serif text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
              Protection Guaranteed
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
              Your Security Matters
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl border border-blue-50 shadow-md shadow-blue-900/5 p-6 sm:p-8 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
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

        {/* Outside Dhaka Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5 mb-20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-amber-900 tracking-wide mb-3">
                Orders Outside Dhaka
              </h3>
              <p className="text-sm font-serif text-amber-800 leading-relaxed mb-4">
                For deliveries outside Dhaka, a{" "}
                <strong className="text-amber-900">150 BDT advance via bKash</strong>{" "}
                is required to confirm your order. This advance covers part of
                the shipping cost and helps us process your order faster.
              </p>
              <div className="bg-amber-100/60 rounded-xl p-4 border border-amber-200/40">
                <p className="text-sm font-serif text-amber-900 font-bold">
                  Important: Orders above 5,000 BDT require 10% advance payment
                  via bKash, regardless of delivery location.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
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
            <Shield className="w-10 h-10 text-blue-300 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight mb-4">
              100% Secure Payments
            </h2>
            <p className="text-blue-200/70 font-serif tracking-wide mb-10 max-w-2xl mx-auto text-sm sm:text-base">
              Your payment security is our top priority. We use industry-standard
              encryption and never store sensitive financial information on our
              servers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-3 bg-white text-[#0b3393] px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                Contact Support
                <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="group inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                View FAQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentContent;
