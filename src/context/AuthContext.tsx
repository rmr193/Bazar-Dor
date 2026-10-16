"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  authClient,
  getStoredUser,
  setStoredUser,
  User,
} from "@/lib/auth-client";

/** Safely turn an unknown caught value into a human-readable error string. */
function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, pass: string) => Promise<AuthResult>;
  signInSocial: (provider: "google" | "github") => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUser: (name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from BetterAuth, falling back to cached local session
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const cached = getStoredUser();
        if (cached && mounted) {
          setUser(cached);
        }

        const sessionRes = await authClient.getSession();
        if (mounted && sessionRes?.data?.user) {
          const authUser: User = {
            id: sessionRes.data.user.id,
            name: sessionRes.data.user.name,
            email: sessionRes.data.user.email,
            image: sessionRes.data.user.image || cached?.image,
            createdAt: sessionRes.data.user.createdAt
              ? String(sessionRes.data.user.createdAt)
              : cached?.createdAt || new Date().toISOString(),
          };
          setUser(authUser);
          setStoredUser(authUser);
        } else if (mounted && !sessionRes?.data?.user && !cached) {
          setUser(null);
        }
      } catch {
        // Fallback to cached user if network fails
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign In with BetterAuth email/password
  const handleSignIn = async (email: string, pass: string): Promise<AuthResult> => {
    try {
      const res = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (res?.error) {
        const errMsg =
          res.error.message ||
          "ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
        toast.error(errMsg);
        return { success: false, error: errMsg };
      }

      if (res?.data?.user) {
        const loggedUser: User = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          image: res.data.user.image,
          createdAt: res.data.user.createdAt
            ? String(res.data.user.createdAt)
            : new Date().toISOString(),
        };
        setUser(loggedUser);
        setStoredUser(loggedUser);
        toast.success(`স্বাগতম, ${loggedUser.name}! লগইন সফল হয়েছে।`);
        return { success: true };
      }

      const defaultError = "লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন।";
      toast.error(defaultError);
      return { success: false, error: defaultError };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "লগইন করার সময় ত্রুটি হয়েছে");
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Sign Up with BetterAuth Name, Email, Password
  const handleSignUp = async (
    name: string,
    email: string,
    pass: string
  ): Promise<AuthResult> => {
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (res?.error) {
        const errMsg =
          res.error.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অন্য ইমেইল দিয়ে চেষ্টা করুন।";
        toast.error(errMsg);
        return { success: false, error: errMsg };
      }

      if (res?.data?.user) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এবার লগইন করুন।");
        return { success: true };
      }

      const defaultError = "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
      toast.error(defaultError);
      return { success: false, error: defaultError };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "রেজিস্ট্রেশন করার সময় ত্রুটি হয়েছে");
      toast.error(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Social Sign In (Google / GitHub) — full OAuth via BetterAuth
  //
  // The browser is redirected to the provider's consent screen, then back to
  // /api/auth/callback/{provider}, then to callbackURL. Because the page
  // navigates away, code below the `await` typically never runs on success.
  const handleSocialSignIn = async (
    provider: "google" | "github"
  ): Promise<AuthResult> => {
    const providerLabel = provider === "google" ? "Google" : "GitHub";
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      // The redirect will happen — the line below is only reached if the
      // browser blocked the navigation.
      return { success: true };
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err, "সোশ্যাল লগইন সম্পন্ন করা যায়নি");
      toast.error(
        `${providerLabel} সাইন-ইন ব্যর্থ: ${errMsg}। ` +
          "OAuth সেটআপ সঠিক আছে কি না দয়া করে যাচাই করুন।"
      );
      return { success: false, error: errMsg };
    }
  };

  // Sign Out
  const handleSignOut = async (): Promise<void> => {
    try {
      await authClient.signOut();
    } catch {
      // Continue clearing client state even if network fails
    } finally {
      setUser(null);
      setStoredUser(null);
      toast.success("সফলভাবে সাইন আউট করা হয়েছে");
    }
  };

  // Update User Profile Name (Challenge C3)
  const handleUpdateUser = async (name: string): Promise<boolean> => {
    if (!name || name.trim().length === 0) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না");
      return false;
    }

    try {
      // Attempt BetterAuth updateUser if session exists
      try {
        await authClient.updateUser({ name: name.trim() });
      } catch {
        // Fallback to local state update
      }

      if (user) {
        const updated: User = {
          ...user,
          name: name.trim(),
        };
        setUser(updated);
        setStoredUser(updated);
      }
      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "তথ্য আপডেট করা যায়নি"));
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
