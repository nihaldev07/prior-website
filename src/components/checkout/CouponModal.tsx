"use client";

import { useState } from "react";
import { X, Tag, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCoupon } from "@/hooks/useCoupon";
import type { MyCoupon, Coupon } from "@/services/couponService";

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  onApplyCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: () => void;
  appliedCoupon: Coupon | null;
  customerPhone: string;
  orderTotal: number;
  cartItems: Array<{
    id: string;
    quantity: number;
    categoryId?: string;
  }>;
  myCoupons: MyCoupon[];
  isLoadingMyCoupons: boolean;
}

export function CouponModal({
  open,
  onClose,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  customerPhone,
  orderTotal,
  cartItems,
  myCoupons,
  isLoadingMyCoupons,
}: CouponModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { validateCouponCode, formatDiscountText, isExpired } = useCoupon();

  const handleApplyCode = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setError("");
    setSuccess("");

    const products = cartItems.map((item) => ({
      productId: item.id,
      category: item.categoryId ?? "",
    }));

    const response = await validateCouponCode({
      couponCode: couponCode.trim(),
      customerPhone: customerPhone || "",
      orderTotal,
      products,
    });

    setIsValidating(false);

    if (response.success && response.data.valid) {
      setSuccess("Coupon applied successfully!");
      onApplyCoupon(response.data.coupon!);
      setCouponCode("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1000);
    } else {
      setError(response.data.error || "Invalid coupon code");
    }
  };

  const handleApplyMyCoupon = async (myCoupon: MyCoupon) => {
    // Check if expired
    if (isExpired(myCoupon.validUntil)) {
      setError("This coupon has expired");
      return;
    }

    // Check minimum order amount
    if (orderTotal < myCoupon.minOrderAmount) {
      setError(`Minimum order amount ৳${myCoupon.minOrderAmount} required`);
      return;
    }

    // Check remaining uses
    if (myCoupon.remainingUses <= 0) {
      setError("No remaining uses for this coupon");
      return;
    }

    // Convert MyCoupon to Coupon format
    const coupon: Coupon = {
      code: myCoupon.code,
      discountType: myCoupon.discountType,
      discountValue: myCoupon.discountValue,
      discountAmount:
        myCoupon.discountType === "percentage"
          ? (orderTotal * myCoupon.discountValue) / 100
          : myCoupon.discountValue,
      maxUses: myCoupon.remainingUses,
      validUntil: myCoupon.validUntil,
    };

    setSuccess("Coupon applied successfully!");
    onApplyCoupon(coupon);
    setTimeout(() => {
      onClose();
      setSuccess("");
    }, 1000);
  };

  const handleRemove = () => {
    onRemoveCoupon();
    setSuccess("Coupon removed");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleInputChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    setError("");
    setSuccess("");
  };

  // Desktop: Dialog, Mobile: Drawer
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const Content = isMobile ? DrawerContent : DialogContent;
  const Header = isMobile ? DrawerHeader : DialogHeader;
  const Title = isMobile ? DrawerTitle : DialogTitle;
  const Description = isMobile ? DrawerDescription : DialogDescription;

  const modalContent = (
    <div className='flex flex-col space-y-6'>
      {/* Applied Coupon Display */}
      {appliedCoupon && (
        <div className='bg-emerald-50 border border-emerald-200 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Check className='h-5 w-5 text-emerald-700' />
              <div>
                <p className='font-serif font-medium text-emerald-900'>
                  {appliedCoupon.code}
                </p>
                <p className='text-sm text-emerald-700'>
                  {formatDiscountText(appliedCoupon)} - Save ৳
                  {appliedCoupon.discountAmount}
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRemove}
              className='text-red-600 hover:text-red-700 hover:bg-red-50 font-serif'>
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Coupon Code Input */}
      {!appliedCoupon && (
        <div className='space-y-3'>
          <label className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700'>
            Enter Coupon Code
          </label>
          <div className='flex gap-2'>
            <Input
              type='text'
              placeholder='COUPON CODE'
              value={couponCode}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
              disabled={isValidating}
              className='flex-1 uppercase font-serif tracking-wide'
            />
            <Button
              onClick={handleApplyCode}
              disabled={isValidating || !couponCode.trim()}
              className='bg-neutral-900 hover:bg-neutral-800 rounded-none font-serif tracking-wide'>
              {isValidating ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* My Available Coupons */}
      {!appliedCoupon && !isLoadingMyCoupons && myCoupons.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700'>
            My Available Coupons
          </h3>
          <ScrollArea className='h-[200px] pr-4'>
            <div className='space-y-2'>
              {myCoupons
                .filter(
                  (coupon) =>
                    coupon.status === "active" &&
                    !isExpired(coupon.validUntil) &&
                    coupon.remainingUses > 0,
                )
                .map((coupon) => (
                  <div
                    key={coupon._id}
                    onClick={() => handleApplyMyCoupon(coupon)}
                    className='flex items-center justify-between p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors'>
                    <div className='flex items-center gap-3'>
                      <Tag className='h-8 w-8 text-neutral-600' />
                      <div>
                        <p className='font-serif font-medium text-neutral-900'>
                          {coupon.code}
                        </p>
                        <p className='text-sm text-neutral-600'>
                          {formatDiscountText(coupon)} • {coupon.remainingUses}{" "}
                          uses left
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className='font-serif text-xs bg-blue-50 text-blue-700 border-blue-200'>
                      Tap to apply
                    </Badge>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
          <p className='text-sm font-serif text-red-700'>{error}</p>
        </div>
      )}

      {success && (
        <div className='bg-emerald-50 border border-emerald-200 rounded-lg p-3'>
          <p className='text-sm font-serif text-emerald-700'>{success}</p>
        </div>
      )}
    </div>
  );

  // Mobile Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className='h-[85vh]'>
          <Header className='px-6 pb-4'>
            <div className='flex items-center justify-between'>
              <Title>Apply Coupon</Title>
              <Button
                variant='ghost'
                size='icon'
                onClick={onClose}
                className='h-8 w-8'>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <Description>
              Enter your coupon code or select from your available coupons
            </Description>
          </Header>
          <div className='px-6 pb-6'>{modalContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Dialog
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Content className='sm:max-w-md'>
        <Header>
          <DialogTitle>Apply Coupon</DialogTitle>
          <DialogDescription>
            Enter your coupon code or select from your available coupons
          </DialogDescription>
        </Header>
        <div className='p-6'>{modalContent}</div>
      </Content>
    </Dialog>
  );
}
