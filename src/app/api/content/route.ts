import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// Helper: read all data files
function readData(fileName: string) {
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Helper: write data file
function writeData(fileName: string, data: any) {
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET - fetch content by type
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as string | null;
  const id = searchParams.get("id") as string | null;

  if (type && id) {
    // Fetch single item by type and id
    const data = readData(`${type}.json`);
    const item = data.find((item: any) => item.id === id);
    return NextResponse.json(item || { error: "Not found" });
  }

  if (type) {
    // Fetch all items of a given type
    return NextResponse.json(readData(`${type}.json`));
  }

  // Fetch all types
  const all: Record<string, any[]> = {};
  fs.readdirSync(DATA_DIR).forEach((file) => {
    if (file.endsWith(".json")) {
      const key = file.replace(".json", "");
      all[key] = readData(file);
    }
  });
  return NextResponse.json(all);
}

// POST - create a new item (or overwrite single object)
export async function POST(request: Request) {
  const body = await request.json();
  const { type, fields, id, _overwrite } = body;

  if (!type || !fields) {
    return NextResponse.json({ error: "type and fields are required" }, { status: 400 });
  }

  const data = readData(`${type}.json`);

  // If file is a single object (identity, now) or _overwrite flag, replace whole file
  if (_overwrite || (!Array.isArray(data) && typeof data === "object")) {
    writeData(`${type}.json`, fields);
    return NextResponse.json(fields, { status: 200 });
  }

  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Data is not an array" }, { status: 500 });
  }

  const newItem = {
    id: id || fields.id || crypto.randomUUID(),
    ...fields,
  };

  data.push(newItem as any);
  writeData(`${type}.json`, data);

  return NextResponse.json(newItem, { status: 201 });
}

// PUT - update an existing item (or single object)
export async function PUT(request: Request) {
  const body = await request.json();
  const { type, id, fields } = body;

  if (!type || !id || !fields) {
    return NextResponse.json({ error: "type, id, and fields are required" }, { status: 400 });
  }

  const data = readData(`${type}.json`);

  // Single object case (identity, now)
  if (!Array.isArray(data) && typeof data === "object") {
    const merged = { ...(data as any), ...fields };
    writeData(`${type}.json`, merged);
    return NextResponse.json(merged);
  }

  const index = (data as any[]).findIndex((item: any) => item.id === id || item.name === id);

  if (index === -1) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  (data as any[])[index] = { ...(data as any[])[index], ...fields };
  writeData(`${type}.json`, data);

  return NextResponse.json((data as any[])[index]);
}

// DELETE - remove an item
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as string;
  const id = searchParams.get("id") as string;

  if (!type || !id) {
    return NextResponse.json({ error: "type and id are required" }, { status: 400 });
  }

  const data = readData(`${type}.json`);
  const filtered = data.filter((item: any) => item.id !== id);
  writeData(`${type}.json`, filtered);

  return NextResponse.json({ success: true });
}