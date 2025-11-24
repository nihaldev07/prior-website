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
        className: "bg-yellow-500 hover:bg-yellow-600 animate-pulse",
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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50'>
      <div className='container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl'>
        {/* Enhanced Header Section */}
        <div className='text-center mb-10 sm:mb-12 lg:mb-16'>
          {/* Title with decorative element */}
          <div className='flex items-center justify-center gap-3 sm:gap-4 mb-4'>
            <div className='h-1.5 w-12 sm:w-16 bg-gradient-to-r from-primary to-blue-600 rounded-full'></div>
            <div className='flex items-center gap-3'>
              <div className='h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-2xl flex items-center justify-center ring-2 ring-primary/20'>
                <LucidePackage className='h-6 w-6 sm:h-7 sm:w-7 text-primary' />
              </div>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                Order Details
              </h1>
            </div>
            <div className='h-1.5 w-12 sm:w-16 bg-gradient-to-l from-primary to-blue-600 rounded-full'></div>
          </div>
          <p className='text-gray-600 text-sm sm:text-base mb-6'>
            Track and manage your order information
          </p>

          {/* Order IDs with enhanced copy functionality */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8'>
            <div className='flex items-center space-x-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-gray-200/80 hover:shadow-lg transition-all duration-300'>
              <span className='text-xs sm:text-sm font-medium text-gray-600'>Order #</span>
              <Badge variant='outline' className='text-base sm:text-lg px-3 py-1 font-semibold bg-gradient-to-r from-primary/5 to-blue-600/5 border-primary/30'>
                {order.orderNumber}
              </Badge>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(order.orderNumber)}
                className='h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all'>
                <LucideCopy className='h-3.5 w-3.5' />
              </Button>
            </div>
            <div className='flex items-center space-x-2 bg-white px-4 py-2.5 rounded-xl shadow-md border border-gray-200/80 hover:shadow-lg transition-all duration-300'>
              <span className='text-xs sm:text-sm font-medium text-gray-600'>Track ID</span>
              <Badge variant='outline' className='text-sm sm:text-base px-3 py-1 font-semibold bg-gradient-to-r from-primary/5 to-blue-600/5 border-primary/30'>
                #{order.id}
              </Badge>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(order.id)}
                className='h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all'>
                <LucideCopy className='h-3.5 w-3.5' />
              </Button>
            </div>
          </div>

          {copied && (
            <Alert className='max-w-sm mx-auto mb-6 bg-green-50 border-green-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300'>
              <LucideCheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-800 font-medium'>Copied to clipboard!</AlertDescription>
            </Alert>
          )}

          {/* Enhanced Status Badge */}
          <div className='flex justify-center mb-3'>
            <div className='relative inline-flex'>
              <div className={`absolute inset-0 ${statusConfig.className} opacity-20 blur-xl rounded-full`}></div>
              <Badge
                variant={statusConfig.variant}
                className={`relative text-base sm:text-lg px-8 py-3.5 rounded-full ${statusConfig.className} transition-all duration-300 hover:scale-105 shadow-lg`}>
                <StatusIcon className='mr-2 h-5 w-5 sm:h-6 sm:w-6' />
                <span className='font-semibold'>{statusConfig.label}</span>
              </Badge>
            </div>
          </div>
          <p className='text-sm sm:text-base text-gray-600 font-medium'>
            {statusConfig.description}
          </p>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12'>
          {/* Customer Information */}
          <Card className='lg:col-span-1 shadow-xl border-gray-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-blue-50 to-white border-b border-gray-100 pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <div className='h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md'>
                  <LucideUser className='h-5 w-5 text-white' />
                </div>
                <span className='font-bold text-gray-900'>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5 pt-6'>
              <div className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                <div className='h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5'>
                  <LucideUser className='h-4 w-4 text-gray-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Name</p>
                  <p className='font-semibold text-gray-900 text-sm sm:text-base break-words'>{order.customer.name}</p>
                </div>
              </div>

              {order.customer.email && (
                <>
                  <Separator className='bg-gray-200' />
                  <div className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div className='h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5'>
                      <LucideMail className='h-4 w-4 text-gray-600' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Email</p>
                      <p className='font-semibold text-gray-900 text-sm sm:text-base break-all'>{order.customer.email}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator className='bg-gray-200' />
              <div className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                <div className='h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5'>
                  <LucidePhone className='h-4 w-4 text-gray-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>Phone</p>
                  <p className='font-semibold text-gray-900 text-sm sm:text-base'>{order.customer.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className='lg:col-span-1 shadow-xl border-gray-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-green-50 to-white border-b border-gray-100 pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <div className='h-10 w-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md'>
                  <LucideMapPin className='h-5 w-5 text-white' />
                </div>
                <span className='font-bold text-gray-900'>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200'>
                <div className='h-9 w-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5'>
                  <LucideMapPin className='h-4 w-4 text-green-600' />
                </div>
                <div className='space-y-2 flex-1 min-w-0'>
                  <p className='font-semibold text-gray-900 text-sm sm:text-base leading-relaxed break-words'>
                    {order?.shipping?.address}
                  </p>
                  <div className='flex flex-wrap items-center gap-2 text-xs sm:text-sm'>
                    <Badge variant='secondary' className='bg-gray-200 text-gray-700 font-medium'>
                      {order?.shipping?.district}
                    </Badge>
                    <span className='text-gray-400'>•</span>
                    <Badge variant='secondary' className='bg-gray-200 text-gray-700 font-medium'>
                      {order?.shipping?.division}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card className='md:col-span-2 lg:col-span-1 shadow-xl border-gray-200/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-purple-50 to-white border-b border-gray-100 pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <div className='h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md'>
                  <LucideCalendar className='h-5 w-5 text-white' />
                </div>
                <span className='font-bold text-gray-900'>Order Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='space-y-5'>
                <div className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                  <div className='relative mt-1'>
                    <div className='w-3 h-3 bg-gradient-to-br from-primary to-blue-600 rounded-full ring-4 ring-primary/20'></div>
                    {order.status !== "processing" && (
                      <div className='absolute top-3 left-1.5 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent'></div>
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-gray-900 mb-1'>Order Placed</p>
                    <p className='text-xs text-gray-600 font-medium'>
                      {order?.createdAt
                        ? new Date(order?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "Date not available"}
                    </p>
                  </div>
                </div>

                {order.status !== "processing" && (
                  <div className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                    <div className='relative mt-1'>
                      <div className='w-3 h-3 bg-gradient-to-br from-primary to-blue-600 rounded-full ring-4 ring-primary/20'></div>
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-gray-900 mb-1'>Status Updated</p>
                      <p className='text-xs text-gray-600 font-medium'>
                        {statusConfig.label} - {new Date(order?.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Order Notes */}
        {!!order?.notes && (
          <Card className='mb-8 sm:mb-10 shadow-xl border-gray-200/80 hover:shadow-2xl transition-all duration-300 overflow-hidden'>
            <CardHeader className='bg-gradient-to-br from-amber-50 to-white border-b border-gray-100 pb-4'>
              <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
                <div className='h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md'>
                  <LucideClipboardList className='h-5 w-5 text-white' />
                </div>
                <span className='font-bold text-gray-900'>Order Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6'>
              <div className='bg-gradient-to-br from-amber-50/50 to-white rounded-xl p-4 sm:p-5 border border-amber-100'>
                <p className='text-sm sm:text-base leading-relaxed text-gray-700'>{order.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Order Summary */}
        <Card className='shadow-xl border-gray-200/80 hover:shadow-2xl transition-all duration-300 overflow-hidden mb-8 sm:mb-10'>
          <CardHeader className='bg-gradient-to-br from-indigo-50 to-white border-b border-gray-100 pb-4'>
            <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
              <div className='h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md'>
                <LucidePackage className='h-5 w-5 text-white' />
              </div>
              <span className='font-bold text-gray-900'>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0 sm:p-6'>
            <OrderTable order={order} />
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
          <Button
            variant='outline'
            size='lg'
            onClick={() => window.history.back()}
            className='w-full sm:w-auto min-w-[160px] h-12 border-2 border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:shadow-lg font-semibold'>
            <svg className='mr-2 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            Go Back
          </Button>
          {order.status === "shipped" && (
            <Button
              size='lg'
              className='w-full sm:w-auto min-w-[180px] h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold'
              onClick={() => {
                // Add tracking functionality here
                alert("Tracking feature coming soon!");
              }}>
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
