import { NextResponse } from "next/server";
import { validateLabParameters } from "@/content/site-content";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateLabParameters(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", status: "CRITICAL" },
      { status: 400 }
    );
  }
}
