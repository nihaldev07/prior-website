// Thank You / Order Success Page
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
import { trackPurchase } from "@/lib/analytics";

const REDIRECT_SECONDS = 15;

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");
  const method = searchParams.get("method") || "cod";
  const totalFromQuery = searchParams.get("total");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
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
          const isBkash = method === "bkash";

          // For bkash orders, check if payment was received (paid > 0)
          // For COD orders, always fire (no payment step to wait for)
          const shouldFirePurchase = isBkash
            ? (orderData?.paid || 0) > 0
            : true;

          if (shouldFirePurchase) {
            hasFiredPurchaseEvent.current = true;

            trackPurchase({
              transaction_id: orderData?.orderNumber || orderNumber,
              value: orderData?.totalPrice || totalFromQuery || 0,
              shipping: orderData?.deliveryCharge || 0,
              discount: orderData?.discount || 0,
              currency: "BDT",
              payment_type: isBkash ? "bkash" : "cod",
              items:
                orderData?.products?.map((product: any) => ({
                  item_id: product?.sku,
                  item_name: product?.name,
                  price: product?.unitPrice,
                  quantity: product?.quantity,
                })) || [],
            });

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
                  payment_type: isBkash ? "bkash" : "cod",
                  items:
                    orderData?.products?.map((product: any) => ({
                      item_id: product?.sku,
                      item_name: product?.name,
                      price: product?.unitPrice,
                      quantity: product?.quantity,
                    })) || [],
                },
              });
            }
          } else {
            // Bkash payment not yet completed — don't fire event
            hasFiredPurchaseEvent.current = false;
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

  // For bkash orders, retry fetching order details if payment is pending
  useEffect(() => {
    if (method !== "bkash" || !orderNumber || hasFiredPurchaseEvent.current) {
      return;
    }

    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = setInterval(async () => {
      if (retryCount >= maxRetries || hasFiredPurchaseEvent.current) {
        clearInterval(retryInterval);
        return;
      }

      try {
        const orderData = await getOrderDetails(orderNumber);
        if (orderData && (orderData.paid || 0) > 0) {
          clearInterval(retryInterval);
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Retry fetch failed:", error);
      }

      retryCount++;
    }, 2000);

    return () => clearInterval(retryInterval);
  }, [orderNumber, method]);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0 && orderNumber) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && orderNumber) {
      router.push(`/order/${orderNumber}`);
    }
  }, [countdown, orderNumber, router]);

  const getDeliveryTimeline = () => {
    if (!order) return "2-3 business days";

    const district = order?.shipping?.district?.toLowerCase() || "";
    if (district.includes("dhaka")) {
      return "1-2 business days";
    } else if (
      district.includes("gazipur") ||
      district.includes("tongi") ||
      district.includes("narayanganj") ||
      district.includes("savar")
    ) {
      return "2-3 business days";
    } else {
      return "3-5 business days";
    }
  };

  // Circular progress ring math for the countdown indicator
  const ringRadius = 20;
  const ringCircumference = useMemo(() => 2 * Math.PI * ringRadius, []);
  const ringProgress = countdown / REDIRECT_SECONDS;
  const ringOffset = ringCircumference * (1 - ringProgress);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-12 w-12 border-[3px] border-neutral-200 border-t-emerald-600' />
            <LucidePackage className='h-5 w-5 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
          </div>
          <p className='text-sm text-neutral-500 tracking-wide'>
            Loading your order details…
          </p>
        </div>
      </div>
    );
  }

  if (!orderNumber) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-neutral-50'>
        <Card className='w-full max-w-sm border-neutral-200 shadow-sm'>
          <CardContent className='pt-8 pb-8'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center'>
                <LucidePackage className='h-8 w-8 text-neutral-400' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-lg font-semibold text-neutral-900'>
                  Order information missing
                </h3>
                <p className='text-sm text-neutral-500'>
                  We couldn&apos;t find the order information. Please check your
                  email or contact us.
                </p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className='mt-2 bg-neutral-900 hover:bg-neutral-800 text-white'>
                Continue shopping
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
    <div className='min-h-screen bg-neutral-50 py-6 sm:py-10 px-4'>
      <div className='container mx-auto max-w-2xl'>
        {/* Hero: success + redirect status, combined and compact */}
        <Card className='border-neutral-200 shadow-sm overflow-hidden mb-4'>
          <CardContent className='p-6 sm:p-8'>
            <div className='flex flex-col items-center text-center gap-3'>
              <div className='h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center ring-1 ring-emerald-100'>
                <LucideCheckCircle className='h-8 w-8 text-emerald-600' />
              </div>

              <div className='space-y-1'>
                <h1 className='text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight'>
                  {isBkash ? "Payment successful" : "Order confirmed"}
                </h1>
                <p className='text-sm text-neutral-500'>
                  {isBkash
                    ? "Thank you — your payment has been received."
                    : "Thank you for your purchase."}
                </p>
              </div>

              <Badge
                className={`${
                  isBkash
                    ? "bg-pink-50 text-pink-700 hover:bg-pink-50"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-50"
                } border-0 px-3 py-1 text-xs font-semibold`}>
                {isBkash ? "Paid via bKash" : "Cash on delivery"}
              </Badge>

              {/* Redirect status — moved up near the top, prominent */}
              <div className='w-full mt-2 flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3'>
                <div className='relative h-11 w-11 shrink-0'>
                  <svg className='h-11 w-11 -rotate-90' viewBox='0 0 48 48'>
                    <circle
                      cx='24'
                      cy='24'
                      r={ringRadius}
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='4'
                      className='text-neutral-200'
                    />
                    <circle
                      cx='24'
                      cy='24'
                      r={ringRadius}
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='4'
                      strokeLinecap='round'
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className='text-emerald-600 transition-[stroke-dashoffset] duration-1000 ease-linear'
                    />
                  </svg>
                  <span className='absolute inset-0 flex items-center justify-center text-xs font-semibold text-neutral-700 tabular-nums'>
                    {countdown}
                  </span>
                </div>
                <div className='flex-1 text-left'>
                  <p className='text-sm text-neutral-700'>
                    Redirecting to your order in{" "}
                    <span className='font-semibold text-neutral-900 tabular-nums'>
                      {countdown}s
                    </span>
                  </p>
                  <button
                    onClick={() => router.push(`/order/${orderNumber}`)}
                    className='text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline'>
                    View now
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className='border-neutral-200 shadow-sm overflow-hidden mb-4'>
          <CardContent className='p-5 sm:p-6 space-y-4'>
            {/* Order Number + Total */}
            <div className='flex items-center justify-between gap-4 pb-4 border-b border-neutral-100'>
              <div>
                <p className='text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5'>
                  Order number
                </p>
                <p className='text-lg font-bold text-neutral-900'>
                  #{orderNumber}
                </p>
              </div>
              {order && (
                <div className='text-right'>
                  <p className='text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-0.5'>
                    Order total
                  </p>
                  <p className='text-lg font-bold text-neutral-900'>
                    ৳{order?.totalPrice || totalFromQuery || "0"}
                  </p>
                </div>
              )}
            </div>

            {/* Delivery details */}
            {order && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='flex items-center gap-3 p-3 rounded-lg bg-neutral-50'>
                  <LucideClock className='h-4 w-4 text-neutral-400 shrink-0' />
                  <div>
                    <p className='text-[11px] font-medium text-neutral-400 uppercase tracking-wider'>
                      Expected delivery
                    </p>
                    <p className='text-sm font-semibold text-neutral-800'>
                      {deliveryTimeline}
                    </p>
                  </div>
                </div>

                {order?.shipping && (
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-neutral-50'>
                    <LucideMapPin className='h-4 w-4 text-neutral-400 shrink-0' />
                    <div>
                      <p className='text-[11px] font-medium text-neutral-400 uppercase tracking-wider'>
                        Delivery location
                      </p>
                      <p className='text-sm font-semibold text-neutral-800'>
                        {order?.shipping?.district}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next steps */}
            <div className='p-4 rounded-lg bg-amber-50/60 border border-amber-100'>
              <h3 className='flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-2'>
                <LucideTruck className='h-4 w-4 text-amber-600' />
                What happens next
              </h3>
              <ul className='space-y-1.5 text-sm text-neutral-600'>
                <li className='flex gap-2'>
                  <span className='text-emerald-600'>✓</span>
                  You&apos;ll receive an order confirmation sms shortly
                </li>
                <li className='flex gap-2'>
                  <span className='text-emerald-600'>✓</span>
                  Our team will prepare your items for shipping
                </li>
                <li className='flex gap-2'>
                  <span className='text-emerald-600'>✓</span>
                  We&apos;ll call you when your order ships
                </li>
                {isBkash && (
                  <li className='flex gap-2'>
                    <span className='text-emerald-600'>✓</span>
                    Your payment has been confirmed via bKash
                  </li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div className='flex items-center justify-center gap-2 pt-1 text-sm text-neutral-500'>
              <LucidePhone className='h-4 w-4' />
              Need help?{" "}
              <a
                href='tel:+8801XXXXXXXXX'
                className='font-semibold text-neutral-800 hover:underline'>
                +880 1XXX-XXXXXX
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button
            onClick={() => router.push(`/order/${orderNumber}`)}
            className='flex-1 h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-medium'>
            <LucidePackage className='mr-2 h-4 w-4' />
            Track order
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant='outline'
            className='flex-1 h-11 border-neutral-200 font-medium hover:bg-neutral-50'>
            <LucideShoppingBag className='mr-2 h-4 w-4' />
            Continue shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
