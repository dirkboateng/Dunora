import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // If already onboarded, skip the wizard
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  const p = profile as { onboarding_completed_at: string | null } | null;
  if (p?.onboarding_completed_at) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Logo size={32} />
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[520px]">{children}</div>
      </main>
    </div>
  );
}
