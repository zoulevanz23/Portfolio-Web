import { Skeleton, SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <div className="mb-8">
        <Skeleton className="h-3 w-20" label="Loading back link" />
      </div>
      <div className="max-w-3xl">
        <Skeleton className="h-3 w-24" label="Loading tag" />
        <Skeleton className="mt-3 h-8 w-3/4" label="Loading title" />
        <Skeleton className="mt-2 h-3 w-40" label="Loading date" />
        <SkeletonText lines={8} className="mt-8" />
      </div>
    </div>
  );
}
