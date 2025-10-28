"use client";
import React, { useState, useEffect } from "react";
import { authFetch } from "../auth/AuthProvider";

export default function AttendanceForm({
  schoolId,
  onDone,
}: {
  schoolId: number;
  onDone?: () => void;
}) {
  const [student, setStudent] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [studentsList, setStudentsList] = useState<
    Array<{ id: number; username: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("http://localhost:8000/api/attendance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("access_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              }
            : {}),
        },
        body: JSON.stringify({
          student: Number(student) || null,
          date: date || undefined,
          status,
          notes,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} ${res.statusText} - ${txt}`);
      }
      setMsg("✓ Attendance recorded");
      setStudent("");
      setDate("");
      setNotes("");
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

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/profiles/");
        if (!res.ok) return;
        const data = await res.json();
        const students = data
          .filter((p: any) => p.role === "student" && p.school === schoolId)
          .map((p: any) => ({
            id: p.id,
            username: p.user?.username || `id:${p.id}`,
          }));
        setStudentsList(students);
      } catch (err) {
        // ignore
      }
    };
    loadStudents();
  }, [schoolId]);

  return (
    <form onSubmit={submit} className="space-y-2">
      <select
        value={student}
        onChange={(e) => setStudent(e.target.value)}
        className="w-full text-sm rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
        required
      >
        <option value="">Select student</option>
        {studentsList.map((s) => (
          <option key={s.id} value={s.id}>
            {s.username}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full text-sm rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full text-sm rounded-lg border border-zinc-300/70 bg-white/70 px-3 py-2 shadow-sm outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
      >
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="late">Late</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full text-xs rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {msg && <div className="text-xs text-center">{msg}</div>}
    </form>
  );
}
