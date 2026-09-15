export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-3" />
      <div className="h-4 w-80 max-w-full animate-pulse rounded-full bg-surface-3" />
      <div className="surface-card mt-6 h-64 animate-pulse" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
