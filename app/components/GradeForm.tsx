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
        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        type="number"
        step="0.01"
        min="0"
        max="100"
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value) || "")}
        placeholder="Grade (0-100)"
      />
      <button
        className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {msg && <div className="text-xs text-center">{msg}</div>}
    </form>
  );
}
