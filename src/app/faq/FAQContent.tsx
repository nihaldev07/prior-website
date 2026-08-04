"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const categories = [
  { id: "orders", name: "Orders & Purchases" },
  { id: "payment", name: "Payment" },
  { id: "shipping", name: "Shipping & Delivery" },
  { id: "returns", name: "Returns & Exchanges" },
  { id: "account", name: "Account & Privacy" },
  { id: "products", name: "Products" },
  { id: "support", name: "Customer Support" },
];

const faqData: Record<string, { question: string; answer: string }[]> = {
  orders: [
    {
      question: "How do I place an order?",
      answer:
        "Browse our collections, select your desired product, choose your size and color, and click 'Buy Now' or 'Add to Cart'. Follow the checkout steps to complete your order.",
    },
    {
      question: "Can I modify my order after placing it?",
      answer:
        "You can modify your order within 2 hours of placing it. Please contact us at +880-1700534317 or message us on our Facebook page with your order ID and the changes you need.",
    },
    {
      question: "How do I cancel my order?",
      answer:
        "To cancel your order, contact us immediately at +880-1700534317 or message us on Facebook. Cancellation is only possible before the order is dispatched.",
    },
    {
      question: "What happens if an item is out of stock after I order?",
      answer:
        "If an item becomes unavailable after your order is confirmed, we will contact you to offer a replacement, alternative product, or a full refund.",
    },
    {
      question: "Can I order multiple items at once?",
      answer:
        "Yes, you can add multiple items to your cart and checkout together. Shipping charges apply per parcel, so combining orders is cost-effective.",
    },
  ],
  payment: [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Cash on Delivery (COD) and bKash. For orders outside Dhaka, a 150 BDT advance via bKash is required. Nagad is currently disabled.",
    },
    {
      question: "Is Cash on Delivery available everywhere?",
      answer:
        "Yes, Cash on Delivery is available all over Bangladesh. However, for orders outside Dhaka, a 150 BDT advance via bKash is required before dispatch.",
    },
    {
      question: "How do I pay via bKash?",
      answer:
        "After placing your order, our team will contact you with the bKash payment number. Send the advance amount and share the transaction ID with us for confirmation.",
    },
    {
      question: "Do I need to pay advance for all orders?",
      answer:
        "A 10% advance is required only for orders above 5000 BDT. For orders outside Dhaka, 150 BDT advance via bKash is required regardless of order value.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, your payment information is secure. For bKash payments, you only share the transaction ID with us. We never store your financial details.",
    },
  ],
  shipping: [
    {
      question: "How long does delivery take?",
      answer:
        "Inside Dhaka: 24-48 hours. Outside Dhaka: 48-168 hours depending on your district. Orders placed before 2 PM are dispatched the same day.",
    },
    {
      question: "How much is the delivery charge?",
      answer:
        "Inside Dhaka: BDT 80 per parcel. Outside Dhaka: BDT 150 per parcel. Delivery charges are set by our courier partners.",
    },
    {
      question: "Which courier service will deliver my order?",
      answer:
        "We use Pathao, SteadFast, and other reputable courier services. The specific courier depends on your location and availability.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes, you can track your order status by contacting our customer support team at +880-1700534317 or messaging us on Facebook with your order ID.",
    },
    {
      question: "What if my order is lost during delivery?",
      answer:
        "If your order is lost in transit, we will reship the product or provide a full refund. Contact our support team immediately for resolution.",
    },
  ],
  returns: [
    {
      question: "What is your return policy?",
      answer:
        "You can return products within 3 days of purchase if they are unused, in original condition, and with the purchase receipt. Returns must be processed within 3 days.",
    },
    {
      question: "How do I exchange a product?",
      answer:
        "Contact us at +880-1700534317 or message on Facebook within 24 hours. You can exchange in-store within 3 days or ship the product back to us."

    },
    {
      question: "Can I return sale items?",
      answer:
        "Sale items are non-exchangeable and non-returnable unless the product is physically damaged or defective.",
    },
    {
      question: "How long does a refund take?",
      answer:
        "Refunds are processed within 7 business days after the returned product is received and passes quality check (QC).",
    },
    {
      question: "Who pays for return shipping?",
      answer:
        "For damaged, wrong, or lost products, shipping is covered by us. For all other returns or exchanges, the customer pays the shipping costs.",
    },
  ],
  account: [
    {
      question: "Do I need an account to place an order?",
      answer:
        "No, you can place an order as a guest. However, creating an account allows you to track orders, manage your wishlist, and enjoy a faster checkout.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Click on the user icon in the header and select 'Register'. Fill in your details including name, email, and password to create your account.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Login' and then 'Forgot Password'. Enter your registered email address and follow the instructions sent to your inbox.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Log in to your account, go to 'My Account' > 'Profile', and update your personal information. Changes are saved automatically.",
    },
    {
      question: "Is my personal data safe?",
      answer:
        "Yes, we take data security seriously. We do not share your personal information with third parties. Read our Privacy Policy for full details.",
    },
  ],
  products: [
    {
      question: "Are the product images accurate?",
      answer:
        "We strive to display colors as accurately as possible. However, slight variations may occur due to screen settings and lighting conditions.",
    },
    {
      question: "How do I find my size?",
      answer:
        "Check the size chart available on each product page. If you need help, contact us and we will guide you to the perfect fit.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Yes, all products sold on Prior are 100% authentic. We are an official retailer and source directly from verified suppliers.",
    },
    {
      question: "Do you restock sold-out items?",
      answer:
        "Some popular items are restocked periodically. Follow us on Facebook or subscribe to our newsletter to stay updated on new arrivals and restocks.",
    },
  ],
  support: [
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach us via phone at +880-1700534317, email at prior.retailshop.info.bd@gmail.com, Facebook page, or WhatsApp. We respond within 24 hours.",
    },
    {
      question: "What are your customer support hours?",
      answer:
        "Our support team is available Saturday to Thursday, 10:00 AM to 8:00 PM (Bangladesh Time). Weekend queries are answered on the next business day.",
    },
    {
      question: "Can I visit your store?",
      answer:
        "Yes! Visit us at Dhanmondi 27, Genetic Plaza Shop No: 134, Dhaka. We also have a second location at Shop 05, Rankin Street, Wari, Dhaka.",
    },
    {
      question: "How do I file a complaint?",
      answer:
        "Contact us via phone, email, or Facebook with your order ID and a description of the issue. We aim to resolve all complaints within 48 hours.",
    },
  ],
};

