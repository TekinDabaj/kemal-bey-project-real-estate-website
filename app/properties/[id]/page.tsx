import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Bath, BedDouble, Expand, MapPin, ArrowLeft, Calendar, Home, Check } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (!property) {
    notFound()
  }

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const statusBadge = {
    active: 'bg-green-500 text-white',
    sold: 'bg-red-500 text-white',
    rented: 'bg-blue-500 text-white',
    inactive: 'bg-slate-500 text-white'
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/properties" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 transition"
          >
            <ArrowLeft size={18} /> Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {property.images && property.images.length > 0 ? (
                <div>
                  {/* Main Image */}
                  <div className="aspect-[16/9] bg-slate-200">
                    <img
                      src={`${bucketUrl}${property.images[0]}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  {property.images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {property.images.map((img: string, index: number) => (
                        <div 
                          key={img} 
                          className={`w-24 h-16 rounded-lg overflow-hidden shrink-0 ${index === 0 ? 'ring-2 ring-amber-500' : ''}`}
                        >
                          <img
                            src={`${bucketUrl}${img}`}
                            alt={`${property.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/9] bg-slate-200 flex items-center justify-center text-slate-400">
                  <Home size={48} />
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {property.type && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                        For {property.type === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    )}
                    {property.status !== 'active' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge[property.status as keyof typeof statusBadge]}`}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    )}
                    {property.featured && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{property.title}</h1>
                  {property.location && (
                    <p className="flex items-center gap-1 text-slate-500 mt-2">
                      <MapPin size={16} /> {property.location}
                    </p>
                  )}
                </div>
                {property.price && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-amber-600">
                      ${property.price.toLocaleString()}
                    </p>
                    {property.type === 'rent' && (
                      <p className="text-slate-500">per month</p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 py-6 border-t border-b border-slate-100">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <BedDouble size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bedrooms</p>
                      <p className="font-semibold text-slate-900">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Bath size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Bathrooms</p>
                      <p className="font-semibold text-slate-900">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Expand size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Area</p>
                      <p className="font-semibold text-slate-900">{property.area} m²</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="pt-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
                  <p className="text-slate-600 whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Interested in this property?</h2>
              <p className="text-slate-600 mb-6">
                Schedule a consultation to learn more about this property and discuss your options.
              </p>
              <Link
                href="/book"
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition"
              >
                <Calendar size={18} /> Book Consultation
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-amber-600 px-6 py-3 rounded-lg font-medium transition mt-3"
              >
                Contact Us
              </Link>
            </div>

            {/* Property Highlights */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Property Highlights</h2>
              <ul className="space-y-3">
                {[
                  property.type === 'sale' ? 'Available for purchase' : 'Available for rent',
                  property.bedrooms && `${property.bedrooms} spacious bedrooms`,
                  property.bathrooms && `${property.bathrooms} modern bathrooms`,
                  property.area && `${property.area} m² living space`,
                  property.location && `Located in ${property.location}`,
                ].filter(Boolean).map((highlight, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600">
                    <Check size={16} className="text-green-500 shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}