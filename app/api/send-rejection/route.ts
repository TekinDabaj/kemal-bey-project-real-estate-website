import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "KA Global <onboarding@resend.dev>";

function getRejectionEmailTemplate({
  name,
  date,
  time,
  reason,
}: {
  name: string;
  date: string;
  time: string;
  reason: string;
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

              <!-- Icon & Title -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <div style="width: 72px; height: 72px; margin: 0 auto 20px auto; border: 2px solid #d4af37; border-radius: 50%; line-height: 68px; background-color: #ffffff;">
                      <span style="color: #d4af37; font-size: 28px;">&#128197;</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Schedule Update</p>
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Hello, ${name}</h1>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.8;">
                      We regret to inform you that your consultation request for the following date and time could not be accommodated at this time.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Original Appointment Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 20px 0; color: #999999; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Original Request</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="text-align: center; padding: 16px; border-right: 1px solid #f0eeeb;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Date</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 500; text-decoration: line-through; opacity: 0.6;">${date}</p>
                        </td>
                        <td width="50%" style="text-align: center; padding: 16px;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Time</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 500; text-decoration: line-through; opacity: 0.6;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Reason Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 16px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Reason</p>
                    <div style="border-left: 3px solid #d4af37; padding: 16px 20px; background-color: #faf9f7;">
                      <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.7;">${reason}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reschedule CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #166534; font-size: 16px; font-weight: 500;">We'd Love to Reschedule</p>
                    <p style="margin: 0 0 16px 0; color: #166534; font-size: 14px; opacity: 0.8;">Please feel free to book a new appointment at your convenience.</p>
                    <a href="https://kemal-bey-project-real-estate-websi.vercel.app/book" style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 14px 32px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 4px;">Book New Appointment</a>
                  </td>
                </tr>
              </table>

              <!-- Contact Section -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 8px 0;">
                    <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Questions or concerns?</p>
                    <p style="margin: 0; color: #666666; font-size: 14px;">Simply reply to this email and we'll be happy to assist you.</p>
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
    const { name, email, date, time, reason } = await request.json();

    console.log("Rejection email request:", { name, email, date, time, reason });

    if (!name || !email || !date || !time || !reason) {
      console.error("Missing required fields:", { name, email, date, time, reason });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send rejection email to customer
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Regarding Your Appointment Request - KA Global",
      html: getRejectionEmailTemplate({ name, date, time, reason }),
    });

    console.log("Rejection email sent:", result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Rejection email error:", error);
    return NextResponse.json(
      { error: "Failed to send rejection email", details: String(error) },
      { status: 500 }
    );
  }
}
