"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BDDistrictList, BDDivisions } from "@/utils/content";
import { ChangeEvent, useState } from "react";
import { UserFormData } from "./page";

const defaultShippingAddress = {
  division: {},
  district: {},
  address: "",
};

interface IProps {
  formData: UserFormData;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        handleInputChange2(
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
        handleInputChange2(
          "district",
          //@ts-ignore
          `${filteredDistrict[0]?.name}(${filteredDistrict[0]?.bn_name})`
        );
      }
    }
  };

  const renderFormView = (
    label: string,
    type: string,
    id: string,
    placeholder: string,
    value: any
  ) => {
    return (
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input
          name={id}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
        />
      </div>
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        {renderFormView(
          "Name",
          "text",
          "name",
          "Enter Your Name",
          formData["name"]
        )}
        <br />
        {renderFormView(
          "Phone Number",
          "text",
          "mobileNumber",
          "Enter Your Mobile Number",
          formData["mobileNumber"]
        )}
        <br />
        {renderFormView(
          "Email",
          "email",
          "email",
          "Enter Your Email",
          formData["email"]
        )}
        <br />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
          <div>
            <Label htmlFor={"division"}>Division</Label>
            <Select
              onValueChange={(value: string) => {
                handleShippingDivChange(value, "division");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  type="text"
                  className="mb-2"
                  placeholder="search"
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
                    value={division?.id}
                  >{`${division?.name}(${division?.bn_name})`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor={"district"}>District</Label>
            {!!shippingAddress?.division && (
              <Select
                onValueChange={(value: string) => {
                  handleShippingDivChange(value, "district");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <Input
                    type="text"
                    className="mb-2"
                    placeholder="search"
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
                      value={division?.id}
                    >{`${division?.name}(${division?.bn_name})`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <br />
        {renderFormView(
          "Address",
          "text",
          "address",
          "Enter Your Address",
          formData["address"]
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
