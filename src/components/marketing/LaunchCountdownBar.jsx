import React, { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-01-01T00:00:00-07:00"); // Jan 1, 2026, Phoenix time

function getTimeLeft(target) {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return {
      isPast: true,
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    isPast: false,
    timeLeft: { days, hours, minutes, seconds },
  };
}

export default function LaunchCountdownBar({ className = "" }) {
  const [{ timeLeft, isPast }, setState] = useState(() => getTimeLeft(LAUNCH_DATE));

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getTimeLeft(LAUNCH_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUnit = (value) => value.toString().padStart(2, "0");

  return (
    <div
      className={`w-full mb-6 rounded-2xl border border-slate-700/70 bg-gradient-to-r from-indigo-900/80 via-slate-900/90 to-violet-900/80 shadow-[0_0_32px_rgba(79,70,229,0.55)] backdrop-blur-md px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left side: label + copy */}
        <div className="flex items-start gap-3 md:gap-4">
          {/* GL badge */}
          <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/60 bg-slate-950/70 shadow-[0_0_20px_rgba(129,140,248,0.7)]">
            <span className="text-lg font-semibold tracking-tight text-indigo-200">
              GL
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
                {isPast ? "Launch Live" : "Pre-Launch Countdown"}
              </p>
              {!isPast && (
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.95)]" />
              )}
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-50">
              Official Launch Begins{" "}
              <span className="text-indigo-300 font-bold">January 1st, 2026</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-300/80">
              {isPast
                ? "Core systems online. Rapid iterations and feature expansions are now in progress."
                : "We are in Pre-Launch Engineering Mode — features updating daily while we battle-test the platform."}
            </p>
          </div>
        </div>

        {/* Right side: countdown */}
        {!isPast ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-center md:text-right">
            {[
              { label: "Days", value: formatUnit(timeLeft.days) },
              { label: "Hours", value: formatUnit(timeLeft.hours) },
              { label: "Minutes", value: formatUnit(timeLeft.minutes) },
              { label: "Seconds", value: formatUnit(timeLeft.seconds) },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-700/70 bg-slate-950/70 px-2 py-2 sm:px-3 sm:py-2 shadow-[0_0_18px_rgba(30,64,175,0.55)]"
              >
                <span className="text-base sm:text-lg md:text-xl font-semibold tabular-nums text-slate-50">
                  {unit.value}
                </span>
                <span className="text-[0.65rem] sm:text-xs uppercase tracking-[0.16em] text-slate-400">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end gap-1">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/40">
              Live Launch Phase
            </span>
            <p className="text-xs sm:text-sm text-slate-300/90 max-w-xs md:text-right">
              Existing users keep access while we continue rolling out advanced modules
              like NUPS, audit layers, and SDK tooling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}