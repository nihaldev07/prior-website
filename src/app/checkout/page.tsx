"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import InputNumber from "@/shared/InputNumber/InputNumber";

import PaymentMethod from "./PaymentMethod";
import { CartItem, useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { createOrder } from "@/utils/orderFunctions";
import { bkashCheckout } from "@/utils/payment";
import {
  isValidBangladeshiPhoneNumber,
  getDeliveryChargeByDistrictId,
} from "@/utils/content";
import { useLocations } from "@/hooks/useLocations";
import { evaluatePrepayment } from "@/services/prepaymentService";
import { fetchBulkProducts } from "@/services/productServices";
import { compareProducts } from "@/utils/productComparison";
import ProductChangesDialog from "@/components/checkout/ProductChangesDialog";
import PrepaymentModal from "@/components/checkout/PrepaymentModal";
import {
  Loader2,
  TrashIcon,
  User,
  LogIn,
  Disc2,
  PackageOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserInformation from "./userForm";
import TermsCondition from "./agreeToTerns";
import { trackBeginCheckout, trackCustomEvent } from "@/lib/analytics";
import { hashUserData } from "@/lib/hashing";
import { useFacebookCookies } from "@/hooks/useFacebookCookies";
import {
  formatVariant,
  formatPrice,
  ceilPrice,
  floorPrice,
  getEffectiveUnitPrice,
  getLineDiscount,
  sanitizeCartItem,
} from "@/utils/functions";
import { Textarea } from "@/components/ui/textarea";
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
  districtId?: string;
  division: string;
  address: string;
  postalCode?: string;
}
const CheckoutPage = () => {
  const { cart, clearCart, updateToCart, removeFromCart, bulkUpdateCart } =
    useCart();
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [verifyingProducts, setVerifyingProducts] = useState(false);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [productChanges, setProductChanges] = useState<any[]>([]);
  const isSubmittingRef = useRef(false);
  const { fbc, fbp } = useFacebookCookies();

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
    districtId: "",
    division: "",
    address: "",
    postalCode: "1234",
  });

  const [prePaymentAmount, setPrePaymentAmount] = useState<number>(0);
  const [hasPrepayment, setHasPrepayment] = useState<boolean>(false);
  const [prepaymentRuleName, setPrepaymentRuleName] = useState<string | null>(
    null,
  );
  // Confirmation popup for placing a COD order that carries an advance
  const [showPrepaymentModal, setShowPrepaymentModal] = useState(false);

  // Server-configured delivery charges (admin-managed locations). Falls back
  // to the hardcoded table when the API hasn't loaded / doesn't know the
  // district. The backend recomputes the authoritative charge on order create.
  const { locations } = useLocations();
  const deliveryChargeForDistrict = (districtId: string): number => {
    if (locations) {
      const district = locations.divisions
        .flatMap((d) => d.districts)
        .find((x) => x.sourceId === districtId);
      if (district?.charge) return district.charge;
    }
    return getDeliveryChargeByDistrictId(districtId);
  };

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
            orderTotal:
              transectionData.totalPrice + transectionData.deliveryCharge,
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

  const checkPrepaymentProductData = async (deliveryChargeAmount = 0) => {
    // Rules engine: single evaluation covering campaign products, delivery
    // zones, order total and customer risk (replaces the old two-call flow
    // and the hardcoded deliveryCharge > 80 gate)
    const orderItems = cart.map((item: CartItem) => ({
      productId: item?.id,
      quantity: item?.quantity,
      unitPrice: item?.updatedPrice ?? item?.unitPrice,
    }));
    const response = await evaluatePrepayment(
      {
        district: formData?.district,
        division: formData?.division,
      },
      orderItems,
      deliveryChargeAmount,
      // needed when a rule matches on fraud risk levels
      formData?.mobileNumber,
    );
    setHasPrepayment(response?.required ?? false);
    setPrePaymentAmount(response?.required ? response.amount : 0);
    setPrepaymentRuleName(response?.appliedRule?.name ?? null);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
      cart.reduce(
        (sum, cartdata) => sum + getLineDiscount(cartdata),
        0,
      ),
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
    //eslint-disable-next-line
  }, [cart, appliedCoupon]);

  // Fire begin_checkout event when user arrives on checkout page
  useEffect(() => {
    if (cart && cart.length > 0) {
      const totalValue = cart.reduce(
        (sum, cartdata) =>
          sum + getEffectiveUnitPrice(cartdata) * Number(cartdata.quantity),
        0,
      );

      trackBeginCheckout(cart, totalValue, appliedCoupon?.code || "");
    }
    //eslint-disable-next-line
  }, [cart.length]); // Only fire when cart length changes (page load)

  useEffect(() => {
    if (paymentMethod === "") return;
    if (formData?.districtId === "" || formData.division === "") {
      Swal.fire("Oops!!", "Enter valid shipping address", "error");
    } else {
      // Use the server-configured delivery charge (hardcoded table fallback)
      const deliveryCharge = deliveryChargeForDistrict(
        formData.districtId || "",
      );

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
    if (formData?.districtId === "" && formData.division === "") {
      deliveryChargeX = 0;
    } else {
      // Use the server-configured delivery charge (hardcoded table fallback)
      deliveryChargeX = deliveryChargeForDistrict(
        formData.districtId || "",
      );

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
      // Rules decide whether prepayment applies — no hardcoded charge gate
      if (cart.length > 0) checkPrepaymentProductData(deliveryChargeX);
    }
    //eslint-disable-next-line
  }, [formData?.districtId, formData?.mobileNumber, appliedCoupon, locations]);

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
      hasDiscount,
      updatedPrice,
    } = item;

    const currentPrice = hasDiscount ? (updatedPrice ?? unitPrice) : unitPrice;
    const itemTotal = Number(currentPrice) * quantity;

    return (
      <motion.div
        key={`${id}-${variation}`}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className='group'>
        <div className='flex gap-3 sm:gap-4 py-4'>
          {/* Product Image */}
          <Link
            href={`/products/${id}`}
            className='relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors duration-200'>
            <Image
              fill
              src={thumbnail}
              alt={name}
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='96px'
            />
          </Link>

          {/* Product Details */}
          <div className='flex flex-1 flex-col justify-between min-w-0'>
            <div className='space-y-1'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1 min-w-0'>
                  <Link
                    href={`/products/${id}`}
                    className='font-medium text-sm text-neutral-900 hover:text-neutral-600 transition-colors duration-200 line-clamp-2 leading-snug'>
                    {name}
                  </Link>
                  {categoryName && (
                    <p className='text-[11px] text-neutral-400 mt-0.5'>
                      {categoryName}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className='text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 p-1.5 rounded-lg flex-shrink-0'
                  aria-label='Remove item'>
                  <TrashIcon className='w-3.5 h-3.5' />
                </button>
              </div>

              {variation && (
                <div className='inline-flex items-center self-start text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded'>
                  {formatVariant(variation)}
                </div>
              )}

              <div className='flex items-baseline gap-2'>
                <span className='text-sm font-semibold text-neutral-900'>
                  ৳{Number(currentPrice).toLocaleString()}
                </span>
                {hasDiscount && Number(unitPrice) > Number(currentPrice) && (
                  <span className='text-xs text-neutral-400 line-through'>
                    ৳{Number(unitPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity & Item Total */}
            <div className='flex items-center justify-between mt-2'>
              <InputNumber
                defaultValue={quantity}
                min={1}
                max={maxQuantity}
                onChange={(value) => {
                  updateToCart({
                    ...item,
                    quantity: value,
                    discount: getLineDiscount(item, Number(value)),
                    totalPrice: Number(item.unitPrice) * Number(value),
                  });
                }}
              />
              <p className='text-sm font-semibold text-neutral-900'>
                ৳{itemTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {index < cart.length - 1 && (
          <div className='border-t border-neutral-100' />
        )}
      </motion.div>
    );
  };

  const renderLeft = () => {
    return (
      <div className='space-y-6'>
        {/* Login Prompt */}
        {!authState.isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Card className='rounded-2xl border-neutral-200 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center font-semibold text-neutral-900 text-base'>
                  <div className='w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2.5'>
                    <User className='h-4 w-4 text-neutral-600' />
                  </div>
                  Sign in for faster checkout
                </CardTitle>
                <CardDescription className='text-sm text-neutral-500'>
                  Auto-fill your information and track orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col sm:flex-row gap-3'>
                  <Link href={`/login?redirect=/checkout`} className='flex-1'>
                    <Button
                      variant='outline'
                      className='w-full font-medium rounded-xl border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300'>
                      <LogIn className='h-4 w-4 mr-2' />
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href={`/register?redirect=/checkout`}
                    className='flex-1'>
                    <Button className='w-full font-medium rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300 shadow-sm'>
                      <User className='h-4 w-4 mr-2' />
                      Create Account
                    </Button>
                  </Link>
                </div>
                <p className='text-xs text-neutral-400 mt-3 text-center'>
                  Or continue as guest below
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Logged-in User Info */}
        {authState.isAuthenticated && authState.user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <Card className='rounded-2xl border-neutral-200 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center font-semibold text-neutral-900 text-base'>
                  <div className='w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2.5'>
                    <User className='h-4 w-4 text-neutral-600' />
                  </div>
                  Welcome back, {authState.user.name?.split(" ")[0]}!
                </CardTitle>
                <CardDescription className='text-sm text-neutral-500'>
                  Your information has been auto-filled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='h-10 w-10 bg-neutral-100 rounded-full flex items-center justify-center'>
                      <User className='h-5 w-5 text-neutral-600' />
                    </div>
                    <div>
                      <p className='font-medium text-neutral-900 text-sm'>
                        {authState.user.name}
                      </p>
                      <p className='text-xs text-neutral-500'>
                        {authState.user.email || authState.user.mobileNumber}
                      </p>
                    </div>
                  </div>
                  <Link href='/account/profile'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-neutral-700 hover:bg-neutral-100 rounded-lg text-xs'>
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
            prepaymentRuleName={prepaymentRuleName}
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
    // Prevent duplicate submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setLoading(true);

    // Generate idempotency key for duplicate order prevention
    const idempotencyKey = crypto.randomUUID();

    // Has payment if: using bkash, has prepayment amount, or delivery charge > 80
    const hasPayment = paymentMethod === "bkash" || prePaymentAmount > 0;

    // Calculate payment amount
    let paymentAmount = 0;
    if (prePaymentAmount > 0) {
      paymentAmount = prePaymentAmount;
    }

    // Hash PII for CAPI Advanced Matching
    const hashedPii = await hashUserData({
      email: formData?.email,
      phone: formData?.mobileNumber,
    });

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
      products: orderProducts.map(sanitizeCartItem),
      hasPayment,
      couponCode: appliedCoupon?.code || undefined,
      // Duplicate prevention
      idempotencyKey,
      // CAPI data for server-side event forwarding
      _capi: {
        fbc,
        fbp,
        email: hashedPii.em,
        phone: hashedPii.ph,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      },
    };
    try {
      trackCustomEvent("add_payment_info", {
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

        // Purchase event moved to Thank You page to fire after successful order/payment
        // This ensures we only track completed orders, not initiated ones

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
          // Redirect to Thank You page for COD orders
          const orderNumber = response.data?.order?.orderNumber;
          const total = transectionData?.totalPrice;
          window.location.href = `/order/thank-you?orderNumber=${orderNumber}&method=cod&total=${total}`;
        }
      } else {
        Swal.fire(
          "Failed to place order ☠️",
          response.error || "Something went wrong, please try again",
          "error",
        );
        setLoading(false);
        isSubmittingRef.current = false;
      }
    } catch (error) {
      Swal.fire(
        "Failed to place order ☠️",
        "Something went wrong, please try again",
        "error",
      );
      console.log("error");
      setLoading(false);
      isSubmittingRef.current = false;
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

    // Prepayment rules engine: when a rule requires an advance and the
    // customer is placing a COD order, confirm it in a modal before placing
    // (bkash orders go straight to the gateway to pay it)
    if (hasPrepayment && prePaymentAmount > 0 && paymentMethod !== "bkash") {
      setShowPrepaymentModal(true);
      return;
    }

    // Confirm order if all checks pass
    confirmOrderAndCreateOne();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className='nc-CheckoutPage min-h-screen bg-[#fafafa]'>
      {/* Product Changes Dialog */}
      <ProductChangesDialog
        open={showChangesDialog}
        onOpenChange={setShowChangesDialog}
        changes={productChanges}
        onContinue={() => setShowChangesDialog(false)}
      />

      {/* Prepayment advance confirmation */}
      <PrepaymentModal
        open={showPrepaymentModal}
        onOpenChange={setShowPrepaymentModal}
        amount={prePaymentAmount}
        onConfirm={() => {
          setShowPrepaymentModal(false);
          confirmOrderAndCreateOne();
        }}
      />

      {/* Header */}
      <div className='bg-white border-b border-neutral-100'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10'>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <h1 className='text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900'>
              Checkout
            </h1>
            <p className='text-neutral-500 text-sm mt-1.5'>
              {verifyingProducts
                ? "Verifying product availability..."
                : `${totalItems} ${totalItems === 1 ? "item" : "items"} in your order`}
            </p>
          </motion.div>
        </div>
      </div>

      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Left - Forms */}
          <div className='flex-1'>{renderLeft()}</div>

          {/* Divider */}
          <div className='hidden lg:block shrink-0 w-px bg-neutral-200' />

          {/* Right - Order Summary */}
          <div className='w-full lg:w-[40%]'>
            <div className='lg:sticky lg:top-6'>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}>
                <Card className='rounded-2xl border-neutral-200 overflow-hidden shadow-sm'>
                  <CardHeader className='bg-gradient-to-r from-neutral-50 to-transparent border-b border-neutral-100 pb-3'>
                    <CardTitle className='text-base font-semibold text-neutral-900 flex items-center gap-2'>
                      <div className='w-1 h-5 bg-neutral-900 rounded-full' />
                      Order Summary
                    </CardTitle>
                    <CardDescription className='text-xs text-neutral-500'>
                      Review your items before checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 sm:p-5'>
                    {/* Cart Items */}
                    <div className='max-h-[320px] overflow-y-auto -mx-1 px-1'>
                      <AnimatePresence>
                        {cart.length > 0 ? (
                          cart.map((item, index) => renderProduct(item, index))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='py-10 text-center'>
                            <PackageOpen className='w-8 h-8 text-neutral-300 mx-auto mb-2' />
                            <p className='text-sm text-neutral-400'>
                              Your cart is empty
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                        className='w-full text-xs font-medium rounded-xl border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all duration-300'
                        onClick={() => setIsCouponModalOpen(true)}>
                        <Tag className='h-3.5 w-3.5 mr-1.5' />
                        {appliedCoupon ? (
                          <span>
                            {appliedCoupon.code} - Save ৳
                            {appliedCoupon.discountAmount}
                          </span>
                        ) : (
                          <span>Apply Coupon</span>
                        )}
                      </Button>
                    </div>

                    {/* Price Breakdown */}
                    <div className='mt-5 space-y-2.5 pt-4 border-t border-neutral-100'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-neutral-500'>
                          Subtotal ({totalItems}{" "}
                          {totalItems === 1 ? "item" : "items"})
                        </span>
                        <span className='text-neutral-900 font-medium'>
                          ৳{formatPrice(transectionData?.totalPrice)}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-neutral-500'>
                          Delivery & Handling
                        </span>
                        <span className='text-neutral-900 font-medium'>
                          {transectionData?.deliveryCharge > 0
                            ? `৳${formatPrice(transectionData?.deliveryCharge)}`
                            : "Calculated next"}
                        </span>
                      </div>

                      {transectionData?.discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className='flex justify-between text-sm'>
                          <span className='text-emerald-600'>Discount</span>
                          <span className='text-emerald-600 font-medium'>
                            -৳{transectionData?.discount}
                          </span>
                        </motion.div>
                      )}

                      {appliedCoupon && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className='flex justify-between text-sm'>
                          <span className='text-emerald-600'>
                            Coupon ({appliedCoupon.code})
                          </span>
                          <span className='text-emerald-600 font-medium'>
                            -৳{appliedCoupon.discountAmount}
                          </span>
                        </motion.div>
                      )}

                      {/* Total */}
                      <div className='flex justify-between items-center pt-3 border-t border-neutral-200'>
                        <span className='text-sm font-semibold text-neutral-900'>
                          Total
                        </span>
                        <motion.span
                          key={transectionData?.remaining}
                          initial={{ scale: 1.05 }}
                          animate={{ scale: 1 }}
                          className='text-xl font-bold text-neutral-900'>
                          ৳{transectionData?.remaining?.toLocaleString()}
                        </motion.span>
                      </div>
                    </div>

                    {/* Savings pill */}
                    <AnimatePresence>
                      {transectionData?.discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className='inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full mt-3'>
                          <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
                          You&apos;re saving ৳
                          {transectionData?.discount.toLocaleString()}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Notes */}
                    <div className='mt-4'>
                      <label className='text-xs font-medium text-neutral-600 mb-1.5 block'>
                        Order Notes (Optional)
                      </label>
                      <Textarea
                        className='w-full border-neutral-200 rounded-xl p-3 text-sm placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-200 focus:border-neutral-300 transition-all duration-200 resize-none bg-neutral-50/50'
                        rows={3}
                        value={notes}
                        onChange={(e: any) => setNotes(e.target.value)}
                        placeholder='Delivery instructions or special requests...'
                      />
                    </div>

                    {/* Terms */}
                    <div className='mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200'>
                      <TermsCondition
                        checked={isTermsChecked}
                        handleTermCondition={(value: boolean) =>
                          setIsTermsChecked(value)
                        }
                      />
                    </div>

                    {/* Confirm Button */}
                    <Button
                      className='mt-4 w-full h-12 text-sm font-semibold tracking-wide rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
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
                        {loading && (
                          <Loader2 className='animate-spin w-4 h-4' />
                        )}
                        {redirecting && (
                          <Disc2 className='animate-spin w-4 h-4' />
                        )}
                        {!loading && !redirecting && (
                          <svg
                            className='w-4 h-4'
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
                    </Button>

                    {/* Security Badge */}
                    <div className='mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400'>
                      <svg
                        className='w-3.5 h-3.5 text-emerald-600'
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
              </motion.div>
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
        orderTotal={transectionData.totalPrice + transectionData.deliveryCharge}
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
