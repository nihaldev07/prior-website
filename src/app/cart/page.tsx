"use client";
import Image from "next/image";
import Link from "next/link";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import InputNumber from "@/shared/InputNumber/InputNumber";
import { CartItem, useCart } from "@/context/CartContext";
import { Cat, Star, Trash } from "lucide-react";
import { trackEvent } from "@/lib/firebase-event";
import { Badge } from "@/components/ui/badge";
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
              ? cartdata?.updatedPrice ?? cartdata?.unitPrice
              : cartdata?.unitPrice
          );
      return sum;
    }, 0),
  });

  const renderProduct = (
    item: CartItem,
    index: number,
    removeFromCart: (id: number) => void
  ) => {
    const {
      id,
      name,
      thumbnail,
      unitPrice,
      hasDiscount = false,
      updatedPrice,
      discountType = "%",
      categoryName,
      quantity,
      variation,
    } = item;

    return (
      <div key={index} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            fill
            src={thumbnail}
            alt={name}
            className="h-full w-full object-contain object-center"
          />
          <Link className="absolute inset-0" href={`/products/${id}`} />
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="font-medium md:text-2xl ">
                  <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <div className="flex items-center gap-1">
                  <Badge variant={"outline"}>{formatVariant(variation)}</Badge>
                </div>
              </div>
              <span className="font-medium md:text-xl">
                ৳ {hasDiscount ? updatedPrice ?? unitPrice : unitPrice}
              </span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div
              className="flex items-center gap-3"
              onClick={() => removeFromCart(index)}
            >
              <Trash className=" size-5 " />
            </div>
            <div>
              <InputNumber
                defaultValue={quantity}
                min={1}
                max={item?.maxQuantity}
                onChange={(value) => {
                  updateToCart({
                    ...item,
                    quantity: value,
                    totalPrice:
                      Number(
                        hasDiscount ? updatedPrice ?? unitPrice : unitPrice
                      ) * Number(value),
                  });
                }}
              />
            </div>
          </div>
        </div>
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
              ? cartdata?.updatedPrice ?? cartdata?.unitPrice
              : cartdata?.unitPrice
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

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-14">
          <h2 className="block text-2xl font-medium sm:text-3xl lg:text-4xl">
            Your Cart
          </h2>
        </div>

        <hr className="my-10 border-neutral-300 xl:my-12" />

        {cart.length > 0 && (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full divide-y divide-neutral-300 lg:w-[60%] xl:w-[55%]">
              {cart.map((item, index) =>
                renderProduct(item, index, removeFromCart)
              )}
            </div>
            <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:mx-16 2xl:mx-20" />
            <div className="flex-1">
              <div className="sticky top-28">
                <h3 className="text-2xl font-semibold">Summary</h3>
                <div className="mt-7 divide-y divide-neutral-300 text-sm">
                  <div>
                    <div className="flex justify-between pb-4">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {cart.reduce((sum, cartdata) => {
                          sum =
                            Number(sum) +
                            Number(cartdata.quantity) *
                              Number(cartdata.unitPrice);
                          return sum;
                        }, 0)}
                      </span>
                    </div>

                    <div className="flex justify-between pb-4">
                      <span>Discount</span>
                      <span className="font-semibold">
                        ৳
                        {cart.reduce((sum, cartdata) => {
                          sum =
                            Number(sum) +
                            Number(cartdata.quantity) *
                              (Number(cartdata.unitPrice) -
                                Number(cartdata.updatedPrice ?? 0));
                          return sum;
                        }, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 text-base font-semibold">
                    <span>Total</span>
                    <span>
                      ৳
                      {cart.reduce((sum, cartdata) => {
                        sum =
                          Number(sum) +
                          Number(cartdata.quantity) *
                            Number(
                              !!cartdata?.hasDiscount
                                ? cartdata?.updatedPrice ?? cartdata?.unitPrice
                                : cartdata?.unitPrice
                            );
                        return sum;
                      }, 0)}
                    </span>
                  </div>
                </div>
                <ButtonPrimary
                  href={"/checkout"}
                  onClick={() => handleCheckoutClick()}
                  className="mt-8 w-full"
                >
                  Checkout Now
                </ButtonPrimary>
              </div>
            </div>
          </div>
        )}
        {cart.length < 1 && (
          <div className="rounded-lg w-full p-10 sm:p-28 text-base sm:text-lg bg-gray-100 flex justify-center items-center">
            <Cat className="size-10 mr-2" /> No Product Added in cart
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
