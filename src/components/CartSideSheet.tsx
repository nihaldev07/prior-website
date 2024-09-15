"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";

import LikeButton from "./LikeButton";
import { CartItem, useCart } from "@/context/CartContext";
import { ShoppingCart, Star, Trash } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Badge } from "./ui/badge";

export interface CartSideBarProps {}
const CartSideBar: React.FC<CartSideBarProps> = () => {
  const { removeFromCart, cart } = useCart();
  const [isVisable, setIsVisable] = useState(false);

  const handleOpenMenu = () => setIsVisable(true);
  const handleCloseMenu = () => setIsVisable(false);

  const renderProduct = (item: CartItem) => {
    const { id, name, thumbnail, unitPrice, categoryName, quantity } = item;

    return (
      <div key={id} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl mr-2">
          <Image
            fill
            src={thumbnail}
            alt={name}
            className="h-full w-full rounded-xl object-fill object-center"
          />
          <Link
            onClick={handleCloseMenu}
            className="absolute inset-0"
            href={`/collections/${id}`}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="font-medium ">
                  <Link onClick={handleCloseMenu} href={`/products/${id}`}>
                    {name}
                  </Link>
                </h3>
                <span className="my-1 text-sm text-neutral-500">
                  {categoryName}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" />
                  <span className="text-sm">{5}</span>
                </div>
              </div>
              <span className=" font-medium">৳{unitPrice}</span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <Trash
                className="text-2xl"
                onClick={() => removeFromCart(item?.id)}
              />
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Qty: {quantity}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSideSheet = () => {
    return (
      <Sheet
        open={isVisable}
        onOpenChange={(open) => (open ? handleOpenMenu() : handleCloseMenu())}
      >
        <SheetContent className="p-0">
          <SheetHeader className="p-8 justify-start">
            <SheetTitle> Shopping Cart</SheetTitle>
          </SheetHeader>

          <div className="relative h-auto bg-white">
            <div className="hiddenScrollbar h-screen overflow-y-auto p-5">
              <div className="divide-y divide-neutral-300">
                {cart.map((item) => renderProduct(item))}
              </div>
            </div>
            <div className="absolute bottom-[100px] left-0 w-full bg-neutral-50 p-5">
              <p className="flex justify-between">
                <span>
                  <span className="font-medium">Subtotal</span>
                  <span className="block text-sm text-neutral-500">
                    Shipping calculated at checkout.
                  </span>
                </span>
                <span className="text-xl font-medium">
                  ৳
                  {cart.reduce((sum, cartdata) => {
                    sum =
                      Number(sum) +
                      Number(cartdata.quantity) * Number(cartdata.unitPrice);
                    return sum;
                  }, 0)}
                </span>
              </p>
              <div className="mt-5 flex items-center gap-5">
                <ButtonPrimary
                  href="/checkout"
                  onClick={() => handleCloseMenu()}
                  className="w-full flex-1"
                >
                  Checkout
                </ButtonPrimary>
                <ButtonSecondary
                  onClick={() => handleCloseMenu()}
                  href="/cart"
                  className="w-full flex-1 border-2 border-primary text-primary"
                >
                  View cart
                </ButtonSecondary>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  const renderContent = () => {
    return <>{renderSideSheet()}</>;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenMenu()}
        className=" sm:mx-5 flex items-center gap-1 rounded-full  p-2 text-primary focus:outline-none"
      >
        <div className="inline-block relative">
          <ShoppingCart className=" text-base text-slate-800 sm:text-2xl sm:text-primary" />{" "}
          <Badge
            variant="destructive"
            className=" absolute right-[-15px] top-[-10px] text-center items-center rounded-full px-1 py-0 sm:hidden"
          >
            {cart?.length > 99 ? "99+" : cart?.length}
          </Badge>
        </div>
        <span className="hidden text-sm lg:block">{cart.length} items</span>
      </button>

      {renderContent()}
    </>
  );
};

export default CartSideBar;
