"use server"; // MUSS in Zeile 1 stehen!

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Hilfsfunktion: Holt die ID des aktuell angemeldeten Users aus dem Session-Cookie auf Server-Ebene
async function getLoggedInUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    throw new Error("Nicht autorisiert. Bitte loggen Sie sich ein.");
  }
  return sessionCookie.value;
}

// 1. Ticket erstellen (Zuweisung zum echten, angemeldeten User via Cookie)
export async function createTicket(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as any;

  if (!title || !description) return;

  const userId = await getLoggedInUserId(); // Holt die echte User-ID sicher auf dem Server aus dem Cookie

  await db.ticket.create({
    data: {
      title,
      description,
      priority,
      userId: userId, // Ticket dem angemeldeten Benutzer zuweisen
    },
  });

  revalidatePath("/");
}

// 2. Ticket-Status aktualisieren
export async function updateTicketStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as any;

  if (!id || !status) return;

  await db.ticket.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
}

// 3. Ticket löschen
export async function deleteTicket(id: string) {
  await db.ticket.delete({
    where: { id },
  });

  revalidatePath("/");
}