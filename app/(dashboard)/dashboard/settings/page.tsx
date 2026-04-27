import { createClient } from "@/lib/supabase/server";
import { getDashboardContext } from "@/lib/dashboard/get-dashboard-context";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { WorkspaceSettingsForm } from "@/components/settings/WorkspaceSettingsForm";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";
import { formatBytes } from "@/lib/dashboard/get-dashboard-data";

export const metadata = {
  title: "Settings",
};

interface ProfileRow {
  full_name: string | null;
  account_type: string | null;
}

interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  brand_color: string | null;
  storage_used_bytes: number;
  storage_quota_bytes: number;
}

export default async function SettingsPage() {
  const ctx = await getDashboardContext();
  const supabase = await createClient();

  const [profileRes, wsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, account_type")
      .eq("id", ctx.userId)
      .maybeSingle(),
    supabase
      .from("workspaces")
      .select("id, name, slug, brand_color, storage_used_bytes, storage_quota_bytes")
      .eq("id", ctx.workspaceId)
      .maybeSingle(),
  ]);
  const profile = profileRes.data as ProfileRow | null;
  const workspace = wsRes.data as WorkspaceRow | null;

  return (
    <DashboardShell
      workspaceName={ctx.workspaceName}
      email={ctx.email}
      role={ctx.role}
      title="Settings"
      description="Manage your profile, workspace branding and storage."
    >
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SettingsCard
            title="Profile"
            description="How your name and email appear inside Dunora."
          >
            <ProfileSettingsForm
              fullName={profile?.full_name ?? ""}
              email={ctx.email}
              accountType={profile?.account_type ?? ""}
            />
          </SettingsCard>

          <SettingsCard
            title="Workspace"
            description="Studio name and brand color shown on your shared galleries."
          >
            <WorkspaceSettingsForm
              workspaceId={ctx.workspaceId}
              name={workspace?.name ?? ""}
              brandColor={workspace?.brand_color ?? "#047857"}
            />
          </SettingsCard>

          <SettingsCard
            title="Account security"
            description="Change your password. You'll stay logged in on this device."
          >
            <PasswordChangeForm />
          </SettingsCard>
        </div>

        <aside className="space-y-3">
          <div className="bg-surface border border-line rounded-2xl p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Storage
            </div>
            <div className="text-2xl font-bold tracking-tight text-ink">
              {formatBytes(workspace?.storage_used_bytes ?? 0)}
            </div>
            <div className="text-xs text-muted">
              of {formatBytes(workspace?.storage_quota_bytes ?? 10737418240)}
            </div>
            <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full"
                style={{
                  width: `${Math.min(
                    ((workspace?.storage_used_bytes ?? 0) /
                      (workspace?.storage_quota_bytes ?? 10737418240)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Plan
            </div>
            <div className="text-base font-semibold text-ink">Free</div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              10 GB storage. Branded galleries. Unlimited projects.
            </p>
          </div>

          <div className="bg-surface border border-line rounded-2xl p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
              Workspace URL
            </div>
            <div className="text-sm font-mono text-ink-2 break-all">
              dunora.app/{workspace?.slug ?? "—"}
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 md:p-7">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="text-sm text-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}
