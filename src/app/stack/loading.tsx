import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="space-y-8">
        {["core", "supporting", "data"].map((c) => (
          <section key={c}>
            <Skeleton className="mb-4 h-3 w-24" label="Loading category" />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="surface-card">
                  <Skeleton className="h-4 w-1/2" label="Loading technology" />
                  <div className="mt-2 flex gap-1">
                    <Skeleton className="h-4 w-20" label="Loading project" />
                    <Skeleton className="h-4 w-20" label="Loading project" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
