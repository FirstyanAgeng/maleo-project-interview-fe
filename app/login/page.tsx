"use client";
import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      router.push("/schools");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur dark:bg-zinc-900/60 dark:ring-zinc-800">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Login
          </h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-zinc-700 dark:text-zinc-300">
                Username
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-sm text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 text-zinc-900 placeholder-zinc-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn-primary w-full">Login</button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </form>
        </div>
      </div>
    </main>
  );
}
