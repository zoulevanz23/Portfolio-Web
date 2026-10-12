"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cvSections, identity } from "@/content/site-content";
import { SectionHeader } from "@/components/SectionHeader";
import { PlaceholderBadge, isPlaceholder } from "@/components/PlaceholderBadge";

export default function CVPage() {
  function handlePrint() {
    window.print();
  }

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "cv-print-styles";
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0.35in;
        }
        * {
          color: #000 !important;
          background: #fff !important;
          border-color: #ccc !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        body {
          font-size: 7.5pt !important;
          line-height: 1.2 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .section-container {
          padding: 0 !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        h1 {
          font-size: 13pt !important;
          margin: 0 !important;
          line-height: 1.1 !important;
        }
        h2 {
          font-size: 7.5pt !important;
          margin: 3pt 0 1pt 0 !important;
          padding: 1pt 0 !important;
          border-bottom: 0.5pt solid #000 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        p, li, span {
          font-size: 7.5pt !important;
          line-height: 1.2 !important;
        }
        section {
          margin-top: 3pt !important;
        }
        .space-y-8 > div {
          margin-top: 3pt !important;
        }
        .space-y-4 > div {
          margin-top: 1pt !important;
        }
        .space-y-1 > li {
          margin-top: 0 !important;
          padding-left: 8pt !important;
          text-indent: -8pt !important;
        }
        .space-y-1 > li > span:first-child {
          display: inline !important;
        }
        .border-b {
          border-bottom: 0.5pt solid #000 !important;
          margin-bottom: 2pt !important;
          padding-bottom: 1pt !important;
        }
        .pb-6 {
          padding-bottom: 2pt !important;
        }
        .mb-3 {
          margin-bottom: 1pt !important;
        }
        .mb-8 {
          margin-bottom: 2pt !important;
        }
        .mt-1 {
          margin-top: 0 !important;
        }
        .mt-2 {
          margin-top: 1pt !important;
        }
        .mt-3 {
          margin-top: 1pt !important;
        }
        .flex {
          flex-wrap: wrap !important;
        }
        .whitespace-nowrap {
          white-space: normal !important;
        }
        ul {
          margin: 0 !important;
          padding: 0 !important;
        }
        li {
          margin: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existing = document.getElementById("cv-print-styles");
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="section-container">
      <div className="mb-8 flex items-start justify-between no-print">
        <SectionHeader
          label="CV"
          title={identity.name}
          description="ATS-friendly CV with PDF export via browser print."
        />
        <button onClick={handlePrint} className="btn-secondary">
          Export PDF
        </button>
      </div>

      {/* CV Content - optimized for print/ATS */}
      <div className="max-w-3xl space-y-8">
        {/* Header — clean, no [Phone]/[Location] artifacts */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold text-foreground">{identity.name}</h1>
          <p className="mt-1 font-mono text-sm text-muted">Software Engineer | Full-Stack Developer</p>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs text-subtle items-center">
            <span>Batangas, Philippines</span>
            {identity.email !== "Available on request" && identity.email && (
              <>
                <span>•</span>
                <a href={`mailto:${identity.email}`} className="link-underline">
                  {identity.email}
                </a>
              </>
            )}
            <span>•</span>
            <a href={identity.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline">
              LinkedIn
            </a>
            <span>•</span>
            <a href={identity.github} target="_blank" rel="noopener noreferrer" className="link-underline">
              GitHub
            </a>
            <span>•</span>
            <Link href="/" className="link-underline">
              Portfolio
            </Link>
          </div>
        </div>

        {/* CV Sections */}
        {cvSections.map((section) => (
          <section key={section.id}>
            <h2 className="mb-3 border-b border-border pb-1 font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              {section.title}
            </h2>
            <div className={section.id === "certifications" ? "space-y-3" : "space-y-4"}>
              {section.items.map((item, i) => (
                <div key={i} className={section.id === "certifications" ? "leading-tight" : ""}>
                  {item.label && (
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-medium text-foreground leading-tight pr-2">{item.label}</p>
                      {item.period && (
                        <p className="font-mono text-xs text-subtle whitespace-nowrap shrink-0">{item.period}</p>
                      )}
                    </div>
                  )}
                  {section.id === "experience" || section.id === "projects" ? (
                    <ul className="mt-2 space-y-1 list-disc pl-5">
                      {item.detail.split(". ").filter(Boolean).map((sentence, j) => (
                        <li key={j} className="text-sm leading-relaxed text-muted">
                          {sentence.endsWith(".") ? sentence : `${sentence}.`}
                        </li>
                      ))}
                    </ul>
                  ) : section.id === "skills" ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      <span className="font-medium text-foreground">{item.label}:</span> {item.detail}
                    </p>
                  ) : section.id === "certifications" ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted break-words">
                      {item.detail.split(/(https:\/\/\S+)/g).map((part, idx) =>
                        part.startsWith("https://") ? (
                          <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-subtle underline underline-offset-2 break-all">
                            {part}
                          </a>
                        ) : (
                          <span key={idx}>{part}</span>
                        )
                      )}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
