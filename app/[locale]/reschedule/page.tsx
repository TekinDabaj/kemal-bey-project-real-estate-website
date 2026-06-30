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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-6">
          <span className="text-2xl font-light tracking-[0.3em] uppercase text-slate-900">
            KA
          </span>
          <span className="text-2xl font-semibold tracking-[0.3em] uppercase text-amber-500">
            Global
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {children}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} KA Global
        </p>
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
        <div className="flex flex-col items-center py-8 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
          <p className="text-sm">Loading your appointment…</p>
        </div>
      </Shell>
    );
  }

  // ---- Invalid / not found ----
  if (loadError || !details) {
    return (
      <Shell>
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <X className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Link not valid
          </h1>
          <p className="text-sm text-slate-500">
            This reschedule link is invalid or has expired. Please contact us
            and we&apos;ll be happy to help.
          </p>
        </div>
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
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <CalendarCheck className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-1">
            You&apos;re all set!
          </h1>
          <p className="text-sm text-slate-500 mb-5">
            Your appointment has been confirmed for the new time.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left mb-5">
            <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
              <Calendar className="w-4 h-4 text-amber-500" />
              {formatDate(details.newDate)}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Clock className="w-4 h-4 text-amber-500" />
              {details.newTime}
            </div>
          </div>
          {meetLink && (
            <a
              href={meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <Video className="w-4 h-4" />
              Join Google Meet
            </a>
          )}
          <p className="text-xs text-slate-400 mt-5">
            A confirmation email is on its way.
          </p>
        </div>
      </Shell>
    );
  }

  if (finalStatus === "declined") {
    return (
      <Shell>
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-7 h-7 text-slate-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Reschedule declined
          </h1>
          <p className="text-sm text-slate-500">
            No problem — we&apos;ve let our team know. Feel free to reply to our
            email if you&apos;d like to arrange a different time.
          </p>
        </div>
      </Shell>
    );
  }

  if (result === "slot_taken") {
    return (
      <Shell>
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            That time was just taken
          </h1>
          <p className="text-sm text-slate-500">
            Unfortunately the proposed slot is no longer available. Please reply
            to our email and we&apos;ll find another time for you.
          </p>
        </div>
      </Shell>
    );
  }

  if (result === "error") {
    return (
      <Shell>
        <div className="text-center py-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <X className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-500">
            We couldn&apos;t process your response. Please try again in a moment
            or reply to our email.
          </p>
        </div>
      </Shell>
    );
  }

  // ---- Proposed: show the offer with confirm/decline ----
  return (
    <Shell>
      <div className="text-center mb-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-500 mb-1">
          Reschedule Request
        </p>
        <h1 className="text-xl font-semibold text-slate-900">
          Hello, {details.name}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          We&apos;ve proposed a new time for your consultation. Please confirm or
          decline below.
        </p>
      </div>

      {/* Original (struck) */}
      {details.originalDate && (
        <div className="text-center mb-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
            Original Request
          </p>
          <p className="text-sm text-slate-400 line-through">
            {formatDate(details.originalDate)} · {details.originalTime}
          </p>
        </div>
      )}

      {/* New proposed */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-amber-600 text-center mb-3">
          Proposed New Time
        </p>
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-slate-800 font-medium">
            <Calendar className="w-4 h-4 text-amber-500" />
            {formatDate(details.newDate)}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-800 font-medium mt-2">
          <Clock className="w-4 h-4 text-amber-500" />
          {details.newTime}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => respond("confirm")}
          disabled={submitting !== null}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm text-white transition disabled:opacity-60 ${
            intent === "confirm"
              ? "bg-green-600 hover:bg-green-700 ring-2 ring-green-300"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting === "confirm" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Confirm New Time
        </button>
        <button
          onClick={() => respond("decline")}
          disabled={submitting !== null}
          className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-60"
        >
          {submitting === "decline" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          Decline
        </button>
      </div>
    </Shell>
  );
}

export default function ReschedulePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        </Shell>
      }
    >
      <RescheduleInner />
    </Suspense>
  );
}
