import { NextResponse } from "next/server";
import { clientIp, interactionRateLimitCheck, toggleReaction } from "@/lib/thoughts-store";

const ALLOWED_EMOJIS = new Set(["👍", "💡", "🔥", "❤️", "😂"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = await clientIp(request);
    if (!interactionRateLimitCheck(ip)) return NextResponse.json({ error: "Slow down." }, { status: 429 });
    const { id } = await params;
    const body = await request.json();
    const emoji = typeof body.emoji === "string" ? body.emoji : "";
    if (!ALLOWED_EMOJIS.has(emoji)) {
      return NextResponse.json({ error: "Invalid emoji." }, { status: 400 });
    }

    const thought = await toggleReaction(id, emoji);
    if (!thought) {
      return NextResponse.json({ error: "Thought not found." }, { status: 404 });
    }
    return NextResponse.json({ thought });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
