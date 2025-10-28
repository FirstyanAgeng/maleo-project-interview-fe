"use client";
import React, { useState } from "react";
import { authFetch } from "../auth/AuthProvider";

export default function AssignmentForm({
  schoolId,
  onDone,
}: {
  schoolId: number;
  onDone?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await authFetch("http://localhost:8000/api/assignments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, due_date: dueDate }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${txt}`);
      }
      setMsg("✓ Assignment created");
      setTitle("");
      setDescription("");
      setDueDate("");
      setTimeout(() => {
        setMsg(null);
        onDone && onDone();
      }, 1000);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button
        className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
      {msg && <div className="text-xs text-center">{msg}</div>}
    </form>
  );
}
