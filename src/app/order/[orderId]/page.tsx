"use client";
import {
  LucideTruck,
  LucideCheckCircle2,
  LucideInfo,
  LucideTimer,
  LucideMapPin,
  LucideUser,
  LucidePackage,
  LucideCalendar,
  LucideClipboardList,
  LucideXCircle,
  LucideCopy,
  LucideArrowLeft,
  LucideCircleDot,
  LucideSparkles,
  LucidePartyPopper,
  LucidePhone,
  LucideMail,
} from "lucide-react";
import OrderProductsTable from "./OrderProductsTable";
import { getOrderDetails } from "@/lib/fetchFunctions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import useAnalytics from "@/hooks/useAnalytics";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeliveryHistorySheet from "@/components/DeliveryHistorySheet";
import { Order } from "../interface";

const statusConfigs = {
  completed: {
    className: "bg-emerald-600 hover:bg-emerald-600",
    icon: LucideCheckCircle2,
    label: "Completed",
    description: "Your order has been delivered successfully.",
    gradient: "from-emerald-500 via-emerald-600 to-teal-600",
    glow: "shadow-emerald-500/20",
    step: 3,
  },
  processing: {
    className: "bg-amber-500 hover:bg-amber-500",
    icon: LucideTimer,
    label: "Processing",
    description: "We're preparing your order for shipment.",
    gradient: "from-amber-400 via-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    step: 1,
  },
  shipped: {
    className: "bg-indigo-600 hover:bg-indigo-600",
    icon: LucideTruck,
    label: "Shipped",
    description: "Your order is on its way.",
    gradient: "from-indigo-500 via-indigo-600 to-violet-600",
    glow: "shadow-indigo-500/20",
    step: 2,
  },
  failed: {
    className: "bg-rose-600 hover:bg-rose-600",
    icon: LucideXCircle,
    label: "Failed",
    description: "There was an issue processing your order.",
    gradient: "from-rose-500 via-rose-600 to-red-600",
    glow: "shadow-rose-500/20",
    step: 0,
  },
  cancel: {
    className: "bg-rose-600 hover:bg-rose-600",
    icon: LucideXCircle,
    label: "Cancelled",
    description: "This order has been cancelled.",
    gradient: "from-slate-500 via-slate-600 to-slate-700",
    glow: "shadow-slate-500/20",
    step: 0,
  },
} as const;

const getStatusConfig = (status: string) =>
  statusConfigs[status as keyof typeof statusConfigs] || {
    className: "bg-slate-500 hover:bg-slate-500",
    icon: LucideInfo,
    label: status,
    description: "Order status unknown.",
    gradient: "from-slate-400 via-slate-500 to-slate-600",
    glow: "shadow-slate-500/20",
    step: 0,
  };

const journeySteps = [
  { key: "placed", label: "Placed", icon: LucideClipboardList },
  { key: "processing", label: "Processing", icon: LucideTimer },
  { key: "shipped", label: "Shipped", icon: LucideTruck },
  { key: "completed", label: "Delivered", icon: LucidePartyPopper },
];

