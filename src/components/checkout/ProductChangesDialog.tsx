"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Package,
  Tag,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { ProductChange, formatPriceChange } from "@/utils/productComparison";
import { formatPrice } from "@/utils/functions";

interface ProductChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: ProductChange[];
  onContinue: () => void;
}

const ProductChangesDialog: React.FC<ProductChangesDialogProps> = ({
  open,
  onOpenChange,
  changes,
  onContinue,
}) => {
  const renderChangeIcon = (change: ProductChange["changes"]) => {
    if (change.productRemoved || change.productInactive) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (
      change.priceChanged?.difference ||
      change.discountedPriceChanged?.difference
    ) {
      const diff =
        change.discountedPriceChanged?.difference ||
        change.priceChanged?.difference ||
        0;
      return diff > 0 ? (
        <TrendingUp className="h-5 w-5 text-red-500" />
      ) : (
        <TrendingDown className="h-5 w-5 text-green-500" />
      );
    }
    if (change.discountChanged) {
      return <Tag className="h-5 w-5 text-blue-500" />;
    }
    if (change.quantityChanged) {
      return <Package className="h-5 w-5 text-orange-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  const renderChangeDetails = (change: ProductChange) => {
    const { changes } = change;

    return (
      <div className="space-y-2">
        {changes.productRemoved && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="destructive">Removed from store</Badge>
            <span className="text-gray-600">
              This product is no longer available and has been removed from your
              cart
            </span>
          </div>
        )}

        {changes.productInactive && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="destructive">Unavailable</Badge>
            <span className="text-gray-600">
              This product is currently unavailable and has been removed from
              your cart
            </span>
          </div>
        )}

        {changes.priceChanged && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Price:</span>
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                ৳{formatPrice(changes.priceChanged.old)}
              </span>
              <span className="font-semibold text-gray-900">
                ৳{formatPrice(changes.priceChanged.new)}
              </span>
              <Badge
                variant={
                  changes.priceChanged.difference > 0 ? "destructive" : "default"
                }
                className={
                  changes.priceChanged.difference > 0
                    ? ""
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                {formatPriceChange(changes.priceChanged.difference)}
              </Badge>
            </div>
          </div>
        )}

        {changes.discountChanged && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Discount Amount:</span>
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                ৳{formatPrice(changes.discountChanged.old)}
              </span>
              <span className="font-semibold text-gray-900">
                ৳{formatPrice(changes.discountChanged.new)}
              </span>
              <Badge
                variant={
                  changes.discountChanged.difference > 0 ? "default" : "destructive"
                }
                className={
                  changes.discountChanged.difference > 0
                    ? "bg-green-100 text-green-800 border-green-200"
                    : ""
                }>
                {formatPriceChange(changes.discountChanged.difference)}
              </Badge>
            </div>
          </div>
        )}

        {changes.discountedPriceChanged && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Final Price:</span>
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                ৳{formatPrice(changes.discountedPriceChanged.old)}
              </span>
              <span className="font-semibold text-gray-900">
                ৳{formatPrice(changes.discountedPriceChanged.new)}
              </span>
              <Badge
                variant={
                  changes.discountedPriceChanged.difference > 0
                    ? "destructive"
                    : "default"
                }
                className={
                  changes.discountedPriceChanged.difference > 0
                    ? ""
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                {formatPriceChange(changes.discountedPriceChanged.difference)}
              </Badge>
            </div>
          </div>
        )}

        {changes.quantityChanged && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <span className="line-through text-gray-400">
                {changes.quantityChanged.old}
              </span>
              <span className="font-semibold text-gray-900">
                {changes.quantityChanged.new}
              </span>
              <Badge variant="outline" className="text-xs">
                Only {changes.quantityChanged.available} available
              </Badge>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            Cart Items Updated
          </DialogTitle>
          <DialogDescription className="text-base">
            Some products in your cart have been updated. Please review the
            changes below before continuing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {changes.map((change, index) => (
            <div
              key={change.productId}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1">{renderChangeIcon(change.changes)}</div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 text-base leading-tight">
                      {change.productName}
                    </h4>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      #{change.productId}
                    </Badge>
                  </div>
                  {renderChangeDetails(change)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-600">
            <ShoppingCart className="h-4 w-4" />
            <span>
              {changes.filter((c) => !c.changes.productRemoved && !c.changes.productInactive).length}{" "}
              {changes.filter((c) => !c.changes.productRemoved && !c.changes.productInactive).length === 1
                ? "item"
                : "items"}{" "}
              updated
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto">
            Review Cart
          </Button>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            Continue to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductChangesDialog;
