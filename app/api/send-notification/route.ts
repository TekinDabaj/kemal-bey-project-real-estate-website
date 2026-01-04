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
<body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          
          <!-- Logo Header -->
          <tr>
            <td style="padding: 32px 0; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding-right: 12px; vertical-align: middle;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%); border-radius: 4px;"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">Premier</span>
                    <span style="color: #d4af37; font-size: 24px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">Realty</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 2px;">
                
                <!-- Gold Accent Line -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(90deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%);"></td>
                </tr>
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 32px 40px; text-align: center; border-bottom: 1px solid #2a2a2a;">
                    <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">New Consultation Request</p>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Booking Received</h1>
                  </td>
                </tr>
                
                <!-- Appointment Details -->
                <tr>
                  <td style="padding: 32px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; border: 1px solid #d4af37; border-radius: 2px;">
                      <tr>
                        <td style="padding: 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%" style="text-align: center; padding: 12px; border-right: 1px solid #2a2a2a;">
                                <p style="margin: 0 0 8px 0; color: #666666; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Date</p>
                                <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 500;">${date}</p>
                              </td>
                              <td width="50%" style="text-align: center; padding: 12px;">
                                <p style="margin: 0 0 8px 0; color: #666666; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Time</p>
                                <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 500;">${time}</p>
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
                  <td style="padding: 0 40px 32px 40px;">
                    <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Client Information</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Name</td>
                              <td style="color: #ffffff; font-size: 15px; font-weight: 500;">${name}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Email</td>
                              <td><a href="mailto:${email}" style="color: #d4af37; font-size: 15px; text-decoration: none;">${email}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Phone</td>
                              <td><a href="tel:${phone}" style="color: #d4af37; font-size: 15px; text-decoration: none;">${phone}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${
                  message
                    ? `
                <!-- Message -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <p style="margin: 0 0 16px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Client Message</p>
                    <div style="background-color: #0f0f0f; border-left: 2px solid #d4af37; padding: 16px 20px;">
                      <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.7; font-style: italic;">"${message}"</p>
                    </div>
                  </td>
                </tr>
                `
                    : ""
                }
                
                <!-- Action Button -->
                <tr>
                  <td style="padding: 0 40px 40px 40px; text-align: center;">
                    <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%); color: #0f0f0f; padding: 14px 40px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px;">Contact Client</a>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #666666; font-size: 11px; letter-spacing: 1px;">Automated notification from Premier Realty Booking System</p>
              <p style="margin: 0; color: #444444; font-size: 10px;">© ${new Date().getFullYear()} Premier Realty. All rights reserved.</p>
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
<body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
          
          <!-- Logo Header -->
          <tr>
            <td style="padding: 32px 0; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding-right: 12px; vertical-align: middle;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%); border-radius: 4px;"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">Premier</span>
                    <span style="color: #d4af37; font-size: 24px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">Realty</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 2px;">
                
                <!-- Gold Accent Line -->
                <tr>
                  <td style="height: 3px; background: linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%);"></td>
                </tr>
                
                <!-- Success Icon & Header -->
                <tr>
                  <td style="padding: 48px 40px 32px 40px; text-align: center;">
                    <div style="width: 72px; height: 72px; margin: 0 auto 24px auto; border: 2px solid #d4af37; border-radius: 50%; line-height: 68px;">
                      <span style="color: #d4af37; font-size: 32px;">✓</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Consultation Confirmed</p>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Thank You, ${name}</h1>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 60px;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #2a2a2a, transparent);"></div>
                  </td>
                </tr>
                
                <!-- Welcome Message -->
                <tr>
                  <td style="padding: 32px 40px; text-align: center;">
                    <p style="margin: 0; color: #999999; font-size: 15px; line-height: 1.8;">
                      Your exclusive consultation with Premier Realty has been scheduled. We look forward to helping you discover your perfect property.
                    </p>
                  </td>
                </tr>
                
                <!-- Appointment Card -->
                <tr>
                  <td style="padding: 0 40px 32px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; border: 1px solid #d4af37; border-radius: 2px;">
                      <tr>
                        <td style="padding: 32px;">
                          <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Your Appointment</p>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td width="50%" style="text-align: center; padding: 16px; border-right: 1px solid #2a2a2a;">
                                <p style="margin: 0 0 4px 0; color: #666666; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Date</p>
                                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 400;">${date}</p>
                              </td>
                              <td width="50%" style="text-align: center; padding: 16px;">
                                <p style="margin: 0 0 4px 0; color: #666666; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Time</p>
                                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 400;">${time}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- What to Expect -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <p style="margin: 0 0 24px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">What to Expect</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #0f0f0f; border: 1px solid #d4af37; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #d4af37; font-size: 12px; font-weight: 600;">01</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">Confirmation Call</p>
                                <p style="margin: 4px 0 0 0; color: #666666; font-size: 13px;">Our team will contact you within 24 hours</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 1px solid #2a2a2a;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #0f0f0f; border: 1px solid #d4af37; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #d4af37; font-size: 12px; font-weight: 600;">02</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">Personalized Consultation</p>
                                <p style="margin: 4px 0 0 0; color: #666666; font-size: 13px;">Discuss your requirements with our experts</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="width: 48px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #0f0f0f; border: 1px solid #d4af37; border-radius: 50%; text-align: center; line-height: 30px;">
                                  <span style="color: #d4af37; font-size: 12px; font-weight: 600;">03</span>
                                </div>
                              </td>
                              <td style="vertical-align: middle;">
                                <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">Curated Property Selection</p>
                                <p style="margin: 4px 0 0 0; color: #666666; font-size: 13px;">Receive handpicked recommendations</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- CTA Section -->
                <tr>
                  <td style="padding: 0 40px 48px 40px; text-align: center;">
                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #2a2a2a, transparent); margin-bottom: 32px;"></div>
                    <p style="margin: 0 0 4px 0; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Questions before your consultation?</p>
                    <p style="margin: 0; color: #999999; font-size: 14px;">Simply reply to this email and we'll assist you.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 40px 0; text-align: center;">
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #666666; font-size: 11px; text-decoration: none; letter-spacing: 1px;">PROPERTIES</a>
                  </td>
                  <td style="color: #333333;">|</td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #666666; font-size: 11px; text-decoration: none; letter-spacing: 1px;">ABOUT US</a>
                  </td>
                  <td style="color: #333333;">|</td>
                  <td style="padding: 0 12px;">
                    <a href="#" style="color: #666666; font-size: 11px; text-decoration: none; letter-spacing: 1px;">CONTACT</a>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #1a1a1a;">
                <p style="margin: 0 0 8px 0; color: #444444; font-size: 11px; letter-spacing: 1px;">© ${new Date().getFullYear()} Premier Realty</p>
                <p style="margin: 0; color: #333333; font-size: 10px;">Exceptional Properties. Exceptional Service.</p>
              </div>
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
      from: "Premier Realty <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Consultation Request — ${name}`,
      html: getAdminEmailTemplate({ name, email, phone, message, date, time }),
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Premier Realty <onboarding@resend.dev>",
      to: email,
      subject: "Your Consultation is Confirmed — Premier Realty",
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
