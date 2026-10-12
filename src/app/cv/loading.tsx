import { SectionHeaderSkeleton, Skeleton, SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex-1">
          <SectionHeaderSkeleton />
        </div>
        <Skeleton className="h-10 w-28" label="Loading export" />
      </div>
      <div className="max-w-3xl space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <section key={i}>
            <Skeleton className="mb-3 h-4 w-40" label="Loading CV section" />
            <SkeletonText lines={4} />
          </section>
        ))}
      </div>
    </div>
  );
}
