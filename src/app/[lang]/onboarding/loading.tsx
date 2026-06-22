export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-pulse rounded-[2rem] bg-neutral-200/70" />
        <div className="animate-pulse rounded-[2rem] border border-neutral-200 bg-white p-6">
          <div className="h-4 w-24 rounded-full bg-neutral-200" />
          <div className="mt-4 h-10 w-3/4 rounded-2xl bg-neutral-200" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-neutral-200" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-2xl bg-neutral-200" />
            <div className="h-24 rounded-2xl bg-neutral-200" />
            <div className="h-24 rounded-2xl bg-neutral-200" />
            <div className="h-24 rounded-2xl bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
