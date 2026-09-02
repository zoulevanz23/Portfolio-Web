import Link from "next/link";
import { blogPosts } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata = {
  title: "Blog",
  description: "Engineering notes and long-form thoughts.",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="section-container">
      <SectionHeader
        label="Community"
        title="Blog"
        description="Engineering notes, lessons, and long-form thoughts."
      />

      {sorted.length === 0 ? (
        <div className="surface-card">
          <p className="text-sm text-muted">No posts published yet.</p>
          <p className="mt-2 text-sm text-subtle">
            Check back soon — notes are in the works.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="surface-card-hover block"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span className="tag">{post.tag}</span>
                <span className="font-mono text-[10px] text-subtle">{post.date}</span>
              </div>
              <h2 className="prose-heading">{post.title}</h2>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
