import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TicketDashboard from "../components/TicketDashboard";

export const revalidate = 0;

export default async function Home() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }

  const currentUser = await db.user.findUnique({
    where: { id: sessionCookie.value },
  });

  if (!currentUser) {
    redirect("/login");
  }

  let tickets;

  // Rollenbasierte Datenbankabfrage (RBAC)
  if (currentUser.role === "ADMIN") {
    // Joan Admin sieht ALLE Tickets im System
    tickets = await db.ticket.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Max Mitarbeiter sieht NUR seine eigenen erstellten Tickets
    tickets = await db.ticket.findMany({
      where: { userId: currentUser.id },
      include: { user: true },
    });
  }

  return (
    <TicketDashboard 
      initialTickets={tickets as any} 
      currentUser={currentUser as any} 
    />
  );
}