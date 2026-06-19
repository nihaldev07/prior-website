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
  division: null as { id: string; name: string; bn_name: string } | null,
  district: null as {
    id: string;
    name: string;
    bn_name: string;
    division_id: string;
  } | null,
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
  const [shippingAddress, setShippingAddress] = useState(
    defaultShippingAddress,
  );
  const [divisionPopoverOpen, setDivisionPopoverOpen] = useState(false);
  const [districtPopoverOpen, setDistrictPopoverOpen] = useState(false);

  const handleShippingDivChange = (id: string, name: string) => {
    if (name === "division") {
      const found = BDDivisions.find((d) => d.id === id);
      if (found) {
        setShippingAddress((prev) => ({
          ...prev,
          division: found,
          district: null,
        }));
        handleInputChange2("division", found.name);
        handleInputChange2("district", "");
        handleInputChange2("districtId", "");
      }
    } else {
      const found = BDDistrictList.find((d) => d.id === id);
      if (found) {
        setShippingAddress((prev) => ({ ...prev, district: found }));
        handleInputChange2("district", found.name);
        handleInputChange2("districtId", found.id);
      }
    }
  };

  const renderFormView = (
    label: string,
    type: string,
    id: string,
    placeholder: string,
    value: any,
  ) => (
    <div className='grid w-full items-center gap-1.5'>
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
          {/* DIVISION */}
          <div className='flex flex-col gap-1.5'>
            <Label className='font-serif tracking-[0.2em] uppercase text-neutral-700'>
              District
            </Label>
            <Popover
              open={divisionPopoverOpen}
              onOpenChange={setDivisionPopoverOpen}
              modal={true} // ← fixes mobile focus stealing
            >
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className={cn(
                    "w-full rounded-none border border-neutral-300 font-serif tracking-wide px-3 py-2 text-left hover:bg-accent focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 flex items-center justify-between",
                    !shippingAddress.division && "text-muted-foreground",
                  )}>
                  <span>
                    {shippingAddress.division?.name ?? "Select district"}
                  </span>
                  <ChevronsUpDown className='h-4 w-4 opacity-50 shrink-0' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0 rounded-none border-neutral-300'
                align='start'
                onInteractOutside={(e) => {
                  // Prevent closing when interacting with the Command input on mobile
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("[cmdk-input]") ||
                    target.closest("[cmdk-root]")
                  ) {
                    e.preventDefault();
                  }
                }}>
                <Command>
                  <CommandInput
                    placeholder='Search district...'
                    className='rounded-none border-neutral-300 font-serif tracking-wide'
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {BDDivisions.map((division) => (
                        <CommandItem
                          key={division.id}
                          value={division.name} // ← fix: use name so built-in search works
                          onSelect={(value) => {
                            const found = BDDivisions.find(
                              (d) =>
                                d.name.toLowerCase() === value.toLowerCase(),
                            );
                            if (found)
                              handleShippingDivChange(found.id, "division");
                            setDivisionPopoverOpen(false);
                          }}
                          className='font-serif tracking-wide rounded-none'>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
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

          {/* DISTRICT */}
          <div className='flex flex-col gap-1.5'>
            <Label className='font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Area
            </Label>
            <Popover
              open={districtPopoverOpen}
              onOpenChange={setDistrictPopoverOpen}
              modal={true} // ← fixes mobile focus stealing
            >
              <PopoverTrigger asChild>
                <button
                  type='button'
                  disabled={!shippingAddress.division}
                  className={cn(
                    "w-full rounded-none border border-neutral-300 font-serif tracking-wide px-3 py-2 text-left hover:bg-accent focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 flex items-center justify-between",
                    (!shippingAddress.division || !shippingAddress.district) &&
                      "text-muted-foreground",
                    !shippingAddress.division &&
                      "opacity-50 cursor-not-allowed",
                  )}>
                  <span>{shippingAddress.district?.name ?? "Select area"}</span>
                  <ChevronsUpDown className='h-4 w-4 opacity-50 shrink-0' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0 rounded-none border-neutral-300'
                align='start'
                onInteractOutside={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("[cmdk-input]") ||
                    target.closest("[cmdk-root]")
                  ) {
                    e.preventDefault();
                  }
                }}>
                <Command>
                  <CommandInput
                    placeholder='Search area...'
                    className='rounded-none border-neutral-300 font-serif tracking-wide'
                  />
                  <CommandList>
                    <CommandEmpty>No area found.</CommandEmpty>
                    <CommandGroup>
                      {BDDistrictList.filter(
                        (d) => d.division_id === shippingAddress.division?.id,
                      ).map((district) => (
                        <CommandItem
                          key={district.id}
                          value={district.name} // ← fix: use name so built-in search works
                          onSelect={(value) => {
                            const found = BDDistrictList.find(
                              (d) =>
                                d.name.toLowerCase() === value.toLowerCase(),
                            );
                            if (found)
                              handleShippingDivChange(found.id, "district");
                            setDistrictPopoverOpen(false);
                          }}
                          className='font-serif tracking-wide rounded-none'>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
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
      </CardContent>
    </Card>
  );
};

export default UserInformation;
