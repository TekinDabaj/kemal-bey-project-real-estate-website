import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getAdminEmailTemplate({
  name,
  email,
  phone,
  message,
  date,
  time,
}: {
  name: string;
  email: string;
  phone: string;
  message?: string;
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
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #f59e0b; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🗓️ New Booking Request</h1>
            </td>
          </tr>
          
          <!-- Appointment Card -->
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 0 20px 12px 20px;">
                    <p style="margin: 0; color: #92400e; font-size: 11px; font-weight: 600; letter-spacing: 1px;">APPOINTMENT DETAILS</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 8px 0;">
                          <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px;">📅 Date</p>
                          <p style="margin: 0; color: #1c1917; font-size: 16px; font-weight: 600;">${date}</p>
                        </td>
                        <td width="50%" style="padding: 8px 0;">
                          <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px;">🕐 Time</p>
                          <p style="margin: 0; color: #1c1917; font-size: 16px; font-weight: 600;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Client Information -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 12px 0; color: #1c1917; font-size: 14px; font-weight: 600;">Client Information</h2>
              <div style="border-top: 1px solid #e7e5e4; padding-top: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #78716c; font-size: 14px; width: 80px;">Name</td>
                    <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 500;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #78716c; font-size: 14px; width: 80px;">Email</td>
                    <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 500;">
                      <a href="mailto:${email}" style="color: #f59e0b; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #78716c; font-size: 14px; width: 80px;">Phone</td>
                    <td style="padding: 8px 0; color: #1c1917; font-size: 14px; font-weight: 500;">
                      <a href="tel:${phone}" style="color: #f59e0b; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          ${
            message
              ? `
          <!-- Message -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 12px 0; color: #1c1917; font-size: 14px; font-weight: 600;">Message</h2>
              <div style="border-top: 1px solid #e7e5e4; padding-top: 16px;">
                <p style="margin: 0; color: #44403c; font-size: 14px; line-height: 1.6; background-color: #fafaf9; padding: 12px; border-radius: 6px;">${message}</p>
              </div>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f4; padding: 20px 24px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; color: #a8a29e; font-size: 12px;">This is an automated notification from your booking system.</p>
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

function getCustomerEmailTemplate({
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
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #f59e0b; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">✅ Booking Confirmed</h1>
            </td>
          </tr>
          
          <!-- Welcome Message -->
          <tr>
            <td style="padding: 32px 24px 16px 24px;">
              <p style="margin: 0; color: #1c1917; font-size: 16px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin: 16px 0 0 0; color: #44403c; font-size: 16px; line-height: 1.6;">
                Thank you for booking a consultation with us. Your appointment has been scheduled!
              </p>
            </td>
          </tr>
          
          <!-- Appointment Card -->
          <tr>
            <td style="padding: 16px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding: 8px 0; text-align: center;">
                          <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px;">📅 Date</p>
                          <p style="margin: 0; color: #1c1917; font-size: 16px; font-weight: 600;">${date}</p>
                        </td>
                        <td width="50%" style="padding: 8px 0; text-align: center;">
                          <p style="margin: 0 0 4px 0; color: #78716c; font-size: 12px;">🕐 Time</p>
                          <p style="margin: 0; color: #1c1917; font-size: 16px; font-weight: 600;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- What's Next -->
          <tr>
            <td style="padding: 16px 24px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 16px 0; color: #1c1917; font-size: 14px; font-weight: 600;">✨ What's Next?</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top;">
                                <div style="width: 24px; height: 24px; background-color: #fde68a; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; color: #92400e;">1</div>
                              </td>
                              <td style="padding-left: 8px; color: #44403c; font-size: 14px; line-height: 1.5;">Check your email for confirmation details</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top;">
                                <div style="width: 24px; height: 24px; background-color: #fde68a; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; color: #92400e;">2</div>
                              </td>
                              <td style="padding-left: 8px; color: #44403c; font-size: 14px; line-height: 1.5;">Our team will contact you shortly</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; vertical-align: top;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width: 28px; vertical-align: top;">
                                <div style="width: 24px; height: 24px; background-color: #fde68a; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: bold; color: #92400e;">3</div>
                              </td>
                              <td style="padding-left: 8px; color: #44403c; font-size: 14px; line-height: 1.5;">Prepare any questions you'd like to discuss</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f4; padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #1c1917; font-size: 14px; font-weight: 600;">Premier Realty</p>
              <p style="margin: 0; color: #a8a29e; font-size: 12px;">Questions? Reply to this email or contact us directly.</p>
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
    const { name, email, phone, message, date, time } = await request.json();

    // Send notification to admin
    await resend.emails.send({
      from: "Reservations <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `🗓️ New Booking: ${name} on ${date}`,
      html: getAdminEmailTemplate({ name, email, phone, message, date, time }),
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Premier Realty <onboarding@resend.dev>",
      to: email,
      subject: "✅ Your Consultation Booking is Confirmed",
      html: getCustomerEmailTemplate({ name, date, time }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
