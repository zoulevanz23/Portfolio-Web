import { NextResponse } from "next/server";
import { systems } from "@/content/site-content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const system = systems.find((s) => s.id === id);

  if (!system) {
    return NextResponse.json({ error: "System not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: system,
    meta: { timestamp: new Date().toISOString() },
  });
}
