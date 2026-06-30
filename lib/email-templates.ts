// Shared, email-client-safe HTML templates for the reschedule flow.
//
// Buttons use a solid `bgcolor` attribute on the <td> (not a CSS gradient),
// because Outlook and several webmail clients drop CSS gradients, which made
// white button text render on a white background (the "invisible button" bug).

const GOLD = "#d4af37";
const INK = "#0f0f0f";
const PAGE_BG = "#faf9f7";

/** A bulletproof, solid-colour CTA button that renders in all major clients. */
export function emailButton(
  href: string,
  label: string,
  bg: string = INK,
  color: string = "#ffffff"
): string {
  return `
  <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 0 auto;">
    <tr>
      <td align="center" bgcolor="${bg}" style="background-color: ${bg}; border-radius: 6px;">
        <a href="${href}" target="_blank" style="display: inline-block; padding: 15px 38px; font-size: 14px; font-weight: 600; color: ${color}; text-decoration: none; letter-spacing: 1px; border-radius: 6px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

/** Wraps body content in the shared KA Global branded shell (header + footer). */
function emailLayout(innerHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: ${PAGE_BG}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: ${PAGE_BG};">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="background-color: ${INK}; padding: 40px; text-align: center;">
              <span style="color: #ffffff; font-size: 26px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">KA</span>
              <span style="color: ${GOLD}; font-size: 26px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase;">Global</span>
              <p style="margin: 16px 0 0 0; color: #666666; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Exceptional Properties. Exceptional Service.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: ${PAGE_BG}; padding: 40px 24px;">
              ${innerHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f4f2; padding: 28px 24px; text-align: center; border-top: 1px solid #e8e6e3;">
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

/** Card showing the original (struck through) and the newly proposed date/time. */
function beforeAfterCard(
  originalDate: string,
  originalTime: string,
  newDate: string,
  newTime: string
): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <tr>
      <td style="padding: 28px;">
        <p style="margin: 0 0 8px 0; color: #999999; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Original Request</p>
        <p style="margin: 0 0 20px 0; text-align: center; color: #1a1a1a; font-size: 15px; text-decoration: line-through; opacity: 0.55;">${originalDate} &nbsp;&middot;&nbsp; ${originalTime}</p>
        <p style="margin: 0 0 12px 0; text-align: center; color: ${GOLD}; font-size: 20px;">&#8595;</p>
        <p style="margin: 0 0 8px 0; color: ${GOLD}; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">Proposed New Time</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="50%" style="text-align: center; padding: 12px; border-right: 1px solid #f0eeeb;">
              <p style="margin: 0 0 6px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Date</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 17px; font-weight: 600;">${newDate}</p>
            </td>
            <td width="50%" style="text-align: center; padding: 12px;">
              <p style="margin: 0 0 6px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Time</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 17px; font-weight: 600;">${newTime}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

/** Simple two-column date/time card. */
function dateTimeCard(label: string, date: string, time: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <tr>
      <td style="padding: 28px;">
        <p style="margin: 0 0 20px 0; color: ${GOLD}; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; text-align: center;">${label}</p>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td width="50%" style="text-align: center; padding: 12px; border-right: 1px solid #f0eeeb;">
              <p style="margin: 0 0 6px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Date</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 17px; font-weight: 600;">${date}</p>
            </td>
            <td width="50%" style="text-align: center; padding: 12px;">
              <p style="margin: 0 0 6px 0; color: #999999; font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Time</p>
              <p style="margin: 0; color: #1a1a1a; font-size: 17px; font-weight: 600;">${time}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function reasonCard(reason: string): string {
  if (!reason) return "";
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border: 1px solid #e8e6e3; border-radius: 4px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
    <tr>
      <td style="padding: 24px;">
        <p style="margin: 0 0 12px 0; color: ${GOLD}; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Note from our team</p>
        <div style="border-left: 3px solid ${GOLD}; padding: 12px 18px; background-color: ${PAGE_BG};">
          <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.7;">${reason}</p>
        </div>
      </td>
    </tr>
  </table>`;
}

function heading(eyebrow: string, eyebrowColor: string, title: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 28px;">
    <tr>
      <td style="text-align: center;">
        <p style="margin: 0 0 8px 0; color: ${eyebrowColor}; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">${eyebrow}</p>
        <h1 style="margin: 0; color: #1a1a1a; font-size: 26px; font-weight: 300; letter-spacing: 1px;">${title}</h1>
      </td>
    </tr>
  </table>`;
}

function paragraph(text: string): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 28px;">
    <tr>
      <td style="text-align: center;">
        <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.8;">${text}</p>
      </td>
    </tr>
  </table>`;
}

const ADMIN_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ||
    "https://kemal-bey-project-real-estate-websi.vercel.app") + "/admin";