const FAQContent = () => {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const categoryNavRef = useRef<HTMLDivElement>(null);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`faq-category-${categoryId}`);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const filteredFaqs = searchQuery
    ? Object.entries(faqData).reduce(
        (acc, [category, items]) => {
          const filtered = items.filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        },
        {} as Record<string, typeof faqData[string]>,
      )
    : faqData;

  useEffect(() => {
    const handleScroll = () => {
      if (!categoryNavRef.current) return;
      const sections = categories.map((cat) =>
        document.getElementById(`faq-category-${cat.id}`),
      );
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveCategory(categories[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalQuestions = Object.values(filteredFaqs).reduce(
    (sum, items) => sum + items.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide uppercase mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto mb-8">
            Find answers to {totalQuestions} common questions across{" "}
            {Object.keys(filteredFaqs).length} categories.
          </p>
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-neutral-700 text-white placeholder:text-neutral-500 font-serif tracking-wide focus:outline-none focus:border-neutral-500 transition-colors duration-200"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Category Nav - Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div
              ref={categoryNavRef}
              className="lg:sticky lg:top-24 bg-white rounded-lg shadow-lg border border-neutral-200 p-4"
            >
              <h3 className="text-sm font-serif font-bold text-neutral-900 tracking-wide uppercase mb-4">
                Categories
              </h3>
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const count = filteredFaqs[cat.id]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className={`w-full text-left px-3 py-2.5 text-sm font-serif tracking-wide transition-colors duration-200 rounded-lg ${
                        activeCategory === cat.id
                          ? "bg-neutral-900 text-white font-bold"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {cat.name}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            activeCategory === cat.id
                              ? "bg-white/20 text-white"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0">
            {Object.entries(filteredFaqs).map(([categoryId, items]) => {
              const category = categories.find((c) => c.id === categoryId);
              if (!category) return null;
              return (
                <div
                  key={categoryId}
                  id={`faq-category-${categoryId}`}
                  className="mb-10"
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 tracking-wide uppercase mb-5 flex items-center gap-3">
                    <span className="w-1 h-6 bg-neutral-900" />
                    {category.name}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      const itemKey = `${categoryId}-${index}`;
                      const isOpen = openItems.has(itemKey);
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-neutral-50 transition-colors duration-200"
                          >
                            <span className="font-serif font-bold text-neutral-900 tracking-wide pr-4">
                              {item.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                            )}
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? "max-h-96" : "max-h-0"
                            }`}
                          >
                            <div className="px-5 pb-5 border-t border-neutral-100">
                              <p className="text-neutral-600 font-serif leading-relaxed pt-4">
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {Object.keys(filteredFaqs).length === 0 && (
              <div className="text-center py-16">
                <p className="text-neutral-500 font-serif text-lg">
                  No questions found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQContent;
