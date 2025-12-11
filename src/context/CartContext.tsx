"use client";
// context/CartContext.tsx
import { Variation } from "@/data/types";
import { trackEvent } from "@/lib/firebase-event";
import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Define types for cart item and cart context
export interface CartItem {
  id: string;
  sku: string;
  name: string;
  active: boolean;
  quantity: number;
  unitPrice: number;
  manufactureId: string;
  updatedPrice?: number;
  hasDiscount?: boolean;
  discountType?: string;
  discount: number;
  description: string;
  thumbnail: string;
  productCode: string;
  totalPrice: number;
  categoryName?: string;
  hasVariation?: boolean;
  variation: Variation;
  maxQuantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  bulkUpdateCart: (items: CartItem[]) => void;
}

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Cart Provider Component
//@ts-ignore
export const CartProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Retrieve initial cart data from localStorage
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Debounced save to localStorage
  const debouncedSave = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (cartData: CartItem[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify(cartData));
      }, 500); // Save after 500ms of no changes
    };
  }, []);

  // Sync cart data with localStorage whenever the cart changes
  useEffect(() => {
    debouncedSave(cart);
  }, [cart, debouncedSave]);

  // Save immediately on unmount to avoid data loss
  useEffect(() => {
    return () => {
      localStorage.setItem("cart", JSON.stringify(cart));
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (item: CartItem) => {
    trackEvent("add_to_cart", {
      item_id: item?.id,
      item_name: item?.name,
      price: item?.unitPrice,
      currency: "BDT",
    });
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((itemY) => {
        if (itemY.id === item.id) {
          if (itemY.hasVariation && item?.hasVariation) {
            return itemY.variation?.id === item?.variation?.id;
          }
          return !itemY.hasVariation;
        }
        return false;
      });

      if (existingIndex !== -1) {
        // Create new array with updated item (immutable)
        return prevCart.map((itemX, idx) => {
          if (idx === existingIndex) {
            const newQuantity = itemX.quantity + 1;
            const totalPrice = itemX.unitPrice * newQuantity;
            const discount =
              (itemX.unitPrice - (itemX.updatedPrice ?? 0)) * newQuantity;

            return {
              ...itemX,
              quantity: newQuantity,
              totalPrice,
              discount,
            };
          }
          return itemX;
        });
      }

      // Add new item
      return [...prevCart, item];
    });
  };

  const updateToCart = (item: CartItem) => {
    setCart((prevCart) => {
      return prevCart.map((itemX) => {
        if (itemX.id === item.id) {
          if (
            itemX.hasVariation &&
            item?.hasVariation &&
            itemX.variation?.id === item?.variation?.id
          ) {
            return item;
          }
          return itemX;
        } else {
          return itemX;
        }
      });
    });
  };

  const removeFromCart = (index: number) => {
    if (index < 0) return;
    const item = cart[index];
    if (!!item)
      trackEvent("remove_from_cart", {
        item_id: item?.id,
        item_name: item?.name,
        price: item?.unitPrice,
        variation: item?.variation ?? "no variation",
        currency: "BDT",
      });
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const bulkUpdateCart = (items: CartItem[]) => {
    setCart(items);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateToCart, bulkUpdateCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
