interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <p className="mono-label mb-2">{label}</p>
      <h1 className="prose-heading">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-muted">{description}</p>
      )}
    </div>
  );
}
