"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  RotateCcw,
  XCircle,
  Sparkles,
  Shield,
  Mail,
} from "lucide-react";

const returnSteps = [
  {
    step: 1,
    title: "Contact Us",
    description:
      "Call us at +880-1700534317 or message us on our official Facebook page within 24 hours with your order ID and issue details.",
    icon: Phone,
  },
  {
    step: 2,
    title: "Ship or Visit",
    description:
      "Bring the product to an outlet within 3 days, or ship it back to us if in-store exchange is not feasible.",
    icon: Package,
  },
  {
    step: 3,
    title: "Receive Resolution",
    description:
      "Once we receive and inspect the product, we will process your exchange or refund within 7 business days.",
    icon: CheckCircle,
  },
];

const returnConditions = [
  {
    type: "eligible",
    title: "Eligible for Return",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    items: [
      "Physically damaged product",
      "Product defects or manufacturing flaws",
      "Fitting issues (wrong size delivered)",
      "Wrong item delivered",
      "Product lost during shipment",
    ],
  },
  {
    type: "not-eligible",
    title: "Not Eligible for Return",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    items: [
      "Sale items (unless damaged/defective)",
      "Items worn, washed, or used",
      "Items without original tags or invoice",
      "Returns after 3-day window",
      "Items without original packaging",
    ],
  },
];

const exchangeOptions = [
  {
    title: "In-Store Exchange",
    description:
      "Visit our outlet within 3 days of purchase with the product, original tags, and receipt for an immediate exchange.",
    icon: Package,
  },
  {
    title: "Ship to Us",
    description:
      "If you cannot visit in person, ship the product back to us. Shipping costs are non-refundable for voluntary exchanges.",
    icon: Truck,
  },
  {
    title: "Size Swap",
    description:
      "Exchange for a different size of the same product. If the size is unavailable, choose another design within a similar or higher price range.",
    icon: RotateCcw,
  },
];

const refundTimeline = [
  { day: "Day 1", event: "Return request submitted", status: "completed" },
  { day: "Day 2-3", event: "Product received & inspected", status: "completed" },
  { day: "Day 4-5", event: "Quality check passed", status: "completed" },
  { day: "Day 6-7", event: "Refund processed to original payment method", status: "current" },
];

