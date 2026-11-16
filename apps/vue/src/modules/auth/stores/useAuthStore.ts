import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";
import { AuthResolver } from "../resolvers/AuthResolver";
import type { LoginInput } from "../types/Auth";

export const useAuthStore = defineStore("auth", () => {
  const error = ref("");
  const session = useSessionStorage("edupro:vue:session", "", {
    flush: "sync",
    onError: () => {
      error.value = "auth.sessionError";
    },
  });
  const isAuthenticated = computed(() =>
    AuthResolver.isValidEmail(session.value),
  );
  function signIn(input: LoginInput) {
    const issues = AuthResolver.validate(input);
    if (issues.email || issues.password) return false;
    error.value = "";
    session.value = input.email.trim();
    if (error.value) {
      session.value = "";
      return false;
    }
    return true;
  }
  function signOut() {
    error.value = "";
    session.value = "";
  }
  return { isAuthenticated, email: session, error, signIn, signOut };
});
