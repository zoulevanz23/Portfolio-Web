"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Thought } from "@/lib/thoughts-shared";

const REACTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
  {
    key: "👍",
    label: "Like",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    ),
  },
  {
    key: "💡",
    label: "Idea",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
  },
  {
    key: "🔥",
    label: "Fire",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    key: "❤️",
    label: "Love",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    key: "😂",
    label: "Haha",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
];

const PIN_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden>
    <path d="M16 3l5 5-8 8-5-5 8-8zM3 21l4.5-4.5" />
  </svg>
);

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const GUEST_ADJECTIVES = [
  "Quiet", "Curious", "Speedy", "Lucky", "Brave", "Mellow", "Sharp", "Cool",
];

const GUEST_NOUNS = [
  "Cat", "Fox", "Panda", "Wolf", "Cactus", "Koala", "Otter", "Taco", "Pixel", "Wizard",
];

function randomGuestName(): string {
  const adj = GUEST_ADJECTIVES[Math.floor(Math.random() * GUEST_ADJECTIVES.length)];
  const noun = GUEST_NOUNS[Math.floor(Math.random() * GUEST_NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

function Avatar({ initials, accent }: { initials: string; accent?: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
        accent ? "bg-accent text-accent-fg" : "bg-surface-subtle text-muted"
      }`}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function ThoughtsWall() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionName(randomGuestName());
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/thoughts");
      if (res.ok) {
        const data = await res.json();
        setThoughts(data.thoughts || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thoughts, replyingId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (posting || !text.trim()) {
      setError("Write a message first.");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/thoughts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sessionName, text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not post.");
        return;
      }
      setText("");
      await refresh();
      triggerAiReply(data.thought.id);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPosting(false);
    }
  }

  async function triggerAiReply(id: string) {
    setReplyingId(id);
    try {
      await fetch(`/api/thoughts/${id}/reply`, { method: "POST" });
      await refresh();
    } finally {
      setReplyingId(null);
    }
  }

  async function toggleReact(id: string, emoji: string) {
    await fetch(`/api/thoughts/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    refresh();
  }

  async function togglePin(id: string) {
    await fetch(`/api/thoughts/${id}/pin`, { method: "POST" });
    refresh();
  }

  const isMine = (t: Thought) => t.name === sessionName;

  return (
    <div className="surface-card flex h-[70vh] flex-col overflow-hidden p-0">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Avatar initials="JI" accent />
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-medium text-foreground">
            Thoughts
          </p>
          <p className="font-mono text-[10px] text-subtle">with Josh · auto-replies</p>
        </div>
        {thoughts.some((t) => t.aiReply) && (
          <span className="ml-auto font-mono text-[10px] text-status-passed">online</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-background px-4 py-5">
        {thoughts.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-muted">
              No messages yet. Say hi — Josh will reply in his own voice.
            </p>
          </div>
        ) : (
          thoughts.map((t) => (
            <div key={t.id}>
              {/* Visitor message */}
              <div className={`flex items-end gap-2 ${isMine(t) ? "flex-row-reverse" : ""}`}>
                {!isMine(t) && <Avatar initials={t.initials} />}
                <div className={`max-w-[75%] ${isMine(t) ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-lg px-3 py-2 text-left ${
                      isMine(t)
                        ? "bg-accent text-accent-fg"
                        : "bg-surface-muted text-foreground"
                    }`}
                  >
                    <p className={`mb-0.5 font-mono text-[10px] font-medium ${isMine(t) ? "text-accent-fg/70" : "text-subtle"}`}>
                      {t.name}
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {t.text}
                    </p>
                  </div>
                  <div className={`mt-1 flex items-center gap-2 ${isMine(t) ? "justify-end" : ""}`}>
                    <span className="font-mono text-[9px] text-subtle">{timeAgo(t.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Typing indicator — animated */}
              {replyingId === t.id && (
                <div className="mt-2 flex items-end gap-2">
                  <Avatar initials="JI" accent />
                  <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2.5">
                    <span className="font-mono text-[10px] text-subtle">Josh is typing</span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.9s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.9s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.9s" }} />
                    </span>
                  </div>
                </div>
              )}

              {/* Josh's AI reply */}
              {t.aiReply && (
                <div className="mt-2 flex items-end gap-2">
                  <Avatar initials="JI" accent />
                  <div className="max-w-[75%]">
                    <div className="rounded-lg bg-surface-muted px-3 py-2">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-medium text-foreground">Josh</span>
                        <span className="font-mono text-[9px] text-subtle">· AI</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {t.aiReply}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {REACTIONS.map((r) => {
                        const active = !!t.reactions[r.key];
                        return (
                          <button
                            key={r.key}
                            onClick={() => toggleReact(t.id, r.key)}
                            title={r.label}
                            aria-label={`${r.label}${t.reactions[r.key] ? ` ${t.reactions[r.key]}` : ""}`}
                            className={`flex items-center gap-1 border px-1.5 py-1 transition-colors ${
                              active
                                ? "border-foreground text-foreground"
                                : "border-transparent text-subtle hover:border-border-muted hover:text-foreground"
                            }`}
                          >
                            <span className={active ? "" : "opacity-70"}>{r.icon}</span>
                            {t.reactions[r.key] ? (
                              <span className="font-mono text-[10px]">{t.reactions[r.key]}</span>
                            ) : null}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => togglePin(t.id)}
                        title={t.pinned ? "Unpin" : "Pin"}
                        aria-label={t.pinned ? "Unpin" : "Pin"}
                        className={`flex items-center border px-1.5 py-1 transition-colors ${
                          t.pinned
                            ? "border-foreground text-foreground"
                            : "border-transparent text-subtle hover:border-border-muted hover:text-foreground"
                        }`}
                      >
                        <span className={t.pinned ? "" : "opacity-70"}>{PIN_ICON}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="border-t border-border bg-surface p-3">
        {error && <p className="mb-2 text-xs text-status-critical">{error}</p>}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            rows={2}
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="btn-primary shrink-0 px-4 disabled:opacity-50"
          >
            {posting ? "..." : "Send"}
          </button>
        </div>
        {sessionName && (
          <p className="mt-2 font-mono text-[10px] text-subtle">
            you appear as {sessionName}
          </p>
        )}
      </form>
    </div>
  );
}
