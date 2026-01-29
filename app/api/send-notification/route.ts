import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "KA Global <onboarding@resend.dev>";

function getAdminEmailTemplate({
  name,
  email,
  phone,
  message,
  date,
  time,
  budget,
  propertyType,
  investmentType,
  reason,
  referralSource,
  desiredProperties,
}: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  date: string;
  time: string;
  budget?: string;
  propertyType?: string;
  investmentType?: string;
  reason?: string;
  referralSource?: string;
  desiredProperties?: string;
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
              
              <!-- Title Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px 0; color: #d4af37; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">New Consultation Request</p>
                    <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Booking Received</h1>
                  </td>
                </tr>
              </table>
              
              <!-- Appointment Details Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Appointment Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="text-align: center; padding: 16px; border-right: 1px solid #f0eeeb;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Date</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 500;">${date}</p>
                        </td>
                        <td width="50%" style="text-align: center; padding: 16px;">
                          <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Time</p>
                          <p style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 500;">${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Client Information Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Client Information</p>
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

              ${(budget || propertyType || investmentType || reason || referralSource) ? `
              <!-- Property Preferences Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 20px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Property Preferences</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${budget ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Budget</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500;">${budget}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      ${propertyType ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Property Type</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500; text-transform: capitalize;">${propertyType}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      ${investmentType ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Interest</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500; text-transform: capitalize;">${investmentType}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      ${reason ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0eeeb;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Purpose</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500; text-transform: capitalize;">${reason}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                      ${referralSource ? `
                      <tr>
                        <td style="padding: 12px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Found Us Via</td>
                              <td style="color: #1a1a1a; font-size: 15px; font-weight: 500; text-transform: capitalize;">${referralSource}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${desiredProperties ? `
              <!-- Interested Properties Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 16px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Interested Properties</p>
                    <div style="background-color: #faf9f7; border-left: 3px solid #d4af37; padding: 16px 20px;">
                      <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.7;">${desiredProperties}</p>
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${
                message
                  ? `
              <!-- Message Card (White) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
                <tr>
                  <td style="padding: 28px;">
                    <p style="margin: 0 0 16px 0; color: #d4af37; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Client Message</p>
                    <div style="border-left: 3px solid #d4af37; padding: 12px 20px; background-color: #faf9f7;">
                      <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.7; font-style: italic;">"${message}"</p>
                    </div>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }
              
              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding: 8px 0;">
                    <a href="https://kemal-bey-project-real-estate-websi.vercel.app/admin" style="display: inline-block; background-color: #0f0f0f; color: #ffffff; padding: 16px 48px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px;">View in Admin Panel</a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f4f2; padding: 24px; text-align: center; border-top: 1px solid #e8e6e3;">
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 11px; letter-spacing: 1px;">Automated notification from KA Global</p>
              <p style="margin: 0; color: #bbbbbb; font-size: 10px;">© ${new Date().getFullYear()} KA Global. All rights reserved.</p>
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
    const {
      name,
      email,
      phone,
      message,
      date,
      time,
      budget,
      propertyType,
      investmentType,
      reason,
      referralSource,
      desiredProperties,
    } = await request.json();

    // Send notification to admin only
    // Customer will receive email when admin confirms or rejects the reservation
    await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.ADMIN_EMAIL!,
      subject: `New Consultation Request — ${name}`,
      html: getAdminEmailTemplate({
        name,
        email,
        phone,
        message,
        date,
        time,
        budget,
        propertyType,
        investmentType,
        reason,
        referralSource,
        desiredProperties,
      }),
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
