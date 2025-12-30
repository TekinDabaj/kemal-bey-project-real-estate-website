'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns'
import { enGB, tr, ms, id, es, pt, de, fr, it, zhCN, ja, hi } from 'date-fns/locale'
import { LogOut, Calendar, Clock, User, Mail, Phone, MessageSquare, Check, X, Trash2, CalendarDays, Image, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reservation, Property, HeroSlide } from '@/types/database'
import ContentEditor from './ContentEditor'
import PropertiesManager from './PropertiesManager'
import { useTranslations } from 'next-intl'

type DateFnsLocale = typeof enGB
const dateFnsLocales: Record<string, DateFnsLocale> = { en: enGB, tr, ms, id, es, pt, de, fr, it, zh: zhCN, ja, hi }

type Props = {
  reservations: Reservation[]
  properties: Property[]
  heroSlides: HeroSlide[]
}

export default function AdminDashboard({ reservations: initialReservations, properties, heroSlides }: Props) {
  const t = useTranslations('admin')
  const params = useParams()
  const locale = (params.locale as string) || 'en'
  const dateLocale = dateFnsLocales[locale] || enGB

  const [reservations, setReservations] = useState(initialReservations)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [activeTab, setActiveTab] = useState<'reservations' | 'properties' | 'content'>('reservations')
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const router = useRouter()
  const supabase = createClient()

  const filtered = reservations.filter(r => filter === 'all' || r.status === filter)

  // Calendar helpers
  const monthStart = startOfMonth(calendarMonth)
  const monthEnd = endOfMonth(calendarMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  // Get reservations for a specific day
  const getReservationsForDay = (day: Date) => {
    return reservations.filter(r => isSameDay(new Date(r.date), day))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setReservations(reservations.map(r =>
        r.id === id ? { ...r, status } : r
      ))
    }
  }

  async function deleteReservation(id: string) {
    if (!confirm(t('reservations.confirmDelete'))) return

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)

    if (!error) {
      setReservations(reservations.filter(r => r.id !== id))
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: t('reservations.stats.pending'),
    confirmed: t('reservations.stats.confirmed'),
    cancelled: t('reservations.stats.cancelled')
  }

  const filterLabels = {
    all: t('reservations.filter.all'),
    pending: t('reservations.filter.pending'),
    confirmed: t('reservations.filter.confirmed'),
    cancelled: t('reservations.filter.cancelled')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">{t('title')}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <LogOut size={18} /> {t('logout')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
                activeTab === 'reservations'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <CalendarDays size={18} /> {t('tabs.reservations')}
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
                activeTab === 'properties'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 size={18} /> {t('tabs.properties')}
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
                activeTab === 'content'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Image size={18} /> {t('tabs.content')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'reservations' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: t('reservations.stats.total'), count: reservations.length, color: 'bg-slate-500' },
                { label: t('reservations.stats.pending'), count: reservations.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
                { label: t('reservations.stats.confirmed'), count: reservations.filter(r => r.status === 'confirmed').length, color: 'bg-green-500' },
                { label: t('reservations.stats.cancelled'), count: reservations.filter(r => r.status === 'cancelled').length, color: 'bg-red-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className={`text-2xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.count}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900">{t('reservations.calendar.title')}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
                    className="p-1.5 hover:bg-slate-100 rounded transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-medium text-slate-700 min-w-[120px] text-center text-sm">
                    {format(calendarMonth, 'MMMM yyyy', { locale: dateLocale })}
                  </span>
                  <button
                    onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
                    className="p-1.5 hover:bg-slate-100 rounded transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(new Date())}
                    className="ml-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
                  >
                    {t('reservations.calendar.today')}
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
                {/* Day Headers */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="bg-slate-50 text-center text-xs font-medium text-slate-500 py-1.5">
                    {format(new Date(2024, 0, i + 7), 'EEE', { locale: dateLocale })}
                  </div>
                ))}

                {/* Empty cells before first day */}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white min-h-[60px]" />
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day) => {
                  const dayReservations = getReservationsForDay(day)
                  const hasReservations = dayReservations.length > 0

                  return (
                    <div
                      key={day.toISOString()}
                      className={`bg-white min-h-[60px] p-1 ${
                        isToday(day) ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`text-xs font-medium mb-0.5 ${
                          isToday(day) ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {format(day, 'd')}
                        </span>
                        {hasReservations && (
                          <div className="flex-1 space-y-0.5 overflow-hidden">
                            {dayReservations.slice(0, 2).map((reservation) => (
                              <div
                                key={reservation.id}
                                className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${
                                  reservation.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : reservation.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                                title={`${reservation.name} - ${reservation.time.slice(0, 5)}`}
                              >
                                {reservation.time.slice(0, 5)} {reservation.name.split(' ')[0]}
                              </div>
                            ))}
                            {dayReservations.length > 2 && (
                              <div className="text-[10px] text-slate-500 px-1">
                                +{dayReservations.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filter === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center text-slate-500 border border-slate-200">
                  {t('reservations.noReservations')}
                </div>
              ) : (
                filtered.map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                            {statusLabels[reservation.status]}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {t('reservations.booked')} {format(new Date(reservation.created_at), 'MMM d, yyyy', { locale: dateLocale })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-900">
                          <User size={16} className="text-slate-400" />
                          <span className="font-medium">{reservation.name}</span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-amber-500" />
                            {format(new Date(reservation.date), 'EEE, MMM d, yyyy', { locale: dateLocale })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-amber-500" />
                            {reservation.time.slice(0, 5)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Mail size={14} /> {reservation.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} /> {reservation.phone}
                          </span>
                        </div>

                        {reservation.message && (
                          <div className="flex items-start gap-1 text-sm text-slate-600 mt-2">
                            <MessageSquare size={14} className="mt-0.5 shrink-0" />
                            <span>{reservation.message}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(reservation.id, 'confirmed')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                              title={t('reservations.actions.confirm')}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(reservation.id, 'cancelled')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title={t('reservations.actions.cancel')}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                          title={t('reservations.actions.delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'properties' && (
          <PropertiesManager initialProperties={properties} />
        )}

        {activeTab === 'content' && (
          <ContentEditor initialHeroSlides={heroSlides} />
        )}
      </div>
    </div>
  )
}