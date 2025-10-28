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
    <form onSubmit={submit} className="max-w-md space-y-3">
      <label className="block">
        <span className="text-sm">Username</span>
        <input
          className="mt-1 block w-full rounded border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm">Email</span>
        <input
          className="mt-1 block w-full rounded border p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm">Password</span>
        <input
          className="mt-1 block w-full rounded border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </div>
    </form>
  );
}
