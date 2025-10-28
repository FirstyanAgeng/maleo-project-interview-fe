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
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
        <input
          type="password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button className="bg-blue-600 text-white p-2 rounded">Login</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </main>
  );
}
