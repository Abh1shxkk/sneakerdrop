export default function ProductLoading() {
  return (
    <section aria-busy="true" aria-label="Loading sneaker" className="bg-sand/60 pb-24 pt-32 sm:pt-36">
      <div className="container-x animate-pulse">
        <div className="h-4 w-56 rounded-full bg-ink/10" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <div className="aspect-square rounded-lg bg-ink/10" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="aspect-square rounded-md bg-ink/10" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-3 w-32 rounded-full bg-ink/10" />
            <div className="h-20 w-4/5 rounded-md bg-ink/15" />
            <div className="h-6 w-1/2 rounded-full bg-ink/10" />
            <div className="h-10 w-40 rounded-full bg-ink/15" />
            <div className="h-24 rounded-md bg-ink/10" />
            <div className="h-48 rounded-lg bg-ink/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
