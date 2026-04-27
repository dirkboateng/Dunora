"use client";

import { useState, type FormEvent } from "react";
import { updateProfile } from "@/lib/actions/settings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AccountType } from "@/types/database";

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "photographer", label: "Photographer" },
  { value: "club", label: "Sports club / organization" },
  { value: "event", label: "Event organizer" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other" },
];

export function ProfileSettingsForm({
  fullName,
  email,
  accountType,
}: {
  fullName: string;
  email: string;
  accountType: string;
}) {
  const [name, setName] = useState(fullName);
  const [type, setType] = useState<AccountType | "">(
    (ACCOUNT_TYPE_OPTIONS.find((o) => o.value === accountType)?.value as
      | AccountType
      | undefined) ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg(null);
    if (!name.trim()) {
      setStatus("error");
      setErrorMsg("Name is required");
      return;
    }
    setLoading(true);
    const result = await updateProfile({
      full_name: name.trim(),
      account_type: type === "" ? null : type,
    });
    setLoading(false);
    if (result.ok) {
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2400);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Could not update profile");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full name"
        name="fullName"
        maxLength={200}
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        required
      />
      <Input
        label="Email"
        name="email"
        value={email}
        disabled
        helper="Contact support to change your account email."
      />
      <Select
        label="Account type"
        name="accountType"
        value={type}
        onChange={(e) => setType(e.target.value as AccountType | "")}
        disabled={loading}
      >
        <option value="">Not set</option>
        {ACCOUNT_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>

      {status === "error" && errorMsg && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}
      {status === "ok" && (
        <div className="bg-accent-wash border border-accent/20 text-accent-deep text-sm rounded-xl px-4 py-3">
          Profile saved.
        </div>
      )}

      <div>
        <Button type="submit" loading={loading}>
          {loading ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
