import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Welcome to Dunora",
};

export default function OnboardingPage() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card animate-fade-in-up">
      <div className="w-12 h-12 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-xl mb-5">
        ✦
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
        Welcome to Dunora
      </h1>
      <p className="text-ink-2 text-sm leading-relaxed mb-6">
        Tell us a little about your studio so we can tailor your workspace.
        You can change everything later in Settings.
      </p>
      <OnboardingForm />
    </div>
  );
}
