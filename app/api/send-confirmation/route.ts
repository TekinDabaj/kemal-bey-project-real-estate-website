import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "KA Global <onboarding@resend.dev>";

function getConfirmationEmailTemplate({
  name,
  date,
  time,
  meetLink,
}: {
  name: string;
  date: string;
  time: string;
  meetLink?: string;
}) {
  // Google Meet section - only shown if meetLink is provided
  const meetSection = meetLink
    ? `
              <!-- Google Meet Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 2px solid #1a73e8; border-radius: 4px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(26,115,232,0.12);">
                <tr>
                  <td style="padding: 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center;">
                          <!-- Google Meet Icon -->
                          <div style="margin-bottom: 16px;">
                            <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #00897B 0%, #1a73e8 100%); border-radius: 12px; line-height: 56px; text-align: center;">
                              <span style="color: #ffffff; font-size: 24px;">&#128249;</span>
                            </div>
                          </div>
                          <p style="margin: 0 0 8px 0; color: #1a73e8; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Video Conference</p>
                          <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 20px; font-weight: 500;">Join via Google Meet</h2>
                          <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                            Click the button below to join the video call at your scheduled time.<br>
                            You can also add this to your calendar automatically.
                          </p>
                          <!-- Join Meeting Button -->
                          <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                            <tr>
                              <td style="background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%); border-radius: 8px;">
                                <a href="${meetLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; letter-spacing: 0.5px;">
                                  Join Meeting
                                </a>
                              </td>
                            </tr>
                          </table>
                          <!-- Meeting Link Text -->
                          <p style="margin: 16px 0 0 0; color: #999999; font-size: 12px;">
                            Or copy this link: <a href="${meetLink}" style="color: #1a73e8; text-decoration: none; word-break: break-all;">${meetLink}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
`
    : "";

  // Update "What's Next" step 1 based on whether we have Meet link
  const step1Content = meetLink
    ? `<p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">Check Your Email</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">You'll receive a calendar invite with the Meet link</p>`
    : `<p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">Save the Date</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">Add this appointment to your calendar</p>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf9f7;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Black Header -->
          <tr>
            <td style="background-color: #0f0f0f; padding: 40px 40px; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 26px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">KA</span>
                    <span style="color: #d4af37; font-size: 26px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">Global</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #666666; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Exceptional Properties. Exceptional Service.</p>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="background-color: #faf9f7; padding: 40px 24px;">

              <!-- Success Icon & Title -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <div style="width: 72px; height: 72px; margin: 0 auto 20px auto; border: 2px solid #22c55e; border-radius: 50%; line-height: 68px; background-color: #f0fdf4;">
                      <span style="color: #22c55e; font-size: 32px;">&#10003;</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #22c55e; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Appointment Confirmed</p>
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Great News, ${name}!</h1>
                  </td>
                </tr>
              </table>

              <!-- Confirmation Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.8;">
                      Your consultation request has been reviewed and <strong style="color: #22c55e;">confirmed</strong> by our team.<br>We're excited to meet with you and help you find your perfect property.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Appointment Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 24px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Your Confirmed Appointment</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="text-align: center; padding: 16px; border-right: 1px solid #f0eeeb;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Date</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 500;">${date}</p>
                        </td>
                        <td width="50%" style="text-align: center; padding: 16px;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Time</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 500;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${meetSection}

              <!-- What's Next Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 32px;">
                    <p style="margin: 0 0 24px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">What's Next</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 14px 0; border-bottom: 1px solid #f0eeeb;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #22c55e; font-size: 12px; font-weight: 600;">01</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                ${step1Content}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 0; border-bottom: 1px solid #f0eeeb;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #22c55e; font-size: 12px; font-weight: 600;">02</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">Prepare Your Questions</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">Think about your property requirements</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 0;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #22c55e; font-size: 12px; font-weight: 600;">03</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">${meetLink ? "Join the Video Call" : "Meet Our Team"}</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">${meetLink ? "Click the Meet link at your scheduled time" : "We'll guide you through every step"}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Need to Reschedule -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 8px 0;">
                    <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Need to reschedule?</p>
                    <p style="margin: 0; color: #666666; font-size: 14px;">Simply reply to this email and we'll help you find a new time.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f4f2; padding: 32px 24px; text-align: center; border-top: 1px solid #e8e6e3;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto 20px auto;">
                <tr>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">PROPERTIES</a>
                  </td>
                  <td style="color: #cccccc;">|</td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">ABOUT US</a>
                  </td>
                  <td style="color: #cccccc;">|</td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #888888; font-size: 11px; text-decoration: none; letter-spacing: 1px;">CONTACT</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 11px; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} KA Global</p>
              <p style="margin: 0; color: #bbbbbb; font-size: 10px;">Exceptional Properties. Exceptional Service.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    const { name, email, date, time, meetLink } = await request.json();

    console.log("Confirmation email request:", { name, email, date, time, meetLink: meetLink ? "provided" : "not provided" });

    if (!name || !email || !date || !time) {
      console.error("Missing required fields:", { name, email, date, time });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send confirmation email to customer
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: meetLink
        ? "Your Appointment is Confirmed - Join via Google Meet"
        : "Your Appointment is Confirmed - KA Global",
      html: getConfirmationEmailTemplate({ name, date, time, meetLink }),
    });

    console.log("Confirmation email sent:", result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Confirmation email error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email", details: String(error) },
      { status: 500 }
    );
  }
}
