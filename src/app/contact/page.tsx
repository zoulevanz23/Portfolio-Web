import { identity } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function ContactPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Contact"
        title="Get in touch"
        description="Direct contact information. No contact form — use email or linked profiles."
      />

      <div className="max-w-lg">
        {isPlaceholder(identity.email) && (
          <div className="mb-6">
            <PlaceholderBadge label="PLACEHOLDER — Replace in site-content.ts" />
          </div>
        )}

        <dl className="space-y-6">
          <div>
            <dt className="mono-label mb-1">Email</dt>
            <dd>
              <a href={`mailto:${identity.email}`} className="font-mono text-sm link-underline">
                {identity.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mono-label mb-1">GitHub</dt>
            <dd>
              <a
                href={identity.github.startsWith("http") ? identity.github : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm link-underline"
              >
                {identity.github}
              </a>
            </dd>
          </div>
          <div>
            <dt className="mono-label mb-1">LinkedIn</dt>
            <dd>
              <a
                href={identity.linkedin.startsWith("http") ? identity.linkedin : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm link-underline"
              >
                {identity.linkedin}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
