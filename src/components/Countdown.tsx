"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  endDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeLeft(endDate: Date): TimeLeft {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-extrabold tabular-nums sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="rounded-lg bg-liam-red/10 px-4 py-3 text-center text-sm font-bold text-liam-red">
        Contributions closed
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Contributions close in
      </p>
      <div className="flex items-center justify-center gap-3">
        <Segment value={timeLeft.days} label="days" />
        <span className="text-lg font-bold text-muted-foreground">:</span>
        <Segment value={timeLeft.hours} label="hrs" />
        <span className="text-lg font-bold text-muted-foreground">:</span>
        <Segment value={timeLeft.minutes} label="min" />
        <span className="text-lg font-bold text-muted-foreground">:</span>
        <Segment value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  );
}
