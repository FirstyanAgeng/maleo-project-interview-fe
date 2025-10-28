"use client";
import React, { useState } from "react";
import { authFetch } from "../auth/AuthProvider";

export default function GradeForm({
  schoolId,
  submissions,
  onDone,
}: {
  schoolId: number;
  submissions: Array<{
    id: number;
    assignment: number;
    student?: string | number;
    grade?: number | null;
  }>;
  onDone?: () => void;
}) {
  const [submissionId, setSubmissionId] = useState<number | "">("");
  const [grade, setGrade] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId) return setMsg("Select submission");
    setLoading(true);
    setMsg(null);
    try {
      const res = await authFetch(
        `http://localhost:8000/api/submissions/${submissionId}/grade/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade: grade || null }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${txt}`);
      }
      setMsg("✓ Grade updated");
      setSubmissionId("");
      setGrade("");
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
      <select
        className="w-full text-sm rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
        value={submissionId}
        onChange={(e) => setSubmissionId(Number(e.target.value) || "")}
      >
        <option value="">Select submission</option>
        {submissions.map((s) => (
          <option key={s.id} value={s.id}>
            #{s.id} - {s.student ?? "student"}
          </option>
        ))}
      </select>
      <input
        className="w-full text-sm rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
        type="number"
        step="0.01"
        min="0"
        max="100"
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value) || "")}
        placeholder="Grade (0-100)"
      />
      <button
        className="w-full text-xs rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {msg && <div className="text-xs text-center">{msg}</div>}
    </form>
  );
}
