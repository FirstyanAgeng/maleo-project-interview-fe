"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "../auth/AuthProvider";

type School = {
  id: number;
  name: string;
  address?: string;
  description?: string;
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const res = await authFetch("http://localhost:8000/api/schools/");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setSchools(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await authFetch("http://localhost:8000/api/schools/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const newSchool = await res.json();
      setSchools([...schools, newSchool]);
      setShowForm(false);
      setFormData({ name: "", address: "", description: "" });
    } catch (err: any) {
      alert(err.message || "Failed to create school");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Schools
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Manage school profiles, attendance, assignments, and grades
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Create School
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Loading schools...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {schools.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-12 text-center shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  No schools found
                </h3>
                <p className="mb-4 mt-2 text-zinc-600 dark:text-zinc-400">
                  Get started by creating your first school.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Create Your First School
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schools.map((school) => (
                  <Link
                    key={school.id}
                    href={`/schools/${school.id}`}
                    className="group rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm transition hover:shadow-md backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-zinc-100">
                          {school.name}
                        </h3>
                        {school.address && (
                          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <svg
                              className="inline w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {school.address}
                          </p>
                        )}
                        {school.description && (
                          <p className="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                            {school.description}
                          </p>
                        )}
                      </div>
                      <svg
                        className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
                      <span className="text-sm font-medium text-indigo-600">
                        View Dashboard →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create School Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-zinc-200/70 bg-white/80 p-8 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Create New School
            </h2>
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300/70 bg-white/70 px-4 py-2 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300/70 bg-white/70 px-4 py-2 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-300/70 bg-white/70 px-4 py-2 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", address: "", description: "" });
                  }}
                  className="flex-1 rounded-lg border border-zinc-300/70 px-4 py-2 text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {formLoading ? "Creating..." : "Create School"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
