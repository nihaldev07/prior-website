"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";

import { useAuth, ResetPasswordData } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const [formData, setFormData] = useState<ResetPasswordData>({
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  useEffect(() => {
    const identifierParam = searchParams.get("identifier");
    if (identifierParam) {
      setIdentifier(identifierParam);
    }
  }, [searchParams]);

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

    // Validate reset code
    if (!formData.resetCode.trim()) {
      newErrors.resetCode = "Reset code is required";
    } else if (formData.resetCode.length < 4) {
      newErrors.resetCode = "Reset code must be at least 4 characters";
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ResetPasswordData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update password strength for password field
    if (field === "newPassword") {
      setPasswordStrength(validatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await resetPassword(formData);

      if (success) {
        Swal.fire({
          title: "Password Reset Successful! 🎉",
          text: "Your password has been reset successfully. You can now sign in with your new password.",
          icon: "success",
          confirmButtonText: "Go to Sign In",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          title: "Reset Failed",
          text: "Invalid reset code or the code has expired. Please request a new reset code.",
          icon: "error",
          showCancelButton: true,
          confirmButtonText: "Request New Code",
          cancelButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/forgot-password");
          }
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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <Link
            href='/forgot-password'
            className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4'>
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back to forgot password
          </Link>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Reset your password
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {identifier && (
              <>
                Enter the code sent to <strong>{identifier}</strong> and choose
                a new password
              </>
            )}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Password</CardTitle>
            <CardDescription>
              Enter the reset code and your new password to complete the reset
              process.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='resetCode'>Reset Code</Label>
                <Input
                  id='resetCode'
                  type='text'
                  placeholder='Enter the reset code'
                  value={formData.resetCode}
                  onChange={(e) =>
                    handleInputChange("resetCode", e.target.value)
                  }
                  className={errors.resetCode ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.resetCode && (
                  <p className='text-sm text-red-500'>{errors.resetCode}</p>
                )}
                <p className='text-sm text-gray-600'>
                  Check your {identifier?.includes("@") ? "email" : "SMS"} for
                  the reset code
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='newPassword'>New Password</Label>
                <div className='relative'>
                  <Input
                    id='newPassword'
                    type={showPassword ? "text" : "password"}
                    placeholder='Create a strong password'
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className={
                      errors.newPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>

                {formData.newPassword && (
                  <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                            passwordStrength.score
                          )}`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className='text-sm text-gray-600'>
                        {passwordStrength.feedback}
                      </span>
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <p className='text-sm text-red-500'>{errors.newPassword}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <div className='relative'>
                  <Input
                    id='confirmPassword'
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder='Confirm your new password'
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={
                      errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                    }
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </button>
                </div>

                {formData.confirmPassword && formData.newPassword && (
                  <div className='flex items-center space-x-2'>
                    {formData.newPassword === formData.confirmPassword ? (
                      <>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='text-sm text-green-600'>
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className='h-4 w-4 text-red-500' />
                        <span className='text-sm text-red-600'>
                          Passwords don&apos;t match
                        </span>
                      </>
                    )}
                  </div>
                )}

                {errors.confirmPassword && (
                  <p className='text-sm text-red-500'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className='text-center space-y-2'>
          <p className='text-sm text-gray-600'>
            Didn&apos;t receive a code?{" "}
            <Link
              href='/forgot-password'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Request new code
            </Link>
          </p>
          <p className='text-sm text-gray-600'>
            Remember your password?{" "}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordWrapper = () => {
  return (
    <Suspense
      fallback={<Loader2 className='h-8 w-8 animate-spin text-blue-500' />}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPasswordWrapper;
