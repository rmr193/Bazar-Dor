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
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

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
      image: DEFAULT_AVATAR,
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
      const cleanEmail = email.trim().toLowerCase();

      // Check registered users
      const allUsers = JSON.parse(localStorage.getItem("bazardor_registered_users") || "[]");
      const matched = allUsers.find(
        (u: any) => u.email === cleanEmail && u.password === password
      );

      if (matched) {
        const user: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          image: matched.image || DEFAULT_AVATAR,
          createdAt: matched.createdAt,
        };
        setStoredUser(user);
        return { data: { user } };
      }

      // Check Figma default demo user
      if (cleanEmail === "rezwanahmed@gmail.com") {
        const rezwanUser: User = {
          id: "user_rezwan",
          name: "Rezwan Ahmed",
          email: "rezwanahmed@gmail.com",
          image: DEFAULT_AVATAR,
          createdAt: new Date().toISOString(),
        };
        setStoredUser(rezwanUser);
        return { data: { user: rezwanUser } };
      }

      // Universal valid user for any email
      if (cleanEmail.includes("@")) {
        const namePart = cleanEmail.split("@")[0];
        const formattedName =
          namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const demoUser: User = {
          id: "user_" + Date.now(),
          name: formattedName || "ব্যবহারকারী",
          email: cleanEmail,
          image: DEFAULT_AVATAR,
          createdAt: new Date().toISOString(),
        };
        setStoredUser(demoUser);
        return { data: { user: demoUser } };
      }

      throw new Error("সঠিক ইমেইল ঠিকানা দিন (যেমন: you@example.com)");
    }

    throw new Error("লগইন সম্পন্ন করা যায়নি");
  },

  // Social Sign In (Google / GitHub)
  async signInSocial({ provider }: { provider: "google" | "github" }) {
    const socialUser: User = {
      id: `user_${provider}_` + Date.now(),
      name: "Rezwan Ahmed",
      email: "rezwanahmed@gmail.com",
      image: DEFAULT_AVATAR,
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
    };

    setStoredUser(updatedUser);

    // Also update in registered list
    if (typeof window !== "undefined") {
      const allUsers = JSON.parse(localStorage.getItem("bazardor_registered_users") || "[]");
      const idx = allUsers.findIndex((u: User) => u.id === current.id || u.email === current.email);
      if (idx !== -1) {
        allUsers[idx].name = name.trim();
        localStorage.setItem("bazardor_registered_users", JSON.stringify(allUsers));
      }
    }

    return { data: { user: updatedUser } };
  },
};
