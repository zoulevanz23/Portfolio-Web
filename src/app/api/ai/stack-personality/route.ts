import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { getStackPersonalityPrompt } from "@/lib/ai-prompts";
import { stack, systems } from "@/content/site-content";

const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

const FALLBACK_PERSONALITIES: Record<string, string> = {
  "Next.js": "The full-stack framework that ties everything together.",
  React: "The UI library that makes components feel like second nature.",
  TypeScript: "Static types that catch bugs before they reach production.",
  "Tailwind CSS": "Utility-first styling that keeps the design system tight.",
  "TanStack Query": "Server state management that makes data fetching feel automatic.",
  Leaflet: "Interactive maps without the bloated SDK.",
  "C#": "Strongly typed, enterprise-ready, and surprisingly elegant.",
  ".NET 8": "The runtime that makes C# production-ready for anything.",
  "ASP.NET Core": "High-performance web APIs built on .NET.",
  "Minimal APIs": "Thin endpoint routing when controllers feel heavy.",
  "EF Core": "ORM that translates LINQ to SQL without the ceremony.",
  JWT: "Stateless tokens that keep APIs authenticated.",
  Firebase: "Backend-as-a-service when you don't want to build auth from scratch.",
  "SQL Server": "Relational database that handles complex queries and transactions.",
  Redis: "In-memory speed for caching, sessions, and rate limiting.",
  IIS: "Windows hosting that still runs the enterprise.",
  Vercel: "Deploy with zero config — push and it's live.",
  Docker: "Containerization that makes deployments reproducible.",
  Kubernetes: "Orchestration for when containers need managing at scale.",
  AWS: "Cloud infrastructure with more services than you'll ever use.",
  Azure: "Microsoft's cloud — natural fit when your stack is .NET.",
  Vitest: "Testing that's fast because it shares your build config.",
  RTL: "Testing components the way users interact with them.",
  jsdom: "A browser environment without the browser.",
  xUnit: ".NET testing that runs clean and runs fast.",
  Moq: "Mocking framework that makes isolation testing bearable.",
  WebApplicationFactory: "Integration testing without spinning up a real server.",
  "Dynamics 365": "Enterprise ERP/CRM that you integrate with, not replace.",
  "BIR EIS": "Philippine electronic invoicing — certificate headaches and all.",
  Python: "The language that makes everything from scripts to ML accessible.",
  FastAPI: "Python APIs with automatic docs and real performance.",
  PyTorch: "Deep learning that doesn't fight your Python instincts.",
  RAG: "Retrieval-augmented generation — giving LLMs a knowledge base.",
  "Vector DB": "Semantic search storage for AI embeddings.",
  Ollama: "Running LLMs locally without the cloud bill.",
  LangChain: "Chaining LLM calls into something resembling reasoning.",
  "Claude Code": "The AI that writes code while you describe problems.",
  "ChatGPT": "Conversational AI that turns questions into working solutions.",
  Codex: "Code generation that turns intent into implementation.",
  Groq: "Hardware-accelerated inference — fast enough to make you forget about latency.",
  MongoDB: "Document storage when your data doesn't fit neat tables.",
  Mermaid: "Diagrams from text — because drawing boxes is overrated.",
  Figma: "Prototyping tool where designs become real before code touches them.",
  Angular: "Enterprise-grade framework with opinions on everything — and you'll thank it later.",
  "GitHub Actions": "CI/CD that runs in the same repo as your code — no external setup needed.",
  "CI/CD": "Automated testing and deployment pipelines that catch issues before production.",
};

export async function GET() {
  const cacheKey = "stack-personality";
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json({ data: cached.data, meta: { cached: true } }, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  }

  let personalities: { name: string; personality: string }[] | null = null;

  try {
    const { systemPrompt, prompt } = getStackPersonalityPrompt();
    // race AI against 2.8s timeout — fall back to curated copy instead of making user stare
    const aiPromise = generateText({
      prompt,
      systemPrompt,
      provider: "groq",
      model: "fast",
      maxTokens: 900,
    }).then((r) => {
      const cleaned = r.text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleaned) as { name: string; personality: string }[];
    });
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2800));
    const raced = await Promise.race([aiPromise, timeout]);
    personalities = raced as { name: string; personality: string }[] | null;
  } catch {
    personalities = null;
  }

  const enriched = stack.map((item) => {
    const ai = personalities?.find(
      (p) => p.name.toLowerCase() === item.name.toLowerCase()
    );
    const projects = item.projectIds
      .map((pid) => systems.find((s) => s.id === pid)?.name)
      .filter(Boolean);
    return {
      name: item.name,
      category: item.category,
      tier: item.tier,
      usageCount: item.projectIds.length,
      projects,
      personality:
        ai?.personality ||
        FALLBACK_PERSONALITIES[item.name] ||
        `${item.name} — used in ${item.projectIds.length} project(s).`,
    };
  });

  cache.set(cacheKey, { data: enriched, expiry: Date.now() + CACHE_TTL });

  return NextResponse.json(
    {
      data: enriched,
      meta: { count: enriched.length, cached: false },
    },
    {
      headers: {
        // edge + browser cache: instant second visit, stale-while-revalidate keeps it fresh
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
