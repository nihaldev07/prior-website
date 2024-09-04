import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const SelectDemo: React.FC<Props> = ({
  type,
  selectedProduct,
  list,
  selected,
  selectedVariant,
  onVariantChange,
}) => {
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
      Swal.fire("Out Of Stock", "This variant is out of stock", "error");
    }
  };

  return (
    <Select
      value={selected}
      onValueChange={(value: string) =>
        //@ts-ignore
        handleVariantChange(value)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={`SELECT A ${type.toUpperCase()}`}
          onClick={(e) => e.stopPropagation()}
        />
      </SelectTrigger>
      <SelectContent position="popper" className="z-30 select-content-up">
        <SelectGroup>
          <SelectLabel>{type.toUpperCase()}</SelectLabel>
          {list.map((v, i) => (
            <SelectItem
              key={i}
              value={v}
              onClick={(event) => event.stopPropagation()}
            >
              {v.toUpperCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectDemo;
