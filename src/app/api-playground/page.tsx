"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { CodeResponseSkeleton } from "@/components/Skeleton";

const endpoints = [
  { method: "GET", path: "/api/projects", description: "List all systems/projects" },
  { method: "GET", path: "/api/experience", description: "Work history with linked systems" },
  { method: "GET", path: "/api/skills", description: "Technology stack by layer" },
  { method: "GET", path: "/api/systems/sys-001", description: "Single system with architecture" },
  { method: "POST", path: "/api/lab/validate", description: "Validate business-rule parameters: { temperature, humidity, pressure, batchId }" },
  { method: "POST", path: "/api/ai/db-schema", description: "Generate a normalized DB schema: { description, database }" },
  { method: "GET", path: "/api/thoughts", description: "List all thoughts + Josh's AI replies" },
  { method: "POST", path: "/api/thoughts", description: "Post a thought: { name, text }" },
  { method: "POST", path: "/api/thoughts/{id}/react", description: "Toggle a reaction: { emoji } (👍💡🔥❤️😂)" },
  { method: "POST", path: "/api/thoughts/{id}/pin", description: "Toggle pinned on a thought" },
  { method: "POST", path: "/api/thoughts/{id}/reply", description: "Generate Josh's AI reply for a thought" },
];

export default function ApiPlaygroundPage() {
  const [selectedPath, setSelectedPath] = useState("/api/projects");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState('{\n  "temperature": "22",\n  "humidity": "45",\n  "pressure": "1013",\n  "batchId": "BATCH-ABC123"\n}');
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  async function executeRequest() {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (method === "POST") {
        options.body = body;
      }

      const res = await fetch(selectedPath, options);
      const elapsed = Math.round(performance.now() - start);
      setResponseTime(elapsed);
      setStatus(res.status);

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({ error: String(err) }, null, 2));
      setStatus(500);
    } finally {
      setLoading(false);
    }
  }

  function selectEndpoint(path: string, m: string) {
    setSelectedPath(path);
    setMethod(m);
    setResponse(null);
    setStatus(null);
  }

  return (
    <div className="section-container">
      <SectionHeader
        label="API Playground"
        title="Live endpoints"
        description="Real Next.js API routes backing this site. Issue requests and inspect JSON responses."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div>
          <p className="mono-label mb-4">Available endpoints</p>
          <div className="space-y-2">
            {endpoints.map((ep) => (
              <button
                key={ep.path + ep.method}
                onClick={() => selectEndpoint(ep.path, ep.method)}
                className={`w-full border p-3 text-left transition-colors ${
                  selectedPath === ep.path && method === ep.method
                    ? "border-foreground bg-surface-muted"
                    : "border-border bg-surface hover:border-border-muted"
                }`}
              >
                <span className="font-mono text-xs text-muted">{ep.method}</span>
                <p className="font-mono text-sm text-foreground">{ep.path}</p>
                <p className="mt-1 text-xs text-subtle">{ep.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="surface-card">
            <div className="mb-4 flex items-center gap-3">
              <span className="tag">{method}</span>
              <span className="font-mono text-sm text-foreground">{selectedPath}</span>
            </div>

            {method === "POST" && (
              <div className="mb-4">
                <p className="mono-label mb-2">Request body</p>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="input-field text-xs"
                />
              </div>
            )}

            <button
              onClick={executeRequest}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Executing..." : "Send Request"}
            </button>

            {response && (
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-4">
                  <span className="font-mono text-xs text-subtle">
                    Status: <span className={status && status < 400 ? "status-passed" : "status-critical"}>{status}</span>
                  </span>
                  {responseTime && (
                    <span className="font-mono text-xs text-subtle">{responseTime}ms</span>
                  )}
                </div>
                <pre className="code-block">{response}</pre>
              </div>
            )}

            {loading && !response && <CodeResponseSkeleton lines={10} />}
          </div>
        </div>
      </div>
    </div>
  );
}
