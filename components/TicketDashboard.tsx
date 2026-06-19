"use client"; // Offiziell eine interaktive Client-Komponente

import { useState } from "react";
import { createTicket, updateTicketStatus, deleteTicket } from "../app/actions/tickets";
import { logoutUser } from "../app/actions/auth";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
}

interface TicketDashboardProps {
  initialTickets: Ticket[];
  currentUser: {
    name: string;
  };
}

export default function TicketDashboard({ initialTickets, currentUser }: TicketDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED">("ALL");

  // Dynamische Filterung
  const filteredTickets = initialTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeFilter === "ALL" || ticket.status === activeFilter;

    return matchesSearch && matchesTab;
  });

  // Statistiken
  const total = initialTickets.length;
  const open = initialTickets.filter((t) => t.status === "OPEN").length;
  const progress = initialTickets.filter((t) => t.status === "IN_PROGRESS").length;
  const closed = initialTickets.filter((t) => t.status === "CLOSED").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">IT-Support Cockpit</h1>
            <p className="text-sm text-slate-500">
              Angemeldet als: <span className="font-bold text-blue-600">{currentUser.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* UX Upgrade: Kein Formular mehr nötig für Logout, direkte Client-Action */}
            <button 
              onClick={async () => {
                await logoutUser();
              }}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Abmelden
            </button>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider">
              System Online
            </span>
          </div>
        </header>

        {/* Dashboard Kennzahlen */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => setActiveFilter("ALL")}
            className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${activeFilter === "ALL" ? "bg-blue-50 border-blue-300 ring-2 ring-blue-100 shadow-sm" : "bg-white border-slate-200 shadow-sm hover:translate-y-[-2px]"}`}
          >
            <span className="text-xs font-semibold text-slate-400 uppercase">Gesamt</span>
            <p className="text-2xl font-bold text-slate-800">{total}</p>
          </button>
          
          <button 
            onClick={() => setActiveFilter("OPEN")}
            className={`p-4 rounded-xl border border-l-4 border-l-red-500 transition-all text-left cursor-pointer ${activeFilter === "OPEN" ? "bg-red-50/50 border-red-300 ring-2 ring-red-100 shadow-sm" : "bg-white border-slate-200 shadow-sm hover:translate-y-[-2px]"}`}
          >
            <span className="text-xs font-semibold text-red-500 uppercase">Offen</span>
            <p className="text-2xl font-bold text-slate-800">{open}</p>
          </button>

          <button 
            onClick={() => setActiveFilter("IN_PROGRESS")}
            className={`p-4 rounded-xl border border-l-4 border-l-yellow-500 transition-all text-left cursor-pointer ${activeFilter === "IN_PROGRESS" ? "bg-yellow-50/50 border-yellow-300 ring-2 ring-yellow-100 shadow-sm" : "bg-white border-slate-200 shadow-sm hover:translate-y-[-2px]"}`}
          >
            <span className="text-xs font-semibold text-yellow-600 uppercase">In Arbeit</span>
            <p className="text-2xl font-bold text-slate-800">{progress}</p>
          </button>

          <button 
            onClick={() => setActiveFilter("CLOSED")}
            className={`p-4 rounded-xl border border-l-4 border-l-green-500 transition-all text-left cursor-pointer ${activeFilter === "CLOSED" ? "bg-green-50/50 border-green-300 ring-2 ring-green-100 shadow-sm" : "bg-white border-slate-200 shadow-sm hover:translate-y-[-2px]"}`}
          >
            <span className="text-xs font-semibold text-green-600 uppercase">Gelöst</span>
            <p className="text-2xl font-bold text-slate-800">{closed}</p>
          </button>
        </section>

        {/* Live-Suche & Filterleiste */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Vorfälle durchsuchen (z. B. Drucker, AD, Sarah)..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase self-center mr-2">Filter:</span>
            <button 
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === "ALL" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"}`}
            >
              Alle ({total})
            </button>
            <button 
              onClick={() => setActiveFilter("OPEN")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === "OPEN" ? "bg-red-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"}`}
            >
              Offen ({open})
            </button>
            <button 
              onClick={() => setActiveFilter("IN_PROGRESS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === "IN_PROGRESS" ? "bg-yellow-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"}`}
            >
              In Arbeit ({progress})
            </button>
            <button 
              onClick={() => setActiveFilter("CLOSED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeFilter === "CLOSED" ? "bg-green-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"}`}
            >
              Gelöst ({closed})
            </button>
          </div>
        </section>

        {/* Responsive Zwei-Spalten-Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Spalte 1: Formular */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:sticky lg:top-8">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">Neues Ticket erfassen</h2>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await createTicket(formData);
                (e.target as HTMLFormElement).reset(); 
              }} 
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Betreff</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="z.B. Monitor flackert..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beschreibung</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Genaue Fehlerbeschreibung..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priorität</label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Niedrig</option>
                  <option value="MEDIUM">Mittel</option>
                  <option value="HIGH">Hoch</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer shadow-sm w-full"
              >
                Ticket einsenden
              </button>
            </form>
          </section>

          {/* Spalte 2: Ticketliste */}
          <section className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4 text-slate-700 border-b pb-2">
              Gemeldete Vorfälle ({filteredTickets.length})
            </h2>
            {filteredTickets.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 shadow-sm">
                Keine passenden Vorfälle für diese Auswahl gefunden.
              </div>
            ) : (
              <div className="grid gap-4 max-h-[800px] overflow-y-auto pr-2">
                {filteredTickets.map((ticket) => (
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
                            ? "bg-red-100 text-red-800"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                            : "bg-green-50 text-green-800"
                        }`}
                      >
                        {ticket.priority === "HIGH" ? "Hoch" : ticket.priority === "MEDIUM" ? "Mittel" : "Niedrig"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{ticket.description}</p>

                    <div className="flex flex-wrap justify-between items-center gap-4 pt-3 border-t border-slate-100 font-medium">
                      
                      {/* UX-Upgrade: Kein Formular/Speichern-Button mehr! Echtzeit-Speicherung bei Änderung */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Status:</span>
                        <select
                          defaultValue={ticket.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            const formData = new FormData();
                            formData.append("id", ticket.id);
                            formData.append("status", newStatus);
                            await updateTicketStatus(formData);
                          }}
                          className="text-xs border border-slate-300 rounded-lg p-1.5 text-black bg-slate-50 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="OPEN">Offen</option>
                          <option value="IN_PROGRESS">In Bearbeitung</option>
                          <option value="CLOSED">Gelöst</option>
                        </select>
                      </div>

                      <button 
                        onClick={async () => {
                          if (confirm("Möchten Sie dieses Ticket wirklich dauerhaft löschen?")) {
                            await deleteTicket(ticket.id);
                          }
                        }}
                        type="button"
                        className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                      >
                        Löschen
                      </button>
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