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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Student Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome, {profile.user?.username || "Student"}!
        </p>

        {/* Check-In Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Daily Check-In
          </h2>
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={checkInStatus}
                  onChange={(e) => setCheckInStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Attendance Records
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {attendance.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
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

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {assignments.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
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

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {submissions.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Attendance History
            </h3>
            <div className="space-y-3">
              {myAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {record.status}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : record.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.status.toUpperCase()}
                  </span>
                </div>
              ))}
              {myAttendance.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No attendance records yet
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Assignments
            </h3>
            <div className="space-y-3">
              {myAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">
                    {assignment.title}
                  </h4>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}
                  {assignment.due_date && (
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
              {myAssignments.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No assignments available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* My Submissions */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Submissions
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Assignment {submission.assignment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        {submission.grade !== null && submission.grade !== undefined ? (
                          submission.grade
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.grade !== null && submission.grade !== undefined ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Graded
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
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

