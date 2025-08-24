"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth, LoginCredentials } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";

interface LoginFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, isModal = false }) => {
  const { login, authState } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate identifier (email or mobile)
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or mobile number is required";
    } else {
      const isEmail = formData.identifier.includes("@");
      const isPhone = /^(\+88)?01[3-9]\d{8}$/.test(formData.identifier);
      
      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.identifier)) {
          newErrors.identifier = "Please enter a valid email address";
        }
      } else if (!isPhone && !isValidBangladeshiPhoneNumber(formData.identifier)) {
        newErrors.identifier = "Please enter a valid email or mobile number";
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await login(formData);
      
      if (response.success) {
        if (!isModal) {
          Swal.fire({
            title: "Login Successful! 🎉",
            text: "Welcome back!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        Swal.fire({
          title: "Login Failed",
          text: response.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email or Mobile Number</Label>
        <Input
          id="identifier"
          type="text"
          placeholder="Enter your email or mobile number"
          value={formData.identifier}
          onChange={(e) => handleInputChange("identifier", e.target.value)}
          className={errors.identifier ? "border-red-500" : ""}
        />
        {errors.identifier && (
          <p className="text-sm text-red-500">{errors.identifier}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => 
              handleInputChange("rememberMe", checked as boolean)
            }
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </Label>
        </div>

        {!isModal && (
          <a
            href="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </a>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={authState.isLoading}
      >
        {authState.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;