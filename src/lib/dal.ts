import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookie, type SessionPayload } from "@/lib/session";

export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  const token = await getSessionCookie();
  return decrypt(token);
});

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getOptionalSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return session;
});

export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/");
  }
  return session;
});
