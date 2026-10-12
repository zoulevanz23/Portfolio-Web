import { ArticleListSkeleton, SectionHeaderSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <ArticleListSkeleton count={3} />
    </div>
  );
}
