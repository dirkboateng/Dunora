import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { UseCases } from "@/components/landing/UseCases";
import { Pricing } from "@/components/landing/Pricing";
import { Roadmap } from "@/components/landing/Roadmap";
import { Faq } from "@/components/landing/Faq";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Dunora — AI-powered photo delivery",
  description:
    "Upload once. Deliver smarter. Dunora helps photographers and clubs deliver branded galleries to their clients in minutes, not hours.",
};

/**
 * Marketing landing page.
 *
 * Server component end-to-end — every section ships as plain HTML.
 * Total client JS budget for this route: 0 KB beyond Next's framework
 * baseline. The FAQ accordion uses native <details>/<summary>; pricing,
 * roadmap and features are static.
 *
 * Logged-in users skip the marketing pitch entirely and land on /dashboard.
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Workflow />
        <UseCases />
        <Pricing />
        <Roadmap />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
