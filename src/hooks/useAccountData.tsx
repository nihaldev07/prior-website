import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { accountService } from "@/services/accountService";

interface AccountStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
  wishlistItems: number;
  accountStatus: string;
}

interface RecentOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

export const useAccountData = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<AccountStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    accountStatus: "Active",
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = async () => {
    if (!authState.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch account stats and recent orders in parallel
      const [ordersResponse] = await Promise.all([
        // accountService.getAccountStats(authState.token),
        accountService.getUserOrders(authState.token),
      ]);

      // if (statsResponse.success) {
      //   setStats(statsResponse.data);
      // }

      if (ordersResponse.success) {
        // Get the 3 most recent orders
        const recent = !ordersResponse?.data?.orders
          ? []
          : ordersResponse.data?.orders
              .sort((a, b) => Number(b.orderNumber) - Number(a.orderNumber))
              .map((order) => ({
                id: order.orderNumber,
                date: order.createdAt,
                status: order.status,
                total: order.totalPrice,
                items: order.itemCount,
              }));
        setRecentOrders(recent);
      }
    } catch (err) {
      console.error("Error fetching account data:", err);
      setError("Failed to load account data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.token]);

  const refetch = () => {
    fetchAccountData();
  };

  return {
    stats,
    recentOrders,
    isLoading,
    error,
    refetch,
  };
};
