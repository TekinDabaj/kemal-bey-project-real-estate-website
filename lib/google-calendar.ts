import { google, calendar_v3 } from "googleapis";
import { createClient } from "@supabase/supabase-js";

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

// Get refresh token from Supabase or environment variable
async function getRefreshToken(): Promise<string | null> {
  // First check environment variable
  const envToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (envToken) {
    console.log("Using refresh token from environment variable");
    return envToken;
  }

  // Then check Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("Supabase not configured, cannot retrieve refresh token");
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "google_refresh_token")
      .single();

    if (error || !data) {
      console.log("No refresh token found in database");
      return null;
    }

    console.log("Using refresh token from database");
    return data.value;
  } catch (err) {
    console.error("Error fetching refresh token:", err);
    return null;
  }
}

// Get OAuth2 client with credentials
async function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing OAuth credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
    );
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error(
      "No refresh token found. Please complete the OAuth setup by visiting /api/auth/google"
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

// Generate a unique request ID for conference creation
function generateRequestId(): string {
  return `meet-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Creates a Google Calendar event with Google Meet conferencing.
 * Uses OAuth2 credentials to create events on the authenticated user's calendar.
 */
export async function createCalendarEventWithMeet(
  input: CalendarEventInput
): Promise<CalendarEventResult> {
  try {
    console.log("Creating calendar event with Meet for:", input.attendeeEmail);
    console.log("Event time:", input.startDateTime, "to", input.endDateTime);

    const auth = await getOAuth2Client();
    const calendar = google.calendar({ version: "v3", auth });

    console.log("Google Calendar client initialized with OAuth");

    // Create the event with Google Meet
    const event: calendar_v3.Schema$Event = {
      summary: input.summary,
      description: input.description,
      start: {
        dateTime: input.startDateTime,
        timeZone: "Europe/Istanbul", // Turkey timezone
      },
      end: {
        dateTime: input.endDateTime,
        timeZone: "Europe/Istanbul",
      },
      // Add client as attendee (OAuth allows this)
      attendees: [
        {
          email: input.attendeeEmail,
          displayName: input.attendeeName,
        },
      ],
      // Request Google Meet conference creation
      conferenceData: {
        createRequest: {
          requestId: generateRequestId(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 }, // 1 hour before
          { method: "popup", minutes: 15 }, // 15 minutes before
        ],
      },
    };

    console.log("Inserting calendar event with Meet...");

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // Send calendar invites to attendees
    });

    const createdEvent = response.data;

    // Extract Meet link from conference data
    const meetLink =
      createdEvent.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri || createdEvent.hangoutLink;

    console.log("Calendar event created successfully:", {
      eventId: createdEvent.id,
      meetLink: meetLink,
    });

    if (!meetLink) {
      console.warn("Event created but no Meet link generated");
    }

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
          "OAuth token expired or revoked. Please re-authorize at /api/auth/google";
      } else if (errorMessage.includes("accessNotConfigured")) {
        errorMessage =
          "Google Calendar API is not enabled. Enable it in Google Cloud Console.";
      } else if (errorMessage.includes("insufficientPermissions")) {
        errorMessage =
          "Insufficient permissions. Please re-authorize at /api/auth/google";
      } else if (errorMessage.includes("No refresh token")) {
        errorMessage =
          "OAuth not set up. Please visit /api/auth/google to connect your Google account.";
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
    const auth = await getOAuth2Client();
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
