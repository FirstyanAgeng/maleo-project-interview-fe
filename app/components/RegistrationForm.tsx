"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../auth/AuthProvider";

export default function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `${res.status} ${res.statusText}`);
      }
      setMsg("Registration successful. Please log in.");
      setUsername("");
      setPassword("");
      setEmail("");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setMsg(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <label className="block">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Username
        </span>
        <input
          className="mt-1 block w-full rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Email</span>
        <input
          className="mt-1 block w-full rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          Password
        </span>
        <input
          className="mt-1 block w-full rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </label>

      <div className="flex items-center gap-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </div>
    </form>
  );
}
