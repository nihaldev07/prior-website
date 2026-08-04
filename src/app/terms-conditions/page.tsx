"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  RotateCcw,
  Package,
  RefreshCw,
  AlertTriangle,
  Scale,
  ArrowRight,
} from "lucide-react";

const englishContent = {
  sections: [
    {
      title: "Delivery Charges and Conditions",
      icon: Truck,
      description: "Shipping rates, timelines, and payment requirements for all delivery zones.",
      items: [
        "Cash on Delivery: Available all over Bangladesh.",
        "150tk Required via bKash for outside Dhaka delivery.",
        "10% advance is needed if the amount of the parcel is 5000 tk.",
        "Dhaka: BDT 80 per parcel",
        "Outside Dhaka: BDT 150 per parcel",
        "Delivery Time: 48-168 hours",
        "Delivery Agents: Pathao, SteadFast and Other Courier Service",
        "Note: Charges are set by the delivery agents.",
      ],
    },
    {
      title: "Exchange Terms and Conditions",
      icon: RotateCcw,
      description: "Guidelines for exchanging products within the allowed timeframe.",
      items: [
        "Exchanges are accepted within 3 days of purchase from Outlet.",
        "Items must be unused, in original condition, and with the purchase receipt.",
        "Exchange is only applicable for size. If the size is unavailable, customers may choose another design within a similar or higher price range.",
        "No monetary compensation for exchanges. Sale items are non-exchangeable.",
        "Ensure items are packed securely. PRIOR is not responsible for damage during return shipping.",
        "Call us at +8801700534317 or message us on our official facebook page within 24 hours with the order ID and issue details to confirm the return and receive pickup instructions.",
      ],
    },
    {
      title: "Return Policies",
      icon: Package,
      description: "How to return products and what to expect during the process.",
      items: [
        "Return products with flaws for a refund if a replacement cannot be provided.",
        "Customers can return unwanted products but must cover delivery charges.",
        "Refunds will be processed within 7 days after the returned product is received and passes QC.",
      ],
    },
    {
      title: "Refund Policy",
      icon: RefreshCw,
      description: "Timeline and process for receiving your refund.",
      items: [
        "Refunds are processed once the item is returned and QC is completed successfully.",
        "Refunds are automatically triggered upon successful cancellation.",
        "Any received cashback amount will be adjusted with the refund amount.",
      ],
    },
  ],
};

