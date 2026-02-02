import { google, calendar_v3 } from "googleapis";
import path from "path";
import fs from "fs";

// Types for the calendar event creation
export interface CalendarEventInput {
  summary: string;
  description: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  attendeeEmail: string;
  attendeeName: string;
}

export interface CalendarEventResult {
  success: boolean;
  eventId?: string;
  meetLink?: string;
  calendarLink?: string;
  error?: string;
}

// Get Google Auth client using service account credentials
function getGoogleAuth() {
  // Try environment variable first (for production/Vercel)
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

  console.log("Google Auth: Checking credentials...");
  console.log("GOOGLE_CREDENTIALS_JSON env var exists:", !!credentialsJson);

  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      console.log("Google Auth: Parsed credentials for project:", credentials.project_id);
      console.log("Google Auth: Service account email:", credentials.client_email);
      return new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
    } catch (error) {
      console.error("Failed to parse GOOGLE_CREDENTIALS_JSON:", error);
      throw new Error("Invalid GOOGLE_CREDENTIALS_JSON environment variable - JSON parse failed");
    }
  }

  // Fall back to file (for local development)
  console.log("Google Auth: Falling back to file-based credentials");
  const credentialsPath = path.join(process.cwd(), "google-credentials.json");

  if (!fs.existsSync(credentialsPath)) {
    console.error("Google Auth: No credentials file found at:", credentialsPath);
    throw new Error(
      "Google credentials not found. Set GOOGLE_CREDENTIALS_JSON env var or place google-credentials.json in project root."
    );
  }

  console.log("Google Auth: Using credentials file:", credentialsPath);
  return new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

// Generate a unique request ID for conference creation
function generateRequestId(): string {
  return `meet-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Creates a Google Calendar event with Google Meet conferencing.
 *
 * The service account creates events on its own primary calendar.
 * Google Meet links are automatically generated for each event.
 */
export async function createCalendarEventWithMeet(
  input: CalendarEventInput
): Promise<CalendarEventResult> {
  try {
    console.log("Creating calendar event with Meet for:", input.attendeeEmail);
    console.log("Event time:", input.startDateTime, "to", input.endDateTime);

    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });

    console.log("Google Calendar client initialized");

    // Create the event - try with Google Meet first, fall back to regular event
    // Note: Service accounts without Google Workspace cannot create Meet conferences
    const baseEvent: calendar_v3.Schema$Event = {
      summary: input.summary,
      description: `${input.description}\n\nClient: ${input.attendeeName} (${input.attendeeEmail})`,
      start: {
        dateTime: input.startDateTime,
        timeZone: "Europe/Istanbul", // Turkey timezone
      },
      end: {
        dateTime: input.endDateTime,
        timeZone: "Europe/Istanbul",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 60 }, // 1 hour before
          { method: "popup", minutes: 15 }, // 15 minutes before
        ],
      },
    };

    let response;
    let meetLink: string | undefined;

    // First, try to create event WITH Google Meet
    console.log("Attempting to create calendar event with Google Meet...");
    try {
      const eventWithMeet: calendar_v3.Schema$Event = {
        ...baseEvent,
        conferenceData: {
          createRequest: {
            requestId: generateRequestId(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      };

      response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: eventWithMeet,
        conferenceDataVersion: 1,
        sendUpdates: "none",
      });

      const createdEvent = response.data;
      meetLink =
        createdEvent.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video"
        )?.uri || createdEvent.hangoutLink || undefined;

      console.log("Event created with Meet link:", meetLink);
    } catch (meetError: unknown) {
      // Meet creation failed - try without Meet
      console.warn("Could not create Meet conference, creating event without Meet:",
        meetError instanceof Error ? meetError.message : "Unknown error");

      try {
        response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: baseEvent,
          sendUpdates: "none",
        });
        console.log("Event created without Meet link");
      } catch (insertError: unknown) {
        console.error("Calendar insert error details:", JSON.stringify(insertError, null, 2));
        const err = insertError as { response?: { data?: unknown }; message?: string };
        if (err.response?.data) {
          console.error("Google API error response:", JSON.stringify(err.response.data, null, 2));
        }
        throw insertError;
      }
    }

    console.log("Calendar event created successfully");
    const createdEvent = response.data;

    return {
      success: true,
      eventId: createdEvent.id || undefined,
      meetLink: meetLink || undefined,
      calendarLink: createdEvent.htmlLink || undefined,
    };
  } catch (error) {
    console.error("Failed to create calendar event:", error);

    // Provide detailed error message
    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific Google API errors
      if (errorMessage.includes("invalid_grant")) {
        errorMessage =
          "Service account credentials are invalid or expired. Please regenerate credentials.";
      } else if (errorMessage.includes("accessNotConfigured")) {
        errorMessage =
          "Google Calendar API is not enabled for this project. Enable it in Google Cloud Console.";
      } else if (errorMessage.includes("insufficientPermissions")) {
        errorMessage =
          "Service account lacks calendar permissions. Check API scopes.";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Deletes a calendar event by its ID.
 * Useful for when a reservation is cancelled.
 */
export async function deleteCalendarEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
      sendUpdates: "all", // Notify attendees of cancellation
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete calendar event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
