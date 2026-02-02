import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    // Check 1: Environment variable
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    diagnostics.checks = {
      ...diagnostics.checks as object,
      envVarExists: !!credentialsJson,
      envVarLength: credentialsJson?.length || 0,
    };

    // Check 2: Try to parse credentials
    let credentials = null;
    if (credentialsJson) {
      try {
        credentials = JSON.parse(credentialsJson);
        diagnostics.checks = {
          ...diagnostics.checks as object,
          jsonParseSuccess: true,
          projectId: credentials.project_id,
          clientEmail: credentials.client_email,
          hasPrivateKey: !!credentials.private_key,
          privateKeyLength: credentials.private_key?.length || 0,
        };
      } catch (parseError) {
        diagnostics.checks = {
          ...diagnostics.checks as object,
          jsonParseSuccess: false,
          parseError: parseError instanceof Error ? parseError.message : "Unknown parse error",
        };
        return NextResponse.json(diagnostics, { status: 500 });
      }
    } else {
      // Check for file
      const credentialsPath = path.join(process.cwd(), "google-credentials.json");
      const fileExists = fs.existsSync(credentialsPath);
      diagnostics.checks = {
        ...diagnostics.checks as object,
        fileExists,
        filePath: credentialsPath,
      };

      if (fileExists) {
        try {
          const fileContent = fs.readFileSync(credentialsPath, "utf-8");
          credentials = JSON.parse(fileContent);
          diagnostics.checks = {
            ...diagnostics.checks as object,
            fileParseSuccess: true,
            projectId: credentials.project_id,
            clientEmail: credentials.client_email,
          };
        } catch (fileError) {
          diagnostics.checks = {
            ...diagnostics.checks as object,
            fileParseSuccess: false,
            fileError: fileError instanceof Error ? fileError.message : "Unknown file error",
          };
          return NextResponse.json(diagnostics, { status: 500 });
        }
      } else {
        diagnostics.error = "No credentials found - set GOOGLE_CREDENTIALS_JSON env var";
        return NextResponse.json(diagnostics, { status: 500 });
      }
    }

    // Check 3: Try to authenticate
    try {
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });

      const authClient = await auth.getClient();
      diagnostics.checks = {
        ...diagnostics.checks as object,
        authSuccess: true,
        authClientType: authClient.constructor.name,
      };

      // Check 4: Try to list calendars (simple API call)
      const calendar = google.calendar({ version: "v3", auth });
      const calendarList = await calendar.calendarList.list({ maxResults: 1 });

      diagnostics.checks = {
        ...diagnostics.checks as object,
        apiCallSuccess: true,
        calendarsFound: calendarList.data.items?.length || 0,
        primaryCalendarExists: calendarList.data.items?.some(c => c.primary) || false,
      };

      diagnostics.status = "OK - Google Calendar API is working";
      return NextResponse.json(diagnostics);

    } catch (authError: unknown) {
      const err = authError as { response?: { data?: unknown }; message?: string; code?: string };
      diagnostics.checks = {
        ...diagnostics.checks as object,
        authSuccess: false,
        authError: err.message || "Unknown auth error",
        authErrorCode: err.code,
      };
      if (err.response?.data) {
        diagnostics.checks = {
          ...diagnostics.checks as object,
          googleApiError: err.response.data,
        };
      }
      return NextResponse.json(diagnostics, { status: 500 });
    }

  } catch (error) {
    diagnostics.error = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
