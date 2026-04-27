import { Topbar } from "@/components/dashboard/Topbar";
import type { ReactNode } from "react";

interface DashboardShellProps {
  workspaceName: string;
  email: string;
  role?: string;
  children: ReactNode;
  /** Optional page title that appears as the H1 above the content */
  title?: string;
  /** Optional description under the title */
  description?: string;
  /** Optional right-side action (e.g. a "New project" button) */
  actions?: ReactNode;
}

export function DashboardShell({
  workspaceName,
  email,
  role,
  children,
  title,
  description,
  actions,
}: DashboardShellProps) {
  return (
    <>
      <Topbar workspaceName={workspaceName} email={email} role={role} />
      <main className="flex-1 px-5 md:px-8 py-8 max-w-[1280px] w-full">
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.6px] text-ink">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-ink-2 mt-1.5">{description}</p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </>
  );
}
