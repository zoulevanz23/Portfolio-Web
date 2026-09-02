import { NextResponse } from "next/server";
import { clientIp, interactionRateLimitCheck, togglePin } from "@/lib/thoughts-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = await clientIp(request);
    if (!interactionRateLimitCheck(ip)) return NextResponse.json({ error: "Slow down." }, { status: 429 });
    const { id } = await params;
    const thought = await togglePin(id);
    if (!thought) {
      return NextResponse.json({ error: "Thought not found." }, { status: 404 });
    }
    return NextResponse.json({ thought });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
