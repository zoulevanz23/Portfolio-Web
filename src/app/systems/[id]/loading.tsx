import { Skeleton, SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <div className="mb-8">
        <Skeleton className="h-3 w-20" label="Loading back link" />
      </div>
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-5 w-16" label="Loading status" />
        </div>
        <Skeleton className="h-8 w-2/3" label="Loading title" />
        <Skeleton className="mt-2 h-4 w-1/2" label="Loading subtitle" />
        <div className="mt-6 flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16" label="Loading tag" />
          <Skeleton className="h-5 w-20" label="Loading tag" />
          <Skeleton className="h-5 w-14" label="Loading tag" />
        </div>
        <SkeletonText lines={5} className="mt-8" />
        <div className="mt-8 flex gap-4">
          <Skeleton className="h-10 w-36" label="Loading action" />
          <Skeleton className="h-10 w-36" label="Loading action" />
        </div>
      </div>
    </div>
  );
}
