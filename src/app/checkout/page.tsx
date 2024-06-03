"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdStar } from "react-icons/md";

import LikeButton from "@/components/LikeButton";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import InputNumber from "@/shared/InputNumber/InputNumber";

import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import { CartItem, useCart } from "@/context/CartContext";
import Swal from "sweetalert2";
import { createOrder } from "@/utils/orderFunctions";
import { bkashCheckout } from "@/utils/payment";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";
import { Loader2 } from "lucide-react";

const CheckoutPage = () => {
  const { cart, updateToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ContactInfo");

  const [customerInformation, setCustomerInformation] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [orderProducts, setOrderProduct] = useState<CartItem[]>([]);
  const [transectionData, setTransectionData] = useState({
    totalPrice: 0,
    paid: 0,
    remaining: 0,
    discount: 0,
    deliveryCharge: 0,
  });
  const [shippingAddress, setShippingAddress] = useState({
    division: "",
    district: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const totalPrice = cart.reduce((sum, cartdata) => {
      sum =
        Number(sum) + Number(cartdata.quantity) * Number(cartdata.unitPrice);
      return sum;
    }, 0);
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
    if (shippingAddress?.district === "" || shippingAddress.division === "") {
      console.log(shippingAddress);
      Swal.fire("Oops!!", "Enter valid shipping address", "error");
    } else {
      let deliveryCharge = 0;
      if (
        shippingAddress.district.toLowerCase().includes("dhaka") &&
        shippingAddress.division.toLowerCase().includes("dhaka")
      ) {
        deliveryCharge = 100;
      } else {
        deliveryCharge = 180;
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

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const renderProduct = (item: CartItem) => {
    const { name, thumbnail, quantity, id, unitPrice, categoryName } = item;

    return (
      <div key={id} className='flex py-5 last:pb-0'>
        <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl md:h-40 md:w-40'>
          <Image
            fill
            src={thumbnail}
            alt={name}
            className='h-full w-full object-contain object-center'
          />
          <Link className='absolute inset-0' href={`/products/${id}`} />
        </div>

        <div className='ml-4 flex flex-1 flex-col justify-between'>
          <div>
            <div className='flex justify-between '>
              <div>
                <h3 className='font-medium md:text-2xl '>
                  <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <span className='my-1 text-sm text-neutral-500'>
                  {categoryName}
                </span>
                <div className='flex items-center gap-1'>
                  <MdStar className='text-yellow-400' />
                  <span className='text-sm'>{5}</span>
                </div>
              </div>
              <span className='font-medium md:text-xl'>${unitPrice}</span>
            </div>
          </div>
          <div className='flex w-full items-end justify-between text-sm'>
            <div className='flex items-center gap-3'>
              <LikeButton />
              <AiOutlineDelete
                className='text-2xl'
                onClick={() => removeFromCart(id)}
              />
            </div>
            <div>
              <InputNumber
                defaultValue={quantity}
                min={1}
                max={20}
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

  const handleCustomerInfoChange = (key: string, value: string) => {
    setCustomerInformation({ ...customerInformation, [key]: value });
  };

  const renderLeft = () => {
    return (
      <div className='space-y-8'>
        <div id='ContactInfo' className='scroll-mt-24'>
          <ContactInfo
            isActive={tabActive === "ContactInfo"}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            handleContactInfoChange={handleCustomerInfoChange}
            customerInformation={customerInformation}
          />
        </div>

        <div id='ShippingAddress' className='scroll-mt-24'>
          <ShippingAddress
            address={shippingAddress?.address}
            handleShippingAddressChange={(key: string, value: string) => {
              setShippingAddress({ ...shippingAddress, [key]: value });
            }}
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id='PaymentMethod' className='scroll-mt-24'>
          <PaymentMethod
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={(value: string) =>
              setPaymentMethod(value)
            }
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => setTabActive("PaymentMethod")}
          />
        </div>
      </div>
    );
  };

  const confirmOrderAndCreateOne = async () => {
    setLoading(true);
    const hasPayment =
      paymentMethod === "bkash" ||
      !shippingAddress.district.toLowerCase().includes("dhaka");
    const orderData = {
      customerInformation: {
        //@ts-ignore
        customer: { ...customerInformation },
        shipping: {
          ...shippingAddress,
        },
      },
      transectionData,
      products: [...orderProducts],
      hasPayment,
    };
    try {
      const response = await createOrder(orderData);
      if (response.success) {
        if (hasPayment) {
          bkashCheckout(
            paymentMethod === "bkash" ? transectionData?.remaining : 200,
            response?.data?.order?.id,
            customerInformation?.name,
            customerInformation?.phoneNumber
          );
        } else if (!shippingAddress.district.toLowerCase().includes("dhaka")) {
          Swal.fire(
            "Order Create Successfully 🎉",
            "Our agent will contact with you shortly",
            "success"
          ).then(() => (window.location.href = "/"));
        }
      }
    } catch (error) {
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
    const { name, phoneNumber } = customerInformation || {};
    if (!name || !phoneNumber) {
      return Swal.fire(
        "Oops!!",
        "Please enter valid name and mobile number",
        "error"
      );
    }

    // Check if shipping address is missing
    const { district, division, address } = shippingAddress || {};
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
    if (!isValidBangladeshiPhoneNumber(phoneNumber)) {
      return Swal.fire("Oops!!", "Please enter a valid phone number", "error");
    }

    // Check for deliveries outside Dhaka and prompt for prepayment
    if (!district.toLowerCase().includes("dhaka")) {
      return Swal.fire({
        title: "Terms & Condition",
        text: "A prepayment of 200 taka is required for deliveries outside Dhaka.",
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
    <div className='nc-CheckoutPage'>
      <main className='container py-16 lg:pb-28 lg:pt-20 '>
        <div className='mb-16'>
          <h2 className='block text-2xl font-semibold sm:text-3xl lg:text-4xl '>
            Checkout
          </h2>
        </div>

        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>{renderLeft()}</div>

          <div className='my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:lg:mx-14 2xl:mx-16 ' />

          <div className='w-full lg:w-[36%] '>
            <h3 className='text-lg font-semibold'>Order summary</h3>
            <div className='mt-8 divide-y divide-neutral-300'>
              {cart.map((item) => renderProduct(item))}
            </div>

            <div className='mt-10 border-t border-neutral-300 pt-6 text-sm'>
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

              <div className='mt-4 flex justify-between pb-4'>
                <span>Subtotal</span>
                <span className='font-semibold'>
                  {transectionData?.totalPrice}
                </span>
              </div>
              <div className='flex justify-between py-4'>
                <span>Estimated Delivery & Handling</span>
                <span className='font-semibold'>
                  {transectionData?.deliveryCharge}
                </span>
              </div>

              <div className='flex justify-between pt-4 text-base font-semibold'>
                <span>Total</span>
                <span>{transectionData?.remaining}</span>
              </div>
            </div>
            <ButtonPrimary
              className='mt-8 w-full'
              disabled={loading}
              onClick={() => handleConfirmOrder()}>
              Confirm order{" "}
              {loading && (
                <Loader2 className=' animate-spin w-5 h-5 text-white ml-2' />
              )}
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
