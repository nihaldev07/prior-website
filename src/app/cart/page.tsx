"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem, useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/firebase-event";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatVariant } from "@/utils/functions";

const CartPage = () => {
  const { cart, removeFromCart, updateToCart } = useCart();

  trackEvent("view_cart", {
    currency: "BDT",
    value: cart.reduce((sum, cartdata) => {
      sum =
        Number(sum) +
        Number(cartdata.quantity) *
          Number(
            !!cartdata?.hasDiscount
              ? (cartdata?.updatedPrice ?? cartdata?.unitPrice)
              : cartdata?.unitPrice,
          );
      return sum;
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
        <div className='flex gap-4 py-6'>
          {/* Product Image */}
          <Link
            href={`/collections/${id}`}
            className='relative h-32 w-32 shrink-0 overflow-hidden rounded-sm bg-neutral-50 border border-neutral-200'>
            <Image
              fill
              src={thumbnail}
              alt={name}
              className='object-contain p-2 transition-transform duration-300 group-hover:scale-105'
            />
          </Link>

          {/* Product Details */}
          <div className='flex flex-1 flex-col justify-between'>
            <div className='space-y-2'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <Link
                    href={`/collections/${id}`}
                    className='font-serif tracking-wide text-neutral-900 hover:text-neutral-700 transition-colors duration-300 line-clamp-2'>
                    {name}
                  </Link>
                  <p className='text-sm font-serif tracking-wide text-neutral-500 mt-1'>
                    {categoryName}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className='text-neutral-400 hover:text-red-600 transition-colors duration-300 p-1 rounded-none hover:bg-red-50'
                  aria-label='Remove item'>
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>

              {/* Variant Info */}
              {variation && (
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    {formatVariant(variation)}
                  </Badge>
                </div>
              )}

              {/* Price */}
              <div className='flex items-baseline gap-2'>
                <span className='text-lg font-serif tracking-wide text-neutral-900'>
                  ৳{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && unitPrice > currentPrice && (
                  <span className='text-sm font-serif tracking-wide text-neutral-400 line-through'>
                    ৳{unitPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Controls & Item Total */}
            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center border border-neutral-300 rounded-none'>
                <button
                  onClick={() => handleQuantityChange(item, -1)}
                  disabled={quantity <= 1}
                  className='p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-none'>
                  <Minus className='w-4 h-4' />
                </button>
                <span className='px-4 py-2 min-w-[3rem] text-center font-serif tracking-wide'>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item, 1)}
                  disabled={quantity >= (maxQuantity || 999)}
                  className='p-2 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 rounded-none'>
                  <Plus className='w-4 h-4' />
                </button>
              </div>

              <div className='text-right'>
                <p className='text-sm font-serif tracking-wide text-neutral-500'>
                  Item Total
                </p>
                <p className='text-lg font-serif tracking-wide text-neutral-900'>
                  ৳{itemTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator />
      </div>
    );
  };

  const handleCheckoutClick = () => {
    const totalValue = cart.reduce((sum, cartdata) => {
      sum =
        Number(sum) +
        Number(cartdata.quantity) *
          Number(
            !!cartdata?.hasDiscount
              ? (cartdata?.updatedPrice ?? cartdata?.unitPrice)
              : cartdata?.unitPrice,
          );
      return sum;
    }, 0);
    trackEvent("begin_checkout", {
      affiliation: "Web-Site",
      Value: totalValue ?? 0,
      coupon: "",
      currency: "BDT",
      items: cart?.map((product, index) => {
        return {
          item_id: product?.sku,
          item_name: product?.name,
          affiliation: "Prior Web-site Store",
          coupon: "",
          discount: product?.discount,
          index,
          item_brand: "Prior",
          item_category: product?.categoryName ?? "",
          item_category2: "",
          item_category3: "",
          item_category4: "",
          item_category5: "",
          item_list_id: product?.id,
          item_list_name: "Related Products",
          item_variant: formatVariant(product?.variation),
          location_id: "",
          price: product?.unitPrice,
          quantity: product?.quantity,
        };
      }),
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
          !!item?.hasDiscount
            ? (item?.updatedPrice ?? item?.unitPrice)
            : item?.unitPrice,
        )
    );
  }, 0);

  return (
    <div className='min-h-screen bg-neutral-50'>
      <div className='max-w-7xl mx-auto px-4 py-8 sm:py-12'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-serif tracking-wide text-neutral-900 mb-2'>
            Shopping Cart
          </h1>
          <p className='text-neutral-600 font-serif tracking-wide'>
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-none border border-neutral-200 p-6'>
                {cart.map((item, index) => renderProduct(item, index))}
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-none border border-neutral-200 p-6 sticky top-24'>
                <h2 className='text-xl font-serif tracking-wide text-neutral-900 mb-6'>
                  Order Summary
                </h2>

                <div className='space-y-4 mb-6'>
                  <div className='flex justify-between text-neutral-600'>
                    <span className='font-serif tracking-wide'>Subtotal</span>
                    <span className='font-serif tracking-wide'>
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className='flex justify-between text-emerald-700'>
                      <span className='font-serif tracking-wide'>Discount</span>
                      <span className='font-serif tracking-wide'>
                        -৳{discount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className='flex justify-between text-neutral-600'>
                    <span className='font-serif tracking-wide'>Shipping</span>
                    <span className='font-serif tracking-wide text-sm'>
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <Separator className='my-4' />

                <div className='flex justify-between items-center mb-6'>
                  <span className='text-lg font-serif tracking-wide text-neutral-900'>
                    Total
                  </span>
                  <span className='text-2xl font-serif tracking-wide text-neutral-900'>
                    ৳{total.toLocaleString()}
                  </span>
                </div>

                <Link href='/checkout' onClick={handleCheckoutClick}>
                  <Button
                    className='w-full h-12 text-sm font-serif tracking-[0.15em] uppercase rounded-none bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-300'
                    size='lg'>
                    Proceed to Checkout
                    <ArrowRight className='w-5 h-5 ml-2' />
                  </Button>
                </Link>

                <Link
                  href='/collections'
                  className='block text-center text-sm font-serif tracking-wide text-neutral-600 hover:text-neutral-900 mt-4 transition-colors duration-300'>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <div className='bg-white rounded-none border border-neutral-200 p-12 text-center'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 bg-neutral-100 rounded-none flex items-center justify-center mx-auto mb-6'>
                <ShoppingBag className='w-12 h-12 text-neutral-400' />
              </div>
              <h2 className='text-2xl font-serif tracking-wide text-neutral-900 mb-2'>
                Your cart is empty
              </h2>
              <p className='text-neutral-600 font-serif tracking-wide mb-6'>
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link href='/collections'>
                <Button
                  size='lg'
                  className='font-serif tracking-[0.15em] uppercase rounded-none bg-neutral-900 hover:bg-neutral-800 text-white transition-colors duration-300'>
                  Start Shopping
                  <ArrowRight className='w-5 h-5 ml-2' />
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
