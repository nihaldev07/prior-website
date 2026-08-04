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
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide uppercase mb-4">
            Return & Refund Policy
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Learn
            about our return and refund terms below.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Tabs defaultValue="english" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-2 w-fit">
              <TabsTrigger value="english">English</TabsTrigger>
              <TabsTrigger value="bangla">বাংলা</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="english">
            <div className="space-y-6">
              {englishContent.sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-6 border-b border-neutral-100 bg-neutral-50">
                      <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                        {section.title}
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-neutral-700 font-serif"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
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
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-amber-800 tracking-wide mb-2">
                    Important
                  </h3>
                  <p className="text-sm font-serif text-amber-700">
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
                    className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-6 border-b border-neutral-100 bg-neutral-50">
                      <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                        {section.title}
                      </h2>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-neutral-700 font-serif"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
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
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-amber-800 tracking-wide mb-2">
                    গুরুত্বপূর্ণ
                  </h3>
                  <p className="text-sm font-serif text-amber-700">
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
        <div className="bg-neutral-900 rounded-lg p-8 lg:p-12 text-center mt-12">
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide uppercase mb-4">
            Need Help With a Return?
          </h2>
          <p className="text-neutral-400 font-serif tracking-wide mb-8 max-w-xl mx-auto">
            Contact our support team and we&apos;ll guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+8801700534317"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-neutral-900 font-serif font-bold tracking-wide uppercase hover:bg-neutral-100 transition-colors duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </a>
            <a
              href="https://wa.me/8801700534317"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-white font-serif font-bold tracking-wide uppercase hover:bg-white hover:text-neutral-900 transition-colors duration-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
