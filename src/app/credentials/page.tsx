import { credentials } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function CredentialsPage() {
  const certs = credentials.filter((c) => c.type === "certification");

  // Group by year (extract YYYY from year string)
  const groups = certs.reduce<Record<string, typeof certs>>((acc, c) => {
    const year = (c.year || "").slice(0, 4) || "Other";
    if (!acc[year]) acc[year] = [];
    acc[year].push(c);
    return acc;
  }, {});

  const sortedYears = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="section-container">
      <SectionHeader
        label="Credentials"
        title="Certifications"
        description="Verifiable certifications. Secondary to shipped systems — present but not equivalent to project work. Links live on Contact."
      />

      {sortedYears.map((year) => (
        <section key={year} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="mono-label">{year}</h2>
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-xs text-subtle">{groups[year].length} certs</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {groups[year]
              .sort((a, b) => (b.year || "").localeCompare(a.year || ""))
              .map((cred) => (
                <div
                  key={cred.id}
                  className={`surface-card-hover ${isPlaceholder(cred.title) ? "placeholder-border" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-subtle">certification</p>
                      <p className="mt-1 font-medium text-foreground leading-tight">{cred.title}</p>
                      {cred.issuer && (
                        <p className="mt-1 font-mono text-xs text-muted leading-relaxed">{cred.issuer}</p>
                      )}
                      {cred.year && (
                        <p className="font-mono text-xs text-subtle mt-1">{cred.year}</p>
                      )}
                    </div>
                    {isPlaceholder(cred.title) && <PlaceholderBadge />}
                  </div>
                  {cred.url && (
                    <a
                      href={cred.url.startsWith("http") ? cred.url : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-mono text-xs link-underline break-all"
                    >
                      {cred.url}
                    </a>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