// ---------------------------------------------------------------------------
// Client-facing: proposed reschedule with confirm / decline buttons
// ---------------------------------------------------------------------------
export function getRescheduleOfferEmail({
  name,
  originalDate,
  originalTime,
  newDate,
  newTime,
  reason,
  confirmUrl,
  declineUrl,
}: {
  name: string;
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  reason?: string;
  confirmUrl: string;
  declineUrl: string;
}): string {
  return emailLayout(`
    ${heading("Reschedule Request", GOLD, `Hello, ${name}`)}
    ${paragraph(
      "Your original appointment time is no longer available, but we'd like to keep your consultation. Please review the new time we've proposed below and let us know if it works for you."
    )}
    ${beforeAfterCard(originalDate, originalTime, newDate, newTime)}
    ${reasonCard(reason || "")}

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 16px;">
      <tr><td style="text-align: center; padding-bottom: 14px;">
        ${emailButton(confirmUrl, "Confirm New Time", "#22c55e")}
      </td></tr>
      <tr><td style="text-align: center;">
        ${emailButton(declineUrl, "Decline", "#6b7280")}
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="text-align: center; padding: 12px 0;">
          <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.7;">
            The buttons above open a secure page where you can confirm your choice.<br>
            Have a question? Simply reply to this email.
          </p>
        </td>
      </tr>
    </table>
  `);
}

// ---------------------------------------------------------------------------
// Client-facing: their rescheduled appointment is now confirmed
// ---------------------------------------------------------------------------
export function getRescheduleConfirmedClientEmail({
  name,
  date,
  time,
  meetLink,
}: {
  name: string;
  date: string;
  time: string;
  meetLink?: string;
}): string {
  const meetSection = meetLink
    ? `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border: 2px solid #1a73e8; border-radius: 4px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 28px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #1a73e8; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Video Conference</p>
          <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 20px; font-weight: 500;">Join via Google Meet</h2>
          <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">Click below to join the video call at your scheduled time.</p>
          ${emailButton(meetLink, "Join Meeting", "#1a73e8")}
          <p style="margin: 18px 0 0 0; color: #999999; font-size: 12px;">Or copy this link: <a href="${meetLink}" style="color: #1a73e8; text-decoration: none; word-break: break-all;">${meetLink}</a></p>
        </td>
      </tr>
    </table>`
    : "";

  return emailLayout(`
    ${heading("Appointment Confirmed", "#22c55e", `Great News, ${name}!`)}
    ${paragraph(
      "Thank you for confirming. Your consultation has been <strong style=\"color:#22c55e;\">rescheduled and confirmed</strong> for the new time below."
    )}
    ${dateTimeCard("Your Confirmed Appointment", date, time)}
    ${meetSection}
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="text-align: center; padding: 8px 0;">
          <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Need to make a change?</p>
          <p style="margin: 0; color: #666666; font-size: 14px;">Simply reply to this email and we'll help you out.</p>
        </td>
      </tr>
    </table>
  `);
}

// ---------------------------------------------------------------------------
// Admin-facing: client accepted the proposed reschedule
// ---------------------------------------------------------------------------
export function getRescheduleAcceptedAdminEmail({
  name,
  email,
  date,
  time,
}: {
  name: string;
  email: string;
  date: string;
  time: string;
}): string {
  return emailLayout(`
    ${heading("Reschedule Accepted", "#22c55e", "Client Confirmed the New Time")}
    ${paragraph(
      `<strong>${name}</strong> (${email}) accepted the proposed reschedule. The appointment is now confirmed and a Google Meet invite has been sent.`
    )}
    ${dateTimeCard("Confirmed Appointment", date, time)}
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr><td style="text-align: center; padding: 8px 0;">
        ${emailButton(ADMIN_URL, "View in Admin Panel", INK)}
      </td></tr>
    </table>
  `);
}

// ---------------------------------------------------------------------------
// Admin-facing: client declined the proposed reschedule
// ---------------------------------------------------------------------------
export function getRescheduleDeclinedAdminEmail({
  name,
  email,
  originalDate,
  originalTime,
  proposedDate,
  proposedTime,
  retained,
}: {
  name: string;
  email: string;
  originalDate: string;
  originalTime: string;
  proposedDate: string;
  proposedTime: string;
  retained?: boolean;
}): string {
  const outcome = retained
    ? "declined the proposed new time, so their original confirmed appointment still stands. You may wish to follow up directly."
    : "declined the proposed reschedule, so the reservation has been cancelled. You may wish to follow up directly.";
  return emailLayout(`
    ${heading("Reschedule Declined", "#ef4444", "Client Declined the New Time")}
    ${paragraph(`<strong>${name}</strong> (${email}) ${outcome}`)}
    ${beforeAfterCard(originalDate, originalTime, proposedDate, proposedTime)}
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr><td style="text-align: center; padding: 8px 0;">
        ${emailButton(ADMIN_URL, "View in Admin Panel", INK)}
      </td></tr>
    </table>
  `);
}
