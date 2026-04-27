"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function GalleryPasswordGate({ slug }: { slug: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    router.push(`/g/${slug}?key=${encodeURIComponent(password.trim())}`);
  }

  return (
    <div className="max-w-[420px] mx-auto px-6 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-2xl mb-5">
        🔒
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
        Password required
      </h1>
      <p className="text-sm text-ink-2 mb-8">
        Enter the password your studio shared with you.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <Button type="submit" size="lg" loading={loading}>
          {loading ? "Checking…" : "Unlock gallery"}
        </Button>
      </form>
    </div>
  );
}
