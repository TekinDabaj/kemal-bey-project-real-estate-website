import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, phone, message, date, time } = await request.json()

    // Send notification to admin
    await resend.emails.send({
      from: 'Reservations <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Booking: ${name} on ${date}`,
      html: `
        <h2>New Consultation Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `
    })

    // Send confirmation to customer
    await resend.emails.send({
      from: 'Premier Realty <onboarding@resend.dev>',
      to: email,
      subject: 'Your Consultation Booking Confirmation',
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Thank you for booking a consultation with us.</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p>We'll be in touch shortly to confirm your appointment.</p>
        <br>
        <p>Best regards,<br>Premier Realty</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}