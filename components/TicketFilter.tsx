"use client"; // Macht diese Komponente offiziell zu einer Client-Komponente

import { useState } from "react";

interface TicketFilterProps {
  onSearch: (term: string) => void;
}

export default function TicketFilter({ onSearch }: TicketFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Gibt die Suche an das Elternelement weiter
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="🔍 Tickets durchsuchen (z. B. Drucker, VPN)..."
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
      />
    </div>
  );
}