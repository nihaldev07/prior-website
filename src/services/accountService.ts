import { hostName } from "@/utils/config";

interface OrderResponse {
  success: boolean;
  data: {
    orders: Array<{
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
    }>;
  };
  message: string;
}

interface OrderDetailsResponse {
  success: boolean;
  data: {
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
    paymentMethod: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      thumbnail: string;
      sku: string;
    }>;
    shippingAddress: {
      name: string;
      address: string;
      district: string;
      division: string;
      postalCode: string;
    };
    billingAddress: {
      name: string;
      address: string;
      district: string;
      division: string;
      postalCode: string;
    };
    orderTracking: Array<{
      status: string;
      date: string;
      description: string;
    }>;
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
  };
  message: string;
}

interface AccountStatsResponse {
  success: boolean;
  data: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalSpent: number;
    wishlistItems: number;
    accountStatus: string;
  };
  message: string;
}

export const accountService = {
  // Get user orders
  getUserOrders: async (token: string): Promise<OrderResponse> => {
    try {
      const response = await fetch(`${hostName}/prior/customer/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Get single order details
  getOrderDetails: async (
    orderId: string,
    token: string
  ): Promise<OrderDetailsResponse> => {
    try {
      const response = await fetch(
        `${hostName}/prior/customer/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order details");
      }

      return data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  // // Get account statistics
  // getAccountStats: async (token: string): Promise<AccountStatsResponse> => {
  //   try {
  //     const response = await fetch(`${hostName}/prior/customer/stats`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to fetch account stats");
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching account stats:", error);
  //     throw error;
  //   }
  // },

  // Download order invoice
  downloadInvoice: async (orderId: string, token: string): Promise<Blob> => {
    try {
      const response = await fetch(
        `${hostName}/prior/customer/orders/${orderId}/invoice`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      return await response.blob();
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error;
    }
  },

  // Track order
  trackOrder: async (
    orderId: string,
    token: string
  ): Promise<{ success: boolean; trackingUrl?: string; message: string }> => {
    try {
      const response = await fetch(
        `${hostName}/prior/customer/orders/${orderId}/track`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get tracking information");
      }

      return data;
    } catch (error) {
      console.error("Error tracking order:", error);
      throw error;
    }
  },

  // Reorder
  reorder: async (
    orderId: string,
    token: string
  ): Promise<{ success: boolean; newOrderId?: string; message: string }> => {
    try {
      const response = await fetch(
        `${hostName}/prior/customer/orders/${orderId}/reorder`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reorder");
      }

      return data;
    } catch (error) {
      console.error("Error reordering:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (
    orderId: string,
    reason: string,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${hostName}/prior/customer/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel order");
      }

      return data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },
};
