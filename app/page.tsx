import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <main className="container-page py-16 md:py-24">
        <div className="relative overflow-hidden rounded-2xl bg-white/70 p-8 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur dark:bg-zinc-900/60 dark:ring-zinc-800">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            Manage schools, classes, and students effortlessly
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
            A clean, modern dashboard for attendance, assignments, and grades.
            Built with Next.js and ready to use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/schools" className="btn-primary">
              Explore Schools
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Attendance"
            desc="Track daily presence with ease."
            icon="🗓️"
          />
          <FeatureCard
            title="Assignments"
            desc="Create and manage tasks quickly."
            icon="📝"
          />
          <FeatureCard
            title="Grades"
            desc="Record and analyze student performance."
            icon="📊"
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm backdrop-blur transition-colors hover:bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
