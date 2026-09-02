import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/site-content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  return { title: post?.title || "Blog post" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div className="section-container">
      <Link href="/blog" className="back-link mb-8 block">
        &lt; back to blog
      </Link>
      <div className="surface-card">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="tag">{post.tag}</span>
          <span className="font-mono text-[10px] text-subtle">{post.date}</span>
        </div>
        <h1 className="prose-heading">{post.title}</h1>
        <p className="mt-3 text-muted">{post.excerpt}</p>
        <div className="mt-8 space-y-4">
          {post.body.map((para, i) => (
            <p key={i} className="leading-relaxed text-foreground/90">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
