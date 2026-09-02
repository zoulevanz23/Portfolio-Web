"use client";

import { useCallback, useRef, useState, useEffect } from "react";

const IN_ACCENT = "var(--interview-accent)";
const IN_ACCENT_SOFT = "var(--interview-accent-soft)";
const IN_BORDER = "var(--interview-border)";
const IN_FILL = "var(--interview-fill)";
const IN_FILL_SOFT = "var(--interview-fill-soft)";
const IN_PRIMARY = "var(--interview-primary)";

interface Message {
  role: "user" | "assistant";
  content: string;
  persona?: string;
  round?: number;
}

interface Verdict {
  persona: string;
  round: number;
  verdict: string;
  technical: number;
  communication: number;
  problemSolving: number;
  cultureFit: number;
  estimatedRole: string;
  salaryRange: string;
  notes: string;
}

interface InterviewChatProps {
  persona: string | null;
  simulationMode: boolean;
  resumeText?: string | null;
  candidateName?: string | null;
}

const SIMULATION_ORDER = ["hr", "architect", "team-lead", "panel"] as const;

const PERSONA_NAMES: Record<string, string> = {
  hr: "Sarah — HR",
  interrogator: "Elena — Staff Engineer",
  architect: "Dmitri — Principal Architect",
  "team-lead": "Marcus — Engineering Manager",
  panel: "Panel Interview",
};

const ROUND_INTROS: Record<string, string> = {
  hr: "[ Round 1: HR Interview with Sarah ]",
  architect: "[ Round 2: Technical Deep-Dive with Dmitri ]",
  "team-lead": "[ Round 3: Team Fit with Marcus ]",
  panel: "[ Round 4: Final Panel ]",
};

const VERDICT_LABELS: Record<string, string> = {
  HIRE: "Job Offer",
  MAYBE: "We'll Call You",
  PASS: "Sorry, We're Moving On",
};

function parseVerdict(text: string, persona: string, round: number): Verdict | null {
  const verdictMatch = text.match(/VERDICT:\s*(HIRE|MAYBE|PASS)/i);
  if (!verdictMatch) return null;

  const techMatch = text.match(/TECHNICAL:\s*(\d)/i);
  const commMatch = text.match(/COMMUNICATION:\s*(\d)/i);
  const probMatch = text.match(/PROBLEM_SOLVING:\s*(\d)/i);
  const cultureMatch = text.match(/CULTURE_FIT:\s*(\d)/i);
  const roleMatch = text.match(/ESTIMATED_ROLE:\s*(.+)/i);
  const salaryMatch = text.match(/SALARY_RANGE:\s*(.+)/i);
  const notesMatch = text.match(/NOTES:\s*(.+)/i);

  return {
    persona,
    round,
    verdict: verdictMatch[1].toUpperCase(),
    technical: techMatch ? parseInt(techMatch[1]) : 0,
    communication: commMatch ? parseInt(commMatch[1]) : 0,
    problemSolving: probMatch ? parseInt(probMatch[1]) : 0,
    cultureFit: cultureMatch ? parseInt(cultureMatch[1]) : 0,
    estimatedRole: roleMatch ? roleMatch[1].trim() : "Software Engineer",
    salaryRange: salaryMatch ? salaryMatch[1].trim() : "Competitive",
    notes: notesMatch ? notesMatch[1].trim() : "",
  };
}

function extractChatText(text: string): string {
  const thanksIdx = text.indexOf("THANKS FOR YOUR TIME");
  if (thanksIdx !== -1) {
    return text.substring(0, thanksIdx).trim();
  }
  return text;
}

