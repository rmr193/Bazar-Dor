import { createAuthClient } from "better-auth/react";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
}

const STORAGE_KEY = "bazardor_user";

// Helper to get currently saved user from localStorage
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Helper to save user in localStorage
export function setStoredUser(user: User | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota or disabled errors
  }
}

// Official BetterAuth client instance
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
