"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

import LikeButton from "@/components/LikeButton";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import InputNumber from "@/shared/InputNumber/InputNumber";

import PaymentMethod from "./PaymentMethod";
import { CartItem, useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { createOrder } from "@/utils/orderFunctions";
import { bkashCheckout } from "@/utils/payment";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";
import { Loader2, Star, TrashIcon, User, LogIn, Disc2 } from "lucide-react";
import UserInformation from "./userForm";
import TermsCondition from "./agreeToTerns";
import { trackEvent } from "@/lib/firebase-event";
import useAnalytics from "@/hooks/useAnalytics";
import { Badge } from "@/components/ui/badge";
import {
  formatVariant,
  formatPrice,
  ceilPrice,
  floorPrice,
} from "@/utils/functions";
import { Textarea } from "@/components/ui/textarea";
import useCampaign from "@/hooks/useCampaign";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { checkPrepaymentProducts, calculatePrepaymentAmount } = useCampaign();
  const { cart, clearCart, updateToCart, removeFromCart } = useCart();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
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
  const [notes, setNotes] = useState("");

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    mobileNumber: "",
    email: "",
    district: "",
    division: "",
    address: "",
    postalCode: "1234",
  });

  const [prePaymentAmount, setPrePaymentAmount] = useState<number>(0);
  const [hasPrepayment, setHasPrepayment] = useState<boolean>(false);

  // Auto-fill form data for logged-in users
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: authState.user?.name || prevFormData.name,
        email: authState.user?.email || prevFormData.email,
        mobileNumber: authState.user?.mobileNumber || prevFormData.mobileNumber,
        district: authState?.user?.address?.district || prevFormData.district,
        division: authState.user?.address?.division || prevFormData.division,
        address: authState.user?.address?.address || prevFormData.address,
        postalCode:
          authState?.user?.address?.postalCode || prevFormData.postalCode,
      }));
    }
  }, [authState.isAuthenticated, authState.user]);

  const checkPrepaymentProductData = async () => {
    const response = await checkPrepaymentProducts(
      cart.map((item: CartItem) => item?.id)
    );
    setHasPrepayment(response?.hasPrepaymentRequirement ?? false);
  };

  const calculateOrderPrepayment = async (deliveryChargeAmount = 0) => {
    const orderItems = cart.map((item) => ({
      productId: item?.id,
      quantity: item?.quantity,
      unitPrice: item?.unitPrice,
    }));
    const deliveryCharge = deliveryChargeAmount;
    const response = await calculatePrepaymentAmount(
      orderItems,
      deliveryCharge
    );

    setPrePaymentAmount(response?.totalPrepayment ?? 0);
  };

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
    const totalPrice = formatPrice(
      cart.reduce((sum, cartdata) => {
        sum =
          Number(sum) + Number(cartdata.quantity) * Number(cartdata.unitPrice);
        return sum;
      }, 0)
    );
    const discount = floorPrice(
      cart.reduce((sum, cartdata) => {
        sum =
          Number(sum) +
          (Number(cartdata.unitPrice) - Number(cartdata.updatedPrice ?? 0)) *
            cartdata.quantity;
        return sum;
      }, 0)
    );
    const remaining = ceilPrice(
      Number(totalPrice) +
        Number(transectionData?.deliveryCharge) -
        discount -
        transectionData.paid
    );
    setTransectionData({
      ...transectionData,
      discount,
      totalPrice,
      remaining,
    });
    setOrderProduct([...cart]);
    checkPrepaymentProductData();
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

      const remaining = ceilPrice(
        Number(transectionData?.totalPrice) +
          Number(deliveryCharge) -
          transectionData.discount -
          transectionData.paid
      );
      setTransectionData({ ...transectionData, deliveryCharge, remaining });
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

      const remaining = ceilPrice(
        Number(transectionData?.totalPrice) +
          Number(deliveryChargeX) -
          transectionData.discount -
          transectionData.paid
      );
      setTransectionData({
        ...transectionData,
        deliveryCharge: deliveryChargeX,
        remaining,
      });
      if (hasPrepayment) calculateOrderPrepayment(deliveryChargeX);
    }
    //eslint-disable-next-line
  }, [formData?.district]);

  const renderProduct = (item: CartItem, index: number) => {
    const {
      name,
      thumbnail,
      quantity,
      id,
      unitPrice,
      categoryName,
      maxQuantity,
      variation,
    } = item;

    return (
      <div key={index} className='flex py-5 last:pb-0'>
        <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl'>
          <Image
            fill
            src={thumbnail}
            alt={name}
            className='h-full w-full object-contain object-center rounded-md'
          />
          <Link className='absolute inset-0' href={`/products/${id}`} />
        </div>

        <div className='ml-4 flex flex-1 flex-col justify-between'>
          <div>
            <div className='flex justify-between '>
              <div>
                <h3 className='font-medium md:text-2xl uppercase'>
                  <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <div className='flex items-center gap-1'>
                  <Badge variant={"outline"}>{formatVariant(variation)}</Badge>
                </div>
              </div>
              <span className='font-medium md:text-xl'>
                ৳{formatPrice(unitPrice)}
              </span>
            </div>
          </div>
          <div className='flex w-full items-end justify-between text-sm'>
            <div
              className='flex items-center gap-3'
              onClick={() => removeFromCart(index)}>
              <TrashIcon className='size-5 text-red-400' />
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
      <div className='space-y-8'>
        {/* Login/Register Prompt for Guest Users */}
        {!authState.isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <User className='h-5 w-5 mr-2' />
                Sign In for Faster Checkout
              </CardTitle>
              <CardDescription>
                Already have an account? Sign in to auto-fill your information
                and track your orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Link href={`/login?redirect=/checkout`} className='flex-1'>
                  <Button variant='outline' className='w-full'>
                    <LogIn className='h-4 w-4 mr-2' />
                    Sign In
                  </Button>
                </Link>
                <Link href={`/register?redirect=/checkout`} className='flex-1'>
                  <Button className='w-full'>
                    <User className='h-4 w-4 mr-2' />
                    Create Account
                  </Button>
                </Link>
              </div>
              <p className='text-xs text-gray-500 mt-3 text-center'>
                Or continue as guest below
              </p>
            </CardContent>
          </Card>
        )}

        {/* Logged-in User Info */}
        {authState.isAuthenticated && authState.user && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <User className='h-5 w-5 mr-2' />
                Welcome back, {authState.user.name?.split(" ")[0]}!
              </CardTitle>
              <CardDescription>
                Your information has been auto-filled. You can edit it below if
                needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <User className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {authState.user.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {authState.user.email || authState.user.mobileNumber}
                    </p>
                  </div>
                </div>
                <Link href='/account/profile'>
                  <Button variant='ghost' size='sm'>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <UserInformation
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputChange2={handleInputChange2}
        />

        <div id='PaymentMethod' className='scroll-mt-24'>
          <PaymentMethod
            prePaymentAmount={
              hasPrepayment && prePaymentAmount > 0 ? prePaymentAmount : 0
            }
            district={formData?.district}
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
    setLoading(true);
    const hasPayment =
      paymentMethod === "bkash" ||
      prePaymentAmount > 0 ||
      !formData.district.toLowerCase().includes("dhaka");
    const paymentAmount =
      prePaymentAmount > 0
        ? prePaymentAmount
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
      notes,
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
        clearCart();
        trackEvent("purchase", {
          transection_id: hasPayment
            ? response?.data?.orderId
            : response.data?.order?.id,
          affiliation: "Web-Site",
          Value: transectionData?.totalPrice,
          shipping: transectionData?.deliveryCharge,
          discount: transectionData?.discount,
          currency: "BDT",
          items: orderProducts?.map((product, index) => {
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
        const orderId = hasPayment
          ? response?.data?.orderId
          : response.data?.order?.id;
        if (hasPayment) {
          setLoading(false);
          setRedirecting(true);
          console.log(hasPayment);
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
            "Order Created Successfully 🎉",
            "Our agent will contact with you shortly",
            "success"
          ).then(() => (window.location.href = `/order/${orderId}`));
        }
      } else {
        Swal.fire(
          "Failed to place order ☠️",
          response.error || "Something went wrong, please try again",
          "error"
        );
        setLoading(false);
      }
    } catch (error) {
      Swal.fire(
        "Failed to place order ☠️",
        "Something went wrong, please try again",
        "error"
      );
      console.log("error");
      setLoading(false);
    }
  };

  const handleConfirmOrder = () => {
    // Check if there are no order products
    if (!orderProducts || orderProducts.length < 1) {
      return Swal.fire("Oops!!", "Please select at least one product", "error");
    }

    // Check if customer information is missing
    const { name, mobileNumber } = formData || {};
    if (!name) {
      return Swal.fire("Oops!!", "Please Enter Your Name", "error");
    }

    if (!isValidBangladeshiPhoneNumber(mobileNumber)) {
      return Swal.fire("Oops!!", "Please Enter A Valid Mobile Number", "error");
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
    if (hasPrepayment) {
      return Swal.fire({
        title: "Terms & Condition",
        text: `A prepayment of ${
          !!prePaymentAmount && prePaymentAmount > 0 ? prePaymentAmount : 200
        } taka is required for dicounted products.`,
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
    <div className='nc-CheckoutPage'>
      <main className='container py-16 lg:pb-28'>
        <div className='mb-4'>
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
              {cart.map((item, index) => renderProduct(item, index))}
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
                  {formatPrice(transectionData?.totalPrice)}
                </span>
              </div>
              <div className='flex justify-between py-4'>
                <span>Estimated Delivery & Handling</span>
                <span className='font-semibold'>
                  {formatPrice(transectionData?.deliveryCharge)}
                </span>
              </div>

              <div className='flex justify-between py-4'>
                <span>Discount</span>
                <span className='font-semibold'>
                  {transectionData?.discount}
                </span>
              </div>

              <div className='flex justify-between pt-4 text-base font-semibold'>
                <span>Total</span>
                <span>{transectionData?.remaining}</span>
              </div>
            </div>

            <div className='mt-6   w-full bg-gray-100'>
              <Textarea
                className='w-full border-0 bg-transparent p-4 text-sm placeholder:text-neutral-500 focus:ring-0'
                rows={5}
                value={notes}
                onChange={(e: any) => setNotes(e.target.value)}
                placeholder='Write a note...'
              />
            </div>

            <div id='PaymentMethod' className='scroll-mt-24 mt-4'>
              <TermsCondition
                checked={isTermsChecked}
                handleTermCondition={(value: boolean) =>
                  setIsTermsChecked(value)
                }
              />
            </div>

            <ButtonPrimary
              className='mt-8 w-full'
              disabled={loading || !isTermsChecked || redirecting}
              onClick={() => {
                // Swal.fire(
                //   "The Website is in maintOur site is currently undergoing maintenance",
                //   "Thank you for your patience and support!",
                //   "info"
                // );
                if (!loading) {
                  handleConfirmOrder();
                }
              }}>
              {redirecting
                ? "Redirecting to payment..."
                : loading
                ? "Processing..."
                : `Confirm ${hasPrepayment ? "and Pay" : ""}`}
              {loading && (
                <Loader2 className=' animate-spin w-5 h-5 text-white ml-2' />
              )}
              {redirecting && (
                <Disc2 className=' animate-spin w-5 h-5 text-white ml-2' />
              )}
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
