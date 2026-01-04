import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

// Create Supabase client with service role for server-side access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    // Fetch today's appointments (pending or confirmed only)
    const { data: appointments, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', today)
      .in('status', ['pending', 'confirmed'])
      .order('time', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
    }

    // No appointments today, no email needed
    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: 'No appointments today', sent: false })
    }

    // Build appointments list HTML
    const appointmentsHtml = appointments.map((apt) => `
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid ${apt.status === 'confirmed' ? '#22c55e' : '#eab308'};">
        <p style="margin: 0 0 8px 0;"><strong style="color: #1e293b;">${apt.name}</strong></p>
        <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">
          <span style="margin-right: 16px;">🕐 ${apt.time.slice(0, 5)}</span>
          <span style="padding: 2px 8px; border-radius: 4px; font-size: 12px; background-color: ${apt.status === 'confirmed' ? '#dcfce7' : '#fef9c3'}; color: ${apt.status === 'confirmed' ? '#166534' : '#854d0e'};">
            ${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
          </span>
        </p>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">📧 ${apt.email} | 📞 ${apt.phone}</p>
        ${apt.message ? `<p style="margin: 8px 0 0 0; color: #475569; font-size: 14px; font-style: italic;">"${apt.message}"</p>` : ''}
      </div>
    `).join('')

    // Format today's date for display
    const displayDate = new Date(today).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Send reminder email to admin
    await resend.emails.send({
      from: 'Reservations <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `📅 You have ${appointments.length} appointment${appointments.length > 1 ? 's' : ''} today`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b; margin-bottom: 8px;">Daily Appointment Reminder</h2>
          <p style="color: #64748b; margin-top: 0;">${displayDate}</p>

          <p style="color: #334155;">You have <strong>${appointments.length} appointment${appointments.length > 1 ? 's' : ''}</strong> scheduled for today:</p>

          ${appointmentsHtml}

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

          <p style="color: #64748b; font-size: 14px;">
            View all reservations in your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="color: #f59e0b;">admin dashboard</a>.
          </p>
        </div>
      `
    })

    return NextResponse.json({
      message: `Reminder sent for ${appointments.length} appointment(s)`,
      sent: true,
      count: appointments.length
    })
  } catch (error) {
    console.error('Daily reminder error:', error)
    return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 })
  }
}
