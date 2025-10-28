import RegistrationForm from "../components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <p className="mt-2 text-sm text-gray-600">
        Register an account to access the school admin features.
      </p>
      <div className="mt-6">
        <RegistrationForm />
      </div>
    </main>
  );
}
