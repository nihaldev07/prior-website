import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/Shadcn/Select";
import { SingleProductType, Variation } from "@/data/types";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  type: "size" | "color";
  selectedProduct: SingleProductType;
  list: string[];
  selected: string;
  selectedVariant: Variation | null;
  onVariantChange: (variant: Variation) => void;
}

const SelectDemo: React.FC<Props> = ({
  type,
  selectedProduct,
  list,
  selected,
  selectedVariant,
  onVariantChange,
}) => {
  const toast = useToast();

  const handleVariantChange = (value: string) => {
    const vType: "size" | "color" = type;

    const rType = vType === "color" ? "size" : "color";
    const selectedRev = !!selectedVariant ? selectedVariant[rType] ?? "" : "";

    const filteredVariants = selectedProduct.variation.filter(
      (variant: Variation) => {
        return (
          variant[vType] === value &&
          (variant[rType] === selectedRev || variant.quantity > 0)
        );
      }
    );

    if (filteredVariants.length > 0) {
      const selectedVariantData = filteredVariants[0];
      onVariantChange(selectedVariantData);
    } else {
      toast({
        title: "This variant is out of stock",
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={selected}
      onValueChange={(value: string) =>
        //@ts-ignore
        handleVariantChange(value)
      }>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={`SELECT A ${type.toUpperCase()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{type.toUpperCase()}</SelectLabel>
          {list.map((v, i) => (
            <SelectItem key={i} value={v}>
              {v.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectDemo;
