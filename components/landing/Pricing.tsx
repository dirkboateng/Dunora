import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "€19",
    desc: "Perfect for freelance photographers getting started.",
    features: [
      "5 projects per month",
      "50 GB storage",
      "Basic galleries",
      "Watermarking",
      "Share links",
    ],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "€49",
    desc: "For active photographers with high delivery volume.",
    features: [
      "Unlimited projects",
      "500 GB storage",
      "AI enhancement",
      "Lightroom presets",
      "Priority processing",
      "Analytics",
    ],
    featured: true,
    cta: "Start free trial",
  },
  {
    name: "Studio",
    price: "€149",
    desc: "For teams, clubs and agencies handling large events.",
    features: [
      "Team members",
      "2 TB storage",
      "Branded galleries",
      "Smart delivery (beta)",
      "Priority support",
      "API access",
    ],
    cta: "Get started",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-surface-2/40 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="Pricing"
          title="Simple, honest pricing."
          sub="Start free during beta. Upgrade when you need more. No hidden fees."
        />

        <div className="max-w-5xl mt-10 mb-2">
          <div className="bg-accent-wash border border-accent/20 rounded-2xl px-5 py-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              ✦
            </div>
            <div>
              <div className="text-sm font-semibold text-accent-deep">
                Free for all beta members
              </div>
              <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                10 GB storage, all features, no credit card. Beta members get
                50% off Pro for 12 months when paid plans launch.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mt-6 md:mt-8 max-w-5xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative bg-surface border rounded-3xl p-8 flex flex-col",
                plan.featured
                  ? "border-accent/30 shadow-card"
                  : "border-line"
              )}
            >
              {plan.featured && (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  />
                  <span className="absolute top-5 right-5 bg-accent text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Most popular
                  </span>
                </>
              )}

              <div className="text-sm font-semibold text-muted mb-3">
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-bold tracking-[-0.04em] text-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-muted">/month</span>
              </div>
              <p className="text-sm text-ink-2 leading-relaxed mb-7 mt-3">
                {plan.desc}
              </p>

              <div className="h-px bg-line mb-6" />

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-ink-2"
                  >
                    <span
                      aria-hidden
                      className="w-4 h-4 rounded-full bg-accent-wash text-accent flex items-center justify-center text-[10px] font-bold"
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={cn(
                  "w-full inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5",
                  plan.featured
                    ? "bg-accent hover:bg-accent-hover text-white hover:shadow-cta"
                    : "bg-surface border border-line-strong text-ink hover:bg-surface-2"
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