const formatDate = (date: Date | null | undefined) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const OrderDetails = () => {
  useAnalytics();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);
  const params = useParams();
  const orderId = params.orderId as string;

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        if (data) setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative h-14 w-14'>
            <div className='absolute inset-0 rounded-full border-[3px] border-slate-200' />
            <div className='absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin' />
            <LucidePackage className='absolute inset-0 m-auto h-5 w-5 text-indigo-500' />
          </div>
          <p className='text-sm text-slate-500 animate-pulse'>
            Fetching your order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100'>
        <Card className='w-full max-w-sm rounded-3xl border-slate-200 shadow-lg shadow-slate-200/50'>
          <CardContent className='pt-10 pb-10 flex flex-col items-center text-center gap-4'>
            <div className='h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center rotate-3'>
              <LucidePackage className='h-9 w-9 text-rose-400 -rotate-3' />
            </div>
            <div className='space-y-1.5'>
              <h3 className='text-lg font-semibold text-slate-900'>
                Order Not Found
              </h3>
              <p className='text-sm text-slate-500'>
                We couldn&apos;t find an order with this ID. It may have been
                moved or the link might be incorrect.
              </p>
            </div>
            <Button
              onClick={() => window.history.back()}
              className='w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const isShipped = order.status === "shipped";
  const isCompleted = order.status === "completed";
  const isTerminalNegative =
    order.status === "failed" || order.status === "cancel";
  const hasCourier = !!(
    order?.courier?.provider || order?.courierDeliveryHistory?.provider
  );

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100'>
      <div className='container mx-auto max-w-5xl px-4 py-6 sm:py-10'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => window.history.back()}
            className='rounded-xl border-slate-200 shrink-0 bg-white hover:bg-slate-50'>
            <LucideArrowLeft className='h-4 w-4' />
          </Button>
          <div className='min-w-0'>
            <h1 className='text-xl sm:text-2xl font-bold text-slate-900 truncate tracking-tight'>
              Order #{order.orderNumber}
            </h1>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                toast.success("Order ID copied");
              }}
              className='flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 font-mono transition-colors'>
              {order.id}
              <LucideCopy className='h-3 w-3' />
            </button>
          </div>
        </div>

        {/* Hero status banner */}
        <Card
          className={`relative rounded-3xl border-0 shadow-xl ${statusConfig.glow} mb-6 overflow-hidden`}>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient}`}
          />
          {/* decorative pattern */}
          <div className='absolute inset-0 opacity-[0.07]'>
            <div className='absolute -right-10 -top-10 h-56 w-56 rounded-full border-[16px] border-white' />
            <div className='absolute right-16 bottom-[-40px] h-32 w-32 rounded-full border-[10px] border-white' />
          </div>
          <CardContent className='relative p-5 sm:p-7'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between'>
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0'>
                  <StatusIcon className='h-6 w-6 sm:h-7 sm:w-7 text-white' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='text-white font-bold text-lg sm:text-xl'>
                      {statusConfig.label}
                    </p>
                    {isCompleted && (
                      <LucideSparkles className='h-4 w-4 text-white/80' />
                    )}
                  </div>
                  <p className='text-white/80 text-sm mt-0.5'>
                    {statusConfig.description}
                  </p>
                </div>
              </div>
              {isShipped && hasCourier && (
                <Button
                  onClick={() => setDeliverySheetOpen(true)}
                  className='rounded-xl bg-white text-indigo-700 hover:bg-white/90 w-full sm:w-auto font-semibold shadow-md'>
                  <LucideTruck className='h-4 w-4 mr-2' />
                  Track Order
                </Button>
              )}
            </div>

            {/* Journey stepper */}
            {!isTerminalNegative && (
              <div className='mt-6 sm:mt-8'>
                <div className='flex items-center'>
                  {journeySteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const currentStepIdx = statusConfig.step;
                    const isDone = idx <= currentStepIdx;
                    const isLast = idx === journeySteps.length - 1;
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                        <div className='flex flex-col items-center gap-1.5'>
                          <div
                            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all ${
                              isDone
                                ? "bg-white text-indigo-700"
                                : "bg-white/20 text-white/60"
                            }`}>
                            <StepIcon className='h-4 w-4' />
                          </div>
                          <span
                            className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                              isDone ? "text-white" : "text-white/50"
                            }`}>
                            {step.label}
                          </span>
                        </div>
                        {!isLast && (
                          <div
                            className={`h-[2px] flex-1 mx-1 sm:mx-2 rounded-full transition-all ${
                              idx < currentStepIdx ? "bg-white" : "bg-white/25"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* Left column */}
          <div className='lg:col-span-1 space-y-4'>
            <Card className='rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold text-slate-900 flex items-center gap-2'>
                  <div className='h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center'>
                    <LucideUser className='h-3.5 w-3.5 text-indigo-600' />
                  </div>
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3.5 text-sm pt-0'>
                <div>
                  <p className='text-xs text-slate-400 mb-0.5'>Name</p>
                  <p className='font-medium text-slate-900'>
                    {order.customer.name}
                  </p>
                </div>
                {order.customer.email && (
                  <div>
                    <p className='text-xs text-slate-400 mb-0.5 flex items-center gap-1'>
                      <LucideMail className='h-3 w-3' /> Email
                    </p>
                    <p className='font-medium text-slate-900 break-all'>
                      {order.customer.email}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-xs text-slate-400 mb-0.5 flex items-center gap-1'>
                    <LucidePhone className='h-3 w-3' /> Phone
                  </p>
                  <p className='font-medium text-slate-900 font-mono'>
                    {order.customer.phoneNumber}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold text-slate-900 flex items-center gap-2'>
                  <div className='h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center'>
                    <LucideMapPin className='h-3.5 w-3.5 text-indigo-600' />
                  </div>
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className='text-sm pt-0 space-y-3'>
                <p className='text-slate-700 leading-relaxed'>
                  {order?.shipping?.address}
                </p>
                <div className='flex flex-wrap gap-2'>
                  <Badge
                    variant='secondary'
                    className='rounded-lg font-normal bg-indigo-50 text-indigo-700 hover:bg-indigo-50'>
                    {order?.shipping?.district}
                  </Badge>
                  <Badge
                    variant='secondary'
                    className='rounded-lg font-normal bg-indigo-50 text-indigo-700 hover:bg-indigo-50'>
                    {order?.shipping?.division}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className='lg:col-span-2 space-y-4'>
            {!!order?.notes && (
              <Card className='rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm font-semibold text-slate-900 flex items-center gap-2'>
                    <div className='h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center'>
                      <LucideClipboardList className='h-3.5 w-3.5 text-indigo-600' />
                    </div>
                    Order Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  <p className='text-sm text-slate-600 italic bg-slate-50 rounded-xl p-3.5 border border-slate-100 border-l-4 border-l-indigo-300'>
                    &quot;{order.notes}&quot;
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className='rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold text-slate-900 flex items-center gap-2'>
                  <div className='h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center'>
                    <LucidePackage className='h-3.5 w-3.5 text-indigo-600' />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <OrderProductsTable order={order} />
              </CardContent>
            </Card>

            {isCompleted && (
              <Card className='rounded-2xl border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm'>
                <CardContent className='py-4 px-5 flex items-center gap-3'>
                  <LucidePartyPopper className='h-5 w-5 text-emerald-600 shrink-0' />
                  <p className='text-sm text-emerald-800'>
                    Thanks for shopping with us — we hope you love it!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Separator className='my-6' />
        <div className='flex justify-center'>
          <Button
            variant='outline'
            onClick={() => window.history.back()}
            className='rounded-xl border-slate-200 bg-white hover:bg-slate-50'>
            <LucideArrowLeft className='h-4 w-4 mr-2' />
            Go Back
          </Button>
        </div>

        <DeliveryHistorySheet
          open={deliverySheetOpen}
          onOpenChange={setDeliverySheetOpen}
          deliveryTimeline={order?.deliveryTimeline}
          courierDeliveryHistory={order?.courierDeliveryHistory}
          provider={
            order?.courier?.provider || order?.courierDeliveryHistory?.provider
          }
          customerPhoneNumber={order?.customer.phoneNumber}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
