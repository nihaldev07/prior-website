import type { FC } from "react";
import React from "react";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";

interface ICustomerInformation {
  name: string;
  email: string;
  phoneNumber: string;
}

interface Props {
  isActive: boolean;
  customerInformation: ICustomerInformation;
  onOpenActive: () => void;
  onCloseActive: () => void;
  handleContactInfoChange: (key: string, value: string) => void;
}

const ContactInfo: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  customerInformation,
  handleContactInfoChange,
}) => {
  return (
    <div className="z-0 overflow-hidden rounded-xl border border-neutral-300">
      <div className="flex flex-col items-start p-6 sm:flex-row ">
        <span className="hidden sm:block">
          <FaRegCircleUser className="text-3xl text-primary" />
        </span>
        <div className="flex w-full items-center justify-between">
          <div className="sm:ml-8">
            <div className="uppercase tracking-tight">CONTACT INFORMATION</div>
            <div className="mt-1 text-sm font-semibold">
              <span className="">{customerInformation?.name}</span>
              <span className="ml-3 tracking-tighter">
                {customerInformation?.phoneNumber}
              </span>
            </div>
          </div>
          <ButtonSecondary
            sizeClass="py-2 px-4"
            className="border-2 border-primary text-primary"
            onClick={onOpenActive}
          >
            Edit
          </ButtonSecondary>
        </div>
      </div>
      <div
        className={`space-y-4 border-t border-neutral-300 px-6 py-7 sm:space-y-6 ${
          isActive ? "block" : "hidden"
        }`}
      >
        <h3 className="text-lg font-semibold">Contact infomation</h3>
        <div className="max-w-lg">
          <FormItem label="Your Name">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className="border border-gray-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              defaultValue=""
              placeholder="Enter Your Name"
              type="text"
              value={customerInformation?.name}
              onChange={(e) => handleContactInfoChange("name", e.target.value)}
            />
          </FormItem>
        </div>
        <div className="max-w-lg">
          <FormItem label="Your phone number">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className="border border-gray-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              defaultValue=""
              placeholder="Enter your mobile number"
              type="text"
              value={customerInformation?.phoneNumber}
              onChange={(e) =>
                handleContactInfoChange("phoneNumber", e.target.value)
              }
            />
          </FormItem>
        </div>
        <div className="max-w-lg">
          <FormItem label="Email address">
            <Input
              rounded="rounded-lg"
              sizeClass="h-12 px-4 py-3"
              className="border border-gray-300 bg-transparent placeholder:text-neutral-500 focus:border-primary"
              type="email"
              placeholder="Enter Your Email"
              value={customerInformation?.email}
              onChange={(e) => handleContactInfoChange("email", e.target.value)}
            />
          </FormItem>
        </div>
        {/* <div>
          <Checkbox
            className='!text-sm'
            name='uudai'
            label='Email me news and offers'
            defaultChecked
          />
        </div> */}

        {/* ============ */}
        <div className="flex flex-col pt-6 sm:flex-row">
          <ButtonPrimary
            className="shadow-none sm:!px-7"
            onClick={() => onCloseActive()}
          >
            Save and go to Shipping
          </ButtonPrimary>
          <ButtonSecondary
            className="mt-3 sm:ml-3 sm:mt-0"
            onClick={() => onCloseActive()}
          >
            Cancel
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
