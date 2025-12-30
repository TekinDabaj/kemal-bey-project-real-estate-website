export type Reservation = {
    id: string
    name: string
    email: string
    phone: string
    message: string | null
    date: string
    time: string
    status: 'pending' | 'confirmed' | 'cancelled'
    created_at: string
  }
  
  export type SiteContent = {
    id: string
    content: Record<string, any>
    updated_at: string
  }
  
  export type AdminUser = {
    id: string
    email: string
    created_at: string
  }