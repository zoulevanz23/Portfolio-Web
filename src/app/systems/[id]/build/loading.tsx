import { SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <div className="grid gap-4">
        <Skeleton className="h-32 w-full" label="Loading problem" />
        <Skeleton className="h-64 w-full" label="Loading approach" />
        <Skeleton className="h-48 w-full" label="Loading decisions" />
      </div>
    </div>
  );
}
