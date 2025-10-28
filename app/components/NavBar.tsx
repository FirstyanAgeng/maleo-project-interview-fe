"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function NavBar() {
  const { token, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60">
      <nav className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            SchoolApp
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/schools"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Schools
            </Link>
            <Link
              href="/student/dashboard"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Student Dashboard
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {token ? (
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          ) : (
            <>
              <Link href="/register" className="btn-secondary">
                Register
              </Link>
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
    </header>
  );
}
