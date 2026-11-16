export interface LoginInput {
  email: string;
  password: string;
}
export interface LoginIssues {
  email?: "auth.emailRequired" | "auth.emailInvalid";
  password?: "auth.passwordRequired";
}
