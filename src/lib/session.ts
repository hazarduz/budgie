import "server-only";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { Role } from "@prisma/client";

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  role: Role;
}

const COOKIE_NAME = "budgie_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

const FALLBACK_SECRET = "budgie-dev-only-secret-change-me";
let warnedAboutFallbackSecret = false;

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && !warnedAboutFallbackSecret) {
    warnedAboutFallbackSecret = true;
    console.warn(
      "[budgie] SESSION_SECRET is not set — using an insecure default. " +
        "Set SESSION_SECRET in your .env before exposing this app beyond your own machine."
    );
  }
  return new TextEncoder().encode(secret || FALLBACK_SECRET);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export { COOKIE_NAME };
