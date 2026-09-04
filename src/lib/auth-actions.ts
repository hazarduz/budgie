"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { provisionUserDefaults } from "@/lib/provision-user";
import { Role } from "@prisma/client";

export interface LoginState {
  error?: string;
}

export async function registerFirstAdmin(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Choose a username and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const userCount = await prisma.user.count();
  if (userCount > 0) {
    return { error: "An admin account already exists — please log in instead." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "That username is already taken." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, role: Role.ADMIN },
  });
  await provisionUserDefaults(prisma, user.id);

  await createSession({ userId: user.id, username: user.username, role: user.role });
  redirect("/");
}

export async function login(_prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter a username and password." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "Invalid username or password." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid username or password." };
  }

  await createSession({ userId: user.id, username: user.username, role: user.role });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
