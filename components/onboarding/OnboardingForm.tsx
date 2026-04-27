"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PRESET_COLORS = [
  { value: "#047857", label: "Emerald" },
  { value: "#0F172A", label: "Ink" },
  { value: "#7C3AED", label: "Purple" },
  { value: "#0284C7", label: "Sky" },
  { value: "#DC2626", label: "Crimson" },
  { value: "#D97706", label: "Amber" },
];

export function OnboardingForm() {
  const router = useRouter();

  const [studioName, setStudioName] = useState("");
  const [brandColor, setBrandColor] = useState("#047857");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    if (!studioName.trim()) {
      setServerError("Studio name is required");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setServerError("Session expired — please log in again");
      setLoading(false);
      return;
    }

    // Update workspace name + brand color (only the user's own workspace via RLS)
    const { error: wsError } = await supabase
      .from("workspaces")
      .update({ name: studioName.trim(), brand_color: brandColor })
      .eq("owner_id", user.id);

    if (wsError) {
      setServerError(wsError.message);
      setLoading(false);
      return;
    }

    // Mark onboarding complete on the profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ onboarding_completed_at: new Date().toISOString() })
      .eq("id", user.id);

    if (profileError) {
      setServerError(profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Studio name"
        name="studioName"
        autoFocus
        maxLength={200}
        placeholder="e.g. Dirk Visuals"
        value={studioName}
        onChange={(e) => setStudioName(e.target.value)}
        helper="This is what your clients will see on shared galleries."
        disabled={loading}
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Brand color</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setBrandColor(c.value)}
              className={
                "w-9 h-9 rounded-lg transition-all " +
                (brandColor === c.value
                  ? "ring-2 ring-offset-2 ring-ink scale-110"
                  : "hover:scale-105")
              }
              style={{ background: c.value }}
              aria-label={c.label}
              title={c.label}
            />
          ))}
        </div>
        <span className="text-xs text-muted">
          Your gallery accent. You can change this anytime.
        </span>
      </div>

      {serverError && (
        <div
          role="alert"
          className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3"
        >
          {serverError}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Setting up your workspace…" : "Continue to dashboard"}
      </Button>
    </form>
  );
}
