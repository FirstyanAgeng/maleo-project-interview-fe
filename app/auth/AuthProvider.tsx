"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (t) setToken(t);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:8000/api/auth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    const access = data.access;
    const refresh = data.refresh;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setToken(access);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// authFetch will attempt request and automatically refresh token on 401
export async function authFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers || {});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  if (res.status !== 401) return res;

  // try refresh flow once
  const refresh =
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null;
  if (!refresh) return res;

  const r = await fetch("http://localhost:8000/api/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!r.ok) {
    // logout on failed refresh
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // return original 401 response
    return res;
  }
  const data = await r.json();
  const newAccess = data.access;
  localStorage.setItem("access_token", newAccess);
  setTimeout(() => {}, 0);

  // retry original request with new token
  const retryHeaders = new Headers(init?.headers || {});
  retryHeaders.set("Authorization", `Bearer ${newAccess}`);
  if (
    !retryHeaders.has("Content-Type") &&
    init?.headers &&
    (init.headers as any)["Content-Type"]
  ) {
    retryHeaders.set("Content-Type", (init.headers as any)["Content-Type"]);
  }
  return fetch(input, { ...init, headers: retryHeaders });
}
