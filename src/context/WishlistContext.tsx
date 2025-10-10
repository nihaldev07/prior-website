"use client";

import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { Variation } from "@/data/types";
import { wishlistService, WishlistAPIItem } from "@/services/wishlistService";

// Define types for wishlist item and context
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  category: string;
  inStock: boolean;
  dateAdded: string;
  sku?: string;
  description?: string;
  originalPrice?: number;
  variation: Variation;
  slug?: string;
  discountPercentage?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<boolean>;
  removeFromWishlist: (itemId: string) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  isInWishlist: (itemId: string) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}

// Create Wishlist Context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// Custom hook to use Wishlist Context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// Wishlist Provider Component
export const WishlistProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const { authState } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist data when user logs in
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadWishlist();
    } else {
      // Load from localStorage for guest users
      loadGuestWishlist();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated, authState.user]);

  const loadWishlist = async () => {
    if (!authState.token) return;

    setIsLoading(true);
    try {
      const response = await wishlistService.getWishlist(authState.token);

      if (response.success) {
        // Convert API items to internal format
        const items: WishlistItem[] = response.data.map(
          (apiItem: WishlistAPIItem) => ({
            id: apiItem.id,
            name: apiItem.name,
            price: apiItem.price,
            thumbnail: apiItem.thumbnail,
            category: apiItem.category,
            inStock: apiItem.isAvailable,
            dateAdded: apiItem.dateAdded,
            sku: apiItem.sku,
            description: apiItem.description,
            originalPrice: apiItem.originalPrice,
            variation: apiItem.variation
              ? {
                  id: apiItem.variation.id,
                  size: apiItem.variation.value, // Map value to size
                  color: "", // Default empty
                  sku: apiItem.sku || "",
                  unitPrice: apiItem.price,
                  quantity: 1, // Default quantity
                }
              : {
                  id: "",
                  size: "",
                  color: "",
                  sku: apiItem.sku || "",
                  unitPrice: apiItem.price,
                  quantity: 1,
                },
            discountPercentage: apiItem.discountPercentage,
          })
        );
        setWishlist(items);
        setWishlistIds(new Set(items.map((item) => item.id)));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      // Fallback to localStorage
      loadGuestWishlist();
    } finally {
      setIsLoading(false);
    }
  };

  const loadGuestWishlist = () => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("guestWishlist");
      if (savedWishlist) {
        try {
          const items = JSON.parse(savedWishlist);
          setWishlist(items);
          setWishlistIds(new Set(items.map((item: WishlistItem) => item.id)));
        } catch (error) {
          console.error("Failed to parse guest wishlist:", error);
          setWishlist([]);
          setWishlistIds(new Set());
        }
      }
    }
  };

  const saveGuestWishlist = (items: WishlistItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guestWishlist", JSON.stringify(items));
    }
  };

  const addToWishlist = async (item: WishlistItem): Promise<boolean> => {
    // Check if item already exists
    if (wishlist.some((w) => w.id === item.id)) {
      return false; // Already in wishlist
    }

    const newItem = {
      ...item,
      dateAdded: new Date().toISOString(),
    };

    if (authState.isAuthenticated && authState.token) {
      setIsLoading(true);
      try {
        const response = await wishlistService.addToWishlist(
          item.id,
          item.variation?.id,
          authState.token
        );

        if (response.success) {
          setWishlist((prev) => [...prev, newItem]);
          setWishlistIds((prev) => new Set(prev).add(item.id));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user - save to localStorage
      const updatedWishlist = [...wishlist, newItem];
      setWishlist(updatedWishlist);
      setWishlistIds((prev) => new Set(prev).add(item.id));
      saveGuestWishlist(updatedWishlist);
      return true;
    }
  };

  const removeFromWishlist = async (itemId: string): Promise<boolean> => {
    if (authState.isAuthenticated && authState.token) {
      setIsLoading(true);
      try {
        const response = await wishlistService.removeFromWishlist(
          itemId,
          authState.token
        );

        if (response.success) {
          setWishlist((prev) => prev.filter((item) => item.id !== itemId));
          setWishlistIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user - remove from localStorage
      const updatedWishlist = wishlist.filter((item) => item.id !== itemId);
      setWishlist(updatedWishlist);
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      saveGuestWishlist(updatedWishlist);
      return true;
    }
  };

  const clearWishlist = async (): Promise<boolean> => {
    if (authState.isAuthenticated && authState.token) {
      setIsLoading(true);
      try {
        const response = await wishlistService.clearWishlist(authState.token);

        if (response.success) {
          setWishlist([]);
          setWishlistIds(new Set());
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to clear wishlist:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Guest user - clear localStorage
      setWishlist([]);
      setWishlistIds(new Set());
      saveGuestWishlist([]);
      return true;
    }
  };

  const isInWishlist = useCallback(
    (itemId: string): boolean => {
      return wishlistIds.has(itemId); // O(1) lookup instead of O(n)
    },
    [wishlistIds]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        isLoading,
      }}>
      {children}
    </WishlistContext.Provider>
  );
};
