import { db } from "../lib/db";
import { createTicket, updateTicketStatus, deleteTicket } from "./actions/tickets";

export const revalidate = 0;

export default async function Home() {
  const tickets = await db.ticket.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // Statistik-Berechnungen für das Dashboard
  const total = tickets.length;
  const open = tickets.filter(t => t.status === "OPEN").length;
  const progress = tickets.filter(t => t.status === "IN_PROGRESS").length;
  const closed = tickets.filter(t => t.status === "CLOSED").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">IT-Support Cockpit</h1>
            <p className="text-sm text-slate-500">Zentrales Ticket- und Vorfallmanagement</p>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            System Online
          </span>
        </header>

        {/* Dashboard Kennzahlen (Statistiken) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Gesamt</span>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
            <span className="text-xs font-semibold text-red-500 uppercase">Offen</span>
            <p className="text-2xl font-bold text-slate-800">{open}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-yellow-500">
            <span className="text-xs font-semibold text-yellow-600 uppercase">In Arbeit</span>
            <p className="text-2xl font-bold text-slate-800">{progress}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
            <span className="text-xs font-semibold text-green-600 uppercase">Gelöst</span>
            <p className="text-2xl font-bold text-slate-800">{closed}</p>
          </div>
        </section>

        {/* Responsive Zwei-Spalten-Layout auf großen Bildschirmen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Linke Spalte: Formular (Nimmt 1/3 ein) */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:sticky lg:top-8">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">Neues Ticket erfassen</h2>
            <form action={createTicket} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Betreff</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="z.B. Drucker im 2. OG blockiert"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beschreibung</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Genaue Fehlerbeschreibung..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priorität</label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
                >
                  <option value="LOW">Niedrig</option>
                  <option value="MEDIUM">Mittel</option>
                  <option value="HIGH">Hoch</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
              >
                Ticket einsenden
              </button>
            </form>
          </section>

          {/* Rechte Spalte: Ticketliste (Nimmt 2/3 ein) */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">Aktive Vorfälle</h2>
            {tickets.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                Keine aktiven Tickets vorhanden.
              </div>
            ) : (
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800">{ticket.title}</h3>
                        <p className="text-[11px] text-slate-400">
                          Gemeldet von: {ticket.user.name} ({ticket.user.email})
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ticket.priority === "HIGH"
                            ? "bg-red-50 text-red-800"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                            : "bg-green-50 text-green-800"
                        }`}
                      >
                        {ticket.priority === "HIGH" ? "Hoch" : ticket.priority === "MEDIUM" ? "Mittel" : "Niedrig"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{ticket.description}</p>

                    <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-slate-100">
                      <form action={updateTicketStatus} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={ticket.id} />
                        <span className="text-xs text-slate-400 font-bold uppercase">Status:</span>
                        <select
                          name="status"
                          defaultValue={ticket.status}
                          className="text-xs border border-slate-300 rounded-lg p-1.5 text-black bg-slate-50 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="OPEN">Offen</option>
                          <option value="IN_PROGRESS">In Bearbeitung</option>
                          <option value="CLOSED">Gelöst</option>
                        </select>
                        <button 
                          type="submit" 
                          className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg font-bold border border-slate-200 transition-colors cursor-pointer"
                        >
                          Speichern
                        </button>
                      </form>

                      <form
                        action={async () => {
                          "use server";
                          await deleteTicket(ticket.id);
                        }}
                      >
                        <button className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer">
                          Löschen
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}