"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Check,
  X,
  Loader2,
  CalendarCheck,
  Video,
  ArrowUpRight,
} from "lucide-react";

type Details = {
  name: string;
  originalDate: string | null;
  originalTime: string;
  newDate: string | null;
  newTime: string;
  status: "proposed" | "accepted" | "declined" | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MONT = { fontFamily: "var(--font-montserrat)" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#0c0a1d] px-5 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <p className="text-center text-[11px] tracking-[0.4em] uppercase text-amber-600 dark:text-amber-500 mb-12">
          KA Global
        </p>
        {children}
      </div>
    </div>
  );
}

/** Thin-bordered circular emblem used at the top of each state. */
function Emblem({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: "amber" | "muted";
}) {
  const ring =
    tone === "muted"
      ? "border-slate-300 dark:border-slate-600"
      : "border-amber-500/40";
  return (
    <div className="flex justify-center mb-8">
      <div
        className={`w-16 h-16 rounded-full border ${ring} flex items-center justify-center`}
      >
        {children}
      </div>
    </div>
  );
}

function Eyebrow({ text, tone = "amber" }: { text: string; tone?: "amber" | "muted" }) {
  const color =
    tone === "muted"
      ? "text-slate-400 dark:text-slate-500"
      : "text-amber-600 dark:text-amber-500";
  return (
    <p className={`text-[11px] tracking-[0.35em] uppercase ${color} text-center mb-4`}>
      {text}
    </p>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={MONT}
      className="text-center text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-white"
    >
      {children}
    </h1>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
      {children}
    </p>
  );
}

/** Hairline date / time band, matching the booking confirmation screen. */
function DateTimeBand({ date, time }: { date: string; time: string }) {
  return (
    <div className="flex items-stretch justify-center border-y border-slate-200 dark:border-[#2d2a4a] py-6">
      <div className="flex-1 text-center px-3">
        <Calendar className="w-4 h-4 text-amber-500 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-sm text-slate-900 dark:text-white font-light">{date}</p>
      </div>
      <div className="w-px bg-slate-200 dark:bg-[#2d2a4a]" />
      <div className="flex-1 text-center px-3">
        <Clock className="w-4 h-4 text-amber-500 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-sm text-slate-900 dark:text-white font-light">{time}</p>
      </div>
    </div>
  );
}

function RescheduleInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const intent = params.get("action"); // "confirm" | "decline" | null

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<Details | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [submitting, setSubmitting] = useState<null | "confirm" | "decline">(
    null
  );
  const [result, setResult] = useState<
    null | "accepted" | "declined" | "slot_taken" | "error"
  >(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/reschedule?token=${encodeURIComponent(token)}`
        );
        if (!res.ok) {
          if (active) setLoadError(true);
          return;
        }
        const data = (await res.json()) as Details;
        if (active) setDetails(data);
      } catch {
        if (active) setLoadError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  async function respond(action: "confirm" | "decline") {
    if (!token || submitting) return;
    setSubmitting(action);
    try {
      const res = await fetch("/api/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action }),
      });
      const data = await res.json();

      if (res.status === 409 || data.error === "slot_taken") {
        setResult("slot_taken");
      } else if (!res.ok) {
        setResult("error");
      } else {
        setResult(data.status === "accepted" ? "accepted" : "declined");
        setMeetLink(data.meetLink || null);
      }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(null);
    }
  }

  // ---- Loading ----
  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center py-10 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-amber-500 mb-4" strokeWidth={1.5} />
          <p className="text-[11px] tracking-[0.25em] uppercase">Loading</p>
        </div>
      </Shell>
    );
  }

  // ---- Invalid / not found ----
  if (loadError || !details) {
    return (
      <Shell>
        <Emblem tone="muted">
          <X className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
        </Emblem>
        <Eyebrow text="Unavailable" tone="muted" />
        <Title>Link not valid</Title>
        <Body>
          This reschedule link is invalid or has expired. Please contact us and
          we&apos;ll be happy to help.
        </Body>
      </Shell>
    );
  }

  // ---- Result states (after action, or already handled) ----
  const finalStatus =
    result ??
    (details.status === "accepted"
      ? "accepted"
      : details.status === "declined"
        ? "declined"
        : null);

  if (finalStatus === "accepted") {
    return (
      <Shell>
        <Emblem>
          <CalendarCheck className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
        </Emblem>
        <Eyebrow text="Appointment Confirmed" />
        <Title>You&apos;re all set</Title>
        <Body>Your consultation has been confirmed for the new time below.</Body>

        <div className="mt-10 mb-8">
          <DateTimeBand date={formatDate(details.newDate)} time={details.newTime} />
        </div>

        {meetLink && (
          <div className="text-center">
            <a
              href={meetLink}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[12px] tracking-[0.2em] uppercase text-white dark:text-[#0c0a1d] bg-[#0f0f0f] dark:bg-white transition-colors hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white"
            >
              <Video className="w-4 h-4" strokeWidth={1.5} />
              Join Google Meet
            </a>
          </div>
        )}

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-10">
          A confirmation email is on its way.
        </p>
      </Shell>
    );
  }

  if (finalStatus === "declined") {
    return (
      <Shell>
        <Emblem tone="muted">
          <X className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
        </Emblem>
        <Eyebrow text="Reschedule Declined" tone="muted" />
        <Title>Thanks for letting us know</Title>
        <Body>
          We&apos;ve informed our team. Feel free to reply to our email if
          you&apos;d like to arrange a different time.
        </Body>
      </Shell>
    );
  }

  if (result === "slot_taken") {
    return (
      <Shell>
        <Emblem>
          <Clock className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
        </Emblem>
        <Eyebrow text="No Longer Available" />
        <Title>That time was just taken</Title>
        <Body>
          Unfortunately the proposed slot is no longer available. Please reply to
          our email and we&apos;ll find another time for you.
        </Body>
      </Shell>
    );
  }

  if (result === "error") {
    return (
      <Shell>
        <Emblem tone="muted">
          <X className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
        </Emblem>
        <Eyebrow text="Something Went Wrong" tone="muted" />
        <Title>Please try again</Title>
        <Body>
          We couldn&apos;t process your response just now. Try again in a moment
          or reply to our email.
        </Body>
      </Shell>
    );
  }

  // ---- Proposed: show the offer with confirm / decline ----
  return (
    <Shell>
      <Emblem>
        <Calendar className="w-6 h-6 text-amber-500" strokeWidth={1.5} />
      </Emblem>
      <Eyebrow text="Reschedule Request" />
      <Title>Hello, {details.name}</Title>
      <Body>
        We&apos;ve proposed a new time for your consultation. Please confirm or
        decline below.
      </Body>

      {/* Original (struck through) */}
      {details.originalDate && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8 mb-5">
          <span className="line-through">
            {formatDate(details.originalDate)} · {details.originalTime}
          </span>
        </p>
      )}

      {/* Proposed new time */}
      <DateTimeBand date={formatDate(details.newDate)} time={details.newTime} />

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-3">
        <button
          onClick={() => respond("confirm")}
          disabled={submitting !== null}
          className={`group flex items-center justify-center gap-2.5 py-3.5 text-[12px] tracking-[0.2em] uppercase text-white dark:text-[#0c0a1d] bg-[#0f0f0f] dark:bg-white transition-colors hover:bg-amber-600 dark:hover:bg-amber-500 dark:hover:text-white disabled:opacity-50 ${
            intent === "confirm" ? "ring-1 ring-amber-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0c0a1d]" : ""
          }`}
        >
          {submitting === "confirm" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" strokeWidth={2} />
          )}
          Confirm New Time
        </button>
        <button
          onClick={() => respond("decline")}
          disabled={submitting !== null}
          className="flex items-center justify-center gap-2.5 py-3.5 text-[12px] tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#2d2a4a] transition-colors hover:border-slate-400 dark:hover:border-slate-500 disabled:opacity-50"
        >
          {submitting === "decline" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" strokeWidth={2} />
          )}
          Decline
        </button>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
        Questions? Just reply to our email
        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </p>
    </Shell>
  );
}

export default function ReschedulePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-amber-500" strokeWidth={1.5} />
          </div>
        </Shell>
      }
    >
      <RescheduleInner />
    </Suspense>
  );
}
