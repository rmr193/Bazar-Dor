"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  authClient,
  getStoredUser,
  setStoredUser,
  User,
} from "@/lib/auth-client";
import { logger } from "@/lib/logger";

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

function toMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}

function userFromAuth(raw: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: string | Date;
  fallbackImage?: string | null;
  fallbackCreatedAt?: string;
}): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    image: raw.image || raw.fallbackImage,
    createdAt: raw.createdAt ? String(raw.createdAt) : raw.fallbackCreatedAt || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const cached = getStoredUser();
        if (cached && mounted) setUser(cached);

        const session = await authClient.getSession();
        if (!mounted) return;

        if (session.data?.user) {
          const u = userFromAuth({
            ...session.data.user,
            fallbackImage: cached?.image,
            fallbackCreatedAt: cached?.createdAt,
          });
          setUser(u);
          setStoredUser(u);
        } else if (!cached) {
          setUser(null);
        }
      } catch (err) {
        logger.error("Session check failed", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function runAuthCall(
    promise: Promise<unknown>,
    successMsg: string,
    fallbackError: string
  ): Promise<AuthResult> {
    try {
      const res = (await promise) as {
        data?: { user?: Omit<User, "createdAt"> & { createdAt?: string | Date } };
        error?: { message?: string } | null;
      };
      if (res.error) {
        const msg = res.error.message || fallbackError;
        toast.error(msg);
        return { success: false, error: msg };
      }
      if (res.data?.user) {
        const u = userFromAuth(res.data.user);
        setUser(u);
        setStoredUser(u);
        toast.success(successMsg);
        return { success: true };
      }
      toast.error(fallbackError);
      return { success: false, error: fallbackError };
    } catch (err) {
      const msg = toMessage(err, fallbackError);
      toast.error(msg);
      return { success: false, error: msg };
    }
  }

  const signIn = (email: string, pass: string) =>
    runAuthCall(
      authClient.signIn.email({ email: email.trim().toLowerCase(), password: pass }),
      "লগইন সফল হয়েছে",
      "ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
    );

  const signUp = (name: string, email: string, pass: string) =>
    runAuthCall(
      authClient.signUp.email({ name: name.trim(), email: email.trim().toLowerCase(), password: pass }),
      "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এবার লগইন করুন।",
      "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অন্য ইমেইল দিয়ে চেষ্টা করুন।"
    );

  const signInSocial = async (provider: "google" | "github"): Promise<AuthResult> => {
    const label = provider === "google" ? "Google" : "GitHub";
    try {
      // BetterAuth handles the full OAuth dance: redirect to provider,
      // back to /api/auth/callback/{provider}, then to callbackURL.
      // The page navigates away on success, so code below rarely runs.
      await authClient.signIn.social({ provider, callbackURL: "/" });
      return { success: true };
    } catch (err) {
      const msg = toMessage(err, "সোশ্যাল লগইন সম্পন্ন করা যায়নি");
      toast.error(
        `${label} সাইন-ইন ব্যর্থ: ${msg}। OAuth সেটআপ সঠিক আছে কি না দয়া করে যাচাই করুন।`
      );
      return { success: false, error: msg };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authClient.signOut();
    } catch (err) {
      logger.error("Sign out failed", err);
    } finally {
      setUser(null);
      setStoredUser(null);
      toast.success("সফলভাবে সাইন আউট করা হয়েছে");
    }
  };

  const updateUser = async (name: string): Promise<boolean> => {
    if (!name.trim()) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না");
      return false;
    }

    try {
      try {
        await authClient.updateUser({ name: name.trim() });
      } catch (err) {
        // The session might be expired — fall through and update local state.
        logger.debug("BetterAuth updateUser failed; using local state only", err);
      }

      if (user) {
        const updated = { ...user, name: name.trim() };
        setUser(updated);
        setStoredUser(updated);
      }
      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");
      return true;
    } catch (err) {
      toast.error(toMessage(err, "তথ্য আপডেট করা যায়নি"));
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signInSocial, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে");
  return ctx;
}
