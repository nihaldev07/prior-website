import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Variation } from '@/data/types';
import { trackEvent } from '@/lib/firebase-event';

// Cart item interface (from CartContext)
export interface CartItem {
  id: string;
  sku: string;
  name: string;
  active: boolean;
  quantity: number;
  unitPrice: number;
  updatedPrice?: number;
  discount: number;
  thumbnail: string;
  productCode: string;
  totalPrice: number;
  variation: Variation;
  maxQuantity: number;
  hasVariation?: boolean;
}

interface CartStore {
  // State
  cart: CartItem[];

  // Actions
  addToCart: (item: CartItem) => void;
  updateToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  bulkUpdateCart: (items: CartItem[]) => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],

      // Add item to cart
      addToCart: (item: CartItem) => {
        // Track Firebase Analytics event
        trackEvent('add_to_cart', {
          item_id: item?.id,
          item_name: item?.name,
          price: item?.unitPrice,
          currency: 'BDT',
        });

        set((state) => {
          // Find existing item (considering variations)
          const existingIndex = state.cart.findIndex((cartItem) => {
            if (cartItem.id === item.id) {
              if (cartItem.hasVariation && item?.hasVariation) {
                return cartItem.variation?.id === item?.variation?.id;
              }
              return !cartItem.hasVariation;
            }
            return false;
          });

          if (existingIndex !== -1) {
            // Update existing item quantity
            const updatedCart = state.cart.map((cartItem, idx) => {
              if (idx === existingIndex) {
                const newQuantity = cartItem.quantity + 1;
                const totalPrice = cartItem.unitPrice * newQuantity;
                const discount =
                  (cartItem.unitPrice - (cartItem.updatedPrice ?? 0)) * newQuantity;

                return {
                  ...cartItem,
                  quantity: newQuantity,
                  totalPrice,
                  discount,
                };
              }
              return cartItem;
            });

            return { cart: updatedCart };
          }

          // Add new item
          return { cart: [...state.cart, item] };
        });
      },

      // Update cart item
      updateToCart: (item: CartItem) => {
        set((state) => ({
          cart: state.cart.map((cartItem) => {
            if (cartItem.id === item.id) {
              if (
                cartItem.hasVariation &&
                item?.hasVariation &&
                cartItem.variation?.id === item?.variation?.id
              ) {
                return item;
              }
              return cartItem;
            }
            return cartItem;
          }),
        }));
      },

      // Remove item from cart
      removeFromCart: (index: number) => {
        if (index < 0) return;

        const state = get();
        const item = state.cart[index];

        if (item) {
          trackEvent('remove_from_cart', {
            item_id: item?.id,
            item_name: item?.name,
            price: item?.unitPrice,
            variation: item?.variation ?? 'no variation',
            currency: 'BDT',
          });
        }

        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        }));
      },

      // Clear entire cart
      clearCart: () => {
        set({ cart: [] });
      },

      // Bulk update cart (for checkout verification)
      bulkUpdateCart: (items: CartItem[]) => {
        set({ cart: items });
      },

      // Get total number of items
      getTotalItems: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Get total price
      getTotalPrice: () => {
        const state = get();
        return state.cart.reduce((total, item) => {
          const price = item.updatedPrice ?? item.unitPrice;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
