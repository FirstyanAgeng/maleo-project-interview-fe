"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AttendanceForm, AssignmentForm, GradeForm } from "../../components";
import { authFetch } from "../../auth/AuthProvider";

type School = {
  id: number;
  name: string;
  address?: string;
  description?: string;
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
  student?: string | number;
  grade?: number | null;
  content?: string;
};
type Attendance = {
  id: number;
  student: number;
  date: string;
  status: string;
  notes?: string;
};
type Profile = {
  id: number;
  user?: { username: string };
  role: string;
};

export default function SchoolDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [school, setSchool] = useState<School | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "assignments" | "submissions" | "attendance"
  >("overview");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, aRes, subRes, attRes, pRes] = await Promise.all([
          authFetch(`http://localhost:8000/api/schools/${id}/`),
          authFetch(`http://localhost:8000/api/assignments/?school=${id}`),
          authFetch(`http://localhost:8000/api/submissions/?school=${id}`),
          authFetch(`http://localhost:8000/api/attendance/?school=${id}`),
          authFetch(`http://localhost:8000/api/profiles/?school=${id}`),
        ]);

        if (!sRes.ok) throw new Error("Failed to load school");
        const sData = await sRes.json();
        setSchool(sData);

        if (aRes.ok) setAssignments(await aRes.json());
        if (subRes.ok) setSubmissions(await subRes.json());
        if (attRes.ok) setAttendances(await attRes.json());
        if (pRes.ok) setProfiles(await pRes.json());
      } catch (err: any) {
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const refresh = () => router.refresh();

  // Calculate statistics
  const totalStudents = profiles.filter((p) => p.role === "student").length;
  const totalAssignments = assignments.length;
  const totalSubmissions = submissions.length;
  const totalAttendance = attendances.length;
  const avgGrade =
    submissions
      .filter((s) => s.grade !== null && s.grade !== undefined)
      .reduce((sum, s) => sum + (s.grade || 0), 0) /
      submissions.filter((s) => s.grade).length || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading school data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !school) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error || "Failed to load school"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
          {school.address && (
            <p className="text-sm text-gray-600 mt-1">{school.address}</p>
          )}
          {school.description && (
            <p className="text-gray-700 mt-2">{school.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalStudents}
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalAssignments}
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalSubmissions}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Average Grade
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {avgGrade > 0 ? avgGrade.toFixed(1) : "N/A"}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: "overview", name: "Overview", count: null },
                {
                  id: "assignments",
                  name: "Assignments",
                  count: totalAssignments,
                },
                {
                  id: "submissions",
                  name: "Submissions",
                  count: totalSubmissions,
                },
                {
                  id: "attendance",
                  name: "Attendance",
                  count: totalAttendance,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <span
                      className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs
                      ${
                        activeTab === tab.id
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-sm text-gray-700 mb-3">
                          Take Attendance
                        </h3>
                        <AttendanceForm schoolId={school.id} onDone={refresh} />
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-sm text-gray-700 mb-3">
                          Create Assignment
                        </h3>
                        <AssignmentForm schoolId={school.id} onDone={refresh} />
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-sm text-gray-700 mb-3">
                          Grade Submission
                        </h3>
                        <GradeForm
                          schoolId={school.id}
                          onDone={refresh}
                          submissions={submissions}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Assignments
                    </h3>
                    <div className="space-y-3">
                      {assignments.slice(0, 5).map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {assignment.title}
                              </h4>
                              {assignment.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {assignment.description}
                                </p>
                              )}
                            </div>
                            {assignment.due_date && (
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                Due:{" "}
                                {new Date(
                                  assignment.due_date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {assignments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No assignments yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      School Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Total Attendance Records
                        </span>
                        <span className="font-semibold text-gray-900">
                          {totalAttendance}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Graded Submissions
                        </span>
                        <span className="font-semibold text-gray-900">
                          {
                            submissions.filter(
                              (s) => s.grade !== null && s.grade !== undefined
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Grades</span>
                        <span className="font-semibold text-yellow-600">
                          {
                            submissions.filter(
                              (s) => s.grade === null || s.grade === undefined
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      Attendance Rate
                    </h3>
                    <p className="text-4xl font-bold">
                      {totalAttendance > 0
                        ? (
                            (attendances.filter((a) => a.status === "present")
                              .length /
                              totalAttendance) *
                            100
                          ).toFixed(1)
                        : "0"}
                      %
                    </p>
                    <p className="text-sm mt-2 opacity-90">
                      Present:{" "}
                      {attendances.filter((a) => a.status === "present").length}{" "}
                      / {totalAttendance}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assignments" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Assignments
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assignment.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {assignment.description || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.due_date
                              ? new Date(
                                  assignment.due_date
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              assignment.created_at
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {assignments.length === 0 && (
                  <p className="text-center text-gray-500 py-12">
                    No assignments found
                  </p>
                )}
              </div>
            )}

            {activeTab === "submissions" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Submissions
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{submission.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Assignment {submission.assignment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.student || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                            {submission.grade !== null &&
                            submission.grade !== undefined ? (
                              `${submission.grade}`
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {submission.grade !== null &&
                            submission.grade !== undefined ? (
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
                {submissions.length === 0 && (
                  <p className="text-center text-gray-500 py-12">
                    No submissions found
                  </p>
                )}
              </div>
            )}

            {activeTab === "attendance" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Attendance Records
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendances.map((attendance) => (
                        <tr key={attendance.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{attendance.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Student {attendance.student}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(attendance.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                attendance.status === "present"
                                  ? "bg-green-100 text-green-800"
                                  : attendance.status === "absent"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {attendance.status.charAt(0).toUpperCase() +
                                attendance.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {attendance.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {attendances.length === 0 && (
                  <p className="text-center text-gray-500 py-12">
                    No attendance records found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
