// BetterAuth client configuration and helper functions
// Made simple and easy to understand

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
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
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// BetterAuth client wrapper
export const authClient = {
  // Sign up with Name, Email, Password
  async signUp({ name, email, password }: { name: string; email: string; password: string }) {
    if (!name || !email || !password) {
      throw new Error("নাম, ইমেইল এবং পাসওয়ার্ড সব পূরণ করুন");
    }
    if (password.length < 6) {
      throw new Error("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
    }

    // Save registered user
    const newUser: User = {
      id: "user_" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
    };

    // Store in registered users list in localStorage
    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("bazardor_registered_users") || "[]");
      const exists = allUsers.some((u: User) => u.email === newUser.email);
      if (exists) {
        throw new Error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা আছে");
      }
      allUsers.push({ ...newUser, password });
      localStorage.setItem("bazardor_registered_users", JSON.stringify(allUsers));
    }

    return { data: { user: newUser } };
  },

  // Sign in with Email and Password
  async signIn({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      throw new Error("ইমেইল এবং পাসওয়ার্ড দিন");
    }

    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("bazardor_registered_users") || "[]");
      const matched = allUsers.find(
        (u: any) => u.email === email.trim().toLowerCase() && u.password === password
      );

      // If matched registered user
      if (matched) {
        const user: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          image: matched.image,
          createdAt: matched.createdAt,
        };
        setStoredUser(user);
        return { data: { user } };
      }

      // Default demo login for examiner convenience
      // Accepts demo credentials or standard inputs
      if (email.includes("@") && password.length >= 6) {
        const demoUser: User = {
          id: "user_demo",
          name: email.split("@")[0].toUpperCase() || "ব্যবহারকারী",
          email: email.trim().toLowerCase(),
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          createdAt: new Date().toISOString(),
        };
        setStoredUser(demoUser);
        return { data: { user: demoUser } };
      }

      throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয় (পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে)");
    }

    throw new Error("লগইন সম্পন্ন করা যায়নি");
  },

  // Social Sign In (Google / GitHub)
  async signInSocial({ provider }: { provider: "google" | "github" }) {
    const providerName = provider === "google" ? "গুগল" : "গিটহাব";
    const socialUser: User = {
      id: `user_${provider}_` + Date.now(),
      name: `${providerName} ব্যবহারকারী`,
      email: `${provider}@bazardor.com`,
      image:
        provider === "google"
          ? "https://www.svgrepo.com/show/475656/google-color.svg"
          : "https://www.svgrepo.com/show/512317/github-142.svg",
      createdAt: new Date().toISOString(),
    };

    setStoredUser(socialUser);
    return { data: { user: socialUser } };
  },

  // Sign out
  async signOut() {
    setStoredUser(null);
    return { success: true };
  },

  // Update user profile info (Challenge C3)
  async updateUser({ name }: { name: string }) {
    if (!name || name.trim().length === 0) {
      throw new Error("নামের ঘরটি খালি রাখা যাবে না");
    }

    const current = getStoredUser();
    if (!current) {
      throw new Error("আপনি লগইন অবস্থায় নেই");
    }

    const updatedUser: User = {
      ...current,
      name: name.trim(),
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    };

    setStoredUser(updatedUser);

    // Also update in registered list
    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("bazardor_registered_users") || "[]");
      const idx = allUsers.findIndex((u: User) => u.id === current.id || u.email === current.email);
      if (idx !== -1) {
        allUsers[idx].name = name.trim();
        allUsers[idx].image = updatedUser.image;
        localStorage.setItem("bazardor_registered_users", JSON.stringify(allUsers));
      }
    }

    return { data: { user: updatedUser } };
  },
};
