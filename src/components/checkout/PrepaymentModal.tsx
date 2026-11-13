"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface PrepaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Required advance amount in BDT */
  amount: number;
  /** Called only when the customer confirms */
  onConfirm: () => void;
}

/**
 * Confirmation popup shown before placing a COD order that carries a
 * prepayment-rule advance.
 */
const PrepaymentModal = ({
  open,
  onOpenChange,
  amount,
  onConfirm,
}: PrepaymentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm rounded-2xl'>
        <DialogHeader className='items-center text-center'>
          <div className='mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50'>
            <Wallet className='h-6 w-6 text-emerald-600' />
          </div>
          <DialogTitle className='text-base font-semibold'>
            Advance Payment Required
          </DialogTitle>
          <DialogDescription className='text-center text-sm leading-relaxed'>
            An advance payment of{" "}
            <span className='font-semibold text-emerald-700'>৳{amount}</span> is
            required for this order. The remaining amount is payable on
            delivery.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-row gap-2 sm:justify-center'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button
            className='flex-1 bg-emerald-600 hover:bg-emerald-500'
            onClick={onConfirm}>
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrepaymentModal;
