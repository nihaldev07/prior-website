import type { FC } from "react";

// import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Button } from "@/components/ui/button";
import { Banknote, Coins, Truck } from "lucide-react";
import Image from "next/image";
import BkashLogo from "@/images/BKash-Icon-Logo.wine.png";
interface Props {
  prePaymentAmount?: number;
  district?: string;
  paymentMethod: string;
  handlePaymentMethodChange: (value: string) => void;
}

const PaymentMethod: FC<Props> = ({
  prePaymentAmount = 0,
  district = "",
  paymentMethod,
  handlePaymentMethodChange,
}) => {
  return (
    <div className='rounded-xl border border-neutral-300 bg-white'>
      <div className='flex flex-col items-start p-6 sm:flex-row'>
        <span className='hidden sm:block'>
          <Coins className='text-3xl text-primary' />
        </span>
        <div className='flex w-full items-center justify-between'>
          <div className='sm:ml-8'>
            <h3 className='uppercase '>PAYMENT METHOD</h3>
            <div className='mt-1 text-sm font-semibold'></div>
          </div>
        </div>
      </div>

      <div
        className={`space-y-6 border-t border-neutral-300 px-6 py-7 ${"block"}`}>
        {/* ==================== */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Button
            variant={paymentMethod === "cashondelivery" ? "default" : "outline"}
            onClick={() => handlePaymentMethodChange("cashondelivery")}>
            <Banknote className='mr-2 size-5' />{" "}
            {!!prePaymentAmount && prePaymentAmount > 0
              ? `Cash On Delivery (Advance ${prePaymentAmount}TK)`
              : district.toLowerCase().includes("dhaka")
              ? "Cash On Delivery"
              : ["gazipur", "tongi", "narayanganj", "savar"].includes(
                  district.replace(/\s*\(.*?\)\s*/g, "").toLowerCase()
                )
              ? "Cash On Delivery (Advance 130TK)"
              : "Cash On Delivery (Advance 150TK)"}
          </Button>
          <Button
            className='flex justify-center items-center'
            variant={paymentMethod === "bkash" ? "default" : "outline"}
            onClick={() => handlePaymentMethodChange("bkash")}>
            <Image
              src={BkashLogo}
              width={32}
              height={32}
              className='mr-2'
              alt='bkash-logo'
            />{" "}
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
