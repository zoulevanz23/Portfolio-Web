import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 8000;

const SCRIPT_PATH = join(process.cwd(), "scripts", "pdf-extract.mjs");

interface ExtractResult {
  ok: boolean;
  text?: string;
  numpages?: number;
  error?: string;
}

const SECTION_KEYWORDS = [
  "resume", "curriculum", "vitae", "cv", "contact", "profile", "summary",
  "objective", "experience", "education", "skills", "projects", "work",
  "about", "personal information", "linkedin", "github", "email", "phone",
];

function looksLikeName(line: string): boolean {
  const words = line.trim().split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;
  if (!/^[A-Z]/.test(line.trim())) return false;
  const lower = ` ${line.toLowerCase()} `;
  if (SECTION_KEYWORDS.some((kw) => lower.includes(` ${kw} `))) return false;
  if (/\d/.test(line)) return false;
  // All words should start with a capital letter (name-like)
  if (!words.every((w) => /^[A-Z]/.test(w) && /^[A-Za-z.'-]+$/.test(w))) return false;
  return true;
}

function extractCandidateName(text: string): string | null {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    if (looksLikeName(line)) {
      return line;
    }
  }
  return null;
}

async function extractText(buffer: Buffer): Promise<ExtractResult> {
  const tempPath = join(
    tmpdir(),
    `resume-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
  );

  try {
    await writeFile(tempPath, buffer);

    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, tempPath],
      { timeout: 15000, maxBuffer: 5 * 1024 * 1024 }
    );

    let parsed: ExtractResult;
    try {
      parsed = JSON.parse(stdout.trim());
    } catch {
      return { ok: false, error: "Unexpected parser output" };
    }
    return parsed;
  } finally {
    await unlink(tempPath).catch(() => {});
  }
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request" },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are supported" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File is too large (max 10MB)" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // magic-byte validation — don't trust client mime
  if (buffer.length < 4 || buffer.slice(0, 4).toString() !== "%PDF") {
    return NextResponse.json({ error: "File does not appear to be a valid PDF." }, { status: 400 });
  }

  let result: ExtractResult;
  try {
    result = await extractText(buffer);
  } catch (err) {
    console.error("Resume parsing error:", err);
    return NextResponse.json(
      { error: "Failed to parse the PDF. Please try another file." },
      { status: 500 }
    );
  }

  if (!result.ok || !result.text) {
    return NextResponse.json(
      { error: "Could not extract text from this PDF. It may be a scanned image." },
      { status: 422 }
    );
  }

  const cleanText = result.text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanText) {
    return NextResponse.json(
      { error: "Could not extract text from this PDF. It may be a scanned image." },
      { status: 422 }
    );
  }

  const truncated = cleanText.slice(0, MAX_TEXT_LENGTH);

  return NextResponse.json({
    name: file.name || "resume.pdf",
    candidateName: extractCandidateName(cleanText),
    text: truncated,
    truncated: cleanText.length > MAX_TEXT_LENGTH,
    length: truncated.length,
  });
}
