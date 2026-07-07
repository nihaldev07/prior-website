"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem, useCart } from "@/context/CartContext";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Lock,
  ShieldCheck,
  RefreshCcw,
  Truck,
  Sparkles,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { trackCustomEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVariant } from "@/utils/functions";

const CartPage = () => {
  const { cart, removeFromCart, updateToCart } = useCart();

  trackCustomEvent("view_cart", {
    currency: "BDT",
    value: cart.reduce((sum, cartdata) => {
      return (
        Number(sum) +
        Number(cartdata.quantity) *
          Number(
            cartdata?.hasDiscount
              ? (cartdata?.updatedPrice ?? cartdata?.unitPrice)
              : cartdata?.unitPrice,
          )
      );
    }, 0),
  });

  const handleQuantityChange = (item: CartItem, change: number) => {
    const newQuantity = Math.max(
      1,
      Math.min(item.maxQuantity || 999, item.quantity + change),
    );
    updateToCart({
      ...item,
      quantity: newQuantity,
      totalPrice:
        Number(
          item.hasDiscount
            ? (item.updatedPrice ?? item.unitPrice)
            : item.unitPrice,
        ) * newQuantity,
    });
  };

  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.quantity) * Number(item.unitPrice);
  }, 0);

  const discount = cart.reduce((sum, item) => {
    return (
      sum +
      Number(item.quantity) *
        (Number(item.unitPrice) - Number(item.updatedPrice ?? item.unitPrice))
    );
  }, 0);

  const total = cart.reduce((sum, item) => {
    return (
      sum +
      Number(item.quantity) *
        Number(
          item?.hasDiscount
            ? (item?.updatedPrice ?? item?.unitPrice)
            : item?.unitPrice,
        )
    );
  }, 0);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderProduct = (item: CartItem, index: number) => {
    const {
      id,
      name,
      thumbnail,
      unitPrice,
      hasDiscount = false,
      updatedPrice,
      categoryName,
      quantity,
      variation,
      maxQuantity,
    } = item;

    const currentPrice = hasDiscount ? (updatedPrice ?? unitPrice) : unitPrice;
    const itemTotal = Number(currentPrice) * quantity;

    return (
      <div key={index} className='group'>
        <div className='flex gap-4 py-5'>
          {/* Product Image */}
          <Link
            href={`/collections/${id}`}
            className='relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors duration-200'>
            <Image
              fill
              src={thumbnail}
              alt={name}
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
          </Link>

          {/* Product Details */}
          <div className='flex flex-1 flex-col justify-between min-w-0'>
            <div className='space-y-1.5'>
              {/* Name Row */}
              <div className='flex items-start justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                  <Link
                    href={`/collections/${id}`}
                    className='font-medium text-sm text-neutral-900 hover:text-neutral-600 transition-colors duration-200 line-clamp-2 leading-snug'>
                    {name}
                  </Link>
                  <p className='text-xs text-neutral-400 mt-0.5 tracking-wide'>
                    {categoryName}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className='text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 p-1.5 rounded-md flex-shrink-0'
                  aria-label='Remove item'>
                  <Trash2 className='w-4 h-4' />
                </button>
              </div>

              {/* Variant Badge */}
              {variation && (
                <Badge
                  variant='secondary'
                  className='text-[11px] px-2 py-0.5 bg-neutral-100 text-neutral-500 border-0 rounded-md font-normal'>
                  {formatVariant(variation)}
                </Badge>
              )}

              {/* Price */}
              <div className='flex items-baseline gap-2'>
                <span className='text-sm font-semibold text-neutral-900'>
                  ৳{Number(currentPrice).toLocaleString()}
                </span>
                {hasDiscount && unitPrice > currentPrice && (
                  <span className='text-xs text-neutral-400 line-through'>
                    ৳{Number(unitPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls & Item Total */}
            <div className='flex items-center justify-between mt-3'>
              <div className='flex items-center border border-neutral-200 rounded-lg overflow-hidden'>
                <button
                  onClick={() => handleQuantityChange(item, -1)}
                  disabled={quantity <= 1}
                  className='w-8 h-8 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 text-neutral-600'
                  aria-label='Decrease quantity'>
                  <Minus className='w-3.5 h-3.5' />
                </button>
                <span className='w-8 h-8 flex items-center justify-center text-sm font-medium text-neutral-900 border-x border-neutral-200'>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item, 1)}
                  disabled={quantity >= (maxQuantity || 999)}
                  className='w-8 h-8 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 text-neutral-600'
                  aria-label='Increase quantity'>
                  <Plus className='w-3.5 h-3.5' />
                </button>
              </div>

              <div className='text-right'>
                <p className='text-[11px] text-neutral-400 mb-0.5'>
                  Item total
                </p>
                <p className='text-sm font-semibold text-neutral-900'>
                  ৳{itemTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider — hidden for last item */}
        {index < cart.length - 1 && (
          <div className='border-t border-neutral-100' />
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='max-w-5xl mx-auto px-4 py-8 sm:py-12'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-semibold text-neutral-900 tracking-tight'>
            Shopping cart
          </h1>
          <div className='inline-flex items-center gap-1.5 text-sm text-neutral-500 bg-white border border-neutral-200 px-3 py-1 rounded-full mt-3'>
            <ShoppingCart className='w-3.5 h-3.5' />
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>

        {cart.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-xl border border-neutral-200 px-6'>
                {cart.map((item, index) => renderProduct(item, index))}
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-xl border border-neutral-200 p-6 sticky top-6'>
                <h2 className='text-base font-semibold text-neutral-900 mb-5 tracking-tight'>
                  Order summary
                </h2>

                <div className='space-y-3 mb-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-neutral-500'>
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className='text-neutral-900 font-medium'>
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className='flex justify-between text-sm'>
                      <span className='flex items-center gap-1 text-emerald-600'>
                        <Tag className='w-3.5 h-3.5' />
                        Discount
                      </span>
                      <span className='text-emerald-600 font-medium'>
                        − ৳{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className='flex justify-between text-sm'>
                    <span className='text-neutral-500'>Shipping</span>
                    <span className='text-neutral-400 text-xs self-center'>
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                {/* Savings pill */}
                {discount > 0 && (
                  <div className='inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full mb-4'>
                    <Sparkles className='w-3 h-3' />
                    You&apos;re saving ৳{discount.toLocaleString()}
                  </div>
                )}

                <div className='border-t border-neutral-100 pt-4 mb-5'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-semibold text-neutral-900'>
                      Total
                    </span>
                    <span className='text-xl font-bold text-neutral-900'>
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href='/checkout'
                  onClick={() => {
                    // begin_checkout fires on /checkout arrival (Facebook InitiateCheckout standard)
                  }}>
                  <Button
                    size='lg'
                    className='w-full h-11 text-xs font-medium tracking-[0.12em] uppercase rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-200 gap-2'>
                    <Lock className='w-3.5 h-3.5' />
                    Proceed to checkout
                    <ArrowRight className='w-4 h-4' />
                  </Button>
                </Link>

                <Link
                  href='/collections'
                  className='block text-center text-xs text-neutral-400 hover:text-neutral-700 mt-3 transition-colors duration-200 underline underline-offset-2'>
                  Continue shopping
                </Link>

                {/* Trust Badges */}
                {/* <div className='flex gap-2 mt-5 pt-5 border-t border-neutral-100'>
                  {[
                    { icon: ShieldCheck, label: "Secure payment" },
                    { icon: RefreshCcw, label: "Easy returns" },
                    { icon: Truck, label: "Fast delivery" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className='flex-1 flex flex-col items-center gap-1.5 text-[10px] text-neutral-400 text-center'>
                      <Icon className='w-4 h-4 text-neutral-400' />
                      {label}
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className='bg-white rounded-xl border border-neutral-200 py-20 px-6 text-center'>
            <div className='max-w-xs mx-auto flex flex-col items-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center'>
                <ShoppingBag className='w-7 h-7 text-neutral-400' />
              </div>
              <div>
                <h2 className='text-lg font-semibold text-neutral-900 mb-1'>
                  Your cart is empty
                </h2>
                <p className='text-sm text-neutral-500 leading-relaxed'>
                  Looks like you haven&apos;t added anything yet. Start browsing
                  to find something you&apos;ll love.
                </p>
              </div>
              <Link href='/collections'>
                <Button
                  size='lg'
                  className='h-10 px-6 text-xs font-medium tracking-[0.12em] uppercase rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-200 gap-2 mt-2'>
                  Start shopping
                  <ArrowRight className='w-4 h-4' />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
