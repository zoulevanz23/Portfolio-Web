import { SectionHeaderSkeleton, SystemGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <SystemGridSkeleton count={6} />
    </div>
  );
}
