'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, addDays, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday } from 'date-fns'
import { Calendar, Clock, CheckCircle } from 'lucide-react'

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
]

function isWorkingDay(date: Date) {
  return isMonday(date) || isTuesday(date) || isWednesday(date) || 
         isThursday(date) || isFriday(date) || isSaturday(date)
}

function getNext30Days() {
  const days = []
  let current = new Date()
  
  for (let i = 0; i < 45 && days.length < 30; i++) {
    const date = addDays(current, i)
    if (isWorkingDay(date)) {
      days.push(date)
    }
  }
  return days
}

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const supabase = createClient()
  const availableDays = getNext30Days()

  async function handleDateSelect(date: Date) {
    setSelectedDate(date)
    setSelectedTime(null)
    
    // Fetch already booked slots for this date
    const { data } = await supabase
      .from('reservations')
      .select('time')
      .eq('date', format(date, 'yyyy-MM-dd'))
      .neq('status', 'cancelled')
    
    setBookedSlots(data?.map(r => r.time.slice(0, 5)) || [])
    setStep(2)
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time)
    setStep(3)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
  
    setLoading(true)
  
    const { error } = await supabase.from('reservations').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || null,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime
    })
  
    if (error) {
      alert('Something went wrong. Please try again.')
      console.error(error)
      setLoading(false)
      return
    }
  
    // Send email notifications
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        date: format(selectedDate, 'EEEE, MMMM d, yyyy'),
        time: selectedTime
      })
    })
  
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-4">
            Your consultation is scheduled for<br />
            <strong>{format(selectedDate!, 'EEEE, MMMM d, yyyy')}</strong> at <strong>{selectedTime}</strong>
          </p>
          <p className="text-slate-500 text-sm">We'll send a confirmation to {formData.email}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Book a Consultation</h1>
        <p className="text-slate-600 text-center mb-8">Select a date and time that works for you</p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${step >= s ? 'bg-amber-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        {/* Step 1: Select Date */}
        {step >= 1 && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <Calendar size={20} className="text-amber-500" />
              Select Date
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {availableDays.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateSelect(date)}
                  className={`p-3 rounded-lg text-center border transition ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedDate?.toDateString() === date.toDateString() 
                      ? <span className="text-amber-100">{format(date, 'EEE')}</span>
                      : format(date, 'EEE')}
                  </div>
                  <div className="font-semibold">{format(date, 'd')}</div>
                  <div className="text-xs">{format(date, 'MMM')}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step >= 2 && selectedDate && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <Clock size={20} className="text-amber-500" />
              Select Time
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {timeSlots.map((time) => {
                const isBooked = bookedSlots.includes(time)
                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && handleTimeSelect(time)}
                    disabled={isBooked}
                    className={`p-3 rounded-lg text-center border transition ${
                      isBooked
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : selectedTime === time
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step >= 3 && selectedTime && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message (optional)</label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Anything you'd like us to know..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}