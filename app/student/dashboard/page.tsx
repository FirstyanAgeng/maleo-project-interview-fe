"use client";
import React, { useEffect, useState } from "react";
import { authFetch } from "../../auth/AuthProvider";

type Profile = {
  id: number;
  user?: { username: string; email?: string };
  role: string;
  school?: number;
};

type Attendance = {
  id: number;
  date: string;
  status: string;
  notes?: string;
};

type Assignment = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
};

type Submission = {
  id: number;
  assignment: number;
  grade?: number | null;
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkInStatus, setCheckInStatus] = useState("present");
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get current user profile
        const pRes = await authFetch("http://localhost:8000/api/profiles/");
        if (!pRes.ok) throw new Error("Failed to load profile");
        const profiles = await pRes.json();
        const currentProfile = profiles[0]; // Get first profile (current user)
        setProfile(currentProfile);

        if (currentProfile.school) {
          // Load attendance records for this student
          const attRes = await authFetch(
            `http://localhost:8000/api/attendance/?school=${currentProfile.school}`
          );
          if (attRes.ok) {
            const attData = await attRes.json();
            setAttendance(
              attData.filter((a: any) => a.student === currentProfile.id)
            );
          }

          // Load assignments
          const assRes = await authFetch(
            `http://localhost:8000/api/assignments/?school=${currentProfile.school}`
          );
          if (assRes.ok) setAssignments(await assRes.json());

          // Load submissions for this student
          const subRes = await authFetch(
            `http://localhost:8000/api/submissions/?school=${currentProfile.school}`
          );
          if (subRes.ok) {
            const subData = await subRes.json();
            setSubmissions(subData);
          }
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setCheckInLoading(true);
    setCheckInMsg(null);

    try {
      const res = await fetch("http://localhost:8000/api/attendance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          student: profile.id,
          date: checkInDate,
          status: checkInStatus,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} - ${txt}`);
      }

      setCheckInMsg("✓ Check-in successful!");
      // Reload attendance data
      const attRes = await authFetch(
        `http://localhost:8000/api/attendance/?school=${profile.school}`
      );
      if (attRes.ok) {
        const attData = await attRes.json();
        setAttendance(attData.filter((a: any) => a.student === profile.id));
      }
    } catch (err: any) {
      setCheckInMsg(err.message || "Check-in failed");
    } finally {
      setCheckInLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">No profile found</p>
        </div>
      </div>
    );
  }

  const myAttendance = attendance.slice(0, 10);
  const myAssignments = assignments.slice(0, 5);
  const recentSubmissions = submissions.slice(0, 5);

  return (
    <main className="min-h-screen">
      <div className="container-page py-12">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Student Dashboard
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Welcome, {profile.user?.username || "Student"}!
        </p>

        {/* Check-In Card */}
        <div className="mb-8 rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Daily Check-In
          </h2>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300/70 bg-white/70 px-4 py-2 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Status
                </label>
                <select
                  value={checkInStatus}
                  onChange={(e) => setCheckInStatus(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300/70 bg-white/70 px-4 py-2 outline-none ring-0 transition focus:border-indigo-500 focus:bg-white dark:border-zinc-700 dark:bg-zinc-900/60"
                >
                  <option value="present">✅ Present</option>
                  <option value="late">⏰ Late</option>
                  <option value="absent">❌ Absent</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={checkInLoading}
              className="w-full rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 md:w-auto"
            >
              {checkInLoading ? "Checking in..." : "Check In"}
            </button>
            {checkInMsg && (
              <div
                className={`text-sm ${
                  checkInMsg.includes("✓") ? "text-green-600" : "text-red-600"
                }`}
              >
                {checkInMsg}
              </div>
            )}
          </form>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Attendance Records
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {attendance.length}
                </p>
              </div>
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Assignments
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {assignments.length}
                </p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Submissions
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {submissions.length}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              My Attendance History
            </h3>
            <div className="space-y-3">
              {myAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/40"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                      {record.status}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : record.status === "late"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {record.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {myAttendance.length === 0 && (
                <p className="py-8 text-center text-zinc-500">
                  No attendance records yet
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Assignments
            </h3>
            <div className="space-y-3">
              {myAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/40"
                >
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {assignment.title}
                  </h4>
                  {assignment.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {assignment.description}
                    </p>
                  )}
                  {assignment.due_date && (
                    <p className="mt-2 text-xs text-zinc-500">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
              {myAssignments.length === 0 && (
                <p className="py-8 text-center text-zinc-500">
                  No assignments available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* My Submissions */}
        {submissions.length > 0 && (
          <div className="mt-6 rounded-lg border border-zinc-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              My Submissions
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800/60">
                <thead className="bg-zinc-50 dark:bg-zinc-900/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white/70 backdrop-blur dark:divide-zinc-800/60 dark:bg-zinc-900/60">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">
                        Assignment {submission.assignment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        {submission.grade !== null &&
                        submission.grade !== undefined ? (
                          submission.grade
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.grade !== null &&
                        submission.grade !== undefined ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Graded
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
