"use client";

import { hostName } from "@/utils/config";
import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Define types for user and auth context
export interface User {
  id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  address?: {
    district?: string;
    division?: string;
    address?: string;
    postalCode?: string;
  };

  isVerified: boolean;
  memberSince: string;
}

export interface IUserProps {
  id: string;
  name: string;
  email?: string;
  mobileNumber: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  district?: string;
  division?: string;
  address?: string;
  postalCode?: string;
  isVerified: boolean;
  memberSince: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (userData: Partial<IUserProps>) => Promise<boolean>;
  changePassword: (passwordData: ChangePasswordData) => Promise<boolean>;
  forgotPassword: (identifier: string) => Promise<boolean>;
  resetPassword: (resetData: ResetPasswordData) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

export interface LoginCredentials {
  identifier: string; // email or mobile number
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  mobileNumber: string;
  email?: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    customer: User;
    token: string;
    refreshToken: string;
  };
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize auth state from localStorage
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("authToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");
      const savedUser = localStorage.getItem("userData");

      if (savedToken && savedRefreshToken && savedUser) {
        try {
          return {
            user: JSON.parse(savedUser),
            isAuthenticated: false, // Don't authenticate until token is verified
            isLoading: true, // Start with loading state
            token: savedToken,
            refreshToken: savedRefreshToken,
          };
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
        }
      }
    }

    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      refreshToken: null,
    };
  });

  // Sync auth data with localStorage
  useEffect(() => {
    if (
      authState.isAuthenticated &&
      authState.user &&
      authState.token &&
      authState.refreshToken
    ) {
      localStorage.setItem("authToken", authState.token);
      localStorage.setItem("refreshToken", authState.refreshToken);
      localStorage.setItem("userData", JSON.stringify(authState.user));
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
    }
  }, [authState]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const currentRefreshToken = authState.refreshToken;
    if (!currentRefreshToken) return false;

    try {
      const response = await fetch(`${hostName}/prior/customer/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          token: data.token,
          refreshToken: data.refreshToken || prev.refreshToken, // Use new refreshToken if provided, otherwise keep existing
        }));
        return true;
      } else {
        // RefreshToken expired or invalid, logout user
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
    //eslint-disable-next-line
  }, []);

  // Check token expiry on mount and set up refresh interval
  useEffect(() => {
    const verifyAndRefreshToken = async () => {
      if (authState.token && authState.refreshToken) {
        // Check if token is expired and refresh if needed
        if (isTokenExpired(authState.token)) {
          const success = await refreshToken();
          if (!success) {
            // Token refresh failed, user will be logged out
            return;
          }
        } else {
          // Token is still valid, mark user as authenticated
          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
          }));
        }

        // Set up auto-refresh interval (every 5 minutes)
        const refreshInterval = setInterval(() => {
          if (authState.token && isTokenExpired(authState.token)) {
            refreshToken();
          }
        }, 5 * 60 * 1000); // Check every 5 minutes instead of calling refresh every 25 minutes

        return () => clearInterval(refreshInterval);
      } else if (authState.isLoading) {
        // No tokens found, stop loading
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    verifyAndRefreshToken();
  }, [
    authState.token,
    authState.refreshToken,
    authState.isLoading,
    refreshToken,
  ]);

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${hostName}/prior/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("response:", data);
      if (response.ok && data.success) {
        setAuthState({
          user: data.data.customer,
          isAuthenticated: true,
          isLoading: false,
          token: data.data.token,
          refreshToken: data.data.refreshToken,
        });

        return {
          success: true,
          message: "Login successful",
          data: data.data,
        };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${hostName}/prior/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthState({
          user: data.data.customer,
          isAuthenticated: true,
          isLoading: false,
          token: data.data.token,
          refreshToken: data.data.refreshToken,
        });

        return {
          success: true,
          message: "Registration successful",
          data: data.data,
        };
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      refreshToken: null,
    });
  };

  const updateProfile = async (
    userData: Partial<IUserProps>
  ): Promise<boolean> => {
    if (!authState.token) return false;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${hostName}/prior/customer/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAuthState((prev) => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...data.data?.customer } : null,
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const changePassword = async (
    passwordData: ChangePasswordData
  ): Promise<boolean> => {
    if (!authState.token) return false;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(
        `${hostName}/prior/customer/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const forgotPassword = async (identifier: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(
        `${hostName}/prior/customer/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier }),
        }
      );

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const resetPassword = async (
    resetData: ResetPasswordData
  ): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(
        `${hostName}/prior/customer/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetData),
        }
      );

      return response.ok;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        refreshToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
