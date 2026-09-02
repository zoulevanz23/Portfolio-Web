type AIProvider = "groq" | "gemini";

interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  provider?: AIProvider;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  text: string;
  provider: string;
  model: string;
}

interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  defaultModel: string;
}

const GROQ_CONFIG: ProviderConfig = {
  baseUrl: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
  defaultModel: "openai/gpt-oss-20b",
};

const GEMINI_CONFIG: ProviderConfig = {
  baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY || "",
  defaultModel: "gemini-1.5-flash-latest",
};

const MODEL_MAP: Record<string, { groq: string; gemini: string }> = {
  fast: { groq: "openai/gpt-oss-20b", gemini: "gemini-1.5-flash-latest" },
  smart: { groq: "openai/gpt-oss-120b", gemini: "gemini-1.5-pro-latest" },
  default: { groq: "openai/gpt-oss-20b", gemini: "gemini-1.5-flash-latest" },
};

const responseCache = new Map<string, { data: AIResponse; expiry: number }>();
const rateLimitTracker = new Map<string, { count: number; resetAt: number }>();

function getCacheKey(req: AIRequest, provider: AIProvider): string {
  // hash full prompt to avoid truncation collisions
  const raw = `${provider}:${req.systemPrompt || ""}:${req.prompt}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) >>> 0;
  return `${provider}:${h}:${raw.slice(0, 120)}`;
}

function isRateLimited(provider: string): boolean {
  const tracker = rateLimitTracker.get(provider);
  if (!tracker) return false;
  if (Date.now() > tracker.resetAt) {
    rateLimitTracker.delete(provider);
    return false;
  }
  return tracker.count >= 900;
}

function trackRequest(provider: string): void {
  const now = Date.now();
  const tracker = rateLimitTracker.get(provider);
  if (!tracker || now > tracker.resetAt) {
    rateLimitTracker.set(provider, { count: 1, resetAt: now + 86400000 });
  } else {
    tracker.count++;
  }
}

async function callGroq(req: AIRequest, model: string): Promise<AIResponse> {
  const config = GROQ_CONFIG;
  if (!config.apiKey || config.apiKey === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY not configured");
  }

  const messages: { role: string; content: string }[] = [];
  if (req.systemPrompt) {
    messages.push({ role: "system", content: req.systemPrompt });
  }
  messages.push({ role: "user", content: req.prompt });

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: req.maxTokens || 500,
      temperature: req.temperature ?? 0.7,
    }),
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  return { text, provider: "groq", model };
}

async function callGemini(req: AIRequest, model: string): Promise<AIResponse> {
  const config = GEMINI_CONFIG;
  if (!config.apiKey || config.apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // use proper systemInstruction field — don't merge roles
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: req.prompt }], role: "user" }],
    generationConfig: {
      maxOutputTokens: Math.min(req.maxTokens || 500, 2000),
      temperature: req.temperature ?? 0.7,
    },
  } as Record<string, unknown>;
  if (req.systemPrompt) (body as Record<string, unknown>).systemInstruction = { parts: [{ text: req.systemPrompt }] };

  const res = await fetch(
    `${config.baseUrl}/models/${model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return { text, provider: "gemini", model };
}

export async function generateText(req: AIRequest): Promise<AIResponse> {
  const provider = req.provider || "groq";
  const tier = req.model || "default";
  const models = MODEL_MAP[tier] || MODEL_MAP.default;

  const cacheKey = getCacheKey(req, provider);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  try {
    if (provider === "groq") {
      if (isRateLimited("groq")) throw new Error("RATE_LIMITED");
      const result = await callGroq(req, models.groq);
      trackRequest("groq");
      responseCache.set(cacheKey, { data: result, expiry: Date.now() + 3600000 });
      return result;
    } else {
      if (isRateLimited("gemini")) throw new Error("RATE_LIMITED");
      const result = await callGemini(req, models.gemini);
      trackRequest("gemini");
      responseCache.set(cacheKey, { data: result, expiry: Date.now() + 3600000 });
      return result;
    }
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMITED") {
      // jittered backoff before fallback to avoid thundering herd
      await new Promise((r) => setTimeout(r, 350 + Math.random() * 600));
      const fallback = provider === "groq" ? "gemini" : "groq";
      if (fallback === "groq" && !isRateLimited("groq")) {
        const result = await callGroq(req, models.groq);
        trackRequest("groq");
        return result;
      }
      if (fallback === "gemini" && !isRateLimited("gemini")) {
        const result = await callGemini(req, models.gemini);
        trackRequest("gemini");
        return result;
      }
    }
    throw err;
  }
}

export async function* generateTextStream(
  req: AIRequest
): AsyncGenerator<string> {
  // clamp maxTokens & protect streaming with rate-limit check — only count successful streams
  req.maxTokens = Math.min(req.maxTokens || 1000, 2500);
  const initialProvider = req.provider || "groq";
  if (isRateLimited(initialProvider)) {
    if (initialProvider !== "gemini" && !isRateLimited("gemini")) {
      yield* generateTextStream({ ...req, provider: "gemini" });
      return;
    }
    if (initialProvider === "gemini" && !isRateLimited("groq")) {
      yield* generateTextStream({ ...req, provider: "groq" });
      return;
    }
  }

  const provider = req.provider || "groq";
  const tier = req.model || "default";
  const models = MODEL_MAP[tier] || MODEL_MAP.default;

  const messages: { role: string; content: string }[] = [];
  if (req.systemPrompt) {
    messages.push({ role: "system", content: req.systemPrompt });
  }
  messages.push({ role: "user", content: req.prompt });

  if (provider === "groq") {
    const config = GROQ_CONFIG;
    if (!config.apiKey || config.apiKey === "your_groq_api_key_here") {
      throw new Error("GROQ_API_KEY not configured");
    }

    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: models.groq,
        messages,
        max_tokens: req.maxTokens || 1000,
        temperature: req.temperature ?? 0.7,
        stream: true,
      }),
    });

    let success = false;
    if (!res.ok) {
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 700));
        if (!isRateLimited("gemini")) {
          yield* generateTextStream({ ...req, provider: "gemini" });
          return;
        }
      }
      throw new Error(`Groq streaming error: ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            trackRequest("groq");
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk) yield chunk;
          } catch {
            // skip malformed JSON lines
          }
        }
      }
    }
    trackRequest("groq");
  } else {
    const config = GEMINI_CONFIG;
    if (!config.apiKey || config.apiKey === "your_gemini_api_key_here") {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const sysInstr = req.systemPrompt ? { systemInstruction: { parts: [{ text: req.systemPrompt }] } } : {};
    const res = await fetch(
      `${config.baseUrl}/models/${models.gemini}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.prompt }], role: "user" }],
          ...sysInstr,
          generationConfig: {
            maxOutputTokens: Math.min(req.maxTokens || 1000, 2000),
            temperature: req.temperature ?? 0.7,
          },
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 700));
        if (!isRateLimited("groq")) {
          yield* generateTextStream({ ...req, provider: "groq" });
          return;
        }
      }
      throw new Error(`Gemini streaming error: ${res.status}`);
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    trackRequest("gemini");
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      yield (i > 0 ? " " : "") + words[i];
    }
  }
}
