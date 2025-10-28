"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function NavBar() {
  const { token, logout } = useAuth();
  return (
    <nav className="w-full bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold">
          SchoolApp
        </Link>
        <Link href="/schools" className="text-sm text-gray-600 hover:underline">
          Schools
        </Link>
        <Link href="/student/dashboard" className="text-sm text-gray-600 hover:underline">
          Student Dashboard
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {token ? (
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-500 text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/register"
              className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-3 py-1 rounded bg-blue-500 text-white"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
