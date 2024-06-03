"use client";

import type { FC } from "react";
import { MdOutlineCreditScore } from "react-icons/md";

// import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { Button } from "@/components/ui/button";

interface Props {
  isActive: boolean;
  paymentMethod: string;
  onCloseActive: () => void;
  onOpenActive: () => void;
  handlePaymentMethodChange: (value: string) => void;
}

const PaymentMethod: FC<Props> = ({
  isActive,
  paymentMethod,
  onCloseActive,
  onOpenActive,
  handlePaymentMethodChange,
}) => {
  return (
    <div className='rounded-xl border border-neutral-300 '>
      <div className='flex flex-col items-start p-6 sm:flex-row'>
        <span className='hidden sm:block'>
          <MdOutlineCreditScore className='text-3xl text-primary' />
        </span>
        <div className='flex w-full items-center justify-between'>
          <div className='sm:ml-8'>
            <h3 className='uppercase tracking-tight'>PAYMENT METHOD</h3>
            <div className='mt-1 text-sm font-semibold'></div>
          </div>
          <ButtonSecondary
            sizeClass='py-2 px-4'
            className='border-2 border-primary text-primary'
            onClick={onOpenActive}>
            Edit
          </ButtonSecondary>
        </div>
      </div>

      <div
        className={`space-y-6 border-t border-neutral-300 px-6 py-7 ${
          isActive ? "block" : "hidden"
        }`}>
        {/* ==================== */}
        <div className='w-full grid grid-cols-2 gap-4'>
          <Button
            variant={
              paymentMethod === "cashondelivery" ? "secondary" : "outline"
            }
            onClick={() => handlePaymentMethodChange("cashondelivery")}>
            Cash On Delivery
          </Button>
          <Button
            variant={paymentMethod === "bkash" ? "secondary" : "outline"}
            onClick={() => handlePaymentMethodChange("bkash")}>
            Pay With Bkash
          </Button>
        </div>

        {/* <div className='flex pt-6'>
          <ButtonPrimary
            className='w-full max-w-[240px]'
            onClick={onCloseActive}>
            Confirm order
          </ButtonPrimary>
          <ButtonSecondary className='ml-3' onClick={onCloseActive}>
            Cancel
          </ButtonSecondary>
        </div> */}
      </div>
    </div>
  );
};

export default PaymentMethod;
