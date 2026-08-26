"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Phone,
  Package,
  Truck,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const englishContent = {
  sections: [
    {
      title: "Qualifying Conditions for Refunds and Returns",
      icon: CheckCircle,
      items: [
        "Physically Damaged Product",
        "Product Defects",
        "Fitting Issues",
        "Wrong Items/Size Delivered",
        "Product Lost During Shipment",
      ],
    },
    {
      title: "How to Exchange",
      icon: RotateCcw,
      items: [
        "Immediate Contact: Call us at 01700534317 or message us on our official Facebook page.",
        "In-Store Exchange: Bring the product to an outlet within 3 days of purchase for an exchange.",
        "Shipping: If in-store exchange is not feasible, you may ship the product back to us. Shipping costs are non-refundable.",
      ],
    },
    {
      title: "Shipping Costs",
      icon: Truck,
      items: [
        "Covered by Us: For damaged, wrong items, or lost products.",
        "Paid by Customer: For all other returns or exchanges.",
      ],
    },
    {
      title: "Return Conditions",
      icon: Package,
      items: [
        "Items must be unworn, unwashed, and unused.",
        "Include the original invoice slip and tags.",
        "Returns must be processed within 3 days of purchase.",
        "Ensure that the product is securely repacked in its original packaging.",
      ],
    },
  ],
};

const banglaContent = {
  sections: [
    {
      title: "ফেরত এবং বিনিময় শর্তাবলী",
      icon: CheckCircle,
      items: [
        "শারীরিকভাবে ক্ষতিগ্রস্ত পণ্য",
        "পণ্যের ত্রুটি",
        "ফিটিং সমস্যা",
        "ভুল আইটেম/সাইজ সরবরাহ করা হয়েছে",
        "শিপমেন্টের সময় পণ্য হারানো",
      ],
    },
    {
      title: "কিভাবে বিনিময় করবেন",
      icon: RotateCcw,
      items: [
        "তাৎক্ষণিক যোগাযোগ: 01700534317 এ আমাদের কল করুন বা আমাদের অফিসিয়াল ফেসবুক পেজে মেসেজ করুন।",
        "ইন-স্টোর বিনিময়: ৩ দিনের মধ্যে পণ্যটি আউটলেটে নিয়ে এসে বিনিময় করুন।",
        "শিপিং: যদি ইন-স্টোর বিনিময় সম্ভব না হয়, আপনি আমাদের কাছে পণ্যটি পাঠাতে পারেন। শিপিং খরচ ফেরতযোগ্য নয়।",
      ],
    },
    {
      title: "শিপিং খরচ",
      icon: Truck,
      items: [
        "আমাদের দ্বারা আচ্ছাদিত: ক্ষতিগ্রস্ত বা ভুল পণ্যের জন্য।",
        "গ্রাহক দ্বারা প্রদান করা: অন্য সব ফেরত বা বিনিময়ের জন্য।",
      ],
    },
    {
      title: "ফেরত শর্তাবলী",
      icon: Package,
      items: [
        "পণ্যগুলি অব্যবহৃত এবং অব্যবহৃত হতে হবে।",
        "মূল চালান স্লিপ এবং ট্যাগগুলি অন্তর্ভুক্ত করুন।",
        "ক্রয়ের ৩ দিনের মধ্যে ফেরত প্রক্রিয়া করতে হবে।",
        "পণ্যটি এর আসল প্যাকেজিংয়ে সুরক্ষিতভাবে পুনরায় প্যাক করা নিশ্চিত করুন।",
      ],
    },
  ],
};

const ReturnPolicy = () => {
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
            <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Hassle-Free
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Return &{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Refund Policy
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            We want you to be completely satisfied with your purchase. Learn
            about our return and refund terms below.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
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
            <div className="space-y-6">
              {englishContent.sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500 overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-6 sm:p-8 border-b border-blue-50 bg-gradient-to-r from-blue-50/80 to-white">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0b3393] to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                        {section.title}
                      </h2>
                    </div>
                    <div className="p-6 sm:p-8">
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-neutral-700 font-serif"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0b3393] mt-2 flex-shrink-0 opacity-40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Important Note */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5 mt-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-900 tracking-wide mb-2">
                    Important
                  </h3>
                  <p className="text-sm font-serif text-amber-800 leading-relaxed">
                    For any return or exchange requests, please contact us
                    within 24 hours of receiving your order. Items returned
                    without prior contact may not be eligible for refund.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bangla">
            <div className="space-y-6">
              {banglaContent.sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500 overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-6 sm:p-8 border-b border-blue-50 bg-gradient-to-r from-blue-50/80 to-white">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0b3393] to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                        {section.title}
                      </h2>
                    </div>
                    <div className="p-6 sm:p-8">
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-neutral-700 font-serif"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0b3393] mt-2 flex-shrink-0 opacity-40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Important Note - Bangla */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5 mt-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-amber-900 tracking-wide mb-2">
                    গুরুত্বপূর্ণ
                  </h3>
                  <p className="text-sm font-serif text-amber-800 leading-relaxed">
                    যেকোনো ফেরত বা বিনিময়ের অনুরোধের জন্য, অনুগ্রহ করে আপনার
                    অর্ডার পাওয়ার ২৪ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করুন।
                    আগামী যোগাযোগ ছাড়া ফেরত দেওয়া আইটেমগুলি ফেরতের জন্য
                    যোগ্য নাও হতে পারে।
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#0b3393] via-blue-900 to-blue-950 rounded-2xl p-8 sm:p-12 lg:p-16 text-center mt-12 relative overflow-hidden">
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
              Need Help With a Return?
            </h2>
            <p className="text-blue-200/70 font-serif tracking-wide mb-10 max-w-xl mx-auto text-sm sm:text-base">
              Contact our support team and we&apos;ll guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+8801700534317"
                className="group inline-flex items-center gap-3 bg-white text-[#0b3393] px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href="https://wa.me/8801700534317"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-serif text-xs tracking-[0.15em] uppercase hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
