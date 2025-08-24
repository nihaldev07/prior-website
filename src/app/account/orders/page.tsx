"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Calendar,
  Eye,
  RotateCcw,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { accountService } from "@/services/accountService";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  total: number;
  paymentStatus: "paid" | "pending" | "failed";
  itemCount: number;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    thumbnail: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    district: string;
    division: string;
  };
}

const OrdersPage = () => {
  const { authState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!authState.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await accountService.getUserOrders(authState.token);

        if (response.success) {
          setOrders(response.data?.orders ?? []);
          setFilteredOrders(response.data?.orders || []);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [authState.token]);

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.products.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "last_week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "last_month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "last_3_months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      if (dateFilter !== "all") {
        filtered = filtered.filter(
          (order) => new Date(order.date) >= filterDate
        );
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className='h-4 w-4' />;
      case "processing":
        return <Package className='h-4 w-4' />;
      case "shipped":
        return <Truck className='h-4 w-4' />;
      case "delivered":
        return <CheckCircle className='h-4 w-4' />;
      case "cancelled":
      case "returned":
        return <XCircle className='h-4 w-4' />;
      default:
        return <Package className='h-4 w-4' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = async (orderId: string) => {
    if (!authState.token) return;

    try {
      const blob = await accountService.downloadInvoice(
        orderId,
        authState.token
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      Swal.fire({
        title: "Download Failed",
        text: "Failed to download invoice. Please try again.",
        icon: "error",
      });
    }
  };

  // Handle reorder
  const handleReorder = async (orderId: string) => {
    if (!authState.token) return;

    try {
      const response = await accountService.reorder(orderId, authState.token);
      if (response.success) {
        Swal.fire({
          title: "Order Placed! 🛒",
          text: "Your reorder has been placed successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Reorder Failed",
          text: response.message || "Failed to reorder. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Reorder Failed",
        text: "An error occurred while reordering. Please try again.",
        icon: "error",
      });
    }
  };

  // Handle track order
  const handleTrackOrder = async (orderId: string) => {
    if (!authState.token) return;

    try {
      const response = await accountService.trackOrder(
        orderId,
        authState.token
      );
      if (response.success && response.trackingUrl) {
        window.open(response.trackingUrl, "_blank");
      } else {
        Swal.fire({
          title: "Tracking Information",
          text:
            response.message ||
            "Tracking information is not available for this order.",
          icon: "info",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Tracking Failed",
        text: "Failed to get tracking information. Please try again.",
        icon: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Order History</h1>
            <p className='text-gray-600'>Track and manage your orders</p>
          </div>
        </div>

        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='animate-pulse space-y-4'>
                  <div className='flex justify-between'>
                    <div className='space-y-2'>
                      <div className='h-4 bg-gray-200 rounded w-32'></div>
                      <div className='h-3 bg-gray-200 rounded w-24'></div>
                    </div>
                    <div className='h-6 bg-gray-200 rounded w-20'></div>
                  </div>
                  <div className='h-3 bg-gray-200 rounded w-full'></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Order History</h1>
            <p className='text-gray-600'>Track and manage your orders</p>
          </div>
        </div>

        <Card>
          <CardContent className='p-12 text-center'>
            <XCircle className='h-16 w-16 text-red-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Failed to Load Orders
            </h3>
            <p className='text-gray-500 mb-6'>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Order History</h1>
          <p className='text-gray-600'>Track and manage your orders</p>
        </div>
        <div className='text-sm text-gray-500'>
          {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by order number or product name...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full md:w-48'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
                <SelectItem value='shipped'>Shipped</SelectItem>
                <SelectItem value='delivered'>Delivered</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='returned'>Returned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className='w-full md:w-48'>
                <SelectValue placeholder='Filter by date' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Time</SelectItem>
                <SelectItem value='last_week'>Last Week</SelectItem>
                <SelectItem value='last_month'>Last Month</SelectItem>
                <SelectItem value='last_3_months'>Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className='space-y-4'>
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className='p-6'>
                <div className='flex flex-col md:flex-row md:items-center justify-between mb-4'>
                  <div className='space-y-1'>
                    <div className='flex items-center space-x-3'>
                      <h3 className='font-semibold text-gray-900'>
                        {order.orderNumber}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className='ml-1 capitalize'>{order.status}</span>
                      </Badge>
                      <Badge
                        className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus === "paid"
                          ? "Paid"
                          : order.paymentStatus === "pending"
                          ? "Payment Pending"
                          : "Payment Failed"}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-500'>
                      {new Date(order.date).toLocaleDateString()} •{" "}
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className='text-right mt-2 md:mt-0'>
                    <p className='text-lg font-semibold text-gray-900'>
                      ৳{order.total}
                    </p>
                    <p className='text-sm text-gray-500'>Total Amount</p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='flex -space-x-2'>
                    {order.products.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className='h-10 w-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium'
                        style={{ zIndex: 10 - index }}>
                        {item.name.charAt(0)}
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div className='h-10 w-10 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium'>
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {order.products
                        .slice(0, 2)
                        .map((item) => item.name)
                        .join(", ")}
                      {order.products.length > 2 &&
                        ` and ${order.products.length - 2} more`}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Delivering to: {order.shippingAddress.district},{" "}
                      {order.shippingAddress.division}
                    </p>
                  </div>
                </div>

                <Separator className='my-4' />

                {/* Actions */}
                <div className='flex flex-wrap gap-2'>
                  <Link href={`/order/${order.id}`}>
                    <Button variant='outline' size='sm'>
                      <Eye className='h-4 w-4 mr-2' />
                      View Details
                    </Button>
                  </Link>

                  {/* {order.status === "delivered" && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleReorder(order.id)}>
                      <RotateCcw className='h-4 w-4 mr-2' />
                      Reorder
                    </Button>
                  )} */}

                  {/* <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDownloadInvoice(order.id)}>
                    <Download className='h-4 w-4 mr-2' />
                    Invoice
                  </Button>

                  {(order.status === "shipped" ||
                    order.status === "processing") && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleTrackOrder(order.id)}>
                      <Truck className='h-4 w-4 mr-2' />
                      Track Order
                    </Button>
                  )} */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='p-12 text-center'>
            <ShoppingBag className='h-16 w-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "No orders found"
                : "No orders yet"}
            </h3>
            <p className='text-gray-500 mb-6'>
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start shopping to see your orders here"}
            </p>
            {!(
              searchTerm ||
              statusFilter !== "all" ||
              dateFilter !== "all"
            ) && (
              <Link href='/'>
                <Button>
                  <ShoppingBag className='h-4 w-4 mr-2' />
                  Start Shopping
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;
