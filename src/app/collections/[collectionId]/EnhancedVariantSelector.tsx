"use client";
import * as React from "react";
import { Palette, Ruler, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SingleProductType, Variation } from "@/data/types";
import Swal from "sweetalert2";

interface Props {
  type: "size" | "color";
  selectedProduct: SingleProductType;
  list: string[];
  selected: string;
  selectedVariant: Variation | null;
  onVariantChange: (variant: Variation) => void;
}

const EnhancedVariantSelector: React.FC<Props> = ({
  type,
  selectedProduct,
  list,
  selected,
  selectedVariant,
  onVariantChange,
}) => {
  const [variations, setVariations] = React.useState<any[]>([]);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!!selectedProduct && !!selectedProduct?.variation) {
      setVariations(selectedProduct?.variation ?? []);
    }
    //eslint-disable-next-line
  }, [selectedProduct]);

  const handleVariantChange = (value: string) => {
    const vType: "size" | "color" = type;
    const rType = vType === "color" ? "size" : "color";
    const selectedRev = !!selectedVariant ? selectedVariant[rType] ?? "" : "";

    const filteredVariants = variations.filter((variant: Variation) => {
      return (
        variant[vType].includes(value) && variant[rType].includes(selectedRev)
      );
    });

    if (filteredVariants.length > 0) {
      const selectedVariantData = filteredVariants[0];
      onVariantChange(selectedVariantData);
    } else {
      Swal.fire({
        title: "Out Of Stock",
        text: "This variant is currently out of stock",
        icon: "error",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "OK",
      });
    }
  };

  // Get available quantities for each variant
  const getVariantInfo = (value: string) => {
    const vType: "size" | "color" = type;
    const rType = vType === "color" ? "size" : "color";
    const selectedRev = !!selectedVariant ? selectedVariant[rType] ?? "" : "";

    const filteredVariants = variations.filter((variant: Variation) => {
      return (
        variant[vType].includes(value) &&
        (selectedRev === "" || variant[rType].includes(selectedRev))
      );
    });

    const totalQuantity = filteredVariants.reduce(
      (sum, variant) => sum + (variant.quantity || 0),
      0
    );
    const isAvailable = totalQuantity > 0;

    return { quantity: totalQuantity, isAvailable };
  };

  const getIcon = () => {
    return type === "color" ? (
      <Palette className='h-4 w-4' />
    ) : (
      <Ruler className='h-4 w-4' />
    );
  };

  const getColorPreview = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      purple: "#8b5cf6",
      pink: "#ec4899",
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      brown: "#92400e",
      orange: "#f97316",
      navy: "#1e3a8a",
      beige: "#f5f5dc",
      maroon: "#800000",
      olive: "#808000",
      teal: "#14b8a6",
    };

    const colorKey = colorName.toLowerCase();
    return colorMap[colorKey] || "#6b7280";
  };

  if (!list || list.length === 0) return null;

  return (
    <div className='space-y-3'>
      {/* Custom Button-based Selector for Better Visual Appeal */}
      <div className='space-y-3'>
        <div className='flex items-center space-x-2'>
          {getIcon()}
          <span className='font-medium text-sm text-zinc-900'>
            {type === "color" ? "Color" : "Size"}
          </span>
          {/* {selected && (
            <Badge
              variant='secondary'
              className='text-xs bg-gray-800 text-white'>
              {selected.toUpperCase()}
            </Badge>
          )} */}
        </div>

        {/* Button Grid for Visual Selection */}
        <div className='flex flex-wrap gap-2'>
          {list
            .filter((item) => !!item)
            .map((value, index) => {
              const variantInfo = getVariantInfo(value);
              const isSelected = selected === value;
              const isOutOfStock = !variantInfo.isAvailable;

              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "relative h-9 px-4 transition-all duration-200",
                    "border shadow-sm whitespace-nowrap rounded ",
                    !isOutOfStock && !isSelected && "hover:bg-gray-100"
                  )}
                  onClick={() => {
                    if (isOutOfStock) {
                      const otherType = type === "color" ? "size" : "color";
                      const otherValue = selectedVariant?.[otherType] || "";
                      const colorText = type === "color" ? value : otherValue;
                      const sizeText = type === "size" ? value : otherValue;

                      toast.error(
                        `${
                          colorText ? `Color: ${colorText.toUpperCase()}` : ""
                        }${colorText && sizeText ? " | " : ""}${
                          sizeText ? `Size: ${sizeText.toUpperCase()}` : ""
                        } is currently out of stock`
                      );
                    } else {
                      handleVariantChange(value);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(null)}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <span
                    className={cn(
                      "font-medium text-sm flex items-center gap-1.5",
                      isSelected
                        ? "text-white"
                        : isOutOfStock
                        ? "text-red-600"
                        : "text-zinc-800 dark:text-zinc-200"
                    )}>
                    {value.toUpperCase()}
                    {isOutOfStock && <XCircle className='h-3.5 w-3.5' />}
                  </span>
                </Button>
              );
            })}
        </div>

        {/* Hover Info Card */}
        {hoveredItem && (
          <Card className='absolute z-50 mt-2 p-0 shadow-lg border animate-in fade-in-0 zoom-in-95'>
            <CardContent className='p-3'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium'>
                  {hoveredItem.toUpperCase()}
                </span>
                {(() => {
                  const info = getVariantInfo(hoveredItem);
                  return info.isAvailable ? (
                    <Badge
                      variant='outline'
                      className='text-xs text-green-600 border-green-200 ml-2'>
                      {info.quantity} available
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-xs text-red-600 border-red-200 ml-2'>
                      Out of stock
                    </Badge>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fallback Select Component for Complex Cases */}
      <div className='hidden'>
        <Select
          value={selected}
          onValueChange={(value: string) => handleVariantChange(value)}>
          <SelectTrigger className='w-full h-12 border-2 hover:border-primary/50 transition-colors'>
            <div className='flex items-center space-x-2'>
              {getIcon()}
              <SelectValue
                placeholder={`Select ${type}`}
                className='text-left'
              />
            </div>
          </SelectTrigger>
          <SelectContent position='popper' className='z-50 min-w-[200px]'>
            <SelectGroup>
              <SelectLabel className='flex items-center space-x-2 py-2'>
                {getIcon()}
                <span>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Options
                </span>
              </SelectLabel>
              {list
                .filter((item) => !!item)
                .map((value, index) => {
                  const variantInfo = getVariantInfo(value);
                  const isOutOfStock = !variantInfo.isAvailable;

                  return (
                    <SelectItem
                      key={index}
                      value={value}
                      disabled={isOutOfStock}
                      className={cn(
                        "cursor-pointer hover:bg-accent",
                        isOutOfStock && "opacity-50 cursor-not-allowed"
                      )}>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center space-x-3'>
                          {type === "color" && (
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full border",
                                value.toLowerCase() === "white"
                                  ? "border-gray-300"
                                  : "border-transparent"
                              )}
                              style={{
                                backgroundColor: getColorPreview(value),
                              }}
                            />
                          )}
                          <span className='font-medium'>
                            {value.toUpperCase()}
                          </span>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {isOutOfStock ? (
                            <Badge
                              variant='outline'
                              className='text-xs text-red-600 border-red-200 ml-2'>
                              Out of stock
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='text-xs text-green-600 border-green-200 ml-2'>
                              {variantInfo.quantity} left
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Selection Summary */}
      {/* {selected && (
        <div className=' items-center justify-between text-sm text-muted-foreground bg-zinc-100 rounded-lg p-3 '>
          <div className='flex items-center space-x-2'>
            <span>Selected {type}:</span>
            <Badge variant='default' className='font-medium bg-orange-800'>
              {selected.toUpperCase()}
            </Badge>
          </div>
          {(() => {
            const info = getVariantInfo(selected);
            return (
              <span className='text-xs'>
                {info.quantity} {info.quantity === 1 ? "item" : "items"}{" "}
                available
              </span>
            );
          })()}
        </div>
      )} */}
    </div>
  );
};

export default EnhancedVariantSelector;
/**
 * type === "color" ? (
                    <div className='relative w-full h-full flex items-center justify-center'>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border-4 shadow-sm",
                          isSelected
                            ? "border-primary"
                            : isOutOfStock
                            ? "border-red-300"
                            : "border-gray-300"
                        )}
                        style={{ backgroundColor: getColorPreview(value) }}
                        onClick={() =>
                          !isOutOfStock &&
                          type === "color" &&
                          handleVariantChange(value)
                        }
                      />
                      {isSelected && (
                        <Check
                          className={`absolute h-4 w-4 ${
                            value.toLowerCase() === "white"
                              ? "text-primary"
                              : "text-white"
                          } `}
                        />
                      )}
                    </div>
                  ) :
 */
