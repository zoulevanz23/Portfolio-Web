import { InterviewChatSkeleton, SectionHeaderSkeleton, Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="section-container">
      <SectionHeaderSkeleton />
      <Skeleton className="mx-auto mb-6 h-40 w-full max-w-6xl" label="Loading interviewer picker" />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
        <Skeleton className="h-48 w-full" label="Loading resume panel" />
        <InterviewChatSkeleton />
      </div>
    </div>
  );
}