const ReturnsContent = () => {
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
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Hassle-Free Returns
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Returns &{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Exchange
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            We want you to love every purchase from Prior. Hassle-free returns
            and exchanges within 3 days of purchase.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Tabs defaultValue="english" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-2 w-fit rounded-full bg-blue-50 border border-blue-100 p-1">
              <TabsTrigger
                value="english"
                className="rounded-full text-xs font-serif tracking-[0.15em] uppercase px-6 py-2.5 data-[state=active]:bg-[#0b3393] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-900/20"
              >
                English
              </TabsTrigger>
              <TabsTrigger
                value="bangla"
                className="rounded-full text-xs font-serif tracking-[0.15em] uppercase px-6 py-2.5 data-[state=active]:bg-[#0b3393] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-900/20"
              >
                বাংলা
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="english">
            {/* 3-Step Process */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  Simple Process
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  How to Return
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {returnSteps.map((step) => {
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

            {/* Return Conditions */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  Guidelines
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  Return Conditions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {returnConditions.map((condition) => {
                  const Icon = condition.icon;
                  return (
                    <div
                      key={condition.type}
                      className={`rounded-2xl p-8 sm:p-10 border ${condition.bg} ${condition.border} shadow-lg shadow-blue-900/5`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${condition.bg}`}
                        >
                          <Icon className={`w-5 h-5 ${condition.color}`} />
                        </div>
                        <h3
                          className={`text-lg font-serif font-bold tracking-wide ${condition.color}`}
                        >
                          {condition.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {condition.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm font-serif text-neutral-600"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${condition.color === "text-emerald-600" ? "bg-emerald-500" : "bg-red-500"}`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exchange Options */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  Flexible Choices
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  Exchange Options
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exchangeOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 p-8 sm:p-10 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:from-[#0b3393] group-hover:to-blue-800 transition-all duration-500">
                        <Icon className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-neutral-900 tracking-wide mb-3">
                        {option.title}
                      </h3>
                      <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Refund Timeline */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  What to Expect
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  Refund Timeline
                </h2>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0b3393] via-blue-300 to-blue-100" />
                  {refundTimeline.map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-start gap-6 pb-8 last:pb-0"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${
                          item.status === "current"
                            ? "bg-gradient-to-br from-[#0b3393] to-blue-800 shadow-lg shadow-blue-900/30"
                            : "bg-white border-2 border-[#0b3393]"
                        }`}
                      >
                        {item.status === "current" ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-[#0b3393]" />
                        )}
                      </div>
                      <div className="bg-white rounded-xl shadow-md shadow-blue-900/5 border border-blue-50 p-5 flex-1 hover:shadow-lg hover:shadow-blue-900/10 transition-shadow duration-300">
                        <span className="text-[10px] font-serif font-bold text-[#0b3393] tracking-[0.2em] uppercase">
                          {item.day}
                        </span>
                        <p className="font-serif font-bold text-neutral-900 tracking-wide mt-1">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-900 tracking-wide mb-3">
                    Important Notes
                  </h3>
                  <ul className="space-y-2 text-sm font-serif text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      Items must be unworn, unwashed, and unused.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      Include the original invoice slip and tags with your return.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      Returns must be processed within 3 days of purchase.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      Shipping costs are covered by us for damaged or wrong items.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bangla">
            {/* 3-Step Process - Bangla */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  সহজ প্রক্রিয়া
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  কিভাবে ফেরত দিবেন
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {returnSteps.map((step) => (
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
                      {step.step === 1
                        ? "আমাদের সাথে যোগাযোগ করুন"
                        : step.step === 2
                          ? "পণ্য পাঠান বা দোকানে আনুন"
                          : "সমাধান পান"}
                    </h3>
                    <p className="text-neutral-500 font-serif text-sm leading-relaxed">
                      {step.step === 1
                        ? "আপনার অর্ডার আইডি এবং সমস্যার বিবরণ সহ +৮৮০-১৭০০৫৩৪৩১৭ নম্বরে কল করুন বা আমাদের ফেসবুক পেজে ২৪ ঘণ্টার মধ্যে মেসেজ করুন।"
                        : step.step === 2
                          ? "৩ দিনের মধ্যে পণ্যটি আমাদের আউটলেটে নিয়ে আসুন, অথবা ইন-স্টোর বিনিময় সম্ভব না হলে আমাদের কাছে পাঠান।"
                          : "আমরা পণ্য পেয়ে ওই পরিদর্শন করার পর ৭ কর্মদিবসের মধ্যে আপনার বিনিময় বা ফেরত প্রক্রিয়া করব।"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Conditions - Bangla */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  নির্দেশিকা
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  ফেরত শর্তাবলী
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {returnConditions.map((condition) => {
                  const Icon = condition.icon;
                  return (
                    <div
                      key={condition.type}
                      className={`rounded-2xl p-8 sm:p-10 border ${condition.bg} ${condition.border} shadow-lg shadow-blue-900/5`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${condition.bg}`}
                        >
                          <Icon className={`w-5 h-5 ${condition.color}`} />
                        </div>
                        <h3
                          className={`text-lg font-serif font-bold tracking-wide ${condition.color}`}
                        >
                          {condition.type === "eligible"
                            ? "ফেরতযোগ্য"
                            : "ফেরতযোগ্য নয়"}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {(condition.type === "eligible"
                          ? [
                              "শারীরিকভাবে ক্ষতিগ্রস্ত পণ্য",
                              "পণ্যের ত্রুটি বা উৎপাদন সমস্যা",
                              "ফিটিং সমস্যা (ভুল সাইজ সরবরাহ)",
                              "ভুল আইটেম সরবরাহ করা হয়েছে",
                              "শিপমেন্টের সময় পণ্য হারানো",
                            ]
                          : [
                              "সেল আইটেম (ক্ষতিগ্রস্ত/ত্রুটিপূর্ণ না হলে)",
                              "ব্যবহৃত, ধুয়ে বা পরিধান করা আইটেম",
                              "মূল ট্যাগ বা চালান ছাড়া আইটেম",
                              "৩-দিনের সময়সীমার পর ফেরত",
                              "মূল প্যাকেজিং ছাড়া আইটেম",
                            ]
                        ).map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm font-serif text-neutral-600"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${condition.color === "text-emerald-600" ? "bg-emerald-500" : "bg-red-500"}`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exchange Options - Bangla */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  নমনীয় বিকল্প
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  বিনিময় বিকল্প
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "ইন-স্টোর বিনিময়",
                    description:
                      "মূল ট্যাগ এবং চালান সহ ৩ দিনের মধ্যে আমাদের আউটলেটে পণ্যটি নিয়ে এসে তাৎক্ষণিক বিনিময় করুন।",
                  },
                  {
                    title: "পণ্য পাঠান",
                    description:
                      "ব্যক্তিগতভাবে আসতে না পারলে পণ্যটি আমাদের কাছে পাঠান। স্বেচ্ছায় বিনিময়ের জন্য শিপিং খরচ ফেরতযোগ্য নয়।",
                  },
                  {
                    title: "সাইজ পরিবর্তন",
                    description:
                      "একই পণ্যের ভিন্ন সাইজে বিনিময় করুন। সাইজ পাওয়া না গেলে একই বা উচ্চ মূল্যের অন্য ডিজাইন বেছে নিন।",
                  },
                ].map((option, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 p-8 sm:p-10 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:from-[#0b3393] group-hover:to-blue-800 transition-all duration-500">
                      {index === 0 ? (
                        <Package className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                      ) : index === 1 ? (
                        <Truck className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                      ) : (
                        <RotateCcw className="w-5 h-5 text-[#0b3393] group-hover:text-white transition-colors duration-500" />
                      )}
                    </div>
                    <h3 className="text-lg font-serif font-bold text-neutral-900 tracking-wide mb-3">
                      {option.title}
                    </h3>
                    <p className="text-sm text-neutral-500 font-serif leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Timeline - Bangla */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <p className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-neutral-400 mb-4">
                  কী প্রত্যাশা করবেন
                </p>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 tracking-tight">
                  ফেরত সময়রেখা
                </h2>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0b3393] via-blue-300 to-blue-100" />
                  {[
                    { day: "দিন ১", event: "ফেরত অনুরোধ জমা দেওয়া হয়েছে" },
                    { day: "দিন ২-৩", event: "পণ্য গ্রহণ ও পরিদর্শন করা হয়েছে" },
                    { day: "দিন ৪-৫", event: "গুণমান পরীক্ষা সফল হয়েছে" },
                    {
                      day: "দিন ৬-৭",
                      event: "মূল পেমেন্ট পদ্ধতিতে ফেরত প্রক্রিয়া করা হয়েছে",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="relative flex items-start gap-6 pb-8 last:pb-0"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all duration-300 ${
                          index === 3
                            ? "bg-gradient-to-br from-[#0b3393] to-blue-800 shadow-lg shadow-blue-900/30"
                            : "bg-white border-2 border-[#0b3393]"
                        }`}
                      >
                        {index === 3 ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-[#0b3393]" />
                        )}
                      </div>
                      <div className="bg-white rounded-xl shadow-md shadow-blue-900/5 border border-blue-50 p-5 flex-1 hover:shadow-lg hover:shadow-blue-900/10 transition-shadow duration-300">
                        <span className="text-[10px] font-serif font-bold text-[#0b3393] tracking-[0.2em] uppercase">
                          {item.day}
                        </span>
                        <p className="font-serif font-bold text-neutral-900 tracking-wide mt-1">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Notice - Bangla */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-900 tracking-wide mb-3">
                    গুরুত্বপূর্ণ তথ্য
                  </h3>
                  <ul className="space-y-2 text-sm font-serif text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      আইটেমগুলি অব্যবহৃত, অশুধ এবং অব্যবহৃত হতে হবে।
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      ফেরত সহ মূল চালান স্লিপ এবং ট্যাগ অন্তর্ভুক্ত করুন।
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      ক্রয়ের ৩ দিনের মধ্যে ফেরত প্রক্রিয়া করতে হবে।
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      ক্ষতিগ্রস্ত বা ভুল পণ্যের জন্য শিপিং খরচ আমাদের দ্বারা আচ্ছাদিত।
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-br from-[#0b3393] via-blue-900 to-blue-950 rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
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
              Ready to Start a Return?
            </h2>
            <p className="text-blue-200/70 font-serif tracking-wide mb-10 max-w-xl mx-auto text-sm sm:text-base">
              Our team is here to help you with returns, exchanges, and refunds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="group inline-flex items-center gap-3 bg-white text-[#0b3393] px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                Contact Support
                <Mail className="w-4 h-4" />
              </Link>
              <a
                href="tel:+8801700534317"
                className="group inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Call Us
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsContent;
