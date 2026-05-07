"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveLandingContent, type LandingContent, type Locale } from "@/lib/actions/site";

interface Props {
  initialEn: LandingContent;
  initialNl: LandingContent;
}

interface FieldGroup {
  label: string;
  fields: { key: keyof LandingContent; label: string; multiline?: boolean }[];
}

const GROUPS: FieldGroup[] = [
  {
    label: "Hero",
    fields: [
      { key: "badge", label: "Badge text" },
      { key: "headline", label: "Headline" },
      { key: "subhead", label: "Subhead", multiline: true },
      { key: "cta_primary", label: "Primary button" },
      { key: "cta_secondary", label: "Secondary button" },
      { key: "scroll_hint", label: "Scroll hint" },
    ],
  },
  {
    label: "Who is it for",
    fields: [
      { key: "for_whom_eyebrow", label: "Eyebrow" },
      { key: "for_whom_title", label: "Title" },
      { key: "for_whom_lead", label: "Lead text", multiline: true },
    ],
  },
  {
    label: "Feature 1",
    fields: [
      { key: "feature_1_title", label: "Title" },
      { key: "feature_1_body", label: "Body", multiline: true },
    ],
  },
  {
    label: "Feature 2",
    fields: [
      { key: "feature_2_title", label: "Title" },
      { key: "feature_2_body", label: "Body", multiline: true },
    ],
  },
  {
    label: "Feature 3",
    fields: [
      { key: "feature_3_title", label: "Title" },
      { key: "feature_3_body", label: "Body", multiline: true },
    ],
  },
  {
    label: "Closing CTA",
    fields: [
      { key: "closing_eyebrow", label: "Eyebrow" },
      { key: "closing_title", label: "Title" },
      { key: "closing_body", label: "Body", multiline: true },
      { key: "closing_cta", label: "Button" },
    ],
  },
  {
    label: "Preview mock",
    fields: [
      { key: "preview_label", label: "Preview label" },
      { key: "preview_gallery", label: "Gallery title" },
      { key: "preview_meta", label: "Gallery meta" },
      { key: "preview_by", label: "Powered-by line" },
    ],
  },
  {
    label: "Layout",
    fields: [
      { key: "under_construction", label: "Top banner" },
      { key: "sign_in", label: "Sign in link" },
      { key: "footer_legal", label: "Footer · Legal" },
      { key: "footer_contact", label: "Footer · Contact" },
      { key: "footer_rights", label: "Footer · Rights" },
    ],
  },
];

export function LandingContentForm({ initialEn, initialNl }: Props) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("nl");
  const [en, setEn] = useState<LandingContent>(initialEn);
  const [nl, setNl] = useState<LandingContent>(initialNl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const current = locale === "en" ? en : nl;
  const setCurrent = locale === "en" ? setEn : setNl;

  function update(key: keyof LandingContent, value: string) {
    setCurrent((prev) => ({ ...prev, [key]: value }));
    setSavedAt(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await saveLandingContent(locale, current);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Failed to save");
      return;
    }
    setSavedAt(Date.now());
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="inline-flex items-center bg-surface-2 rounded-full p-0.5 border border-line">
          <button type="button" onClick={() => setLocale("nl")} className={"px-3 py-1.5 text-xs font-semibold rounded-full transition-colors " + (locale === "nl" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink-2")}>Nederlands</button>
          <button type="button" onClick={() => setLocale("en")} className={"px-3 py-1.5 text-xs font-semibold rounded-full transition-colors " + (locale === "en" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink-2")}>English</button>
        </div>

        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-accent-deep">Saved</span>}
          <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
      )}

      <div className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group.label} className="bg-surface border border-line rounded-2xl p-5">
            <h3 className="text-sm font-bold text-ink mb-4 tracking-tight">{group.label}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.fields.map((f) => (
                <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                  <label htmlFor={`${locale}-${f.key}`} className="block text-xs font-medium text-ink-2 mb-1.5">{f.label}</label>
                  {f.multiline ? (
                    <textarea id={`${locale}-${f.key}`} value={current[f.key]} onChange={(e) => update(f.key, e.target.value)} rows={3} className="w-full px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all resize-y" />
                  ) : (
                    <input id={`${locale}-${f.key}`} type="text" value={current[f.key]} onChange={(e) => update(f.key, e.target.value)} className="w-full px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink placeholder:text-muted-2 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
