import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-100">
          School Management
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Lightweight admin UI for attendance, assignments and grading. Use the
          navigation to view schools and sign in.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/schools"
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            View Schools
          </Link>
          <Link
            href="/login"
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
