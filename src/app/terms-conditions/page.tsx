import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TermsAndConditions = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg'>
        <Tabs defaultValue='english' className='w-full px-4 relative'>
          <h1 className=' text-xl md:text-3xl font-bold text-left md:text-center mb-6'>
            Terms & Conditions
          </h1>
          <TabsList className='hidden md:grid min-w-fit grid-cols-2 top-0 right-2 absolute'>
            <TabsTrigger value='english'>English</TabsTrigger>
            <TabsTrigger value='bangla'>বাংলা</TabsTrigger>
          </TabsList>

          <TabsList className='grid md:hidden min-w-fit grid-cols-2 top-0 right-[-15px] absolute'>
            <TabsTrigger value='english'>EN</TabsTrigger>
            <TabsTrigger value='bangla'>বাং</TabsTrigger>
          </TabsList>

          {/* Content */}

          <TabsContent value='english'>
            <div>
              <h2 className='text-base md:text-xl font-semibold mb-4'>
                Delivery Charges and Conditions
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>Cash on Delivery: Available all over Bangladesh.</li>
                <li>150tk Required via bKash for outside Dhaka delivery.</li>
                <li>
                  10% advance is needed if the amount of the parcel is 5000 tk.
                </li>
                <li>Dhaka: BDT 80 per parcel</li>
                <li>Outside Dhaka: BDT 150 per parcel</li>
                <li>Delivery Time: 48-168 hours</li>
                <li>
                  Delivery Agents: Pathao, SteadFast and Other Courier Service
                </li>
                <li>Note: Charges are set by the delivery agents.</li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                Exchange Terms and Conditions
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  Exchanges are accepted within 3 days of purchase from Outlet.
                </li>
                <li>
                  Items must be unused, in original condition, and with the
                  purchase receipt.
                </li>
                <li>
                  Exchange is only applicable for size. If the size is
                  unavailable, customers may choose another design within a
                  similar or higher price range.
                </li>
                <li>
                  No monetary compensation for exchanges. Sale items are
                  non-exchangeable.
                </li>
                <li>
                  Ensure items are packed securely. PRIOR is not responsible for
                  damage during return shipping.
                </li>
                <li>
                  Call us at +8801700534317 or message us on our official
                  facebook page within 24 hours with the order ID and issue
                  details to confirm the return and receive pickup instructions.
                </li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                Return Policies
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  Return products with flaws for a refund if a replacement
                  cannot be provided.
                </li>
                <li>
                  Customers can return unwanted products but must cover delivery
                  charges.
                </li>
                <li>
                  Refunds will be processed within 7 days after the returned
                  product is received and passes QC.
                </li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                Refund Policy
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  Refunds are processed once the item is returned and QC is
                  completed successfully.
                </li>
                <li>
                  Refunds are automatically triggered upon successful
                  cancellation.
                </li>
                <li>
                  Any received cashback amount will be adjusted with the refund
                  amount.
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value='bangla'>
            <div>
              {/* Bangla content goes here */}
              <h2 className='text-base md:text-xl font-semibold mb-4'>
                ডেলিভারি চার্জ এবং শর্তাবলী
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>ক্যাশ অন ডেলিভারি: বাংলাদেশের সর্বত্র পাওয়া যায়।</li>
                <li>
                  ঢাকার বাইরে ডেলিভারির জন্য বিকাশের মাধ্যমে ১৫০ টাকা প্রয়োজন।
                </li>
                <li>৫০০০ টাকা পরিমাণের পণ্য হলে ১০% অগ্রিম প্রয়োজন।</li>
                <li>ঢাকা: প্রতি পার্সেল ৮০ টাকা</li>
                <li>ঢাকার বাইরে: প্রতি পার্সেল ১৫০ টাকা</li>
                <li>ডেলিভারি সময়: ৪৮-১৬৮ ঘন্টা</li>
                <li>ডেলিভারি এজেন্ট: পাঠাও এবং সুন্দরবান কুরিয়ার সার্ভিস</li>
                <li>বিঃদ্রঃ চার্জগুলি ডেলিভারি এজেন্ট দ্বারা নির্ধারিত।</li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                বিনিময় শর্তাবলী
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  আউটলেট থেকে ক্রয়ের ৩ দিনের মধ্যে বিনিময় গ্রহণ করা হয়।
                </li>
                <li>
                  পণ্যগুলি অব্যবহৃত, আসল অবস্থায় থাকতে হবে এবং ক্রয়ের রসিদ সহ
                  থাকতে হবে।
                </li>
                <li>
                  মাপের জন্য বিনিময় প্রযোজ্য। মাপ পাওয়া না গেলে, গ্রাহকরা একই
                  বা উচ্চ মূল্যের ডিজাইন বেছে নিতে পারেন।
                </li>
                <li>বিক্রয় আইটেম বিনিময়যোগ্য নয়।</li>
                <li>
                  আইটেমগুলি সুরক্ষিতভাবে প্যাকেজ করা নিশ্চিত করুন। PRIOR ফেরত
                  শিপিংয়ের সময় ক্ষতির জন্য দায়ী নয়।
                </li>
                <li>
                  অর্ডার আইডি এবং সমস্যার বিশদ সহ আমাদেরকে +৮৮০১৭০০৫৩৪৩১৭ নম্বরে
                  কল করুন বা আমাদের অফিসিয়াল ফেসবুক পেজে ২৪ ঘণ্টার মধ্যে বার্তা
                  পাঠান ফেরত নিশ্চিত করতে এবং পিকআপের নির্দেশনা পেতে।
                </li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                ফেরত নীতিমালা
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>
                  পণ্যের ত্রুটির জন্য ফেরত প্রদান করা হবে যদি কোনো বিকল্প প্রদান
                  করা না হয়।
                </li>
                <li>
                  অপ্রয়োজনীয় পণ্য ফেরত দেওয়া যেতে পারে তবে গ্রাহককে ডেলিভারি
                  চার্জ বহন করতে হবে।
                </li>
                <li>
                  ফেরত পণ্য QC পাস করার পরে ৭ দিনের মধ্যে ফেরত প্রদান করা হবে।
                </li>
              </ul>

              <h2 className='text-base md:text-xl font-semibold mb-4'>
                ফেরত নীতি
              </h2>
              <ul className='list-disc list-inside space-y-2 mb-6'>
                <li>ফেরত পণ্য QC পাস করার পরে ফেরত প্রদান করা হবে।</li>
                <li>অর্ডার বাতিল হলে স্বয়ংক্রিয়ভাবে ফেরত প্রদান করা হবে।</li>
                <li>
                  প্রাপ্ত ক্যাশব্যাকের পরিমাণ ফেরত পরিমাণের সাথে সমন্বয় করা
                  হবে।
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TermsAndConditions;
