import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getContactEmailTemplate({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
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
                    <span style="color: #ffffff; font-size: 26px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">Premier</span>
                    <span style="color: #d4af37; font-size: 26px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">Realty</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: #666666; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Exceptional Properties. Exceptional Service.</p>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="background-color: #faf9f7; padding: 40px 24px;">

              <!-- Title Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <div style="width: 64px; height: 64px; margin: 0 auto 20px auto; background: linear-gradient(135deg, #d4af37 0%, #b8962e 100%); border-radius: 50%; line-height: 64px;">
                      <span style="color: #ffffff; font-size: 28px;">&#9993;</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">New Contact Message</p>
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Website Inquiry</h1>
                  </td>
                </tr>
              </table>

              <!-- Subject Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 12px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Subject</p>
                    <p style="margin: 0; color: #1a1a1a; font-size: 18px; font-weight: 500;">${subject}</p>
                  </td>
                </tr>
              </table>

              <!-- Contact Information Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Contact Information</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 14px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Name</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${name}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Email</td>
                              <td><a href="mailto:${email}" style="color: #1a1a1a; font-size: 15px; text-decoration: none;">${email}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 14px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Phone</td>
                              <td><a href="tel:${phone}" style="color: #1a1a1a; font-size: 15px; text-decoration: none;">${phone}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 16px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Message</p>
                    <div style="border-left: 3px solid #d4af37; padding: 16px 20px; background-color: #faf9f7;">
                      <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 8px 0;">
                    <a href="mailto:${email}" style="display: inline-block; background-color: #0f0f0f; color: #ffffff; padding: 16px 48px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px; margin-right: 12px;">Reply via Email</a>
                    <a href="tel:${phone}" style="display: inline-block; background-color: #d4af37; color: #ffffff; padding: 16px 48px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px;">Call Now</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f4f2; padding: 24px; text-align: center; border-top: 1px solid #e8e6e3;">
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 11px; letter-spacing: 1px;">Automated notification from Premier Realty Website</p>
              <p style="margin: 0; color: #bbbbbb; font-size: 10px;">&copy; ${new Date().getFullYear()} Premier Realty. All rights reserved.</p>
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
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send notification to admin
    await resend.emails.send({
      from: "Premier Realty <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `Contact Form: ${subject} — ${name}`,
      html: getContactEmailTemplate({ name, email, phone, subject, message }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
