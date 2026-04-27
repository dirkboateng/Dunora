export default function AuthLoading() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card">
      <div className="h-8 w-48 rounded-lg bg-surface-2 animate-pulse mb-3" />
      <div className="h-4 w-64 rounded bg-surface-2 animate-pulse mb-6" />
      <div className="space-y-4">
        <div className="h-11 w-full rounded-xl bg-surface-2 animate-pulse" />
        <div className="h-11 w-full rounded-xl bg-surface-2 animate-pulse" />
        <div className="h-12 w-full rounded-[14px] bg-surface-2 animate-pulse" />
      </div>
    </div>
  );
}
