"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth, LoginCredentials } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isValidBangladeshiPhoneNumber } from "@/utils/content";

const LoginPage = () => {
  const { login, authState } = useAuth();
  const router = useRouter();
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
      } else if (
        !isPhone &&
        !isValidBangladeshiPhoneNumber(formData.identifier)
      ) {
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

  const handleInputChange = (
    field: keyof LoginCredentials,
    value: string | boolean
  ) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await login(formData);

      if (response.success) {
        Swal.fire({
          title: "Login Successful! 🎉",
          text: "Welcome back!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect to intended page or dashboard
        const redirectTo =
          new URLSearchParams(window.location.search).get("redirect") ||
          "/account";
        router.push(redirectTo);
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
    <div className='min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-serif font-bold text-neutral-900 tracking-[0.2em] uppercase'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm font-serif text-neutral-600 tracking-wide'>
            Or{" "}
            <Link
              href='/register'
              className='font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline underline-offset-4'>
              create a new account
            </Link>
          </p>
        </div>

        <Card className="rounded-none border-neutral-200">
          <CardHeader className="border-b border-neutral-200">
            <CardTitle className='font-serif tracking-wide text-neutral-900'>Welcome Back</CardTitle>
            <CardDescription className="font-serif tracking-wide text-neutral-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='identifier' className="font-serif tracking-[0.2em] uppercase text-neutral-700">Email or Mobile Number</Label>
                <Input
                  id='identifier'
                  type='text'
                  placeholder='Enter your email or mobile number'
                  value={formData.identifier}
                  onChange={(e) =>
                    handleInputChange("identifier", e.target.value)
                  }
                  className={`rounded-none border-neutral-300 font-serif tracking-wide focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all duration-300 ${errors.identifier ? "border-red-500" : ""}`}
                />
                {errors.identifier && (
                  <p className='text-sm font-serif text-red-600'>{errors.identifier}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password' className="font-serif tracking-[0.2em] uppercase text-neutral-700">Password</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`rounded-none border-neutral-300 font-serif tracking-wide focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all duration-300 ${
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }`}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors duration-300'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-sm font-serif text-red-600'>{errors.password}</p>
                )}
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='rememberMe'
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor='rememberMe'
                    className='text-sm font-serif font-medium tracking-wide text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Remember me
                  </Label>
                </div>

                <Link
                  href='/forgot-password'
                  className='text-sm font-serif font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline underline-offset-4'>
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type='submit'
                className='w-full font-serif tracking-wide rounded-none hover:bg-neutral-800 transition-colors duration-300'
                disabled={authState.isLoading}>
                {authState.isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className='text-center'>
          <p className='text-sm font-serif text-neutral-600 tracking-wide'>
            {" Don't have an account?"}{" "}
            <Link
              href='/register'
              className='font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline underline-offset-4'>
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
