"use client";

import { useEffect, useState } from "react";

interface InterviewTimerProps {
  isRunning: boolean;
}

export function InterviewTimer({ isRunning }: InterviewTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const start = Date.now() - elapsed * 1000;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex items-center gap-3">
      <span className="mono-label">Session time</span>
      <span className="font-mono text-sm text-foreground">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {isRunning && (
        <span
          className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ background: "var(--interview-accent)", boxShadow: "0 0 8px var(--interview-accent)" }}
        />
      )}
    </div>
  );
}
