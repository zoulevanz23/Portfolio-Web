import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  getInitials,
  NAME_MAX,
  TEXT_MAX,
  type Thought,
} from "./thoughts-shared";

const MAX_ENTRIES = 200;

const POST_RATE_LIMIT_MS = 2_800;
const INTERACTION_RATE_LIMIT_MS = 1_200;

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "thoughts.json");

const rateLimits = new Map<string, number>();
const interactionLimits = new Map<string, number>();

function sanitize(value: string, max: number): string {
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

export function rateLimitCheck(ip: string): boolean {
  const last = rateLimits.get(ip);
  const now = Date.now();
  if (last && now - last < POST_RATE_LIMIT_MS) {
    return false;
  }
  rateLimits.set(ip, now);
  return true;
}

export function interactionRateLimitCheck(ip: string): boolean {
  const last = interactionLimits.get(ip);
  const now = Date.now();
  if (last && now - last < INTERACTION_RATE_LIMIT_MS) {
    return false;
  }
  interactionLimits.set(ip, now);
  return true;
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readThoughts(): Promise<Thought[]> {
  try {
    await ensureFile();
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    // validate shape — filter corrupt entries
    return (data as Thought[]).filter((t) => t && typeof t.id === "string" && typeof t.text === "string");
  } catch {
    return [];
  }
}

async function writeThoughts(thoughts: Thought[]): Promise<void> {
  await ensureFile();
  // atomic write: temp + rename to avoid TOCTOU / partial write
  const tmpPath = filePath + ".tmp." + Date.now();
  await fs.writeFile(tmpPath, JSON.stringify(thoughts, null, 2), "utf8");
  await fs.rename(tmpPath, filePath);
}

export function sortThoughts(thoughts: Thought[]): Thought[] {
  return [...thoughts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.createdAt - b.createdAt;
  });
}

export async function clearThoughts(): Promise<void> {
  await writeThoughts([]);
}

export async function addThought(input: {
  name: string;
  text: string;
  ip?: string;
}): Promise<{ ok: boolean; thought?: Thought; error?: string }> {
  const name = sanitize(input.name, NAME_MAX);
  const text = sanitize(input.text, TEXT_MAX);

  if (!name) {
    return { ok: false, error: "Name is required." };
  }
  if (!text) {
    return { ok: false, error: "Thought text is required." };
  }

  const thoughts = await readThoughts();
  if (thoughts.length >= MAX_ENTRIES) {
    // drop oldest (chronological) to keep newest — sort by createdAt
    thoughts.sort((a, b) => a.createdAt - b.createdAt);
    thoughts.splice(0, thoughts.length - MAX_ENTRIES + 1);
  }

  const thought: Thought = {
    id: randomUUID(),
    name,
    text,
    color: "",
    initials: getInitials(name),
    createdAt: Date.now(),
    pinned: false,
    reactions: {},
  };

  thoughts.push(thought);
  await writeThoughts(thoughts);

  return { ok: true, thought };
}

export async function findThought(id: string): Promise<{ thought?: Thought; index?: number; list?: Thought[] }> {
  const list = await readThoughts();
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return {};
  return { thought: list[index], index, list };
}

export async function toggleReaction(id: string, emoji: string): Promise<Thought | null> {
  const { thought, index, list } = await findThought(id);
  if (!thought || index === undefined || !list) return null;

  const current = thought.reactions[emoji] || 0;
  if (current > 0) {
    delete thought.reactions[emoji];
  } else {
    thought.reactions[emoji] = 1;
  }
  list[index] = thought;
  await writeThoughts(list);
  return thought;
}

export async function togglePin(id: string): Promise<Thought | null> {
  const { thought, index, list } = await findThought(id);
  if (!thought || index === undefined || !list) return null;

  thought.pinned = !thought.pinned;
  list[index] = thought;
  await writeThoughts(list);
  return thought;
}

export async function setAiReply(id: string, reply: string): Promise<Thought | null> {
  const { thought, index, list } = await findThought(id);
  if (!thought || index === undefined || !list) return null;

  thought.aiReply = reply;
  thought.aiReplyAt = Date.now();
  list[index] = thought;
  await writeThoughts(list);
  return thought;
}

export async function clientIp(request: Request): Promise<string> {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
