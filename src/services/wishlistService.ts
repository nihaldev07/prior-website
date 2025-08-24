import { hostName } from "@/utils/config";

export interface WishlistAPIItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  thumbnail: string;
  category: string;
  description?: string;
  sku?: string;
  dateAdded: string;
  isAvailable: boolean;
  stock: number;
  variation?: {
    id: string;
    name: string;
    value: string;
  };
}

interface WishlistResponse {
  success: boolean;
  data: WishlistAPIItem[];
  message: string;
}

interface WishlistActionResponse {
  success: boolean;
  message: string;
}

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (token: string): Promise<WishlistResponse> => {
    try {
      const response = await fetch(`${hostName}/prior/customer/wishlist`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch wishlist");
      }

      return data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  // Add item to wishlist
  addToWishlist: async (productId: string, variationId?: string, token?: string): Promise<WishlistActionResponse> => {
    try {
      const body: any = { productId };
      if (variationId) {
        body.variationId = variationId;
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${hostName}/prior/customer/wishlist/add`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to wishlist");
      }

      return data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  // Remove item from wishlist
  removeFromWishlist: async (itemId: string, token: string): Promise<WishlistActionResponse> => {
    try {
      const response = await fetch(`${hostName}/prior/customer/wishlist/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove from wishlist");
      }

      return data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  // Clear entire wishlist
  clearWishlist: async (token: string): Promise<WishlistActionResponse> => {
    try {
      const response = await fetch(`${hostName}/prior/customer/wishlist/clear`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to clear wishlist");
      }

      return data;
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  },

  // Check if item is in wishlist
  checkWishlistStatus: async (productId: string, variationId?: string, token?: string): Promise<{ isInWishlist: boolean; wishlistItemId?: string }> => {
    try {
      const params = new URLSearchParams({ productId });
      if (variationId) {
        params.append('variationId', variationId);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${hostName}/prior/customer/wishlist/check?${params.toString()}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        return { isInWishlist: false };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking wishlist status:", error);
      return { isInWishlist: false };
    }
  },

  // Move wishlist item to cart
  moveToCart: async (wishlistItemId: string, quantity: number = 1, token: string): Promise<WishlistActionResponse> => {
    try {
      const response = await fetch(`${hostName}/prior/customer/wishlist/move-to-cart`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlistItemId,
          quantity,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to move to cart");
      }

      return data;
    } catch (error) {
      console.error("Error moving to cart:", error);
      throw error;
    }
  },
};