import { NextResponse } from "next/server";
import { createCalendarEventWithMeet } from "@/lib/google-calendar";

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

    // Parse date and time to create ISO datetime strings
    // date format: "YYYY-MM-DD", time format: "HH:MM"
    const [hours, minutes] = time.split(":").map(Number);

    // Create start datetime (Turkey timezone: Europe/Istanbul)
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    // Create end datetime (1 hour meeting duration)
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    // Format as ISO strings
    const startDateTime = startDate.toISOString();
    const endDateTime = endDate.toISOString();

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
