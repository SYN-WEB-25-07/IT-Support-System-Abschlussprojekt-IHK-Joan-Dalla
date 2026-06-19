"use server";

import { db } from "../../lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. Benutzer registrieren
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return "Bitte alle Felder ausfüllen.";

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return "Diese E-Mail-Adresse wird bereits verwendet.";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Next.js 15 Standard: cookies() mit await aufrufen
  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 Tag
    path: "/",
  });

  redirect("/");
}

// 2. Benutzer einloggen
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return "Bitte alle Felder ausfüllen.";

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return "Ungültige E-Mail-Adresse oder Passwort.";

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return "Ungültige E-Mail-Adresse oder Passwort.";

  // Next.js 15 Standard: cookies() mit await aufrufen
  const cookieStore = await cookies();
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  redirect("/");
}

// 3. Benutzer ausloggen
export async function logoutUser() {
  // Next.js 15 Standard: cookies() mit await aufrufen
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}