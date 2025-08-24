"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth, RegisterData } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";

interface RegisterFormProps {
  onSuccess?: () => void;
  isModal?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, isModal = false }) => {
  const { register, authState } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const validatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = "Very weak";
        break;
      case 2:
        feedback = "Weak";
        break;
      case 3:
        feedback = "Medium";
        break;
      case 4:
        feedback = "Strong";
        break;
      case 5:
        feedback = "Very strong";
        break;
    }

    return { score, feedback };
  };

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate mobile number
    if (!formData.mobileNumber.trim()) {
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

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Update password strength for password field
    if (field === "password" && typeof value === "string") {
      setPasswordStrength(validatePasswordStrength(value));
    }
    
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
      const response = await register(formData);
      
      if (response.success) {
        if (!isModal) {
          Swal.fire({
            title: "Registration Successful! 🎉",
            text: "Welcome to Prior! Your account has been created successfully.",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
        }
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        Swal.fire({
          title: "Registration Failed",
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
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobileNumber">Mobile Number *</Label>
        <Input
          id="mobileNumber"
          type="tel"
          placeholder="01XXXXXXXXX"
          value={formData.mobileNumber}
          onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
          className={errors.mobileNumber ? "border-red-500" : ""}
        />
        {errors.mobileNumber && (
          <p className="text-sm text-red-500">{errors.mobileNumber}</p>
        )}
      </div>

      {!isModal && (
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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
        
        {formData.password && !isModal && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{passwordStrength.feedback}</span>
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        
        {formData.confirmPassword && formData.password && (
          <div className="flex items-center space-x-2">
            {formData.password === formData.confirmPassword ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Passwords don&apos;t match</span>
              </>
            )}
          </div>
        )}
        
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => 
              handleInputChange("agreeToTerms", checked as boolean)
            }
          />
          <Label
            htmlFor="agreeToTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <a
              href="/terms-conditions"
              className="text-blue-600 hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            {!isModal && (
              <>
                {" "}and{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </>
            )}
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
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
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;