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
import {
  Loader2,
  Star,
  TrashIcon,
  User,
  LogIn,
  Disc2,
  ShoppingBag,
} from "lucide-react";
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
      <div
        key={index}
        className='group relative flex flex-col sm:flex-row gap-4 py-6 last:pb-0 transition-all duration-300 hover:bg-gray-50/50 rounded-xl px-2 sm:px-3'>
        <div className='relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200/50 transition-all duration-300 group-hover:shadow-md group-hover:ring-gray-300/50'>
          <Image
            fill
            src={thumbnail}
            alt={name}
            className='h-full w-full object-contain object-center p-2 transition-transform duration-300 group-hover:scale-105'
          />
          <Link className='absolute inset-0' href={`/products/${id}`} />
        </div>

        <div className='flex flex-1 flex-col justify-between'>
          <div className='space-y-2'>
            <div className='flex flex-col sm:flex-row sm:justify-between gap-2'>
              <div className='flex-1'>
                <h3 className='font-semibold text-base sm:text-lg md:text-xl text-gray-900 line-clamp-2 hover:text-primary transition-colors'>
                  <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <div className='flex items-center gap-2 mt-2'>
                  <Badge
                    variant={"outline"}
                    className='text-xs font-medium bg-blue-50 text-blue-700 border-blue-200'>
                    {formatVariant(variation)}
                  </Badge>
                </div>
              </div>
              <div className='flex items-start'>
                <span className='font-bold text-lg sm:text-xl text-primary whitespace-nowrap'>
                  ৳{formatPrice(unitPrice * quantity)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4'>
            <button
              className='flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors group/delete'
              onClick={() => removeFromCart(index)}>
              <TrashIcon className='size-4 transition-transform group-hover/delete:scale-110' />
              <span className='hidden sm:inline'>Remove</span>
            </button>
            <div className='flex items-center gap-3'>
              <span className='text-sm text-gray-600 font-medium hidden sm:inline'>
                Quantity:
              </span>
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
    <div className='nc-CheckoutPage bg-gradient-to-b from-gray-50 to-white min-h-screen'>
      <main className='container py-8 sm:py-12 lg:py-16 lg:pb-28'>
        {/* Enhanced Header */}
        <div className='mb-8 sm:mb-10 lg:mb-12'>
          <h2 className='text-2xl sm:ml-20 sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
            Checkout
          </h2>
          <p className='text-gray-600 text-sm sm:text-base ml-0 sm:ml-20 mt-2'>
            Complete your order in just a few steps
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12'>
          {/* Left Section - Forms */}
          <div className=' flex-1 order-2 lg:order-1'>{renderLeft()}</div>

          {/* Divider */}
          <div className='hidden lg:block shrink-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent' />

          {/* Right Section - Order Summary */}
          <div className='w-full lg:w-[42%] xl:w-[38%] order-2'>
            <div className='lg:sticky lg:top-24 space-y-6'>
              {/* Order Summary Card */}
              <Card className='shadow-xl border-gray-200/80 overflow-hidden'>
                <CardHeader className='bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 pb-4'>
                  <CardTitle className='text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2'>
                    <div className='h-8 w-1 bg-gradient-to-b from-primary to-blue-600 rounded-full'></div>
                    Order Summary
                  </CardTitle>
                  <CardDescription className='text-sm text-gray-600 mt-1'>
                    Review your items before checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-4 sm:p-6'>
                  {/* Cart Items */}
                  <div className='divide-y divide-gray-100 -mx-2 sm:-mx-3'>
                    {cart.length > 0 ? (
                      cart.map((item, index) => renderProduct(item, index))
                    ) : (
                      <div className='py-12 text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4'>
                          <svg
                            className='w-8 h-8 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                            />
                          </svg>
                        </div>
                        <p className='text-gray-500 text-sm'>
                          Your cart is empty
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className='mt-8 space-y-4 pt-6 border-t-2 border-gray-100'>
                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-semibold text-gray-900'>
                        ৳{formatPrice(transectionData?.totalPrice)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className='text-gray-600'>Delivery & Handling</span>
                      <span className='font-semibold text-gray-900'>
                        ৳{formatPrice(transectionData?.deliveryCharge)}
                      </span>
                    </div>

                    {transectionData?.discount > 0 && (
                      <div className='flex justify-between items-center text-sm sm:text-base'>
                        <span className='text-gray-600'>Discount</span>
                        <span className='font-semibold text-green-600'>
                          -৳{transectionData?.discount}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className='flex justify-between items-center pt-4 border-t-2 border-gray-200'>
                      <span className='text-base sm:text-lg font-bold text-gray-900'>
                        Total
                      </span>
                      <span className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
                        ৳{transectionData?.remaining}
                      </span>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className='mt-6'>
                    <label className='text-sm font-medium text-gray-700 mb-2 block'>
                      Order Notes (Optional)
                    </label>
                    <Textarea
                      className='w-full border-gray-200 bg-gray-50/50 p-3 sm:p-4 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-xl resize-none'
                      rows={4}
                      value={notes}
                      onChange={(e: any) => setNotes(e.target.value)}
                      placeholder='Add delivery instructions or special requests...'
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className='mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100'>
                    <TermsCondition
                      checked={isTermsChecked}
                      handleTermCondition={(value: boolean) =>
                        setIsTermsChecked(value)
                      }
                    />
                  </div>

                  {/* Confirm Button */}
                  <ButtonPrimary
                    className='mt-6 w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90'
                    disabled={loading || !isTermsChecked || redirecting}
                    onClick={() => {
                      if (!loading) {
                        handleConfirmOrder();
                      }
                    }}>
                    <span className='flex items-center justify-center gap-2'>
                      {redirecting
                        ? "Redirecting to payment..."
                        : loading
                        ? "Processing..."
                        : `Confirm ${hasPrepayment ? "and Pay" : "Order"}`}
                      {loading && <Loader2 className='animate-spin w-5 h-5' />}
                      {redirecting && (
                        <Disc2 className='animate-spin w-5 h-5' />
                      )}
                      {!loading && !redirecting && (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13 7l5 5m0 0l-5 5m5-5H6'
                          />
                        </svg>
                      )}
                    </span>
                  </ButtonPrimary>

                  {/* Security Badge */}
                  <div className='mt-4 flex items-center justify-center gap-2 text-xs text-gray-500'>
                    <svg
                      className='w-4 h-4 text-green-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Secure checkout
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
