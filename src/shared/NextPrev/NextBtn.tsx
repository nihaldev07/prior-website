import { ArrowRight } from "lucide-react";
import type { ButtonHTMLAttributes, FC } from "react";
import React from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

const NextBtn: FC<Props> = ({ className = "w-10 h-10 text-lg", ...args }) => {
  return (
    <button
      type="button"
      className={`NextBtn ${className} inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white hover:border-neutral-300`}
      {...args}
    >
      <ArrowRight className="text-2xl" />
    </button>
  );
};

export default NextBtn;
