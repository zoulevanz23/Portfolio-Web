import { SectionHeaderSkeleton, Skeleton, TableGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <Skeleton className="mb-4 h-3 w-32" label="Loading form" />
          <Skeleton className="h-48 w-full" label="Loading input" />
          <Skeleton className="mt-2 h-10 w-full" label="Loading action" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" label="Loading overview" />
          <TableGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}
