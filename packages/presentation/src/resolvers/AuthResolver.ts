import type { LoginInput, LoginIssues } from "../types/Auth";
export const DEMO_EMAIL = "demo@edupro.local";
export const DEMO_PASSWORD = "edupro123";
export class AuthResolver {
  static isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }
  static validate(input: LoginInput): LoginIssues {
    return {
      email: !input.email.trim()
        ? "auth.emailRequired"
        : !this.isValidEmail(input.email)
          ? "auth.emailInvalid"
          : undefined,
      password: !input.password.trim() ? "auth.passwordRequired" : undefined,
    };
  }
  static destination(value: unknown): string {
    if (typeof value !== "string") return "/";
    return /^(?:\/|\/(?:courses|subjects|students|enrollments)(?:\/[^/?#\\]+)?(?:\?[^#\\]*)?)$/.test(
      value,
    )
      ? value
      : "/";
  }
}
