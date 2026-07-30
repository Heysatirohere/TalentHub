"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type UserRole = "aluno" | "master" | "empresa";

export async function loginAction(role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set("user_role", role, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    sameSite: "lax",
  });
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  cookieStore.delete("user_role");
  cookieStore.delete("user_email");
  cookieStore.delete("user_ra");

  revalidatePath("/", "layout");
  redirect("/login");
}
