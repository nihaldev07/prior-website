"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FC } from "react";

interface Props {
  checked: boolean;
  handleTermCondition: (value: boolean) => void;
}

const TermsCondition: FC<Props> = ({ checked, handleTermCondition }) => {
  return (
    <div className="rounded-xl ">
      <div className="flex  items-start p-4 ">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={checked}
            onCheckedChange={(checked: boolean) => handleTermCondition(checked)}
          />
          <Label htmlFor="terms">
            I Have Read & Agree to the website{" "}
            <a href="/terms-conditions" className="text-blue-500 font-semibold">
              terms & conditions
            </a>
            {" and "}
            <a href="/return-policy" className="text-blue-500 font-semibold">
              return policy
            </a>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
