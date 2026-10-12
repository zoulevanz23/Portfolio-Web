import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="rounded-xl border border-border bg-surface p-6">
          <Skeleton className="mb-4 h-3 w-32" label="Loading upload" />
          <Skeleton className="h-48 w-full" label="Loading dropzone" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" label="Loading roast" />
          <Skeleton className="h-24 w-full" label="Loading roast" />
          <Skeleton className="h-24 w-full" label="Loading roast" />
        </div>
      </div>
    </div>
  );
}
