import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/lib/google-calendar";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required field: eventId" },
        { status: 400 }
      );
    }

    const result = await deleteCalendarEvent(eventId);

    if (!result.success) {
      console.error("Calendar event deletion failed:", result.error);
      return NextResponse.json(
        {
          error: "Failed to delete calendar event",
          details: result.error,
        },
        { status: 500 }
      );
    }

    console.log("Calendar event deleted successfully:", eventId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete-calendar-event API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
