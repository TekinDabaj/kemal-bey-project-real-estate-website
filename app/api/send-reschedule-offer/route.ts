import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getRescheduleOfferEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "KA Global <onboarding@resend.dev>";
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://kemal-bey-project-real-estate-websi.vercel.app";

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      originalDate,
      originalTime,
      newDate,
      newTime,
      reason,
      token,
    } = await request.json();

    if (!name || !email || !newDate || !newTime || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tokenParam = encodeURIComponent(token);
    const confirmUrl = `${BASE_URL}/reschedule?token=${tokenParam}&action=confirm`;
    const declineUrl = `${BASE_URL}/reschedule?token=${tokenParam}&action=decline`;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "A New Appointment Time Has Been Proposed - KA Global",
      html: getRescheduleOfferEmail({
        name,
        originalDate,
        originalTime,
        newDate,
        newTime,
        reason,
        confirmUrl,
        declineUrl,
      }),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Reschedule offer email error:", error);
    return NextResponse.json(
      { error: "Failed to send reschedule offer", details: String(error) },
      { status: 500 }
    );
  }
}
