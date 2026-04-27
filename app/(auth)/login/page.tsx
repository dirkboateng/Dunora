import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card animate-fade-in-up">
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-1">
        Welcome back
      </h1>
      <p className="text-ink-2 text-sm mb-8">
        Log in to deliver your next gallery.
      </p>

      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="mt-6 pt-6 border-t border-line text-sm text-center text-ink-2">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-accent font-semibold hover:text-accent-hover"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}
