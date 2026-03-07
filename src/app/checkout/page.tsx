"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

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
import { fetchBulkProducts } from "@/services/productServices";
import { compareProducts } from "@/utils/productComparison";
import ProductChangesDialog from "@/components/checkout/ProductChangesDialog";
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
import { CouponModal } from "@/components/checkout/CouponModal";
import { useCoupon } from "@/hooks/useCoupon";
import type { Coupon as CouponType, MyCoupon } from "@/services/couponService";
import { Tag } from "lucide-react";
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
  const { cart, clearCart, updateToCart, removeFromCart, bulkUpdateCart } =
    useCart();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [verifyingProducts, setVerifyingProducts] = useState(false);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [productChanges, setProductChanges] = useState<any[]>([]);

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

  // Coupon states
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponType | null>(null);
  const [myCoupons, setMyCoupons] = useState<MyCoupon[]>([]);
  const [isLoadingMyCoupons, setIsLoadingMyCoupons] = useState(false);

  const { fetchCustomerCoupons, fetchAutoApplyCoupon } = useCoupon();

  // Memoize fetchCustomerCoupons to prevent unnecessary re-renders
  const fetchCouponsCallback = useCallback(
    async (phone: string) => {
      setIsLoadingMyCoupons(true);
      try {
        const response = await fetchCustomerCoupons(phone);
        if (response.success) {
          setMyCoupons(response.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setIsLoadingMyCoupons(false);
      }
    },
    //eslint-disable-next-line
    [],
  );

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

  // Fetch customer coupons when phone number is available
  useEffect(() => {
    if (
      formData.mobileNumber &&
      isValidBangladeshiPhoneNumber(formData.mobileNumber)
    ) {
      fetchCouponsCallback(formData.mobileNumber);
    }
    //eslint-disable-next-line
  }, [formData.mobileNumber]);

  // Check for auto-apply coupon on page load
  useEffect(() => {
    const checkAutoApply = async () => {
      if (
        !appliedCoupon &&
        formData.mobileNumber &&
        isValidBangladeshiPhoneNumber(formData.mobileNumber) &&
        transectionData.totalPrice > 0
      ) {
        try {
          const products = cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          }));

          const response = await fetchAutoApplyCoupon({
            customerPhone: formData.mobileNumber,
            orderTotal: transectionData.totalPrice,
            products,
          });

          if (response.success && response.data) {
            handleApplyCoupon(response.data);
          }
        } catch (error) {
          console.error("Error checking auto-apply coupon:", error);
        }
      }
    };

    checkAutoApply();
    //eslint-disable-next-line
  }, [formData.mobileNumber, transectionData.totalPrice]);

  // Coupon handler functions
  const handleApplyCoupon = (coupon: CouponType) => {
    // Calculate total with coupon discount
    const couponDiscount = coupon.discountAmount;
    const newRemaining =
      Number(transectionData.totalPrice) +
      Number(transectionData.deliveryCharge) -
      Number(transectionData.discount) -
      couponDiscount;

    // Validate that remaining doesn't go negative
    if (newRemaining < 0) {
      Swal.fire(
        "Invalid Coupon",
        "Coupon discount exceeds order total. Please add more items or use a different coupon.",
        "error",
      );
      return;
    }

    setAppliedCoupon(coupon);
    setTransectionData((prev) => ({
      ...prev,
      remaining: ceilPrice(newRemaining),
    }));
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    // Recalculate remaining without coupon discount
    const newRemaining =
      Number(transectionData.totalPrice) +
      Number(transectionData.deliveryCharge) -
      Number(transectionData.discount);
    setTransectionData((prev) => ({
      ...prev,
      remaining: ceilPrice(newRemaining),
    }));
  };

  // Verify products on checkout page load
  useEffect(() => {
    const verifyCartProducts = async () => {
      if (cart.length === 0) return;

      setVerifyingProducts(true);
      try {
        const productIds = cart.map((item) => Number(item.id));
        const freshProducts = await fetchBulkProducts(productIds);

        const comparison = compareProducts(cart, freshProducts);

        if (comparison.hasChanges) {
          setProductChanges(comparison.changes);
          setShowChangesDialog(true);
          bulkUpdateCart(comparison.updatedCart);
        }
      } catch (error) {
        console.error("Error verifying products:", error);
      } finally {
        setVerifyingProducts(false);
      }
    };

    verifyCartProducts();
    //eslint-disable-next-line
  }, []);

  const checkPrepaymentProductData = async () => {
    const response = await checkPrepaymentProducts(
      cart.map((item: CartItem) => item?.id),
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
      deliveryCharge,
    );

    setPrePaymentAmount(response?.totalPrepayment ?? 0);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      }, 0),
    );
    const discount = floorPrice(
      cart.reduce((sum, cartdata) => {
        sum =
          Number(sum) +
          (Number(cartdata.unitPrice) - Number(cartdata.updatedPrice ?? 0)) *
            cartdata.quantity;
        return sum;
      }, 0),
    );
    const couponDiscount = appliedCoupon?.discountAmount || 0;
    const remaining = ceilPrice(
      Number(totalPrice) +
        Number(transectionData?.deliveryCharge) -
        discount -
        couponDiscount -
        transectionData.paid,
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
  }, [cart, appliedCoupon]);

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
          formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase(),
        )
      ) {
        deliveryCharge = 130;
      } else {
        deliveryCharge = 150;
      }

      const couponDiscount = appliedCoupon?.discountAmount || 0;
      const remaining = ceilPrice(
        Number(transectionData?.totalPrice) +
          Number(deliveryCharge) -
          transectionData.discount -
          couponDiscount -
          transectionData.paid,
      );
      setTransectionData({ ...transectionData, deliveryCharge, remaining });
    }
    //eslint-disable-next-line
  }, [paymentMethod, appliedCoupon]);

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
          formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase(),
        )
      ) {
        deliveryChargeX = 130;
      } else {
        deliveryChargeX = 150;
      }

      const couponDiscount = appliedCoupon?.discountAmount || 0;
      const remaining = ceilPrice(
        Number(transectionData?.totalPrice) +
          Number(deliveryChargeX) -
          transectionData.discount -
          couponDiscount -
          transectionData.paid,
      );
      setTransectionData({
        ...transectionData,
        deliveryCharge: deliveryChargeX,
        remaining,
      });
      if (hasPrepayment) calculateOrderPrepayment(deliveryChargeX);
    }
    //eslint-disable-next-line
  }, [formData?.district, appliedCoupon]);

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
        className='group relative flex flex-col sm:flex-row gap-4 py-6 last:pb-0 transition-all duration-300 hover:bg-neutral-50/50 rounded-none px-2 sm:px-3'>
        <div className='relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded bg-neutral-50 border border-neutral-200 transition-all duration-300'>
          <Image
            fill
            src={thumbnail}
            alt={name}
            className='h-full w-full object-cover object-center p-2 transition-transform duration-300 group-hover:scale-105'
          />
          <Link className='absolute inset-0' href={`/products/${id}`} />
        </div>

        <div className='flex flex-1 flex-col justify-between'>
          <div className='space-y-2'>
            <div className='flex flex-col sm:flex-row sm:justify-between gap-2'>
              <div className='flex-1'>
                <h3 className='font-serif text-base sm:text-lg md:text-xl text-neutral-900 line-clamp-2 hover:text-primary transition-colors duration-300 tracking-wide'>
                  <Link href={`/products/${id}`}>{name}</Link>
                </h3>
                <div className='flex items-center gap-2 mt-2'>
                  <Badge
                    variant={"outline"}
                    className='text-xs font-serif bg-blue-50 text-blue-700 border-blue-200 tracking-wide'>
                    {formatVariant(variation)}
                  </Badge>
                </div>
              </div>
              <div className='flex items-start'>
                <span className='font-serif text-lg sm:text-xl text-primary whitespace-nowrap tracking-wide'>
                  ৳{formatPrice(unitPrice * quantity)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4'>
            <button
              className='flex items-center gap-2 text-sm font-serif text-red-600 hover:text-red-700 transition-colors duration-300 group/delete'
              onClick={() => removeFromCart(index)}>
              <TrashIcon className='size-4 transition-transform group-hover/delete:scale-110' />
            </button>
            <div className='flex items-center gap-3'>
              <span className='text-sm font-serif text-neutral-600 tracking-wide hidden sm:inline'>
                Qty:
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
          <Card className='rounded-none border-neutral-200'>
            <CardHeader className='border-b border-neutral-200'>
              <CardTitle className='flex items-center font-serif tracking-wide text-neutral-900'>
                <User className='h-5 w-5 mr-2' />
                Sign In for Faster Checkout
              </CardTitle>
              <CardDescription className='font-serif tracking-wide text-neutral-600'>
                Already have an account? Sign in to auto-fill your information
                and track your orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Link href={`/login?redirect=/checkout`} className='flex-1'>
                  <Button
                    variant='outline'
                    className='w-full font-serif tracking-wide rounded-none border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50'>
                    <LogIn className='h-4 w-4 mr-2' />
                    Sign In
                  </Button>
                </Link>
                <Link href={`/register?redirect=/checkout`} className='flex-1'>
                  <Button className='w-full font-serif tracking-wide rounded-none bg-neutral-900 hover:bg-neutral-800'>
                    <User className='h-4 w-4 mr-2' />
                    Create Account
                  </Button>
                </Link>
              </div>
              <p className='text-xs font-serif tracking-wide text-neutral-500 mt-3 text-center'>
                Or continue as guest below
              </p>
            </CardContent>
          </Card>
        )}

        {/* Logged-in User Info */}
        {authState.isAuthenticated && authState.user && (
          <Card className='rounded-none border-neutral-200'>
            <CardHeader className='border-b border-neutral-200'>
              <CardTitle className='flex items-center font-serif tracking-wide text-neutral-900'>
                <User className='h-5 w-5 mr-2' />
                Welcome back, {authState.user.name?.split(" ")[0]}!
              </CardTitle>
              <CardDescription className='font-serif tracking-wide text-neutral-600'>
                Your information has been auto-filled. You can edit it below if
                needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='h-10 w-10 bg-neutral-100 rounded-none flex items-center justify-center'>
                    <User className='h-5 w-5 text-neutral-600' />
                  </div>
                  <div>
                    <p className='font-serif tracking-wide text-neutral-900'>
                      {authState.user.name}
                    </p>
                    <p className='text-sm font-serif text-neutral-500 tracking-wide'>
                      {authState.user.email || authState.user.mobileNumber}
                    </p>
                  </div>
                </div>
                <Link href='/account/profile'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='font-serif tracking-wide rounded-none hover:bg-neutral-50'>
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
              formData.district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase(),
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
      couponCode: appliedCoupon?.code || undefined,
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
            formData?.mobileNumber,
          );
        } else {
          let timerInterval: NodeJS.Timeout;
          Swal.fire({
            title: "Order Created Successfully 🎉",
            html: "Our agent will contact you shortly<br><br><strong>Redirecting in <b id='swal-timer'>3</b> seconds...</strong>",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
              const timer =
                Swal.getHtmlContainer()?.querySelector("#swal-timer");
              if (timer) {
                timerInterval = setInterval(() => {
                  const currentTimer = parseInt(timer.textContent || "3");
                  if (currentTimer > 0) {
                    timer.textContent = (currentTimer - 1).toString();
                  }
                }, 1000);
              }
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then(() => {
            window.location.href = `/order/${orderId}`;
          });
        }
      } else {
        Swal.fire(
          "Failed to place order ☠️",
          response.error || "Something went wrong, please try again",
          "error",
        );
        setLoading(false);
      }
    } catch (error) {
      Swal.fire(
        "Failed to place order ☠️",
        "Something went wrong, please try again",
        "error",
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
        "error",
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
    if (!district.toLowerCase().includes("dhaka")) {
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
    <div className='nc-CheckoutPage bg-neutral-50 min-h-screen'>
      {/* Product Changes Dialog */}
      <ProductChangesDialog
        open={showChangesDialog}
        onOpenChange={setShowChangesDialog}
        changes={productChanges}
        onContinue={() => setShowChangesDialog(false)}
      />

      <main className='container py-8 sm:py-12 lg:py-16 lg:pb-28'>
        {/* Enhanced Header */}
        <div className='mb-8 sm:mb-10 lg:mb-12'>
          <h2 className='text-2xl sm:ml-20 sm:text-3xl lg:text-4xl xl:text-5xl font-serif tracking-wide text-neutral-900'>
            Checkout
          </h2>
          <p className='text-neutral-600 text-sm sm:text-base font-serif tracking-wide ml-0 sm:ml-20 mt-2'>
            {verifyingProducts
              ? "Verifying product availability and prices..."
              : "Complete your order in just a few steps"}
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12'>
          {/* Left Section - Forms */}
          <div className=' flex-1 order-2 lg:order-1'>{renderLeft()}</div>

          {/* Divider */}
          <div className='hidden lg:block shrink-0 w-px bg-neutral-200' />

          {/* Right Section - Order Summary */}
          <div className='w-full lg:w-[42%] xl:w-[38%] order-2'>
            <div className='lg:sticky lg:top-24 space-y-6'>
              {/* Order Summary Card */}
              <Card className='shadow-sm border-neutral-200 overflow-hidden rounded-none'>
                <CardHeader className='bg-white border-b border-neutral-200 pb-4'>
                  <CardTitle className='text-xl sm:text-2xl font-serif tracking-wide text-neutral-900 flex items-center gap-2'>
                    <div className='h-8 w-1 bg-neutral-900 rounded-none'></div>
                    Order Summary
                  </CardTitle>
                  <CardDescription className='text-sm font-serif text-neutral-600 mt-1 tracking-wide'>
                    Review your items before checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className='p-4 sm:p-6'>
                  {/* Cart Items */}
                  <div className='divide-y divide-neutral-200 -mx-2 sm:-mx-3'>
                    {cart.length > 0 ? (
                      cart.map((item, index) => renderProduct(item, index))
                    ) : (
                      <div className='py-12 text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-none mb-4'>
                          <svg
                            className='w-8 h-8 text-neutral-400'
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
                        <p className='text-neutral-500 text-sm font-serif tracking-wide'>
                          Your cart is empty
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Coupon Button */}
                  <div className='mt-4'>
                    <Button
                      disabled={
                        cart.length === 0 ||
                        !formData.mobileNumber ||
                        !isValidBangladeshiPhoneNumber(formData.mobileNumber)
                      }
                      variant='outline'
                      className='w-full font-serif tracking-wide rounded-none border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50'
                      onClick={() => setIsCouponModalOpen(true)}>
                      <div className='flex items-center justify-center gap-2'>
                        <Tag className='h-4 w-4' />
                        {appliedCoupon ? (
                          <span>
                            {appliedCoupon.code} - Save ৳
                            {appliedCoupon.discountAmount}
                          </span>
                        ) : (
                          <span>Apply Coupon</span>
                        )}
                      </div>
                    </Button>
                  </div>

                  {/* Price Breakdown */}
                  <div className='mt-8 space-y-4 pt-6 border-t border-neutral-200'>
                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className='text-neutral-600 font-serif tracking-wide'>
                        Subtotal
                      </span>
                      <span className='font-serif tracking-wide text-neutral-900'>
                        ৳{formatPrice(transectionData?.totalPrice)}
                      </span>
                    </div>

                    <div className='flex justify-between items-center text-sm sm:text-base'>
                      <span className='text-neutral-600 font-serif tracking-wide'>
                        Delivery & Handling
                      </span>
                      <span className='font-serif tracking-wide text-neutral-900'>
                        ৳{formatPrice(transectionData?.deliveryCharge)}
                      </span>
                    </div>

                    {transectionData?.discount > 0 && (
                      <div className='flex justify-between items-center text-sm sm:text-base'>
                        <span className='text-neutral-600 font-serif tracking-wide'>
                          Discount
                        </span>
                        <span className='font-serif tracking-wide text-emerald-700'>
                          -৳{transectionData?.discount}
                        </span>
                      </div>
                    )}

                    {/* Coupon Discount */}
                    {appliedCoupon && (
                      <div className='flex justify-between items-center text-sm sm:text-base'>
                        <span className='text-neutral-600 font-serif tracking-wide'>
                          Coupon ({appliedCoupon.code})
                        </span>
                        <span className='font-serif tracking-wide text-emerald-700'>
                          -৳{appliedCoupon.discountAmount}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className='flex justify-between items-center pt-4 border-t border-neutral-300'>
                      <span className='text-base sm:text-lg font-serif tracking-wide text-neutral-900'>
                        Total
                      </span>
                      <span className='text-xl sm:text-2xl font-serif tracking-wide text-neutral-900'>
                        ৳{transectionData?.remaining}
                      </span>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className='mt-6'>
                    <label className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700 mb-2 block'>
                      Order Notes (Optional)
                    </label>
                    <Textarea
                      className='w-full border-neutral-300 bg-neutral-50/50 p-3 sm:p-4 text-sm font-serif tracking-wide placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all duration-300 rounded-none resize-none'
                      rows={4}
                      value={notes}
                      onChange={(e: any) => setNotes(e.target.value)}
                      placeholder='Add delivery instructions or special requests...'
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <div className='mt-6 p-4 bg-blue-50/50 rounded-none border border-blue-100'>
                    <TermsCondition
                      checked={isTermsChecked}
                      handleTermCondition={(value: boolean) =>
                        setIsTermsChecked(value)
                      }
                    />
                  </div>

                  {/* Confirm Button */}
                  <ButtonPrimary
                    className='mt-6 w-full h-12 sm:h-14 text-sm sm:text-base font-serif tracking-[0.15em] uppercase rounded-none shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
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
                  <div className='mt-4 flex items-center justify-center gap-2 text-xs font-serif tracking-wide text-neutral-500'>
                    <svg
                      className='w-4 h-4 text-emerald-700'
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

      {/* Coupon Modal/Drawer */}
      <CouponModal
        open={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        appliedCoupon={appliedCoupon}
        customerPhone={formData.mobileNumber}
        orderTotal={transectionData.totalPrice}
        cartItems={cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          category: item.categoryName,
        }))}
        myCoupons={myCoupons}
        isLoadingMyCoupons={isLoadingMyCoupons}
      />
    </div>
  );
};

// Disable SSR to ensure real-time data from backend
export default dynamic(() => Promise.resolve(CheckoutPage), {
  ssr: false,
});
