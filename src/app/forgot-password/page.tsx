"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth } from "@/context/AuthContext";
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
import { isValidBangladeshiPhoneNumber } from "@/utils/content";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Email or mobile number is required";
    } else {
      const isEmail = identifier.includes("@");
      const isPhone = /^(\+88)?01[3-9]\d{8}$/.test(identifier);

      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
          newErrors.identifier = "Please enter a valid email address";
        }
      } else if (!isPhone && !isValidBangladeshiPhoneNumber(identifier)) {
        newErrors.identifier = "Please enter a valid email or mobile number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await forgotPassword(identifier);

      if (success) {
        setIsSubmitted(true);
        Swal.fire({
          title: "Reset Code Sent! ✉️",
          text: `We&apos;ve sent a password reset code to ${identifier}. Please check your ${
            identifier.includes("@") ? "email" : "SMS"
          } and follow the instructions.`,
          icon: "success",
          confirmButtonText: "Continue",
        }).then(() => {
          router.push(
            `/reset-password?identifier=${encodeURIComponent(identifier)}`
          );
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to send reset code. Please check your email/mobile number and try again.",
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

  const handleInputChange = (value: string) => {
    setIdentifier(value);

    // Clear error when user starts typing
    if (errors.identifier) {
      setErrors({});
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <Link
            href='/login'
            className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4'>
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back to sign in
          </Link>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Forgot your password?
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Don&apos;t worry, we&apos;ll help you reset it
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Mail className='mr-2 h-5 w-5' />
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email address or mobile number and we&apos;ll send you
              a code to reset your password.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='identifier'>Email or Mobile Number</Label>
                <Input
                  id='identifier'
                  type='text'
                  placeholder='Enter your email or mobile number'
                  value={identifier}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className={errors.identifier ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.identifier && (
                  <p className='text-sm text-red-500'>{errors.identifier}</p>
                )}

                <div className='flex items-start space-x-2 text-sm text-gray-600'>
                  <Mail className='h-4 w-4 mt-0.5 text-blue-500' />
                  <span>We&apos;ll send a reset code to your email</span>
                </div>

                <div className='flex items-start space-x-2 text-sm text-gray-600'>
                  <Phone className='h-4 w-4 mt-0.5 text-green-500' />
                  <span>Or we can send an SMS to your mobile</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending reset code...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className='text-center space-y-2'>
          <p className='text-sm text-gray-600'>
            Remember your password?{" "}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign in
            </Link>
          </p>
          <p className='text-sm text-gray-600'>
            {" Don't have an account?"}{" "}
            <Link
              href='/register'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
