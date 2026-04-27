import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card animate-fade-in-up">
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-1">
        Start your Dunora account
      </h1>
      <p className="text-ink-2 text-sm mb-8">
        Free during beta. No credit card required.
      </p>

      <Suspense>
        <RegisterForm />
      </Suspense>

      <div className="mt-6 pt-6 border-t border-line text-sm text-center text-ink-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent font-semibold hover:text-accent-hover"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
