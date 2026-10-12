import type { CSSProperties } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
  rounded?: boolean;
  label?: string;
};

/** Base shimmer block. Theme-aware via CSS vars, respects reduced motion. */
export function Skeleton({ className = "", style, rounded = true, label = "Loading" }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-hidden={false}
      className={`skeleton${rounded ? " skeleton-rounded" : ""} ${className}`}
      style={style}
    >
      <span className="sr-only">{label}…</span>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
  lastWidth = "70%",
}: {
  lines?: number;
  className?: string;
  lastWidth?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          label="Loading text"
          className="h-3 w-full"
          style={i === lines - 1 ? { width: lastWidth } : undefined}
        />
      ))}
    </div>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="mb-10" aria-hidden="true">
      <Skeleton className="mb-3 h-3 w-24" label="Loading section" />
      <Skeleton className="mb-3 h-7 w-2/3 max-w-md" label="Loading title" />
      <Skeleton className="h-4 w-full max-w-xl" label="Loading description" />
    </div>
  );
}

export function SystemCardSkeleton() {
  return (
    <div className="surface-card" aria-hidden="true">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4" label="Loading project name" />
          <Skeleton className="mt-2 h-4 w-1/2" label="Loading project function" />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16" label="Loading tag" />
        <Skeleton className="h-5 w-20" label="Loading tag" />
        <Skeleton className="h-5 w-14" label="Loading tag" />
      </div>
      <Skeleton className="mb-4 h-16 w-full" label="Loading diagram" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-24" label="Loading link" />
        <Skeleton className="h-4 w-24" label="Loading link" />
      </div>
    </div>
  );
}

export function SystemGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SystemCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card">
          <Skeleton className="h-6 w-2/3" label="Loading heading" />
          <Skeleton className="mt-2 h-3 w-32" label="Loading meta" />
          <SkeletonText lines={4} className="mt-4" />
        </div>
      ))}
    </div>
  );
}

export function ChatBubbleSkeleton({ mine = false }: { mine?: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`} aria-hidden="true">
      {!mine && <Skeleton className="h-8 w-8 shrink-0 !rounded-full" label="Loading avatar" />}
      <div className={`max-w-[75%] ${mine ? "text-right" : ""}`}>
        <div className="inline-block w-56 max-w-full rounded-lg border border-border bg-surface-muted px-3 py-2">
          <Skeleton className="mb-2 h-2.5 w-20" label="Loading name" />
          <Skeleton className="h-3 w-full" label="Loading message" />
          <Skeleton className="mt-2 h-3 w-4/5" label="Loading message" />
          <Skeleton className="mt-2 h-3" label="Loading message" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
}

export function ThoughtsWallSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="surface-card flex h-[70vh] flex-col overflow-hidden p-0" aria-hidden="true">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Skeleton className="h-8 w-8 !rounded-full" label="Loading avatar" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24" label="Loading header" />
          <Skeleton className="mt-1.5 h-2.5 w-32" label="Loading subheader" />
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-hidden bg-background px-4 py-5">
        {Array.from({ length: count }).map((_, i) => (
          <ChatBubbleSkeleton key={i} mine={i % 3 === 2} />
        ))}
      </div>
      <div className="border-t border-border bg-surface p-3">
        <div className="flex items-end gap-2">
          <Skeleton className="h-[52px] flex-1" label="Loading composer" />
          <Skeleton className="h-10 w-20" label="Loading send button" />
        </div>
      </div>
    </div>
  );
}

export function InterviewChatSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-3 w-48" label="Loading status" />
        <Skeleton className="h-3 w-24" label="Loading timer" />
      </div>
      <div className="mb-4 space-y-3 rounded-xl border border-border bg-surface p-4">
        <ChatBubbleSkeleton />
        <div className="flex justify-end">
          <div className="w-2/3">
            <Skeleton className="h-14 w-full" label="Loading reply" />
          </div>
        </div>
        <ChatBubbleSkeleton />
      </div>
      <div className="flex items-end gap-2">
        <Skeleton className="h-10 flex-1" label="Loading input" />
        <Skeleton className="h-10 w-20" label="Loading send" />
      </div>
    </div>
  );
}

/** Pulsing dots used while the assistant is "thinking" — distinct from static skeletons. */
export function TypingSkeleton({ label = "Loading response" }: { label?: string }) {
  return (
    <div className="flex items-end gap-2" role="status" aria-label={label}>
      <Skeleton className="h-8 w-8 shrink-0 !rounded-full" label="Loading avatar" />
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
        <span className="font-mono text-[10px] text-subtle">Thinking</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="skeleton-dot" style={{ animationDelay: "0ms" }} />
          <span className="skeleton-dot" style={{ animationDelay: "150ms" }} />
          <span className="skeleton-dot" style={{ animationDelay: "300ms" }} />
        </span>
        <span className="sr-only">{label}…</span>
      </div>
    </div>
  );
}

export function CodeResponseSkeleton({ lines = 12 }: { lines?: number }) {
  return (
    <div className="mt-6" aria-hidden="true">
      <div className="mb-2 flex items-center gap-4">
        <Skeleton className="h-3 w-24" label="Loading status" />
        <Skeleton className="h-3 w-16" label="Loading timing" />
      </div>
      <div className="code-block space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            label="Loading response"
            className="h-3"
            style={{ width: `${92 - ((i * 13) % 40)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-3 py-2">
            <Skeleton className="h-4 w-1/2" label="Loading table" />
          </div>
          <div className="space-y-2 px-3 py-2">
            <Skeleton className="h-3 w-full" label="Loading column" />
            <Skeleton className="h-3 w-5/6" label="Loading column" />
            <Skeleton className="h-3 w-4/6" label="Loading column" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton({ cards = 0 }: { cards?: number }) {
  return (
    <div className="section-container" aria-hidden="true">
      <SectionHeaderSkeleton />
      {cards > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} className="surface-card">
              <Skeleton className="h-5 w-1/2" label="Loading card" />
              <SkeletonText lines={3} className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <SkeletonText lines={6} className="max-w-3xl" />
      )}
    </div>
  );
}
