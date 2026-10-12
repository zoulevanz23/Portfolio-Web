import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <Skeleton className="mb-6 h-28 w-full" label="Loading intro" />
      <Skeleton className="mb-8 h-[420px] w-full" label="Loading technical map" />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface-card">
            <Skeleton className="h-4 w-1/2" label="Loading technology" />
            <Skeleton className="mt-2 h-3 w-full" label="Loading description" />
            <Skeleton className="mt-2 h-3 w-2/3" label="Loading description" />
          </div>
        ))}
      </div>
    </div>
  );
}
