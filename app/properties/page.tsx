import { createClient } from '@/lib/supabase/server'
import { Bath, BedDouble, Expand, MapPin } from 'lucide-react'
import Link from 'next/link'

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .in('status', ['active', 'sold', 'rented'])
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const statusBadge = {
    active: '',
    sold: 'bg-red-500 text-white',
    rented: 'bg-blue-500 text-white'
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Properties</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Browse our selection of properties for sale and rent
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!properties || properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No properties available at the moment.</p>
              <Link
                href="/contact"
                className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium"
              >
                Contact us for upcoming listings
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-slate-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={`${bucketUrl}${property.images[0]}`}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No image
                      </div>
                    )}

                    {/* Status Badge */}
                    {property.status !== 'active' && (
                      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium ${statusBadge[property.status as keyof typeof statusBadge]}`}>
                        {property.status === 'sold' ? 'Sold' : 'Rented'}
                      </div>
                    )}

                    {/* Type Badge */}
                    {property.type && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium bg-amber-500 text-slate-900">
                        For {property.type === 'sale' ? 'Sale' : 'Rent'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition">{property.title}</h3>

                    {property.location && (
                      <p className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                        <MapPin size={14} /> {property.location}
                      </p>
                    )}

                    {property.price && (
                      <p className="text-2xl font-bold text-amber-600 mb-4">
                        ${property.price.toLocaleString()}
                        {property.type === 'rent' && <span className="text-base font-normal text-slate-500">/mo</span>}
                      </p>
                    )}

                    {/* Features */}
                    <div className="flex gap-4 text-slate-600 text-sm border-t border-slate-100 pt-4">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={16} /> {property.bedrooms} Beds
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath size={16} /> {property.bathrooms} Baths
                        </span>
                      )}
                      {property.area && (
                        <span className="flex items-center gap-1">
                          <Expand size={16} /> {property.area} m²
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Interested in a Property?</h2>
          <p className="text-slate-600 mb-6">Book a consultation to discuss your options.</p>
          <Link
            href="/book"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}