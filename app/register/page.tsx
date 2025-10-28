import RegistrationForm from "../components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl bg-white/70 p-8 shadow-sm ring-1 ring-zinc-200/60 backdrop-blur dark:bg-zinc-900/60 dark:ring-zinc-800">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Create account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Register an account to access the school admin features.
          </p>
          <div className="mt-6">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </main>
  );
}
