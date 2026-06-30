import { NextResponse } from "next/server";
import { createCalendarEventWithMeet } from "@/lib/google-calendar";
import { buildNaiveDateTimeRange } from "@/lib/timezone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, time, phone, message } = body;

    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, date, time" },
        { status: 400 }
      );
    }

    // Build naive local datetime strings (no UTC "Z") for a 1-hour meeting.
    // These are interpreted in CYPRUS_TIMEZONE by the calendar layer, which
    // lets Google apply the correct EET/EEST (winter/summer) offset itself.
    // date format: "YYYY-MM-DD", time format: "HH:MM"
    const { startDateTime, endDateTime } = buildNaiveDateTimeRange(
      date,
      time,
      60
    );

    // Build description with client details
    let description = `Property Consultation with ${name}\n\n`;
    description += `Contact Information:\n`;
    description += `Email: ${email}\n`;
    if (phone) {
      description += `Phone: ${phone}\n`;
    }
    if (message) {
      description += `\nClient Message:\n${message}\n`;
    }
    description += `\n---\nThis meeting was automatically scheduled via KA Global booking system.`;

    // Create calendar event with Google Meet
    const result = await createCalendarEventWithMeet({
      summary: `Property Consultation - ${name}`,
      description,
      startDateTime,
      endDateTime,
      attendeeEmail: email,
      attendeeName: name,
    });

    if (!result.success) {
      console.error("Calendar event creation failed:", result.error);
      return NextResponse.json(
        {
          error: "Failed to create calendar event",
          details: result.error,
        },
        { status: 500 }
      );
    }

    console.log("Calendar event created successfully:", {
      eventId: result.eventId,
      meetLink: result.meetLink,
    });

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      meetLink: result.meetLink,
      calendarLink: result.calendarLink,
    });
  } catch (error) {
    console.error("Error in create-calendar-event API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
