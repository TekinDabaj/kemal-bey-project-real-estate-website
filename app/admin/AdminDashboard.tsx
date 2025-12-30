'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { LogOut, Calendar, Clock, User, Mail, Phone, MessageSquare, Check, X, Trash2, CalendarDays, Image, Building2 } from 'lucide-react'
import { Reservation, Property } from '@/types/database'
import ContentEditor from './ContentEditor'
import PropertiesManager from './PropertiesManager'

type Props = {
  reservations: Reservation[]
  images: {
    homepage: string[]
  }
  properties: Property[]
}

export default function AdminDashboard({ reservations: initialReservations, images, properties }: Props) {
  const [reservations, setReservations] = useState(initialReservations)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [activeTab, setActiveTab] = useState<'reservations' | 'properties' | 'content'>('reservations')
  const router = useRouter()
  const supabase = createClient()

  const filtered = reservations.filter(r => filter === 'all' || r.status === filter)

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
    if (!confirm('Are you sure you want to delete this reservation?')) return

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <LogOut size={18} /> Logout
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
              <CalendarDays size={18} /> Reservations
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
                activeTab === 'properties'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Building2 size={18} /> Properties
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition ${
                activeTab === 'content'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Image size={18} /> Images
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
                { label: 'Total', count: reservations.length, color: 'bg-slate-500' },
                { label: 'Pending', count: reservations.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
                { label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length, color: 'bg-green-500' },
                { label: 'Cancelled', count: reservations.filter(r => r.status === 'cancelled').length, color: 'bg-red-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className={`text-2xl font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.count}</div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition ${
                    filter === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center text-slate-500 border border-slate-200">
                  No reservations found
                </div>
              ) : (
                filtered.map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}>
                            {reservation.status}
                          </span>
                          <span className="text-slate-400 text-sm">
                            Booked {format(new Date(reservation.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-900">
                          <User size={16} className="text-slate-400" />
                          <span className="font-medium">{reservation.name}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-amber-500" />
                            {format(new Date(reservation.date), 'EEE, MMM d, yyyy')}
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
                              title="Confirm"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(reservation.id, 'cancelled')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                          title="Delete"
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
          <ContentEditor initialImages={images} />
        )}
      </div>
    </div>
  )
}