"use client";
// context/CartContext.tsx
import { Variation } from "@/data/types";
import { trackEvent } from "@/lib/firebase-event";
import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
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

  // Sync cart data with localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    trackEvent("add_to_cart", {
      item_id: item?.id,
      item_name: item?.name,
      price: item?.unitPrice,
      currency: "BDT",
    });
    setCart((prevCart) => {
      const foundObject = prevCart.find((itemY) => {
        if (itemY.id === item.id) {
          if (itemY.hasVariation && item?.hasVariation) {
            return itemY.variation?.id === item?.variation?.id;
          }
          return false;
        }
      });
      if (foundObject) {
        prevCart.forEach((itemX) => {
          if (itemX.id === item.id) {
            const totalPrice = itemX.unitPrice * (Number(itemX.quantity) + 1);
            itemX = {
              ...itemX,
              totalPrice,
              quantity: itemX.quantity++,
              discount:
                (itemX.unitPrice - (item.updatedPrice ?? 0)) *
                (itemX.quantity + 1),
            };
          }
        });
        return prevCart;
      } else return [...prevCart, item];
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

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
