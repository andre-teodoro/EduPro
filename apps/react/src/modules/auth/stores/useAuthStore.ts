import { create } from "zustand";
import { AuthResolver, type LoginInput } from "@edupro/presentation";
const sessionKey = "edupro:react:session";
interface AuthState {
  email: string;
  ready: boolean;
  error: "auth.sessionError" | "";
  hydrate: () => void;
  signIn: (input: LoginInput) => boolean;
  signOut: () => boolean;
}
export const useAuthStore = create<AuthState>()((set) => ({
  email: "",
  ready: false,
  error: "",
  hydrate: () => {
    try {
      const email = window.sessionStorage.getItem(sessionKey) ?? "";
      set({
        email: AuthResolver.isValidEmail(email) ? email : "",
        ready: true,
        error: "",
      });
    } catch {
      set({ email: "", ready: true, error: "auth.sessionError" });
    }
  },
  signIn: (input) => {
    const issues = AuthResolver.validate(input);
    if (issues.email || issues.password) return false;
    try {
      const email = input.email.trim();
      window.sessionStorage.setItem(sessionKey, email);
      set({ email, error: "" });
      return true;
    } catch {
      set({ error: "auth.sessionError" });
      return false;
    }
  },
  signOut: () => {
    try {
      window.sessionStorage.removeItem(sessionKey);
      set({ email: "", error: "" });
      return true;
    } catch {
      set({ error: "auth.sessionError" });
      return false;
    }
  },
}));
