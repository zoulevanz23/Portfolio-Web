export function PlaceholderBadge({ label = "PLACEHOLDER" }: { label?: string }) {
  return (
    <span className="inline-block border border-dashed border-border-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-subtle">
      {label}
    </span>
  );
}

export function isPlaceholder(text: string): boolean {
  return text.includes("[PLACEHOLDER");
}
