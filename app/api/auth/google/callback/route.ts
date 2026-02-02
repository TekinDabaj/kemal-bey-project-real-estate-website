import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { error: "OAuth authorization failed", details: error },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code received" },
      { status: 400 }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Missing OAuth configuration" },
      { status: 500 }
    );
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        {
          error: "No refresh token received",
          details: "Try revoking app access at https://myaccount.google.com/permissions and try again",
        },
        { status: 400 }
      );
    }

    // Store the refresh token in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      // If no Supabase, show the token to be manually added to env
      return NextResponse.json({
        success: true,
        message: "OAuth successful! Add this refresh token to your environment variables:",
        refresh_token: tokens.refresh_token,
        instructions: "Add GOOGLE_REFRESH_TOKEN to your Vercel environment variables",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store in a settings table
    const { error: upsertError } = await supabase
      .from("site_settings")
      .upsert(
        {
          key: "google_refresh_token",
          value: tokens.refresh_token,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

    if (upsertError) {
      console.error("Failed to store refresh token:", upsertError);
      // Still return success with the token for manual setup
      return NextResponse.json({
        success: true,
        warning: "Could not store in database. Add this to your environment variables:",
        refresh_token: tokens.refresh_token,
        env_var: "GOOGLE_REFRESH_TOKEN",
      });
    }

    // Return success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Calendar Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255,255,255,0.1);
              border-radius: 16px;
              backdrop-filter: blur(10px);
            }
            .success-icon {
              width: 80px;
              height: 80px;
              background: #22c55e;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 24px;
              font-size: 40px;
            }
            h1 { margin: 0 0 16px; }
            p { color: #a0a0a0; margin: 0 0 24px; }
            a {
              display: inline-block;
              padding: 12px 24px;
              background: #d4af37;
              color: #0f0f0f;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            }
            a:hover { background: #c4a030; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h1>Google Calendar Connected!</h1>
            <p>Your account is now linked. Google Meet links will be automatically created for confirmed reservations.</p>
            <a href="/admin">Go to Admin Dashboard</a>
          </div>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err) {
    console.error("OAuth token exchange failed:", err);
    return NextResponse.json(
      {
        error: "Failed to exchange authorization code",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
