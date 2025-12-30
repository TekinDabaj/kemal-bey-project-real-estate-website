import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }

  // Check if admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    redirect('/admin/login')
  }

  // Fetch reservations
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

  // Fetch images from storage
  const { data: imageFiles } = await supabase.storage
    .from('images')
    .list()

  const images = imageFiles?.map(f => f.name) || []

  return <AdminDashboard reservations={reservations || []} images={images} />
}