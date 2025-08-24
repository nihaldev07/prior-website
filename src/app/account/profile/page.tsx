"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Save,
  Loader2,
  MapPin,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import Swal from "sweetalert2";

import { IUserProps, useAuth, User } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";

const ProfilePage = () => {
  const { authState, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<IUserProps>>({
    name: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    district: "",
    division: "",
    address: "",
    postalCode: "",
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (authState.user) {
      setFormData({
        name: authState.user.name || "",
        email: authState.user.email || "",
        mobileNumber: authState.user.mobileNumber || "",
        dateOfBirth: authState.user.dateOfBirth || "",
        gender: authState.user.gender || "",
        district: !!authState?.user?.address
          ? authState?.user?.address.district ?? ""
          : "",
        division: authState.user?.address?.division || "",
        address: authState.user.address?.address || "",
        postalCode: authState.user.address?.postalCode || "",
      });
    }
  }, [authState.user]);

  // Bangladesh divisions and districts data
  const locationData: Record<string, string[]> = {
    Dhaka: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
    ],
    Chittagong: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chittagong",
      "Comilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachhari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
    ],
    Rajshahi: [
      "Bogra",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Nawabganj",
      "Pabna",
      "Rajshahi",
      "Sirajganj",
    ],
    Khulna: [
      "Bagerhat",
      "Chuadanga",
      "Jessore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
    Barisal: [
      "Barguna",
      "Barisal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
    ],
    Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    Rangpur: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
    ],
    Mymensingh: ["Jamalpur", "Mymensingh", "Netrakona", "Sherpur"],
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name?.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate mobile number
    if (!formData.mobileNumber?.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!isValidBangladeshiPhoneNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid Bangladeshi mobile number";
    }

    // Validate email (optional but if provided, should be valid)
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Validate date of birth (optional but if provided, should be valid)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13 || age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof IUserProps, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleDivisionChange = (division: string) => {
    setFormData((prev) => ({
      ...prev,
      division,
      district: "", // Reset district when division changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await updateProfile(formData);

      if (success) {
        Swal.fire({
          title: "Profile Updated! ✅",
          text: "Your profile information has been updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Update Failed",
          text: "Failed to update profile. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Profile Settings</h1>
          <p className='text-gray-600'>
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Profile Picture Section */}
        <Card className='hidden'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Camera className='h-5 w-5 mr-2' />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-6'>
              <div className='h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center'>
                <UserIcon className='h-12 w-12 text-blue-600' />
              </div>
              <div className='space-y-2'>
                <Button type='button' variant='outline' disabled>
                  <Camera className='h-4 w-4 mr-2' />
                  Upload Picture
                </Button>
                <p className='text-sm text-gray-500'>
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <UserIcon className='h-5 w-5 mr-2' />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your basic personal details
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name *</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Enter your full name'
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='mobileNumber'>Mobile Number *</Label>
                <Input
                  id='mobileNumber'
                  type='tel'
                  placeholder='01XXXXXXXXX'
                  value={formData.mobileNumber || ""}
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  className={errors.mobileNumber ? "border-red-500" : ""}
                />
                {errors.mobileNumber && (
                  <p className='text-sm text-red-500'>{errors.mobileNumber}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email'
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dateOfBirth'>Date of Birth</Label>
                <Input
                  id='dateOfBirth'
                  type='date'
                  value={formData.dateOfBirth || ""}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className='text-sm text-red-500'>{errors.dateOfBirth}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender</Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select gender' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Male</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                    <SelectItem value='prefer_not_to_say'>
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <MapPin className='h-5 w-5 mr-2' />
              Address Information
            </CardTitle>
            <CardDescription>
              Update your address for accurate delivery
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='division'>Division</Label>
                <Select
                  value={formData.division || ""}
                  onValueChange={handleDivisionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select division' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(locationData).map((division) => (
                      <SelectItem key={division} value={division}>
                        {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='district'>District</Label>
                <Select
                  value={formData.district || ""}
                  onValueChange={(value) =>
                    handleInputChange("district", value)
                  }
                  disabled={!formData.division}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select district' />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.division &&
                      locationData[formData.division]?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='address'>Detailed Address</Label>
                <Input
                  id='address'
                  type='text'
                  placeholder='House/Flat no, Road, Area'
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='postalCode'>Postal Code</Label>
                <Input
                  id='postalCode'
                  type='text'
                  placeholder='1234'
                  value={formData.postalCode || ""}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className='flex justify-end'>
          <Button type='submit' className='min-w-32' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
