"use client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Order } from "../interface";

const bdt = (n: number) =>
  `৳${n.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

const VariationChips = ({
  variation,
}: {
  variation: { color: string | null; size: string | null } | null;
}) => {
  if (!variation || (!variation.color && !variation.size)) return null;
  return (
    <div className='flex flex-wrap gap-1.5 mt-1'>
      {variation.color && (
        <Badge
          variant='outline'
          className='text-[11px] font-normal px-1.5 py-0 h-5 border-slate-200 text-slate-600'>
          {variation.color}
        </Badge>
      )}
      {variation.size && (
        <Badge
          variant='outline'
          className='text-[11px] font-normal px-1.5 py-0 h-5 border-slate-200 text-slate-600'>
          {variation.size}
        </Badge>
      )}
    </div>
  );
};

const OrderProductsTable = ({ order }: { order: Order }) => {
  const grandTotal =
    order.totalPrice - (order.discount || 0) + (order.deliveryCharge || 0);

  return (
    <div>
      {/* Desktop table */}
      <div className='hidden sm:block'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
              <th className='py-3 pl-1 font-medium'>Product</th>
              <th className='py-3 font-medium text-center'>Qty</th>
              <th className='py-3 font-medium text-right'>Unit Price</th>
              <th className='py-3 pr-1 font-medium text-right'>Total</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {order.products.map((product: any) => (
              <tr key={product.id} className='align-top'>
                <td className='py-3 pl-1'>
                  <div className='flex items-start gap-3'>
                    <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          sizes='56px'
                          className='object-cover'
                        />
                      ) : null}
                    </div>
                    <div className='min-w-0'>
                      <p className='font-medium text-slate-900 leading-snug line-clamp-2'>
                        {product.name}
                      </p>
                      <VariationChips variation={product.variation} />
                    </div>
                  </div>
                </td>
                <td className='py-3 text-center text-slate-700'>
                  {product.quantity}
                </td>
                <td className='py-3 text-right text-slate-700'>
                  {bdt(product.unitPrice)}
                </td>
                <td className='py-3 pr-1 text-right font-medium text-slate-900'>
                  {bdt(product.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className='sm:hidden divide-y divide-slate-100'>
        {order.products.map((product: any) => (
          <div
            key={product.id}
            className='flex gap-3 py-3 first:pt-0 last:pb-0'>
            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50'>
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.name}
                  fill
                  sizes='56px'
                  className='object-cover'
                />
              ) : null}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='font-medium text-slate-900 leading-snug'>
                {product.name}
              </p>
              <VariationChips variation={product.variation} />
              <div className='mt-1.5 flex items-center justify-between text-sm'>
                <span className='text-slate-500'>
                  {product.quantity} × {bdt(product.unitPrice)}
                </span>
                <span className='font-medium text-slate-900'>
                  {bdt(product.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className='my-4' />

      {/* Payment summary */}
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between text-slate-600'>
          <span>Subtotal</span>
          <span>{bdt(order.totalPrice)}</span>
        </div>
        {order.discount > 0 && (
          <div className='flex justify-between text-slate-600'>
            <span>Discount</span>
            <span className='text-emerald-600'>-{bdt(order.discount)}</span>
          </div>
        )}
        <div className='flex justify-between text-slate-600'>
          <span>Delivery Charge</span>
          <span>{bdt(order.deliveryCharge || 0)}</span>
        </div>
        <Separator className='my-2' />
        <div className='flex justify-between font-semibold text-slate-900'>
          <span>Grand Total</span>
          <span>{bdt(grandTotal)}</span>
        </div>
        <div className='flex justify-between text-slate-600'>
          <span>Paid</span>
          <span>{bdt(order.paid || 0)}</span>
        </div>
        <div className='flex justify-between font-medium'>
          <span className='text-slate-700'>Due</span>
          <span
            className={
              order.remaining > 0 ? "text-rose-600" : "text-emerald-600"
            }>
            {order.remaining > 0 ? bdt(order.remaining) : "Fully Paid"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderProductsTable;
