"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient, getStoredUser, User } from "@/lib/auth-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signUp: (name: string, email: string, pass: string) => Promise<boolean>;
  signInSocial: (provider: "google" | "github") => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved user session on initial page load
  useEffect(() => {
    try {
      const savedUser = getStoredUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simple Sign In function
  const handleSignIn = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await authClient.signIn({ email, password: pass });
      if (res.data?.user) {
        setUser(res.data.user);
        toast.success(`স্বাগতম, ${res.data.user.name}! লগইন সফল হয়েছে।`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "লগইন ব্যর্থ হয়েছে");
      return false;
    }
  };

  // Simple Sign Up function
  const handleSignUp = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await authClient.signUp({ name, email, password: pass });
      if (res.data?.user) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এবার লগইন করুন।");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      return false;
    }
  };

  // Simple Social Sign In function (Google / GitHub)
  const handleSocialSignIn = async (provider: "google" | "github"): Promise<boolean> => {
    try {
      const res = await authClient.signInSocial({ provider });
      if (res.data?.user) {
        setUser(res.data.user);
        toast.success(
          `${provider === "google" ? "গুগল" : "গিটহাব"} দিয়ে সফলভাবে লগইন হয়েছে!`
        );
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "সোশ্যাল লগইন সম্পন্ন করা যায়নি");
      return false;
    }
  };

  // Simple Sign Out function
  const handleSignOut = async (): Promise<void> => {
    try {
      await authClient.signOut();
      setUser(null);
      toast.success("সফলভাবে সাইন আউট করা হয়েছে");
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
    }
  };

  // Simple Update User Profile Name function (Challenge C3)
  const handleUpdateUser = async (name: string): Promise<boolean> => {
    try {
      const res = await authClient.updateUser({ name });
      if (res.data?.user) {
        setUser(res.data.user);
        toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || "তথ্য আপডেট করা যায়নি");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInSocial: handleSocialSignIn,
        signOut: handleSignOut,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use AuthContext in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  }
  return context;
}
