import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getConfirmationEmailTemplate({
  name,
  date,
  time,
}: {
  name: string;
  date: string;
  time: string;
}) {
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
                                <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">Save the Date</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">Add this appointment to your calendar</p>
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
                                <p style="margin: 0; color: #1a1a1a; font-size: 14px; font-weight: 500;">Meet Our Team</p>
                                <p style="margin: 4px 0 0 0; color: #888888; font-size: 13px;">We'll guide you through every step</p>
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
    const { name, email, date, time } = await request.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: "KA Global <onboarding@resend.dev>",
      to: email,
      subject: "Your Appointment is Confirmed - KA Global",
      html: getConfirmationEmailTemplate({ name, date, time }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirmation email error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
