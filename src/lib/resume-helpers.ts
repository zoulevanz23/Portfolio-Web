export const MAX_RESUME_FILE_SIZE = 10 * 1024 * 1024;

export function validateResumeFile(file: File): string | null {
  if (file.type && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Only PDF files are supported";
  }
  if (file.size > MAX_RESUME_FILE_SIZE) return "File is too large (max 10MB)";
  return null;
}

export async function parseResumeFile(file: File): Promise<{ text: string; candidateName: string | null; name: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/ai/resume-parser", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not extract text");
  return { text: data.text as string, candidateName: (data.candidateName as string | null) || null, name: (data.name as string) || file.name };
}