const banglaContent = {
  sections: [
    {
      title: "ডেলিভারি চার্জ এবং শর্তাবলী",
      icon: Truck,
      description: "সকল ডেলিভারি জোনের জন্য শিপিং রেট, সময়সীমা এবং পেমেন্ট প্রয়োজনীয়তা।",
      items: [
        "ক্যাশ অন ডেলিভারি: বাংলাদেশের সর্বত্র পাওয়া যায়।",
        "ঢাকার বাইরে ডেলিভারির জন্য বিকাশের মাধ্যমে ১৫০ টাকা প্রয়োজন।",
        "৫০০০ টাকা পরিমাণের পণ্য হলে ১০% অগ্রিম প্রয়োজন।",
        "ঢাকা: প্রতি পার্সেল ৮০ টাকা",
        "ঢাকার বাইরে: প্রতি পার্সেল ১৫০ টাকা",
        "ডেলিভারি সময়: ৪৮-১৬৮ ঘন্টা",
        "ডেলিভারি এজেন্ট: পাঠাও এবং সুন্দরবান কুরিয়ার সার্ভিস",
        "বিঃদ্রঃ চার্জগুলি ডেলিভারি এজেন্ট দ্বারা নির্ধারিত।",
      ],
    },
    {
      title: "বিনিময় শর্তাবলী",
      icon: RotateCcw,
      description: "অনুমোদিত সময়সীমার মধ্যে পণ্য বিনিময়ের নির্দেশিকা।",
      items: [
        "আউটলেট থেকে ক্রয়ের ৩ দিনের মধ্যে বিনিময় গ্রহণ করা হয়।",
        "পণ্যগুলি অব্যবহৃত, আসল অবস্থায় থাকতে হবে এবং ক্রয়ের রসিদ সহ থাকতে হবে।",
        "মাপের জন্য বিনিময় প্রযোজ্য। মাপ পাওয়া না গেলে, গ্রাহকরা একই বা উচ্চ মূল্যের ডিজাইন বেছে নিতে পারেন।",
        "বিক্রয় আইটেম বিনিময়যোগ্য নয়।",
        "আইটেমগুলি সুরক্ষিতভাবে প্যাকেজ করা নিশ্চিত করুন। PRIOR ফেরত শিপিংয়ের সময় ক্ষতির জন্য দায়ী নয়।",
        "অর্ডার আইডি এবং সমস্যার বিশদ সহ আমাদেরকে +৮৮০১৭০০৫৩৪৩১৭ নম্বরে কল করুন বা আমাদের অফিসিয়াল ফেসবুক পেজে ২৪ ঘণ্টার মধ্যে বার্তা পাঠান ফেরত নিশ্চিত করতে এবং পিকআপের নির্দেশনা পেতে।",
      ],
    },
    {
      title: "ফেরত নীতিমালা",
      icon: Package,
      description: "কিভাবে পণ্য ফেরত দিতে হয় এবং প্রক্রিয়ায় কী প্রত্যাশা করবেন।",
      items: [
        "পণ্যের ত্রুটির জন্য ফেরত প্রদান করা হবে যদি কোনো বিকল্প প্রদান করা না হয়।",
        "অপ্রয়োজনীয় পণ্য ফেরত দেওয়া যেতে পারে তবে গ্রাহককে ডেলিভারি চার্জ বহন করতে হবে।",
        "ফেরত পণ্য QC পাস করার পরে ৭ দিনের মধ্যে ফেরত প্রদান করা হবে।",
      ],
    },
    {
      title: "ফেরত নীতি",
      icon: RefreshCw,
      description: "ফেরত পাওয়ার সময়রেখা এবং প্রক্রিয়া।",
      items: [
        "ফেরত পণ্য QC পাস করার পরে ফেরত প্রদান করা হবে।",
        "অর্ডার বাতিল হলে স্বয়ংক্রিয়ভাবে ফেরত প্রদান করা হবে।",
        "প্রাপ্ত ক্যাশব্যাকের পরিমাণ ফেরত পরিমাণের সাথে সমন্বয় করা হবে।",
      ],
    },
  ],
};

const sectionColors = [
  { gradient: "from-[#0b3393] to-blue-800", light: "bg-blue-50", text: "text-[#0b3393]" },
  { gradient: "from-violet-600 to-purple-800", light: "bg-violet-50", text: "text-violet-600" },
  { gradient: "from-emerald-600 to-emerald-800", light: "bg-emerald-50", text: "text-emerald-600" },
  { gradient: "from-amber-500 to-orange-600", light: "bg-amber-50", text: "text-amber-600" },
];

const TermsAndConditions = () => {
  const renderContent = (content: typeof englishContent) => (
    <div className="space-y-6">
      {content.sections.map((section, index) => {
        const Icon = section.icon;
        const colors = sectionColors[index];
        return (
          <div
            key={index}
            className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500 overflow-hidden"
          >
            <div className={`flex items-center gap-4 p-6 sm:p-8 border-b border-blue-50 bg-gradient-to-r ${colors.light} to-white`}>
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-neutral-900 tracking-wide">
                  {section.title}
                </h2>
                <p className="text-xs font-serif text-neutral-500 mt-0.5">
                  {section.description}
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <ul className="space-y-4">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm sm:text-[15px] text-neutral-600 font-serif leading-relaxed"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors.text} opacity-40`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );

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
            <Scale className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Legal
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Terms &{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Conditions
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            Please read these terms carefully before using our services. By
            placing an order, you agree to these terms.
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
            {renderContent(englishContent)}
          </TabsContent>

          <TabsContent value="bangla">
            {renderContent(banglaContent)}
          </TabsContent>
        </Tabs>

        {/* Note */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 sm:p-8 shadow-lg shadow-amber-900/5 mt-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-amber-900 tracking-wide mb-2">
                Note
              </h3>
              <p className="text-sm font-serif text-amber-800 leading-relaxed">
                These terms are subject to change. Any updates will be posted on
                this page. Continued use of our services after changes constitutes
                acceptance of the revised terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
