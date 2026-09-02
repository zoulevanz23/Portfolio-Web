import { NextResponse } from "next/server";
import { systems } from "@/content/site-content";

export async function GET() {
  const projects = systems.map(({ architecture, ...rest }) => rest);
  return NextResponse.json({
    data: projects,
    meta: { count: projects.length, timestamp: new Date().toISOString() },
  });
}
