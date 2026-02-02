import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // Check 1: OAuth credentials
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    diagnostics.checks = {
      clientIdExists: !!clientId,
      clientSecretExists: !!clientSecret,
    };

    if (!clientId || !clientSecret) {
      diagnostics.error = "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET";
      diagnostics.action = "Add OAuth credentials to environment variables";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    // Check 2: Refresh token
    let refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!refreshToken) {
      // Try Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "google_refresh_token")
          .single();

        if (data?.value) {
          refreshToken = data.value;
          diagnostics.checks = {
            ...diagnostics.checks as object,
            refreshTokenSource: "database",
          };
        }
      }
    } else {
      diagnostics.checks = {
        ...diagnostics.checks as object,
        refreshTokenSource: "environment",
      };
    }

    if (!refreshToken) {
      diagnostics.checks = {
        ...diagnostics.checks as object,
        refreshTokenExists: false,
      };
      diagnostics.error = "No refresh token found";
      diagnostics.action = "Visit /api/auth/google to connect your Google account";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    diagnostics.checks = {
      ...diagnostics.checks as object,
      refreshTokenExists: true,
    };

    // Check 3: Try to authenticate
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    // Check 4: Try to list calendars
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
      const calendarList = await calendar.calendarList.list({ maxResults: 1 });
      diagnostics.checks = {
        ...diagnostics.checks as object,
        apiCallSuccess: true,
        calendarsFound: calendarList.data.items?.length || 0,
      };

      // Check 5: Verify Meet is available
      const primaryCalendar = calendarList.data.items?.find((c) => c.primary);
      if (primaryCalendar) {
        diagnostics.checks = {
          ...diagnostics.checks as object,
          primaryCalendarId: primaryCalendar.id,
          calendarAccessRole: primaryCalendar.accessRole,
        };
      }

      diagnostics.status = "OK - Google Calendar API is working with OAuth";
      diagnostics.meetSupport = "Google Meet links will be created for confirmed reservations";
      return NextResponse.json(diagnostics);

    } catch (apiError: unknown) {
      const err = apiError as { message?: string; code?: number };
      diagnostics.checks = {
        ...diagnostics.checks as object,
        apiCallSuccess: false,
        apiError: err.message,
      };

      if (err.message?.includes("invalid_grant")) {
        diagnostics.error = "Refresh token expired or revoked";
        diagnostics.action = "Visit /api/auth/google to re-authorize";
      } else {
        diagnostics.error = err.message;
      }

      return NextResponse.json(diagnostics, { status: 500 });
    }

  } catch (error) {
    diagnostics.error = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
