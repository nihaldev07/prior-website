"use client";

import type { FC } from "react";
import { Banknote, Wallet } from "lucide-react";
import Image from "next/image";
import BkashLogo from "@/images/BKash-Icon-Logo.wine.png";
import { cn } from "@/lib/utils";

interface Props {
  prePaymentAmount?: number;
  prepaymentRuleName?: string | null;
  paymentMethod: string;
  handlePaymentMethodChange: (value: string) => void;
}

const PaymentMethod: FC<Props> = ({
  prePaymentAmount = 0,
  prepaymentRuleName,
  paymentMethod,
  handlePaymentMethodChange,
}) => {
  const hasAdvance = !!prePaymentAmount && prePaymentAmount > 0;

  return (
    <div className='rounded-2xl border border-neutral-200 bg-white shadow-sm'>
      <div className='p-4 sm:p-5'>
        <h3 className='flex items-center font-semibold text-neutral-900 text-base mb-4'>
          <div className='w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2.5'>
            <Wallet className='h-4 w-4 text-neutral-600' />
          </div>
          Payment Method
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {/* Cash on Delivery */}
          <button
            type='button'
            onClick={() => handlePaymentMethodChange("cashondelivery")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
              paymentMethod === "cashondelivery"
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50",
            )}>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200",
                paymentMethod === "cashondelivery"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500",
              )}>
              <Banknote className='w-5 h-5' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-neutral-900'>
                Cash on Delivery
              </p>
              <p className='text-[11px] text-neutral-500 mt-0.5'>
                {hasAdvance
                  ? `Advance ৳${prePaymentAmount.toLocaleString()} required${
                      prepaymentRuleName ? ` (${prepaymentRuleName})` : ""
                    }`
                  : "Pay when you receive"}
              </p>
            </div>
            {/* Radio indicator */}
            <div
              className={cn(
                "ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200",
                paymentMethod === "cashondelivery"
                  ? "border-neutral-900"
                  : "border-neutral-300",
              )}>
              {paymentMethod === "cashondelivery" && (
                <div className='w-2 h-2 rounded-full bg-neutral-900' />
              )}
            </div>
          </button>

          {/* bKash */}
          <button
            type='button'
            onClick={() => handlePaymentMethodChange("bkash")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left",
              paymentMethod === "bkash"
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50",
            )}>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden transition-colors duration-200",
                paymentMethod === "bkash"
                  ? "bg-neutral-100"
                  : "bg-neutral-100",
              )}>
              <Image
                src={BkashLogo}
                width={24}
                height={24}
                className='object-contain'
                alt='bKash'
              />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-neutral-900'>
                Pay with bKash
              </p>
              <p className='text-[11px] text-neutral-500 mt-0.5'>
                Secure online payment
              </p>
            </div>
            {/* Radio indicator */}
            <div
              className={cn(
                "ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200",
                paymentMethod === "bkash"
                  ? "border-neutral-900"
                  : "border-neutral-300",
              )}>
              {paymentMethod === "bkash" && (
                <div className='w-2 h-2 rounded-full bg-neutral-900' />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
