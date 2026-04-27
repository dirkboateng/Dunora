/**
 * Loading skeleton for any dashboard subpage during server data fetch.
 * Renders the same overall shape as the real page so the layout doesn't
 * jump when content arrives.
 */
export default function DashboardLoading() {
  return (
    <div className="flex-1 px-5 md:px-8 py-8 max-w-[1280px] w-full">
      <div className="h-16 -mx-5 md:-mx-8 mb-8 border-b border-line bg-bg/85 backdrop-blur-md" />

      <div className="mb-8">
        <div className="h-8 w-64 rounded-lg bg-surface-2 animate-pulse" />
        <div className="h-4 w-80 rounded-md bg-surface-2 animate-pulse mt-3" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-line rounded-2xl p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-2 animate-pulse mb-3" />
            <div className="h-7 w-16 rounded-md bg-surface-2 animate-pulse" />
            <div className="h-3 w-24 rounded-sm bg-surface-2 animate-pulse mt-2" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-line rounded-2xl p-5 h-[120px]"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-surface-2 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-surface-2 animate-pulse" />
                <div className="h-3 w-full rounded bg-surface-2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
