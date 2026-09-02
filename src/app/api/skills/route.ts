import { NextResponse } from "next/server";
import { stack } from "@/content/site-content";

export async function GET() {
  const byLayer = stack.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof stack>
  );

  return NextResponse.json({
    data: byLayer,
    meta: { count: stack.length, timestamp: new Date().toISOString() },
  });
}
