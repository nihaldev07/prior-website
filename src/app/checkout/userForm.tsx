"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BDDistrictList, BDDivisions } from "@/utils/content";
import { ChangeEvent, useState } from "react";
import { UserFormData } from "./page";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultShippingAddress = {
  division: {},
  district: {},
  address: "",
};

interface IProps {
  formData: UserFormData;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleInputChange2: (name: string, value: any) => void;
}

const UserInformation: React.FC<IProps> = ({
  formData,
  handleInputChange,
  handleInputChange2,
}) => {
  const [divisionQuery, setDivisionQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [shippingAddress, setShippingAddress] = useState(
    defaultShippingAddress,
  );
  const [divisionPopoverOpen, setDivisionPopoverOpen] = useState(false);
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false);

  const handleShippingDivChange = (id: string, name: string) => {
    if (name === "division") {
      const filteredDivision = BDDivisions.filter(
        (division) => division?.id === id,
      );
      if (filteredDivision.length > 0) {
        setShippingAddress({
          ...shippingAddress,
          division: filteredDivision[0],
        });
        handleInputChange2(
          "division",
          //@ts-ignore
          `${filteredDivision[0]?.name}`,
        );
      }
    } else {
      const filteredDistrict = BDDistrictList.filter(
        (District) => District?.id === id,
      );
      if (filteredDistrict.length > 0) {
        setShippingAddress({
          ...shippingAddress,
          district: filteredDistrict[0],
        });
        handleInputChange2(
          "district",
          //@ts-ignore
          `${filteredDistrict[0]?.name}`,
        );
        handleInputChange2("districtId", filteredDistrict[0]?.id);
      }
    }
  };

  const renderFormView = (
    label: string,
    type: string,
    id: string,
    placeholder: string,
    value: any,
  ) => {
    return (
      <div className='grid w-full  items-center gap-1.5'>
        <Label
          htmlFor={id}
          className='font-serif tracking-[0.2em] uppercase text-neutral-700'>
          {label}
        </Label>
        <Input
          name={id}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className='rounded-none border-neutral-300 font-serif tracking-wide focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'
        />
      </div>
    );
  };
  return (
    <Card className='rounded-none border-neutral-200'>
      <CardHeader>
        <CardTitle className='text-xl font-serif tracking-wide text-neutral-900'>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderFormView(
          "Name",
          "text",
          "name",
          "Enter Your Name",
          formData["name"],
        )}
        <br />
        {renderFormView(
          "Phone Number",
          "text",
          "mobileNumber",
          "Enter Your Mobile Number",
          formData["mobileNumber"],
        )}
        <br />
        {renderFormView(
          "Email",
          "email",
          "email",
          "Enter Your Email",
          formData["email"],
        )}
        <br />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3'>
          <div>
            <Label
              htmlFor={"division"}
              className='font-serif tracking-[0.2em] uppercase text-neutral-700'>
              District
            </Label>
            <Popover
              open={divisionPopoverOpen}
              onOpenChange={(open) => {
                setDivisionPopoverOpen(open);
                if (!open) {
                  setDivisionQuery("");
                }
              }}>
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className={cn(
                    "w-full rounded-none border border-neutral-300 font-serif tracking-wide px-3 py-2 text-left hover:bg-accent focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",
                    !shippingAddress.division && "text-muted-foreground",
                  )}>
                  {shippingAddress.division ? (
                    //@ts-ignore
                    shippingAddress.division.name
                  ) : (
                    <span>Select district</span>
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50 inline' />
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0 rounded-none border-neutral-300' align='start'>
                <Command>
                  <CommandInput
                    placeholder='Search district...'
                    value={divisionQuery}
                    onValueChange={setDivisionQuery}
                    className='rounded-none border-neutral-300 font-serif tracking-wide'
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {BDDivisions.filter(
                        (division) =>
                          division.name
                            .toLowerCase()
                            .includes(divisionQuery.toLowerCase()) ||
                          division.bn_name.includes(divisionQuery),
                      ).map((division) => (
                        <CommandItem
                          key={division.id}
                          value={division.id}
                          onSelect={(value) => {
                            handleShippingDivChange(value, "division");
                            setDivisionQuery("");
                            setDivisionPopoverOpen(false);
                          }}
                          className='font-serif tracking-wide rounded-none'>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              //@ts-ignore
                              shippingAddress.division?.id === division.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {division.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label
              htmlFor={"district"}
              className='font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Area
            </Label>
            {!!shippingAddress?.division && (
              <Popover
                open={districtPopoverOpen}
                onOpenChange={(open) => {
                  setDistrictPopoverOpen(open);
                  if (!open) {
                    setDistrictQuery("");
                  }
                }}>
                <PopoverTrigger asChild>
                  <button
                    type='button'
                    className={cn(
                      "w-full rounded-none border border-neutral-300 font-serif tracking-wide px-3 py-2 text-left hover:bg-accent focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",
                      !shippingAddress.district && "text-muted-foreground",
                    )}>
                    {shippingAddress.district ? (
                      //@ts-ignore
                      shippingAddress.district.name
                    ) : (
                      <span>Select area</span>
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50 inline' />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0 rounded-none border-neutral-300' align='start'>
                  <Command>
                    <CommandInput
                      placeholder='Search area...'
                      value={districtQuery}
                      onValueChange={setDistrictQuery}
                      className='rounded-none border-neutral-300 font-serif tracking-wide'
                    />
                    <CommandList>
                      <CommandEmpty>No area found.</CommandEmpty>
                      <CommandGroup>
                        {BDDistrictList.filter(
                          (district) =>
                            !!shippingAddress.division &&
                            //@ts-ignore
                            shippingAddress?.division.id ===
                              district.division_id &&
                            (district.name
                              .toLowerCase()
                              .includes(districtQuery.toLowerCase()) ||
                              district.bn_name.includes(districtQuery)),
                        ).map((district) => (
                          <CommandItem
                            key={district.id}
                            value={district.id}
                            onSelect={(value) => {
                              handleShippingDivChange(value, "district");
                              setDistrictQuery("");
                              setDistrictPopoverOpen(false);
                            }}
                            className='font-serif tracking-wide rounded-none'>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                //@ts-ignore
                                shippingAddress.district?.id === district.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {district.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <br />
        {renderFormView(
          "Address",
          "text",
          "address",
          "Enter Your Address",
          formData["address"],
        )}
        <br />
        {/* {renderFormView(
          "Postal Code",
          "text",
          "postalCode",
          "Enter Postal Code",
          formData["postalCode"]
        )} */}
      </CardContent>
    </Card>
  );
};

export default UserInformation;
