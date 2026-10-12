import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="rounded-xl border border-border bg-surface p-4">
        <Skeleton className="h-[420px] w-full" label="Loading architecture diagram" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-48 w-full" label="Loading panel" />
        <Skeleton className="h-48 w-full" label="Loading panel" />
      </div>
    </div>
  );
}
