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

export type RoomSpec = {
  name: string
  area: number
}

export type Property = {
  id: string
  title: string
  description: string | null
  price: number | null
  location: string | null
  latitude: number | null
  longitude: number | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  type: 'sale' | 'rent' | null
  status: 'active' | 'sold' | 'rented' | 'inactive'
  featured: boolean
  images: string[]
  floor_plans: string[] | null
  rooms: RoomSpec[] | null
  amenities: string[] | null
  year_built: number | null
  parking_spaces: number | null
  heating_type: string | null
  cooling_type: string | null
  property_type: string | null
  floor_number: number | null
  total_floors: number | null
  furnished: boolean | null
  created_at: string
  updated_at: string
}

export type HeroSlide = {
  id: string
  image: string
  title: string
  highlight: string | null
  subtitle: string | null
  sort_order: number
  active: boolean
  created_at: string
}