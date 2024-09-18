import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { FC } from "react";

interface Props {
  checked: boolean;
  handleTermCondition: (value: boolean) => void;
}

const TermsCondition: FC<Props> = ({ checked, handleTermCondition }) => {
  return (
    <div className="rounded-xl ">
      <div className="flex  items-start py-4 leading-relaxed">
        <div className="flex items-center space-x-2 leading-relaxed">
          <Checkbox
            id="terms"
            checked={checked}
            onCheckedChange={(checked: boolean) => handleTermCondition(checked)}
          />
          <Label htmlFor="terms">
            I Have Read & Agree to the website{" "}
            <Link
              href="/terms-conditions"
              className="text-blue-500 font-semibold"
            >
              terms & conditions
            </Link>
            {" and "}
            <Link href="/return-policy" className="text-blue-500 font-semibold">
              return & refund policy
            </Link>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
