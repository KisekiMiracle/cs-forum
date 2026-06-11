"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/schema";

export type FormState = {
  error: string | null;
  fieldErrors?: Record<string, string>;
};

export async function signUpAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());

  // Server-side Zod Validation
  const validated = signupSchema.safeParse(rawData);
  if (!validated.success) {
    // Flatten Zod errors into a clean key-value object (e.g., { email: "Invalid email" })
    const fieldErrors: Record<string, string> = {};
    validated.error.issues.forEach((issue) => {
      if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
    });
    return { error: "Validation failed.", fieldErrors };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: validated.data.email,
        password: validated.data.password,
        name: validated.data.name,
      },
    });
  } catch (error: any) {
    return { error: error?.message || "Failed to register account." };
  }

  redirect("/");
}

export async function signInAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());

  // Server-side Zod Validation
  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    const fieldErrors: Record<string, string> = {};
    validated.error.issues.forEach((issue) => {
      if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
    });
    return { error: "Validation failed.", fieldErrors };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: validated.data.email,
        password: validated.data.password,
      },
    });
  } catch (error: any) {
    return { error: error?.message || "Invalid email or password." };
  }

  redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}
