"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useLocations } from "@/hooks/useLocations";
import { ChangeEvent, useMemo, useState } from "react";
import { UserFormData } from "./page";
import { Check, ChevronsUpDown, MapPin, User } from "lucide-react";
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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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

  // Server-configured locations (divisions/districts + charges). Falls back
  // to the hardcoded constants when the API is unavailable.
  const { locations } = useLocations();

  // Select-option shape shared by API data and the legacy constants
  const divisionOptions = useMemo(() => {
    if (!locations) return BDDivisions;
    return locations.divisions.map((d) => ({
      id: d.divisionId,
      name: d.division,
      bn_name: d.districts[0]?.bnName || "",
    }));
  }, [locations]);

  const districtOptions = useMemo(() => {
    if (!locations) return BDDistrictList;
    return locations.divisions.flatMap((d) =>
      d.districts.map((x) => ({
        id: x.sourceId,
        division_id: d.divisionId,
        name: x.name,
        bn_name: x.bnName,
      })),
    );
  }, [locations]);

  // Delivery charge per district option, shown in the picker when the
  // server config knows it
  const chargeById = useMemo(() => {
    const map = new Map<string, number>();
    if (locations) {
      for (const d of locations.divisions) {
        for (const x of d.districts) map.set(x.sourceId, x.charge);
      }
    }
    return map;
  }, [locations]);

  const handleShippingDivChange = (id: string, name: string) => {
    if (name === "division") {
      const found = divisionOptions.find((d) => d.id === id);
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
      const found = districtOptions.find((d) => d.id === id);
      if (found) {
        setShippingAddress((prev) => ({ ...prev, district: found }));
        handleInputChange2("district", found.name);
        handleInputChange2("districtId", found.id);
      }
    }
  };

  const inputClass =
    "rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-200 focus:border-neutral-300 transition-all duration-200 h-11";

  const labelClass = "text-xs font-medium text-neutral-600";

  const renderFormView = (
    label: string,
    type: string,
    id: string,
    placeholder: string,
    value: any,
  ) => (
    <div className='grid w-full items-center gap-1.5'>
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>
      <Input
        name={id}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={inputClass}
      />
    </div>
  );

  const renderFormTextarea = (
    label: string,
    id: string,
    placeholder: string,
    value: any,
  ) => (
    <div className='grid w-full items-center gap-1.5'>
      <Label htmlFor={id} className={labelClass}>
        {label}
      </Label>
      <Textarea
        name={id}
        id={id}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className='rounded-xl border-neutral-200 bg-neutral-50/50 p-3 text-sm placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-200 focus:border-neutral-300 transition-colors duration-200 resize-none'
      />
    </div>
  );

  const selectTriggerClass = cn(
    inputClass,
    "h-11 w-full flex items-center justify-between text-left",
    "bg-white",
  );

  return (
    <Card className='rounded-2xl border-neutral-200 shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center font-semibold text-neutral-900 text-base'>
          <div className='w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2.5'>
            <User className='h-4 w-4 text-neutral-600' />
          </div>
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {renderFormView(
          "Full Name",
          "text",
          "name",
          "Enter your full name",
          formData["name"],
        )}
        {renderFormView(
          "Phone Number",
          "text",
          "mobileNumber",
          "01XXXXXXXXX",
          formData["mobileNumber"],
        )}
        {renderFormView(
          "Email",
          "email",
          "email",
          "you@example.com",
          formData["email"],
        )}

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* DISTRICT (Division) */}
          <div className='flex flex-col gap-1.5'>
            <Label className={labelClass}>District</Label>
            <Popover
              open={divisionPopoverOpen}
              onOpenChange={setDivisionPopoverOpen}
              modal={true} // ← fixes mobile focus stealing
            >
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className={cn(
                    selectTriggerClass,
                    !shippingAddress.division && "text-neutral-400",
                  )}>
                  <span className='truncate'>
                    {shippingAddress.division?.name ?? "Select district"}
                  </span>
                  <ChevronsUpDown className='h-4 w-4 opacity-50 shrink-0' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0 rounded-xl border-neutral-200 shadow-lg'
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
                    className='rounded-t-xl border-neutral-200 text-sm'
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {divisionOptions.map((division) => (
                        <CommandItem
                          key={division.id}
                          value={division.name} // ← fix: use name so built-in search works
                          onSelect={(value) => {
                            const found = divisionOptions.find(
                              (d) =>
                                d.name.toLowerCase() === value.toLowerCase(),
                            );
                            if (found)
                              handleShippingDivChange(found.id, "division");
                            setDivisionPopoverOpen(false);
                          }}
                          className='text-sm rounded-lg'>
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

          {/* AREA (District) */}
          <div className='flex flex-col gap-1.5'>
            <Label className={labelClass}>Area</Label>
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
                    selectTriggerClass,
                    (!shippingAddress.division || !shippingAddress.district) &&
                      "text-neutral-400",
                    !shippingAddress.division &&
                      "opacity-50 cursor-not-allowed",
                  )}>
                  <span className='truncate'>
                    {shippingAddress.district?.name ?? "Select area"}
                  </span>
                  <ChevronsUpDown className='h-4 w-4 opacity-50 shrink-0' />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0 rounded-xl border-neutral-200 shadow-lg'
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
                    className='rounded-t-xl border-neutral-200 text-sm'
                  />
                  <CommandList>
                    <CommandEmpty>No area found.</CommandEmpty>
                    <CommandGroup>
                      {districtOptions.filter(
                        (d) => d.division_id === shippingAddress.division?.id,
                      ).map((district) => (
                        <CommandItem
                          key={district.id}
                          value={district.name} // ← fix: use name so built-in search works
                          onSelect={(value) => {
                            const found = districtOptions.find(
                              (d) =>
                                d.name.toLowerCase() === value.toLowerCase(),
                            );
                            if (found)
                              handleShippingDivChange(found.id, "district");
                            setDistrictPopoverOpen(false);
                          }}
                          className='text-sm rounded-lg'>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              shippingAddress.district?.id === district.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {district.name}
                          {chargeById.get(district.id) !== undefined &&
                            ` — ৳${chargeById.get(district.id)}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {renderFormTextarea(
          "Street Address",
          "address",
          "House No, Road, Area",
          formData["address"],
        )}

        <div className='flex items-center gap-1.5 text-[11px] text-neutral-400'>
          <MapPin className='h-3 w-3' />
          Delivery charge is calculated based on your selected area
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInformation;
