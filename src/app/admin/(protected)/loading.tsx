/** Shown instantly while an admin page renders on the server. */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-6xl animate-pulse">
      <div className="h-3 w-24 rounded-full bg-ink/10" />
      <div className="mt-3 h-12 w-56 rounded-md bg-ink/15" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-md bg-white shadow-card" />
        ))}
      </div>
      <div className="mt-8 space-y-px overflow-hidden rounded-lg bg-white shadow-card">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 border-t border-line px-4 py-4 first:border-t-0">
            <div className="size-12 rounded-sm bg-ink/10" />
            <div className="h-4 flex-1 rounded-full bg-ink/10" />
            <div className="h-8 w-28 rounded-full bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
