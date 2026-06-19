"use client"; // Macht die Login-Seite offiziell zu einer Client-Komponente

import { loginUser, registerUser } from "../actions/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">IT-Support-System</h1>
          <p className="text-sm text-slate-500 mt-1">Anmeldung für Mitarbeiter und Admins</p>
        </div>

        {/* Login Formular */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-1">Anmelden</h2>
          <form 
            action={async (formData) => { await loginUser(formData); }} 
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">E-Mail</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="ihr.name@firma.de"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Passwort</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
            >
              Anmelden
            </button>
          </form>
        </div>

        {/* Registrierungs-Formular */}
        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-sm font-bold text-slate-600 mb-3">Neuen Account erstellen</h2>
          <form 
            action={async (formData) => { await registerUser(formData); }} 
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <input
                type="email"
                name="email"
                placeholder="E-Mail-Adresse"
                required
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Sicheres Passwort wählen"
              required
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="submit"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold py-1.5 px-4 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Registrieren & Einloggen
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}