import { Skeleton } from "@/app/ui/Skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header skeleton */}
      <header className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Page title */}
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-10" />

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => `skeleton-card-${i}`).map(
            (id) => (
              <div
                key={id}
                className="rounded-xl border border-slate-100 p-5 flex flex-col gap-3 shadow-sm"
              >
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ),
          )}
        </div>
      </main>
    </div>
  )
}