function JobOfferDocument({ verdict }: { verdict: Verdict }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border border-border bg-background p-6">
      <div className="mb-6 border-b-2 border-foreground pb-4 text-center">
        <p className="font-mono text-[10px] tracking-widest text-subtle">
          CONFIDENTIAL
        </p>
        <p className="mt-2 font-mono text-lg font-bold text-foreground">
          JOB OFFER LETTER
        </p>
      </div>

      <div className="mb-4 space-y-1 font-mono text-xs text-muted">
        <p>Date: {dateStr}</p>
        <p>To: Candidate</p>
        <p>Re: Offer of Employment</p>
      </div>

      <div className="mb-4 space-y-3 font-mono text-xs text-foreground">
        <p>Dear Candidate,</p>
        <p>
          We are pleased to extend this offer of employment for the position of{" "}
          <span className="font-bold">{verdict.estimatedRole}</span> at our
          company.
        </p>

        <div className="border border-border bg-surface p-3">
          <p className="mb-2 font-bold">Position Details</p>
          <div className="space-y-1">
            <p>Role: {verdict.estimatedRole}</p>
            <p>Salary: {verdict.salaryRange}</p>
            <p>Type: Full-time</p>
            <p>Start Date: TBD</p>
          </div>
        </div>

        <div className="border border-border bg-surface p-3">
          <p className="mb-2 font-bold">Interview Evaluation</p>
          <div className="space-y-1">
            <p>Technical: {verdict.technical}/5</p>
            <p>Communication: {verdict.communication}/5</p>
            <p>Problem Solving: {verdict.problemSolving}/5</p>
            <p>Culture Fit: {verdict.cultureFit}/5</p>
          </div>
        </div>

        {verdict.notes && (
          <div className="border border-border bg-surface p-3">
            <p className="mb-1 font-bold">Interviewer Notes</p>
            <p className="text-muted">{verdict.notes}</p>
          </div>
        )}

        <p>
          This offer is based on our assessment of your skills and experience
          during the interview process. We believe you would be a valuable
          addition to our team.
        </p>

        <p>
          Please review this offer and let us know if you have any questions.
          We look forward to hearing from you.
        </p>

        <p className="mt-4">Sincerely,</p>
        <p>The Hiring Team</p>
      </div>

      <div className="mt-4 border-t border-border pt-3 text-center">
        <p className="font-mono text-[10px] text-subtle">
          This is a simulated offer for practice purposes only.
        </p>
      </div>
    </div>
  );
}

