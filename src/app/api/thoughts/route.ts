import { NextResponse } from "next/server";
import {
  addThought,
  clearThoughts,
  clientIp,
  rateLimitCheck,
  readThoughts,
  sortThoughts,
} from "@/lib/thoughts-store";

export async function GET() {
  const thoughts = await readThoughts();
  return NextResponse.json({ count: thoughts.length, thoughts: sortThoughts(thoughts) });
}

export async function DELETE(request: Request) {
  // protected: requires CRON_SECRET or ADMIN_TOKEN matching server env, otherwise 403
  const secret = process.env.CRON_SECRET || process.env.ADMIN_TOKEN;
  if (secret) {
    const auth = request.headers.get("authorization") || request.headers.get("x-admin-token") || "";
    const urlSecret = new URL(request.url).searchParams.get("secret");
    if (auth !== `Bearer ${secret}` && auth !== secret && urlSecret !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else {
    // if no secret configured, deny destructive operation in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden — admin not configured" }, { status: 403 });
    }
  }
  await clearThoughts();
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const ip = await clientIp(request);
    if (!rateLimitCheck(ip)) {
      return NextResponse.json(
        { error: "Please wait a moment before posting again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = await addThought({
      name: typeof body.name === "string" ? body.name : "",
      text: typeof body.text === "string" ? body.text : "",
      ip,
    });

    if (!result.ok || !result.thought) {
      return NextResponse.json(
        { error: result.error || "Could not add thought." },
        { status: 400 }
      );
    }

    return NextResponse.json({ thought: result.thought }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
