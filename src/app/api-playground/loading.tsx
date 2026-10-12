import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] w-full" label="Loading endpoint" />
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="surface-card">
            <Skeleton className="mb-4 h-5 w-2/3" label="Loading request" />
            <Skeleton className="h-10 w-32" label="Loading action" />
            <Skeleton className="mt-6 h-48 w-full" label="Loading response" />
          </div>
        </div>
      </div>
    </div>
  );
}
