import { credentials } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function CredentialsPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Credentials"
        title="Certifications and links"
        description="Secondary to shipped systems. Present but not equivalent to project work."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className={`surface-card-hover ${isPlaceholder(cred.title) ? "placeholder-border" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-subtle">{cred.type}</p>
                <p className="mt-1 font-medium text-foreground">{cred.title}</p>
                {cred.issuer && (
                  <p className="font-mono text-xs text-muted">{cred.issuer}</p>
                )}
                {cred.year && (
                  <p className="font-mono text-xs text-subtle">{cred.year}</p>
                )}
              </div>
              {isPlaceholder(cred.title) && <PlaceholderBadge />}
            </div>
            {cred.url && (
              <a
                href={cred.url.startsWith("http") ? cred.url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-mono text-xs link-underline"
              >
                {cred.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
