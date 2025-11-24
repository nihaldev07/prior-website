// Enhanced Order Details Page with shadcn/ui
"use client";
import {
  LucideTruck,
  LucideCheckCircle,
  LucideInfo,
  TimerIcon,
  LucideMapPin,
  LucideUser,
  LucidePhone,
  LucideMail,
  LucidePackage,
  LucideCalendar,
  LucideClipboardList,
  LucideXCircle,
  LucideCopy,
} from "lucide-react";
import OrderTable from "../OrderTable";
import { getOrderDetails } from "@/lib/fetchFunctions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useAnalytics from "@/hooks/useAnalytics";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const OrderDetails = () => {
  useAnalytics();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  //@ts-ignore
  const orderId: string = params.orderId;

  const fetchOrderInformation = async () => {
    try {
      setLoading(true);
      const orderData = await getOrderDetails(orderId);
      if (!!orderData) {
        setOrder(orderData);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!!orderId) {
      fetchOrderInformation();
    }
    //eslint-disable-next-line
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        variant: "default" as const,
        className: "bg-green-500 hover:bg-green-600",
        icon: LucideCheckCircle,
        label: "Completed",
        description: "Your order has been delivered successfully",
      },
      processing: {
        variant: "default" as const,
        className: "bg-yellow-500 hover:bg-yellow-600",
        icon: TimerIcon,
        label: "Processing",
        description: "We're preparing your order",
      },
      shipped: {
        variant: "default" as const,
        className: "bg-blue-500 hover:bg-blue-600",
        icon: LucideTruck,
        label: "Shipped",
        description: "Your order is on the way",
      },
      failed: {
        variant: "destructive" as const,
        className: "bg-red-500 hover:bg-red-600",
        icon: LucideXCircle,
        label: "Failed",
        description: "There was an issue with your order",
      },
      cancel: {
        variant: "destructive" as const,
        className: "bg-red-500 hover:bg-red-600",
        icon: LucideXCircle,
        label: "Cancelled",
        description: "This order has been cancelled",
      },
    };
    return (
      configs[status as keyof typeof configs] || {
        variant: "secondary" as const,
        className: "bg-gray-500 hover:bg-gray-600",
        icon: LucideInfo,
        label: status,
        description: "Order status unknown",
      }
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white'>
        <div className='flex flex-col items-center space-y-6'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary'></div>
            <LucidePackage className='h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
          </div>
          <div className='text-center space-y-2'>
            <p className='text-lg font-semibold text-gray-900'>Loading order details...</p>
            <p className='text-sm text-gray-500'>Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white'>
        <Card className='w-full max-w-md shadow-2xl border-gray-200/80'>
          <CardContent className='pt-8 pb-8'>
            <div className='flex flex-col items-center space-y-6'>
              <div className='relative'>
                <div className='h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center'>
                  <LucidePackage className='h-12 w-12 text-gray-400' />
                </div>
                <div className='absolute -bottom-1 -right-1 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center'>
                  <LucideXCircle className='h-5 w-5 text-white' />
                </div>
              </div>
              <div className='text-center space-y-2'>
                <h3 className='text-2xl font-bold text-gray-900'>Order Not Found</h3>
                <p className='text-gray-600'>
                  {`We couldn't find an order with this ID. Please check and try again.`}
                </p>
              </div>
              <Button
                onClick={() => window.history.back()}
                className='mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300'>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 max-w-6xl'>

        {/* Elegant Header */}
        <div className='relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-200/60 p-5 sm:p-7 mb-5 sm:mb-7 overflow-hidden'>
          {/* Decorative background pattern */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-full blur-3xl -z-0'></div>

          <div className='relative z-10'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4'>
              <div className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-1 bg-gradient-to-b from-primary via-blue-600 to-primary rounded-full'></div>
                  <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                    Order #{order.orderNumber}
                  </h1>
                </div>
                <p className='text-xs sm:text-sm text-gray-500 ml-4 flex items-center gap-2'>
                  <LucideClipboardList className='h-3.5 w-3.5' />
                  Tracking ID: <span className='font-mono font-medium text-gray-700'>{order.id}</span>
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <Badge
                  variant={statusConfig.variant}
                  className={`${statusConfig.className} px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300`}>
                  <StatusIcon className='mr-2 h-4 w-4 sm:h-4.5 sm:w-4.5' />
                  {statusConfig.label}
                </Badge>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => copyToClipboard(order.orderNumber)}
                  className='h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 rounded-xl'>
                  <LucideCopy className='h-4 w-4 text-gray-600' />
                </Button>
              </div>
            </div>

            {copied && (
              <Alert className='bg-gradient-to-r from-green-50 to-emerald-50 border-green-300/50 shadow-sm mb-3 animate-in fade-in slide-in-from-top-2 duration-300'>
                <LucideCheckCircle className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-800 text-sm font-medium'>Order number copied to clipboard!</AlertDescription>
              </Alert>
            )}

            <div className='flex items-start gap-3 mt-3 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100/50'>
              <LucideInfo className='h-5 w-5 text-blue-600 mt-0.5 shrink-0' />
              <p className='text-sm text-gray-700 leading-relaxed'>
                {statusConfig.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6'>

          {/* Left Column - Info Cards */}
          <div className='lg:col-span-1 space-y-4'>

            {/* Customer Info */}
            <Card className='shadow-md hover:shadow-xl transition-all duration-300 border-gray-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-blue-50/20'>
              <CardHeader className='pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-blue-100/50'>
                <CardTitle className='text-base sm:text-lg flex items-center gap-3 font-bold text-gray-900'>
                  <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md'>
                    <LucideUser className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                  </div>
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-sm pt-5'>
                <div className='group'>
                  <p className='text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide'>Full Name</p>
                  <p className='font-semibold text-gray-900 text-base group-hover:text-primary transition-colors'>{order.customer.name}</p>
                </div>
                {order.customer.email && (
                  <>
                    <Separator className='bg-gradient-to-r from-transparent via-gray-200 to-transparent' />
                    <div className='group'>
                      <p className='text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide'>Email Address</p>
                      <p className='font-medium text-gray-900 break-all group-hover:text-primary transition-colors'>{order.customer.email}</p>
                    </div>
                  </>
                )}
                <Separator className='bg-gradient-to-r from-transparent via-gray-200 to-transparent' />
                <div className='group'>
                  <p className='text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide'>Phone Number</p>
                  <p className='font-semibold text-gray-900 text-base font-mono group-hover:text-primary transition-colors'>{order.customer.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card className='shadow-md hover:shadow-xl transition-all duration-300 border-gray-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/20'>
              <CardHeader className='pb-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-b border-green-100/50'>
                <CardTitle className='text-base sm:text-lg flex items-center gap-3 font-bold text-gray-900'>
                  <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md'>
                    <LucideMapPin className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                  </div>
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className='text-sm pt-5'>
                <div className='p-4 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border border-green-100/50 mb-4'>
                  <p className='font-medium text-gray-900 leading-relaxed'>{order?.shipping?.address}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='secondary' className='text-xs px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 font-semibold shadow-sm'>
                    📍 {order?.shipping?.district}
                  </Badge>
                  <Badge variant='secondary' className='text-xs px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 font-semibold shadow-sm'>
                    🌍 {order?.shipping?.division}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className='shadow-md hover:shadow-xl transition-all duration-300 border-gray-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-purple-50/20'>
              <CardHeader className='pb-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-b border-purple-100/50'>
                <CardTitle className='text-base sm:text-lg flex items-center gap-3 font-bold text-gray-900'>
                  <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md'>
                    <LucideCalendar className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                  </div>
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-sm pt-5'>
                <div className='flex gap-4 items-start group'>
                  <div className='relative'>
                    <div className='w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300'>
                      <LucideCheckCircle className='h-5 w-5 text-white' />
                    </div>
                    {order.status !== "processing" && (
                      <div className='absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary to-purple-500'></div>
                    )}
                  </div>
                  <div className='flex-1 pt-1.5'>
                    <p className='font-bold text-gray-900 mb-1'>Order Placed</p>
                    <p className='text-xs text-gray-600 font-medium'>
                      {order?.createdAt
                        ? new Date(order?.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {order.status !== "processing" && (
                  <div className='flex gap-4 items-start group'>
                    <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300'>
                      <StatusIcon className='h-5 w-5 text-white' />
                    </div>
                    <div className='flex-1 pt-1.5'>
                      <p className='font-bold text-gray-900 mb-1'>Status Updated</p>
                      <p className='text-xs text-gray-600 font-medium'>
                        {statusConfig.label} - {new Date(order?.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Details */}
          <div className='lg:col-span-2 space-y-4'>

            {/* Order Notes */}
            {!!order?.notes && (
              <Card className='shadow-md hover:shadow-xl transition-all duration-300 border-gray-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-amber-50/20'>
                <CardHeader className='pb-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-amber-100/50'>
                  <CardTitle className='text-base sm:text-lg flex items-center gap-3 font-bold text-gray-900'>
                    <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md'>
                      <LucideClipboardList className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                    </div>
                    Order Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-5'>
                  <div className='p-4 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl border border-amber-100/50'>
                    <p className='text-sm text-gray-700 leading-relaxed italic'>&quot;{order.notes}&quot;</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            <Card className='shadow-lg hover:shadow-2xl transition-all duration-300 border-gray-200/60 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/20'>
              <CardHeader className='pb-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-indigo-100/50'>
                <CardTitle className='text-base sm:text-lg flex items-center gap-3 font-bold text-gray-900'>
                  <div className='h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md'>
                    <LucidePackage className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='p-0 sm:p-6'>
                <OrderTable order={order} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button
            variant='outline'
            onClick={() => window.history.back()}
            className='w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-xl border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg'>
            <svg className='mr-2 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Go Back
          </Button>
          {order.status === "shipped" && (
            <Button
              onClick={() => alert("Tracking feature coming soon!")}
              className='w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
              <LucideTruck className='mr-2 h-5 w-5' />
              Track Package
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
