import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RefundAndReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <Tabs defaultValue="english" className="w-full px-4 relative">
          <h1 className="text-xl md:text-3xl font-bold text-left md:text-center mb-6">
            Refund & Return Policy
          </h1>
          <TabsList className="hidden md:grid min-w-fit grid-cols-2 top-0 right-2 absolute">
            <TabsTrigger value="english">English</TabsTrigger>
            <TabsTrigger value="bangla">বাংলা</TabsTrigger>
          </TabsList>

          <TabsList className="grid md:hidden min-w-fit grid-cols-2 top-0 right-[-15px] absolute">
            <TabsTrigger value="english">EN</TabsTrigger>
            <TabsTrigger value="bangla">বাং</TabsTrigger>
          </TabsList>

          {/* English Content */}
          <TabsContent value="english">
            <div>
              <h2 className="text-base md:text-xl font-semibold mb-4">
                Qualifying Conditions for Refunds and Returns
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Physically Damaged Product</li>
                <li>Product Defects</li>
                <li>Fitting Issues</li>
                <li>Wrong Items/Size Delivered</li>
                <li>Product Lost During Shipment</li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                How to Exchange
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  Immediate Contact: Call us at 01700534317 or message us on our
                  official Facebook page.
                </li>
                <li>
                  In-Store Exchange: Bring the product to an outlet within 3
                  days of purchase for an exchange.
                </li>
                <li>
                  Shipping: If in-store exchange is not feasible, you may ship
                  the product back to us. Shipping costs are non-refundable.
                </li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                Shipping Costs
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  Covered by Us: For damaged, wrong items, or lost products.
                </li>
                <li>Paid by Customer: For all other returns or exchanges.</li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                Return Conditions
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Items must be unworn, unwashed, and unused.</li>
                <li>Include the original invoice slip and tags.</li>
                <li>Returns must be processed within 3 days of purchase.</li>
                <li>
                  Ensure that the product is securely repacked in its original
                  packaging.
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* Bangla Content */}
          <TabsContent value="bangla">
            <div>
              <h2 className="text-base md:text-xl font-semibold mb-4">
                ফেরত এবং বিনিময় শর্তাবলী
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>শারীরিকভাবে ক্ষতিগ্রস্ত পণ্য</li>
                <li>পণ্যের ত্রুটি</li>
                <li>ফিটিং সমস্যা</li>
                <li>ভুল আইটেম/সাইজ সরবরাহ করা হয়েছে</li>
                <li>শিপমেন্টের সময় পণ্য হারানো</li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                কিভাবে বিনিময় করবেন
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  তাৎক্ষণিক যোগাযোগ: 01700534317 এ আমাদের কল করুন বা আমাদের
                  অফিসিয়াল ফেসবুক পেজে মেসেজ করুন।
                </li>
                <li>
                  ইন-স্টোর বিনিময়: ৩ দিনের মধ্যে পণ্যটি আউটলেটে নিয়ে এসে
                  বিনিময় করুন।
                </li>
                <li>
                  শিপিং: যদি ইন-স্টোর বিনিময় সম্ভব না হয়, আপনি আমাদের কাছে
                  পণ্যটি পাঠাতে পারেন। শিপিং খরচ ফেরতযোগ্য নয়।
                </li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                শিপিং খরচ
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>আমাদের দ্বারা আচ্ছাদিত: ক্ষতিগ্রস্ত বা ভুল পণ্যের জন্য।</li>
                <li>
                  গ্রাহক দ্বারা প্রদান করা: অন্য সব ফেরত বা বিনিময়ের জন্য।
                </li>
              </ul>

              <h2 className="text-base md:text-xl font-semibold mb-4">
                ফেরত শর্তাবলী
              </h2>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>পণ্যগুলি অব্যবহৃত এবং অব্যবহৃত হতে হবে।</li>
                <li>মূল চালান স্লিপ এবং ট্যাগগুলি অন্তর্ভুক্ত করুন।</li>
                <li>ক্রয়ের ৩ দিনের মধ্যে ফেরত প্রক্রিয়া করতে হবে।</li>
                <li>
                  পণ্যটি এর আসল প্যাকেজিংয়ে সুরক্ষিতভাবে পুনরায় প্যাক করা
                  নিশ্চিত করুন।
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RefundAndReturnPolicy;