function VerdictCard({ verdict }: { verdict: Verdict }) {
  const isHire = verdict.verdict === "HIRE";
  const isMaybe = verdict.verdict === "MAYBE";

  const borderColor = isHire
    ? "border-emerald-500"
    : isMaybe
      ? "border-amber-500"
      : "border-red-500";

  const labelColor = isHire
    ? "text-emerald-400"
    : isMaybe
      ? "text-amber-400"
      : "text-red-400";

  const scores = [
    { label: "Technical", value: verdict.technical },
    { label: "Communication", value: verdict.communication },
    { label: "Problem Solving", value: verdict.problemSolving },
    { label: "Culture Fit", value: verdict.cultureFit },
  ];

  const avg =
    (verdict.technical + verdict.communication + verdict.problemSolving + verdict.cultureFit) / 4;

  return (
    <div className={`overflow-hidden rounded-xl border ${borderColor} p-4`} style={{ backgroundColor: IN_FILL_SOFT }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-subtle">
          {PERSONA_NAMES[verdict.persona] || `Round ${verdict.round}`}
        </span>
        <span className={`font-mono text-sm font-bold ${labelColor}`}>
          {VERDICT_LABELS[verdict.verdict] || verdict.verdict}
        </span>
      </div>

      {isHire && (
        <div className="mb-3 border border-border bg-background p-3">
          <p className="mb-1 font-mono text-[10px] text-subtle">Offered Role</p>
          <p className="font-mono text-sm font-bold text-foreground">
            {verdict.estimatedRole}
          </p>
          <p className="mt-1 font-mono text-[10px] text-subtle">
            Estimated Salary
          </p>
          <p className="font-mono text-sm font-bold text-foreground">
            {verdict.salaryRange}
          </p>
        </div>
      )}

      {isMaybe && (
        <p className="mb-3 border border-border bg-background p-3 font-mono text-xs text-muted">
          We were impressed but want to see more. We&apos;ll reach out if a
          better-fit role opens up.
        </p>
      )}

      {!isHire && !isMaybe && (
        <p className="mb-3 border border-border bg-background p-3 font-mono text-xs text-muted">
          We appreciate your time but have decided to move forward with other
          candidates. We wish you the best in your search.
        </p>
      )}

      <div className="mb-3 space-y-2">
        {scores.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-28 font-mono text-[10px] text-muted">
              {s.label}
            </span>
            <div className="flex flex-1 gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-2 flex-1 ${
                    n <= s.value ? "bg-foreground" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <span className="w-4 text-right font-mono text-[10px] text-muted">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="font-mono text-[10px] text-subtle">Average</span>
        <span className="font-mono text-xs font-bold text-foreground">
          {avg.toFixed(1)}
        </span>
      </div>

      {verdict.notes && (
        <p className="mt-2 border-t border-border pt-2 text-xs text-muted">
          {verdict.notes}
        </p>
      )}
    </div>
  );
}

export function InterviewChat({ persona, simulationMode, resumeText, candidateName }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundMessages, setRoundMessages] = useState(0);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamStartRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const activePersona = simulationMode
    ? SIMULATION_ORDER[currentRound]
    : persona;

  const EXCHANGES_PER_ROUND = 5;

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming || !activePersona || interviewEnded) return;

    const userMessage = input.trim();
    setInput("");

    const newUserMsg: Message = {
      role: "user",
      content: userMessage,
      persona: activePersona,
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setRoundMessages((prev) => prev + 1);

    setIsStreaming(true);
    streamStartRef.current = Date.now();

    try {
      const historyForApi = messages
        .filter((m) => m.persona === activePersona)
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        }));

      const payload = {
        persona: activePersona,
        message: userMessage,
        history: historyForApi,
        round: simulationMode ? currentRound + 1 : undefined,
        resume: resumeText || undefined,
        candidateName: candidateName || undefined,
      };

      let res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status === 503) {
        const waitMs = (parseInt(res.headers.get("Retry-After") || "2", 10) * 1000) + Math.random() * 600;
        await new Promise((r) => setTimeout(r, waitMs));
        res = await fetch("/api/ai/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok && res.status === 503) {
          // second transient failure before 5 — show ONE neutral question instead of spamming disconnected
          const isFifth = roundMessages + 1 >= EXCHANGES_PER_ROUND && !simulationMode;
          if (!isFifth) {
            const neutral = "Thanks for sharing that — could you walk me through one concrete example of that in a bit more detail?";
            setMessages([...updatedMessages, { role: "assistant", content: neutral, persona: activePersona, round: currentRound + 1 }]);
            return;
          }
        }
      }

      if (!res.ok) {
        let msg = "AI interviewer is not connected.";
        try {
          const j = await res.clone().json();
          if (j?.error) msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      const text = await res.text();
      const elapsed = Math.round(
        (Date.now() - streamStartRef.current) / 1000
      );
      setResponseTime(elapsed);

      const v = parseVerdict(text, activePersona, currentRound + 1);
      if (v) {
        setVerdicts((prev) => [...prev, v]);
        setInterviewEnded(true);
      }

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: text,
          persona: activePersona,
          round: currentRound + 1,
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "AI interviewer is not connected.";
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: msg.includes("not connected") ? msg : "AI interviewer is not connected.",
          persona: activePersona,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [
    input,
    isStreaming,
    activePersona,
    messages,
    simulationMode,
    currentRound,
    interviewEnded,
    resumeText,
    candidateName,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const advanceRound = useCallback(() => {
    if (currentRound < SIMULATION_ORDER.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setRoundMessages(0);
      setInterviewEnded(false);
    }
  }, [currentRound]);

  const shouldAdvanceRound =
    simulationMode &&
    !isStreaming &&
    interviewEnded &&
    currentRound < SIMULATION_ORDER.length - 1;

  const simulationDone =
    simulationMode && verdicts.length === SIMULATION_ORDER.length;

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  const startConversation = useCallback(() => {
    if (!activePersona) return;
    const interviewerName =
      activePersona === "hr" ? "Sarah" : activePersona === "interrogator" ? "Elena" : activePersona === "architect" ? "Dmitri" : activePersona === "team-lead" ? "Marcus" : "your panel interviewers";
    const greeting = candidateName
      ? `Nice to meet you, ${candidateName}. `
      : "";
    const intro = `[${PERSONA_NAMES[activePersona]}]\n\nI'm ${interviewerName}. ${greeting}Let's get started — tell me a bit about yourself and what brings you here.`;
    setMessages([
      { role: "assistant", content: intro, persona: activePersona, round: 1 },
    ]);
  }, [activePersona, candidateName]);

  if (!persona && !simulationMode) {
    return null;
  }

  if (simulationMode && messages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border p-6" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
          <div className="mb-3 font-mono text-xs text-subtle">
            Hiring Simulation: 4 rounds, ~4 exchanges each
          </div>
          <div className="mb-4 space-y-2">
            {SIMULATION_ORDER.map((p, i) => (
              <div key={p} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: i === 0 ? IN_ACCENT : IN_BORDER, boxShadow: i === 0 ? `0 0 8px ${IN_ACCENT}` : "none" }}
                />
                <span className={`font-mono text-xs ${i === 0 ? "text-foreground" : "text-muted"}`}>
                  {i + 1}. {PERSONA_NAMES[p]}
                </span>
              </div>
            ))}
          </div>
          <button onClick={startConversation} className="w-full rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${IN_ACCENT}, ${IN_PRIMARY})`, boxShadow: `0 0 18px ${IN_ACCENT_SOFT}` }}>
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border p-6" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
        <div className="mb-3 flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: IN_ACCENT, boxShadow: `0 0 8px ${IN_ACCENT}` }} />
          <div className="font-mono text-xs text-subtle">
            Interviewing with: {PERSONA_NAMES[activePersona || ""]}
          </div>
        </div>
        <button onClick={startConversation} className="w-full rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${IN_ACCENT}, ${IN_PRIMARY})`, boxShadow: `0 0 18px ${IN_ACCENT_SOFT}` }}>
          Start Interview
        </button>
      </div>
    );
  }

  if (simulationDone) {
    const hasHire = verdicts.some((v) => v.verdict === "HIRE");
    const hireVerdict = verdicts.find((v) => v.verdict === "HIRE");

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border p-6 text-center" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
          <p className="mb-1 font-mono text-sm font-medium text-foreground">
            Simulation Complete
          </p>
          <p className="mb-4 text-xs text-muted">
            Here is how each interviewer evaluated you.
          </p>
          <div className="space-y-3">
            {verdicts.map((v, i) => (
              <VerdictCard key={i} verdict={v} />
            ))}
          </div>
        </div>

        {hasHire && hireVerdict && (
          <div>
            <p className="mb-2 font-mono text-xs text-subtle">
              Based on your combined evaluation:
            </p>
            <JobOfferDocument verdict={hireVerdict} />
          </div>
        )}

        <div className="rounded-xl border p-6 text-center" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
          <p className="mb-1 font-mono text-[10px] text-subtle">
            Overall Average
          </p>
          <p className="font-mono text-lg font-bold" style={{ color: IN_ACCENT }}>
            {(
              verdicts.reduce(
                (sum, v) =>
                  sum +
                  (v.technical + v.communication + v.problemSolving + v.cultureFit) /
                    4,
                0
              ) / verdicts.length
            ).toFixed(1)}
            <span className="text-xs text-muted"> / 5.0</span>
          </p>
        </div>
      </div>
    );
  }

  if (interviewEnded && !simulationMode) {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    const v = lastAssistant
      ? parseVerdict(lastAssistant.content, activePersona || "", 1)
      : null;

    return (
      <div className="flex flex-col gap-4">
        <div className="mb-4 max-h-60 space-y-3 overflow-y-auto rounded-xl border p-4" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === "user" ? "text-right" : "text-left"}
            >
              <span
                className={`inline-block max-w-[85%] p-3 font-mono text-sm ${
                  msg.role === "user" ? "text-accent-fg" : "text-foreground"
                }`}
                style={
                  msg.role === "user"
                    ? { border: `1px solid ${IN_ACCENT}`, background: IN_ACCENT, boxShadow: `0 0 18px ${IN_ACCENT_SOFT}` }
                    : { border: `1px solid ${IN_BORDER}`, background: IN_FILL_SOFT }
                }
              >
                {extractChatText(msg.content)}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {v && (
          <>
            <VerdictCard verdict={v} />
            {v.verdict === "HIRE" && <JobOfferDocument verdict={v} />}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {simulationMode && (
        <div className="mb-3 flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: IN_BORDER, background: IN_FILL_SOFT }}>
          <div className="font-mono text-xs text-subtle">
            {ROUND_INTROS[SIMULATION_ORDER[currentRound]]} — Exchange{" "}
            {roundMessages + 1}/{EXCHANGES_PER_ROUND}
          </div>
          <div className="flex gap-1">
            {SIMULATION_ORDER.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 6,
                  background:
                    i < currentRound ? IN_ACCENT : i === currentRound ? IN_ACCENT : IN_BORDER,
                  boxShadow: i <= currentRound ? `0 0 8px ${IN_ACCENT_SOFT}` : "none",
                  animation: i === currentRound ? "pulse 1.2s ease-in-out infinite" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <span className="mono-label">
          {isStreaming
            ? `${PERSONA_NAMES[activePersona || ""]} is speaking...`
            : "Your turn"}
        </span>
        {responseTime !== null && !isStreaming && (
          <span className="font-mono text-[10px] text-subtle">
            Last response: {responseTime}s
          </span>
        )}
      </div>

      <div className="mb-4 max-h-96 space-y-3 overflow-y-auto rounded-xl border p-4" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
            style={{ animation: "fade-up 0.2s ease-out" }}
          >
            <span
              className={`inline-block max-w-[85%] p-3 font-mono text-sm ${
                msg.role === "user"
                  ? "text-accent-fg"
                  : "text-foreground"
              }`}
              style={
                msg.role === "user"
                  ? {
                      border: `1px solid ${IN_ACCENT}`,
                      background: IN_ACCENT,
                      boxShadow: `0 0 18px ${IN_ACCENT_SOFT}`,
                    }
                  : {
                      border: `1px solid ${IN_BORDER}`,
                      background: IN_FILL_SOFT,
                    }
              }
            >
              {msg.role === "assistant"
                ? extractChatText(msg.content)
                : msg.content}
              {msg.role === "assistant" &&
                isStreaming &&
                i === messages.length - 1 && (
                  <span
                    className="ml-0.5 inline-block h-3 w-1.5 bg-foreground"
                    style={{
                      animation: "typewriter-cursor 0.8s step-end infinite",
                    }}
                  />
                )}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {shouldAdvanceRound ? (
        <div className="space-y-3">
          <div className="rounded-xl border p-6 text-center" style={{ borderColor: IN_BORDER, backgroundColor: IN_FILL }}>
            <p className="mb-3 font-mono text-xs text-subtle">
              Round complete — next:{" "}
              <span style={{ color: IN_ACCENT }}>{PERSONA_NAMES[SIMULATION_ORDER[currentRound + 1]]}</span>
            </p>
            <button onClick={advanceRound} className="w-full rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${IN_ACCENT}, ${IN_PRIMARY})`, boxShadow: `0 0 18px ${IN_ACCENT_SOFT}` }}>
              Next Round
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            disabled={isStreaming}
            rows={1}
            className="input-field flex-1 resize-none overflow-hidden"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="rounded-lg px-6 py-2.5 font-mono text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${IN_ACCENT}, ${IN_PRIMARY})`,
              boxShadow: `0 0 18px ${IN_ACCENT_SOFT}`,
            }}
          >
            {isStreaming ? "..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}
