import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createCalendarEventWithMeet } from "@/lib/google-calendar";
import { buildNaiveDateTimeRange } from "@/lib/timezone";
import {
  getRescheduleConfirmedClientEmail,
  getRescheduleAcceptedAdminEmail,
  getRescheduleDeclinedAdminEmail,
} from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "KA Global <onboarding@resend.dev>";

// Service-role client: this endpoint is public (the client is not logged in),
// so access is gated entirely by the unguessable reschedule_token, and all DB
// work happens server-side with the service role (never the browser).
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** "2026-07-15" -> "Wednesday, July 15, 2026" (rendered in UTC, it's a bare date). */
function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : "");

// GET /api/reschedule?token=... -> proposal details for the landing page
export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("reservations")
      .select(
        "name, date, time, reschedule_date, reschedule_time, reschedule_status"
      )
      .eq("reschedule_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      name: data.name,
      originalDate: data.date,
      originalTime: hhmm(data.time),
      newDate: data.reschedule_date,
      newTime: hhmm(data.reschedule_time),
      status: data.reschedule_status, // proposed | accepted | declined
    });
  } catch (error) {
    console.error("Reschedule GET error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

// POST /api/reschedule  { token, action: "confirm" | "decline" }
export async function POST(request: Request) {
  try {
    const { token, action } = await request.json();

    if (!token || (action !== "confirm" && action !== "decline")) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data: reservation, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("reschedule_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!reservation) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    // Idempotency: if the client already responded, report the prior outcome
    // instead of mutating again (handles double-clicks / re-opened links).
    if (reservation.reschedule_status !== "proposed") {
      return NextResponse.json({
        status: reservation.reschedule_status,
        alreadyHandled: true,
      });
    }

    const newDate: string = reservation.reschedule_date;
    const newTime = hhmm(reservation.reschedule_time);

    // ----- DECLINE -----------------------------------------------------------
    if (action === "decline") {
      await supabase
        .from("reservations")
        .update({ reschedule_status: "declined", status: "cancelled" })
        .eq("id", reservation.id);

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: process.env.ADMIN_EMAIL!,
          subject: `Reschedule Declined — ${reservation.name}`,
          html: getRescheduleDeclinedAdminEmail({
            name: reservation.name,
            email: reservation.email,
            originalDate: formatDate(reservation.date),
            originalTime: hhmm(reservation.time),
            proposedDate: formatDate(newDate),
            proposedTime: newTime,
          }),
        });
      } catch (e) {
        console.error("Failed to send decline notification:", e);
      }

      return NextResponse.json({ status: "declined" });
    }

    // ----- CONFIRM -----------------------------------------------------------
    // Re-check the proposed slot is still free (a different client could have
    // booked it while this offer was outstanding).
    const { data: dayReservations } = await supabase
      .from("reservations")
      .select("id, time, status")
      .eq("date", newDate)
      .neq("status", "cancelled")
      .neq("id", reservation.id);

    const slotTaken = (dayReservations || []).some(
      (r) => hhmm(r.time) === newTime
    );
    if (slotTaken) {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }

    // Move the reservation to the new slot and confirm it.
    await supabase
      .from("reservations")
      .update({
        date: newDate,
        time: newTime,
        status: "confirmed",
        reschedule_status: "accepted",
      })
      .eq("id", reservation.id);

    // Create the Google Calendar event + Meet link (non-blocking on failure).
    let meetLink: string | undefined;
    try {
      const { startDateTime, endDateTime } = buildNaiveDateTimeRange(
        newDate,
        newTime,
        60
      );
      const cal = await createCalendarEventWithMeet({
        summary: `Property Consultation - ${reservation.name}`,
        description: `Rescheduled property consultation with ${reservation.name}.\n\nEmail: ${reservation.email}${reservation.phone ? `\nPhone: ${reservation.phone}` : ""}`,
        startDateTime,
        endDateTime,
        attendeeEmail: reservation.email,
        attendeeName: reservation.name,
      });
      if (cal.success) {
        meetLink = cal.meetLink;
        await supabase
          .from("reservations")
          .update({
            calendar_event_id: cal.eventId || null,
            meet_link: cal.meetLink || null,
          })
          .eq("id", reservation.id);
      } else {
        console.warn("Calendar event creation failed on reschedule:", cal.error);
      }
    } catch (e) {
      console.error("Calendar error on reschedule confirm:", e);
    }

    const prettyDate = formatDate(newDate);

    // Email the client their confirmation (with Meet link if available)...
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: reservation.email,
        subject: meetLink
          ? "Your Rescheduled Appointment is Confirmed - Join via Google Meet"
          : "Your Rescheduled Appointment is Confirmed - KA Global",
        html: getRescheduleConfirmedClientEmail({
          name: reservation.name,
          date: prettyDate,
          time: newTime,
          meetLink,
        }),
      });
    } catch (e) {
      console.error("Failed to send client confirmation:", e);
    }

    // ...and notify the admin that the client accepted.
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: process.env.ADMIN_EMAIL!,
        subject: `Reschedule Accepted — ${reservation.name}`,
        html: getRescheduleAcceptedAdminEmail({
          name: reservation.name,
          email: reservation.email,
          date: prettyDate,
          time: newTime,
        }),
      });
    } catch (e) {
      console.error("Failed to send accept notification:", e);
    }

    return NextResponse.json({ status: "accepted", meetLink: meetLink || null });
  } catch (error) {
    console.error("Reschedule POST error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
