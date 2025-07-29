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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='text-muted-foreground'>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center space-y-4'>
              <LucidePackage className='h-16 w-16 text-muted-foreground' />
              <div className='text-center'>
                <h3 className='text-lg font-semibold'>Order Not Found</h3>
                <p className='text-muted-foreground'>
                  {`We couldn't find an order with this ID.`}
                </p>
              </div>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20'>
      <div className='container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Header Section */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center space-x-2 mb-4'>
            <LucidePackage className='h-8 w-8 text-primary' />
            <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
              Order Details
            </h1>
          </div>

          {/* Order IDs with copy functionality */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-6'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-muted-foreground'>Order #</span>
              <Badge variant='outline' className='text-lg px-3 py-1'>
                {order.orderNumber}
              </Badge>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(order.orderNumber)}
                className='h-6 w-6 p-0'>
                <LucideCopy className='h-3 w-3' />
              </Button>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-muted-foreground'>Track ID</span>
              <Badge variant='outline' className='px-3 py-1'>
                #{order.id}
              </Badge>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => copyToClipboard(order.id)}
                className='h-6 w-6 p-0'>
                <LucideCopy className='h-3 w-3' />
              </Button>
            </div>
          </div>

          {copied && (
            <Alert className='max-w-sm mx-auto mb-4'>
              <LucideCheckCircle className='h-4 w-4' />
              <AlertDescription>Copied to clipboard!</AlertDescription>
            </Alert>
          )}

          {/* Status Badge */}
          <div className='flex justify-center'>
            <Badge
              variant={statusConfig.variant}
              className={`text-base px-6 py-3 rounded-full ${statusConfig.className} transition-all duration-200 hover:scale-105`}>
              <StatusIcon className='mr-2 h-5 w-5' />
              {statusConfig.label}
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground mt-2'>
            {statusConfig.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Customer Information */}
          <Card className='lg:col-span-1 hover:shadow-lg transition-shadow duration-200'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <LucideUser className='h-5 w-5 text-primary' />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center space-x-3'>
                <LucideUser className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Name</p>
                  <p className='font-medium'>{order.customer.name}</p>
                </div>
              </div>

              {order.customer.email && (
                <>
                  <Separator />
                  <div className='flex items-center space-x-3'>
                    <LucideMail className='h-4 w-4 text-muted-foreground' />
                    <div>
                      <p className='text-sm text-muted-foreground'>Email</p>
                      <p className='font-medium'>{order.customer.email}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className='flex items-center space-x-3'>
                <LucidePhone className='h-4 w-4 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Phone</p>
                  <p className='font-medium'>{order.customer.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className='lg:col-span-1 hover:shadow-lg transition-shadow duration-200'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <LucideMapPin className='h-5 w-5 text-primary' />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-start space-x-3'>
                <LucideMapPin className='h-4 w-4 text-muted-foreground mt-1' />
                <div className='space-y-1'>
                  <p className='font-medium leading-relaxed'>
                    {order?.shipping?.address}
                  </p>
                  <p className='text-muted-foreground'>
                    {order?.shipping?.district}, {order?.shipping?.division}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline or Additional Info */}
          <Card className='lg:col-span-1 hover:shadow-lg transition-shadow duration-200'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <LucideCalendar className='h-5 w-5 text-primary' />
                <span>Order Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-primary rounded-full'></div>
                  <div>
                    <p className='text-sm font-medium'>Order Placed</p>
                    <p className='text-xs text-muted-foreground'>
                      {order?.createdAt
                        ? new Date(order?.createdAt).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>
                </div>

                {order.status !== "processing" && (
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                    <div>
                      <p className='text-sm font-medium'>Status Updated</p>
                      <p className='text-xs text-muted-foreground'>
                        {statusConfig.label}{" "}
                        {`(${new Date(order?.updatedAt).toLocaleDateString()})`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Notes */}
        {!!order?.notes && (
          <Card className='mb-8 hover:shadow-lg transition-shadow duration-200'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <LucideClipboardList className='h-5 w-5 text-primary' />
                <span>Order Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-muted/50 rounded-lg p-4'>
                <p className='text-sm leading-relaxed'>{order.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card className='hover:shadow-lg transition-shadow duration-200'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <LucidePackage className='h-5 w-5 text-primary' />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTable order={order} />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
          <Button
            variant='outline'
            onClick={() => window.history.back()}
            className='hover:scale-105 transition-transform duration-200'>
            Go Back
          </Button>
          {order.status === "shipped" && (
            <Button
              className='hover:scale-105 transition-transform duration-200'
              onClick={() => {
                // Add tracking functionality here
                alert("Tracking feature coming soon!");
              }}>
              <LucideTruck className='mr-2 h-4 w-4' />
              Track Package
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
