import { NextResponse } from "next/server";
import { experience } from "@/content/site-content";

export async function GET() {
  return NextResponse.json({
    data: experience,
    meta: { count: experience.length, timestamp: new Date().toISOString() },
  });
}
