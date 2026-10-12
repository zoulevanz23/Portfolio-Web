import { SectionHeaderSkeleton, ThoughtsWallSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <ThoughtsWallSkeleton />
    </div>
  );
}
