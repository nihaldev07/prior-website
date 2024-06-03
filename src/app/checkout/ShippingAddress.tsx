"use client";

import type { FC } from "react";
import React, { useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import FormItem from "@/shared/FormItem";
import Input from "@/shared/Input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Shadcn/Select";
import { BDDistrictList, BDDivisions } from "@/utils/content";

interface Props {
  isActive: boolean;
  address: string;
  handleShippingAddressChange: (key: string, value: string) => void;
  onCloseActive: () => void;
  onOpenActive: () => void;
}
const defaultShippingAddress = {
  division: {},
  district: {},
  address: "",
};

const ShippingAddress: FC<Props> = ({
  isActive,
  address,
  onCloseActive,
  onOpenActive,
  handleShippingAddressChange,
}) => {
  const [divisionQuery, setDivisionQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [shippingAddress, setShippingAddress] = useState(
    defaultShippingAddress
  );

  const handleShippingDivChange = (id: string, name: string) => {
    if (name === "division") {
      const filteredDivision = BDDivisions.filter(
        (division) => division?.id === id
      );
      if (filteredDivision.length > 0) {
        setShippingAddress({
          ...shippingAddress,
          division: filteredDivision[0],
        });
        handleShippingAddressChange(
          "division",
          //@ts-ignore
          `${filteredDivision[0]?.name}(${filteredDivision[0]?.bn_name})`
        );
      }
    } else {
      const filteredDistrict = BDDistrictList.filter(
        (District) => District?.id === id
      );
      if (filteredDistrict.length > 0) {
        setShippingAddress({
          ...shippingAddress,
          district: filteredDistrict[0],
        });
        handleShippingAddressChange(
          "district",
          //@ts-ignore
          `${filteredDistrict[0]?.name}(${filteredDistrict[0]?.bn_name})`
        );
      }
    }
  };
  return (
    <div className='rounded-xl border border-neutral-300 '>
      <div className='flex flex-col items-start p-6 sm:flex-row'>
        <span className='hidden sm:block'>
          <TbTruckDelivery className='text-3xl text-primary' />
        </span>

        <div className='flex w-full items-center justify-between'>
          <div className='sm:ml-8'>
            <span className='uppercase'>SHIPPING ADDRESS</span>
            <div className='mt-1 text-sm font-semibold'>
              <span className=''>{address}</span>
            </div>
          </div>
          <ButtonSecondary
            sizeClass='py-2 px-4'
            className='border-2 border-primary text-primary'
            onClick={onOpenActive}>
            Edit
          </ButtonSecondary>
        </div>
      </div>
      <div
        className={`space-y-4 border-t border-neutral-300 px-6 py-7 sm:space-y-6 ${
          isActive ? "block" : "hidden"
        }`}>
        {/* ============ */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3'>
          <div>
            <FormItem label='Division'>
              <Select
                onValueChange={(value: string) => {
                  handleShippingDivChange(value, "division");
                }}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Division' />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    type='text'
                    className='mb-2'
                    placeholder='search'
                    value={divisionQuery}
                    onChange={(e) => setDivisionQuery(e.target.value)}
                  />
                  {BDDivisions.filter(
                    (division) =>
                      division.name
                        .toLowerCase()
                        .includes(divisionQuery.toLowerCase()) ||
                      division.bn_name.includes(divisionQuery)
                  ).map((division, index: number) => (
                    <SelectItem
                      key={index}
                      value={
                        division?.id
                      }>{`${division?.name}(${division?.bn_name})`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
          <div>
            <FormItem label='District'>
              {!!shippingAddress?.division && (
                <Select
                  onValueChange={(value: string) => {
                    handleShippingDivChange(value, "district");
                  }}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='District' />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      type='text'
                      className='mb-2'
                      placeholder='search'
                      value={districtQuery}
                      onChange={(e) => setDistrictQuery(e.target.value)}
                    />
                    {BDDistrictList.filter(
                      (district) =>
                        !!shippingAddress.division &&
                        //@ts-ignore
                        shippingAddress?.division.id === district.division_id &&
                        (district.name
                          .toLowerCase()
                          .includes(districtQuery.toLowerCase()) ||
                          district.bn_name.includes(districtQuery))
                    ).map((division, index: number) => (
                      <SelectItem
                        key={index}
                        value={
                          division?.id
                        }>{`${division?.name}(${division?.bn_name})`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormItem>
          </div>
        </div>

        {/* ============ */}
        <div className='space-y-4 sm:flex sm:space-x-3 sm:space-y-0'>
          <div className='flex-1'>
            <FormItem label='Address'>
              <Input
                rounded='rounded-lg'
                sizeClass='h-12 px-4 py-3'
                className='border border-gray-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
                placeholder=''
                defaultValue='Enter Address'
                type='text'
                value={address}
                onChange={(e) =>
                  handleShippingAddressChange("address", e.target.value)
                }
              />
            </FormItem>
          </div>
        </div>

        {/* ============
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3'>
          <div>
            <FormItem label='City'>
              <Input
                rounded='rounded-lg'
                sizeClass='h-12 px-4 py-3'
                className='border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
                defaultValue='Cityville'
              />
            </FormItem>
          </div>
          <div>
            <FormItem label='Country'>
              <Select
                sizeClass='h-12 px-4 py-3'
                className='rounded-lg border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
                defaultValue='United States '>
                <option value='United States'>United States</option>
                <option value='United States'>Canada</option>
                <option value='United States'>Mexico</option>
                <option value='United States'>Israel</option>
                <option value='United States'>France</option>
                <option value='United States'>England</option>
                <option value='United States'>Laos</option>
                <option value='United States'>China</option>
              </Select>
            </FormItem>
          </div>
        </div>

        {/* ============ */}
        {/* <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3'>
          <div>
            <FormItem label='State/Province'>
              <Input
                rounded='rounded-lg'
                sizeClass='h-12 px-4 py-3'
                className='border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
                defaultValue='Arizona'
              />
            </FormItem>
          </div>
        </div>
        <div>
          <FormItem label='Postal code'>
            <Input
              rounded='rounded-lg'
              sizeClass='h-12 px-4 py-3'
              className='border-neutral-300 bg-transparent placeholder:text-neutral-500 focus:border-primary'
              defaultValue='12345'
            />
          </FormItem>
        </div>  */}
      </div>

      {/* ============ */}
      {/* <div className='px-6'>
        <FormItem label='Address type'>
          <div className='mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3'>
            <Radio
              label='Home(All Day Delivery)'
              id='Address-type-home'
              name='Addres s-type'
              defaultChecked
            />
            <Radio
              label='Office(Delivery 9 AM - 5 PM)'
              id='Address-type-office'
              name='Address-type'
            />
          </div>
        </FormItem>
      </div> */}

      {/* ============ */}
      <div className='flex flex-col p-6 sm:flex-row'>
        <ButtonPrimary className='shadow-none sm:!px-7' onClick={onCloseActive}>
          Save and go to Payment
        </ButtonPrimary>
        <ButtonSecondary
          className='mt-3 sm:ml-3 sm:mt-0'
          onClick={onCloseActive}>
          Cancel
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default ShippingAddress;
