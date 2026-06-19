import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TicketDashboard from "../components/TicketDashboard";

export const revalidate = 0;

export default async function Home() {
  // 1. Next.js 15: Cookies asynchron prüfen
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }

  // 2. Angemeldeten Benutzer laden
  const currentUser = await db.user.findUnique({
    where: { id: sessionCookie.value },
  });

  if (!currentUser) {
    redirect("/login");
  }

  // 3. Alle Tickets inkl. Ersteller laden
  const tickets = await db.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // 4. Daten an die interaktive Client-Komponente übergeben
  return (
    <TicketDashboard 
      initialTickets={tickets as any} 
      currentUser={currentUser} 
    />
  );
}