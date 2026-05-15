// Thank You / Order Success Page
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LucideCheckCircle,
  LucidePackage,
  LucideShoppingBag,
  LucideMapPin,
  LucideClock,
  LucidePhone,
  LucideTruck,
} from "lucide-react";
import { getOrderDetails } from "@/lib/fetchFunctions";
import { trackEvent } from "@/lib/firebase-event";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const method = searchParams.get("method") || "cod";
  const totalFromQuery = searchParams.get("total");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const hasFiredPurchaseEvent = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderDetails(orderNumber);
        setOrder(orderData);

        // Fire purchase event only once
        if (!hasFiredPurchaseEvent.current && orderData) {
          hasFiredPurchaseEvent.current = true;

          // Prepare items array for analytics
          const items = orderData?.products?.map((product: any, index: number) => ({
            item_id: product?.sku,
            item_name: product?.name,
            affiliation: "Prior Web-site Store",
            coupon: "",
            discount: product?.discount,
            index,
            item_brand: "Prior",
            item_category: product?.categoryName ?? "",
            item_category2: "",
            item_category3: "",
            item_category4: "",
            item_category5: "",
            item_list_id: product?.id,
            item_list_name: "Order Products",
            item_variant: product?.variation ? JSON.stringify(product?.variation) : "no variation",
            location_id: "",
            price: product?.unitPrice,
            quantity: product?.quantity,
          }));

          // Fire purchase event
          trackEvent("purchase", {
            transaction_id: orderData?.orderNumber || orderNumber,
            affiliation: "Web-Site",
            value: orderData?.totalPrice || totalFromQuery || 0,
            shipping: orderData?.deliveryCharge || 0,
            discount: orderData?.discount || 0,
            currency: "BDT",
            payment_type: method === "bkash" ? "bkash" : "cod",
            items: items || [],
          });

          // Push to Data Layer for GTM
          if (typeof window !== "undefined" && window.dataLayer) {
            window.dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: orderData?.orderNumber || orderNumber,
                affiliation: "Web-Site",
                value: orderData?.totalPrice || totalFromQuery || 0,
                shipping: orderData?.deliveryCharge || 0,
                discount: orderData?.discount || 0,
                currency: "BDT",
                payment_type: method === "bkash" ? "bkash" : "cod",
                items: items || [],
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, method, totalFromQuery]);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0 && orderNumber) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && orderNumber) {
      // Redirect to order details page
      router.push(`/order/${orderNumber}`);
    }
  }, [countdown, orderNumber, router]);

  const getDeliveryTimeline = () => {
    if (!order) return "2-3 business days";

    const district = order?.shipping?.district?.toLowerCase() || "";
    if (district.includes("dhaka")) {
      return "1-2 business days";
    } else if (district.includes("gazipur") || district.includes("tongi") || district.includes("narayanganj") || district.includes("savar")) {
      return "2-3 business days";
    } else {
      return "3-5 business days";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-neutral-900"></div>
            <LucidePackage className="h-6 w-6 text-neutral-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-serif font-semibold text-neutral-900 tracking-wide">
              Loading your order details...
            </p>
            <p className="text-sm font-serif text-neutral-500 tracking-wide">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-neutral-50 to-white">
        <Card className="w-full max-w-md shadow-2xl border-neutral-200/80">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="h-24 w-24 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full flex items-center justify-center">
                <LucidePackage className="h-12 w-12 text-neutral-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
                  Order Information Missing
                </h3>
                <p className="font-serif text-neutral-600 tracking-wide">
                  We couldn&apos;t find the order information. Please check your email or contact us.
                </p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 font-serif tracking-wide"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isBkash = method === "bkash";
  const deliveryTimeline = getDeliveryTimeline();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Message */}
        <Card className="shadow-2xl border-neutral-200/60 overflow-hidden mb-6">
          <CardContent className="pt-10 pb-10 px-6 sm:px-10">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="h-24 w-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <LucideCheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent tracking-wide">
                  {isBkash ? "Payment Successful!" : "Order Confirmed!"}
                </h1>
                <p className="text-lg sm:text-xl font-serif text-neutral-600 tracking-wide">
                  {isBkash ? "Thank you for your payment" : "Thank you for your purchase"}
                </p>
              </div>

              {/* Payment Method Badge */}
              <Badge className={`${isBkash ? "bg-pink-500 hover:bg-pink-600" : "bg-blue-500 hover:bg-blue-600"} px-6 py-2 text-sm font-serif font-bold shadow-md`}>
                {isBkash ? "Paid via bKash" : "Cash on Delivery"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="shadow-xl border-neutral-200/60 overflow-hidden mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Order Number */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div>
                  <p className="text-xs font-serif font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                    Order Number
                  </p>
                  <p className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
                    #{orderNumber}
                  </p>
                </div>
                {order && (
                  <div className="text-right">
                    <p className="text-xs font-serif font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                      Order Total
                    </p>
                    <p className="text-2xl font-serif font-bold text-neutral-900 tracking-wide">
                  ৳{order?.totalPrice || totalFromQuery || "0"}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Details Grid */}
              {order && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Timeline */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <LucideClock className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-serif font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                        Expected Delivery
                      </p>
                      <p className="font-serif font-semibold text-neutral-900 tracking-wide">
                        {deliveryTimeline}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  {order?.shipping && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <LucideMapPin className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-serif font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                          Delivery Location
                        </p>
                        <p className="font-serif font-semibold text-neutral-900 tracking-wide">
                          {order?.shipping?.district}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Next Steps */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                <h3 className="font-serif font-bold text-neutral-900 mb-3 tracking-wide flex items-center gap-2">
                  <LucideTruck className="h-5 w-5 text-amber-600" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm font-serif text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>You&apos;ll receive an order confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Our team will prepare your items for shipping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>We&apos;ll contact you via phone when your order is shipped</span>
                  </li>
                  {isBkash && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Your payment has been confirmed via bKash</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <LucidePhone className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-serif text-neutral-700">
                  Need help? Contact us at{" "}
                  <a href="tel:+8801XXXXXXXXX" className="font-bold text-blue-600 hover:underline">
                    +880 1XXX-XXXXXX
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Track Order Button - Primary */}
          <Button
            onClick={() => router.push(`/order/${orderNumber}`)}
            className="w-full sm:w-auto px-8 py-6 text-base font-serif font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 tracking-wide"
          >
            <LucidePackage className="mr-2 h-5 w-5" />
            Track Order
          </Button>

          {/* Continue Shopping Button - Secondary */}
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 text-base font-serif font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg tracking-wide"
          >
            <LucideShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </div>

        {/* Auto-redirect Message */}
        {countdown > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm font-serif text-neutral-600 tracking-wide">
              Redirecting to order details in{" "}
              <span className="font-bold text-primary">{countdown}</span> seconds...
            </p>
            <Button
              onClick={() => router.push(`/order/${orderNumber}`)}
              variant="link"
              className="mt-2 text-sm font-serif text-primary hover:underline"
            >
              View Order Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYouPage;
