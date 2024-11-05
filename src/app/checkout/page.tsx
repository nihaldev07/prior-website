"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import LikeButton from "@/components/LikeButton";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import InputNumber from "@/shared/InputNumber/InputNumber";

import PaymentMethod from "./PaymentMethod";
import { CartItem, useCart } from "@/context/CartContext";
import Swal from "sweetalert2";
import { createOrder } from "@/utils/orderFunctions";
import { bkashCheckout } from "@/utils/payment";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";
import { Loader2, Star, TrashIcon } from "lucide-react";
import UserInformation from "./userForm";
import TermsCondition from "./agreeToTerns";
import { trackEvent } from "@/lib/firebase-event";
import useAnalytics from "@/hooks/useAnalytics";
export interface UserFormData {
  name: string;
  mobileNumber: string;
  email?: string;
  district: string;
  division: string;
  address: string;
  postalCode?: string;
}
const CheckoutPage = () => {
  useAnalytics();
  const { cart, updateToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const [orderProducts, setOrderProduct] = useState<CartItem[]>([]);
  const [transectionData, setTransectionData] = useState({
    totalPrice: 0,
    paid: 0,
    remaining: 0,
    discount: 0,
    deliveryCharge: 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    mobileNumber: "",
    email: "",
    district: "",
    division: "",
    address: "",
    postalCode: "1234",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleInputChange2 = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const totalPrice = cart.reduce((sum, cartdata) => {
      sum =
        Number(sum) + Number(cartdata.quantity) * Number(cartdata.unitPrice);
      return sum;
    }, 0);
    const discount = cart.reduce((sum, cartdata) => {
      sum =
        Number(sum) +
        (Number(cartdata.unitPrice) - Number(cartdata.updatedPrice ?? 0));
      return sum;
    }, 0);
    transectionData.discount = discount;
    transectionData.totalPrice = totalPrice;
    transectionData.remaining =
      Number(totalPrice) +
      Number(transectionData?.deliveryCharge) -
      transectionData.discount -
      transectionData.paid;
    setTransectionData(transectionData);
    setOrderProduct([...cart]);
    //eslint-disable-next-line
  }, [cart]);

  useEffect(() => {
    if (paymentMethod === "") return;
    if (formData?.district === "" || formData.division === "") {
      Swal.fire("Oops!!", "Enter valid shipping address", "error");
    } else {
      let deliveryCharge = 0;
      if (
        formData.district.toLowerCase().includes("dhaka") &&
        formData.division.toLowerCase().includes("dhaka")
      ) {
        deliveryCharge = 80;
      } else if (
        formData.division.toLowerCase().includes("dhaka") &&
        ["gazipur", "tongi", "narayanganj", "savar"].includes(
          formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase()
        )
      ) {
        deliveryCharge = 130;
      } else {
        deliveryCharge = 150;
      }

      transectionData.remaining =
        Number(transectionData?.totalPrice) +
        Number(deliveryCharge) -
        transectionData.discount -
        transectionData.paid;
      setTransectionData({ ...transectionData, deliveryCharge });
    }
    //eslint-disable-next-line
  }, [paymentMethod]);

  useEffect(() => {
    let deliveryChargeX = transectionData?.deliveryCharge ?? 0;
    if (formData?.district === "" && formData.division === "") {
      deliveryChargeX = 0;
    } else {
      if (
        formData.district.toLowerCase().includes("dhaka") &&
        formData.division.toLowerCase().includes("dhaka")
      ) {
        deliveryChargeX = 80;
      } else if (
        formData.division.toLowerCase().includes("dhaka") &&
        ["gazipur", "tongi", "narayanganj", "savar"].includes(
          formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase()
        )
      ) {
        deliveryChargeX = 130;
      } else {
        deliveryChargeX = 150;
      }

      transectionData.remaining =
        Number(transectionData?.totalPrice) +
        Number(deliveryChargeX) -
        transectionData.discount -
        transectionData.paid;
      setTransectionData({
        ...transectionData,
        deliveryCharge: deliveryChargeX,
      });
    }
    //eslint-disable-next-line
  }, [formData?.district]);

  const renderProduct = (item: CartItem) => {
    const {
      name,
      thumbnail,
      quantity,
      id,
      unitPrice,
      categoryName,
      maxQuantity,
    } = item;

    return (
      <div key={id} className="flex py-5 last:pb-0">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-40">
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
                <span className="my-1 text-sm text-neutral-500">
                  {categoryName}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400" />
                  <span className="text-sm">{5}</span>
                </div>
              </div>
              <span className="font-medium md:text-xl">${unitPrice}</span>
            </div>
          </div>
          <div className="flex w-full items-end justify-between text-sm">
            <div className="flex items-center gap-3">
              <LikeButton />
              <TrashIcon
                className="size-5 text-red-400"
                onClick={() => removeFromCart(id)}
              />
            </div>
            <div>
              <InputNumber
                defaultValue={quantity}
                min={1}
                max={maxQuantity}
                onChange={(value) => {
                  updateToCart({
                    ...item,
                    quantity: value,
                    totalPrice: Number(unitPrice) * Number(value),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <UserInformation
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputChange2={handleInputChange2}
        />

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={(value: string) =>
              setPaymentMethod(value)
            }
          />
        </div>
      </div>
    );
  };

  const confirmOrderAndCreateOne = async () => {
    trackEvent("begin_checkout", {
      value: transectionData?.remaining,
      currency: "BDT",
      coupon: "",
    });

    setLoading(true);
    const hasPayment =
      transectionData?.discount > 0 ||
      paymentMethod === "bkash" ||
      !formData.district.toLowerCase().includes("dhaka");
    const paymentAmount =
      transectionData?.discount > 0
        ? Math.min(200, transectionData?.remaining)
        : !formData.district.toLowerCase().includes("dhaka")
        ? ["gazipur", "tongi", "narayanganj", "savar"].includes(
            formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase()
          )
          ? Math.min(130, transectionData?.remaining)
          : Math.min(150, transectionData?.remaining)
        : 0;
    const orderData = {
      customerInformation: {
        //@ts-ignore
        customer: {
          name: formData?.name,
          phoneNumber: formData?.mobileNumber,
          email: formData?.email,
        },
        shipping: {
          division: formData?.division,
          district: formData?.district,
          address: formData?.address,
        },
      },
      transectionData,
      products: [...orderProducts],
      hasPayment,
    };
    try {
      trackEvent("add_payment_info", {
        payment_type: hasPayment ? "bkash" : paymentMethod,
        value:
          paymentMethod === "bkash"
            ? transectionData?.remaining
            : paymentAmount,
        currency: "BDT",
      });
      const response = await createOrder(orderData);

      if (response.success) {
        trackEvent("begin_checkout", {
          transection_id: response?.data?.order?.id,
          affiliation: "Web-Site",
          Value: transectionData?.remaining,
          shipping: transectionData?.deliveryCharge,
          discount: transectionData?.discount,
          currency: "BDT",
        });
        const orderId = response?.data?.order?.id;
        if (hasPayment) {
          bkashCheckout(
            paymentMethod === "bkash"
              ? transectionData?.remaining
              : paymentAmount,
            orderId,
            formData?.name,
            formData?.mobileNumber
          );
        } else {
          Swal.fire(
            "Order Create Successfully 🎉",
            "Our agent will contact with you shortly",
            "success"
          ).then(() => (window.location.href = `/order/${orderId}`));
        }
      }
    } catch (error) {
      Swal.fire(
        "Failed to place order ☠️",
        "Something went wrong, please try again",
        "error"
      );
      console.log("error");
    }
    setLoading(false);
  };

  const handleConfirmOrder = () => {
    // Check if there are no order products
    if (!orderProducts || orderProducts.length < 1) {
      return Swal.fire("Oops!!", "Please select at least one product", "error");
    }

    // Check if customer information is missing
    const { name, mobileNumber } = formData || {};
    if (!name || !mobileNumber) {
      return Swal.fire(
        "Oops!!",
        "Please enter valid name and mobile number",
        "error"
      );
    }

    // Check if shipping address is missing
    const { district, division, address } = formData || {};
    if (!district || !division || !address) {
      return Swal.fire(
        "Oops!!",
        "Please enter valid shipping address",
        "error"
      );
    }

    // Check if payment method is missing
    if (!paymentMethod) {
      return Swal.fire("Oops!!", "Please select a payment method", "error");
    }

    // Validate Bangladeshi phone number
    if (!isValidBangladeshiPhoneNumber(mobileNumber)) {
      return Swal.fire("Oops!!", "Please enter a valid phone number", "error");
    }

    // Check for deliveries outside Dhaka and prompt for prepayment
    if (transectionData?.discount > 0) {
      return Swal.fire({
        title: "Terms & Condition",
        text: "A prepayment of 200 taka is required for dicounted products.",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Continue",
        denyButtonText: "Don't save",
      }).then((result) => {
        if (result.isConfirmed) {
          confirmOrderAndCreateOne();
        }
      });
    } else if (!district.toLowerCase().includes("dhaka")) {
      return Swal.fire({
        title: "Terms & Condition",
        text: `A prepayment of ${transectionData?.deliveryCharge} taka (delivery charge) is required for deliveries outside Dhaka.`,
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Continue",
        denyButtonText: "Don't save",
      }).then((result) => {
        if (result.isConfirmed) {
          confirmOrderAndCreateOne();
        }
      });
    }

    // Confirm order if all checks pass
    confirmOrderAndCreateOne();
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28">
        <div className="mb-4">
          <h2 className="block text-2xl font-semibold sm:text-3xl lg:text-4xl ">
            Checkout
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:lg:mx-14 2xl:mx-16 " />

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-neutral-300">
              {cart.map((item) => renderProduct(item))}
            </div>

            <div className="mt-10 border-t border-neutral-300 pt-6 text-sm">
              {/* <div>
                <div className='text-sm'>Discount code</div>
                <div className='mt-1.5 flex'>
                  <Input
                    rounded='rounded-lg'
                    sizeClass='h-12 px-4 py-3'
                    className='flex-1 border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
                  />
                  <button
                    type='button'
                    className='ml-3 flex w-24 items-center justify-center rounded-2xl border border-neutral-300 bg-gray px-4 text-sm font-medium transition-colors hover:bg-neutral-100'>
                    Apply
                  </button>
                </div>
              </div> */}

              <div className="mt-4 flex justify-between pb-4">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {transectionData?.totalPrice}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span>Estimated Delivery & Handling</span>
                <span className="font-semibold">
                  {transectionData?.deliveryCharge}
                </span>
              </div>

              <div className="flex justify-between py-4">
                <span>Discount</span>
                <span className="font-semibold">
                  {transectionData?.discount}
                </span>
              </div>

              <div className="flex justify-between pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{transectionData?.remaining}</span>
              </div>
            </div>

            <div id="PaymentMethod" className="scroll-mt-24 mt-4">
              <TermsCondition
                checked={isTermsChecked}
                handleTermCondition={(value: boolean) =>
                  setIsTermsChecked(value)
                }
              />
            </div>

            <ButtonPrimary
              className="mt-8 w-full"
              disabled={loading || !isTermsChecked}
              onClick={() => handleConfirmOrder()}
            >
              Confirm order{" "}
              {loading && (
                <Loader2 className=" animate-spin w-5 h-5 text-white ml-2" />
              )}
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
