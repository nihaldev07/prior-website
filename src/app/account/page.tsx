"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Calendar,
  Package,
  Star,
  TrendingUp,
  Edit,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { accountService } from "@/services/accountService";

const AccountDashboard = () => {
  const { authState } = useAuth();
  const user = authState.user;
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    wishlistItems: 0,
    accountStatus: "Verified",
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authState.token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch account stats and recent orders
        const [ordersResponse] = await Promise.all([
          accountService.getUserOrders(authState.token),
        ]);

        // if (statsResponse.success) {
        //   setStats({
        //     totalOrders: statsResponse.data.totalOrders,
        //     completedOrders: statsResponse.data.completedOrders,
        //     wishlistItems: statsResponse.data.wishlistItems,
        //     accountStatus: statsResponse.data.accountStatus,
        //   });
        // }

        if (ordersResponse.success) {
          // Get the 3 most recent orders
          const recent = !ordersResponse?.data?.orders
            ? []
            : ordersResponse.data?.orders
                .sort((a, b) => Number(b.orderNumber) - Number(a.orderNumber))
                .map((order) => ({
                  id: order.orderNumber,
                  date: order.date,
                  status: order.status,
                  total: order.total,
                  items: order.itemCount,
                }));
          setRecentOrders(recent);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authState.token]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        {/* Welcome Section Skeleton */}
        <div className='bg-gray-200 animate-pulse rounded-lg h-32'></div>

        {/* Stats Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='animate-pulse space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-20'></div>
                  <div className='h-8 bg-gray-200 rounded w-12'></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <Card className='lg:col-span-1'>
            <CardContent className='p-6'>
              <div className='animate-pulse space-y-4'>
                <div className='h-16 w-16 bg-gray-200 rounded-full'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-32'></div>
                  <div className='h-3 bg-gray-200 rounded w-24'></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='lg:col-span-2'>
            <CardContent className='p-6'>
              <div className='animate-pulse space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='h-16 bg-gray-200 rounded'></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Account Dashboard
            </h1>
            <p className='text-gray-600'>Welcome to your account overview</p>
          </div>
        </div>

        <Card>
          <CardContent className='p-12 text-center'>
            <AlertCircle className='h-16 w-16 text-red-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Failed to Load Dashboard
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
      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold mb-2'>
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className='text-blue-100'>
              Manage your account, track orders, and explore your wishlist
            </p>
          </div>
          <div className='hidden md:block'>
            <div className='bg-white/20 backdrop-blur rounded-lg p-4'>
              <Calendar className='h-8 w-8 text-white' />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Orders
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalOrders}
                </p>
              </div>
              <div className='h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <ShoppingBag className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Completed Orders
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.completedOrders}
                </p>
              </div>
              <div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Package className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Wishlist Items
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.wishlistItems}
                </p>
              </div>
              <div className='h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center'>
                <Heart className='h-6 w-6 text-red-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Account Status
                </p>
                <Badge className='bg-green-100 text-green-800 mt-1'>
                  {stats.accountStatus}
                </Badge>
              </div>
              <div className='h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Star className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Profile Overview */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='h-5 w-5 mr-2' />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center'>
                <User className='h-8 w-8 text-blue-600' />
              </div>
              <div className='flex-1'>
                <h3 className='font-medium text-gray-900'>{user?.name}</h3>
                <p className='text-sm text-gray-500'>
                  {user?.email || user?.mobileNumber}
                </p>
                <p className='text-xs text-gray-400'>
                  Member since{" "}
                  {new Date(
                    user?.memberSince || Date.now()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center text-sm'>
                <MapPin className='h-4 w-4 text-gray-400 mr-2' />
                <span className='text-gray-600'>
                  {user?.address?.district && user?.address?.division
                    ? `${user?.address?.district}, ${user?.address?.division}`
                    : "Address not set"}
                </span>
              </div>
              <div className='flex items-center text-sm'>
                <Calendar className='h-4 w-4 text-gray-400 mr-2' />
                <span className='text-gray-600'>
                  {user?.dateOfBirth || "Birthdate not set"}
                </span>
              </div>
            </div>

            <Link href='/account/profile'>
              <Button variant='outline' className='w-full'>
                <Edit className='h-4 w-4 mr-2' />
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center'>
                <Package className='h-5 w-5 mr-2' />
                Recent Orders
              </CardTitle>
              <Link href='/account/orders'>
                <Button variant='ghost' size='sm'>
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className='space-y-4'>
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-4'>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {order.id}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {new Date(order.date).toLocaleDateString()} •{" "}
                            {order.items} items
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium text-gray-900'>
                        ৳{order.total}
                      </p>
                      <Link href={`/order/${order.id}`}>
                        <Button variant='ghost' size='sm'>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  No orders yet
                </h3>
                <p className='text-gray-500 mb-4'>
                  Start shopping to see your orders here
                </p>
                <Link href='/'>
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <TrendingUp className='h-5 w-5 mr-2' />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Link href='/account/orders'>
              <Button
                variant='outline'
                className='w-full h-16 flex flex-col items-center justify-center space-y-2'>
                <ShoppingBag className='h-6 w-6' />
                <span>View Orders</span>
              </Button>
            </Link>

            <Link href='/account/wishlist'>
              <Button
                variant='outline'
                className='w-full h-16 flex flex-col items-center justify-center space-y-2'>
                <Heart className='h-6 w-6' />
                <span>My Wishlist</span>
              </Button>
            </Link>

            <Link href='/account/profile'>
              <Button
                variant='outline'
                className='w-full h-16 flex flex-col items-center justify-center space-y-2'>
                <User className='h-6 w-6' />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDashboard;
