import { createClient } from '@/lib/supabase/server'
import { Bath, BedDouble, Expand, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function PropertiesPage() {
  const t = await getTranslations('properties')
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

  const statusLabels = {
    sold: t('sold'),
    rented: t('rented')
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!properties || properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">{t('noProperties')}</p>
              <Link
                href="/contact"
                className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                {t('contactForListings')}
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group border border-slate-100"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-slate-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={`${bucketUrl}${property.images[0]}`}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        {t('noImage')}
                      </div>
                    )}

                    {/* Status Badge */}
                    {property.status !== 'active' && (
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium ${statusBadge[property.status as keyof typeof statusBadge]}`}>
                        {statusLabels[property.status as keyof typeof statusLabels]}
                      </div>
                    )}

                    {/* Type Badge */}
                    {property.type && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-slate-900">
                        {property.type === 'sale' ? t('forSale') : t('forRent')}
                      </div>
                    )}

                    {/* Price Overlay */}
                    {property.price && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                        <p className="text-lg font-bold text-white">
                          ${property.price.toLocaleString()}
                          {property.type === 'rent' && <span className="text-sm font-normal text-white/80">{t('perMonth')}</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-amber-600 transition line-clamp-1">{property.title}</h3>

                    {property.location && (
                      <p className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                        <MapPin size={12} /> {property.location}
                      </p>
                    )}

                    {/* Description */}
                    {property.description && (
                      <p className="text-slate-600 text-xs line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}

                    {/* Features */}
                    <div className="flex gap-3 text-slate-500 text-xs border-t border-slate-100 pt-3">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={14} className="text-slate-400" /> {property.bedrooms} {t('beds')}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath size={14} className="text-slate-400" /> {property.bathrooms} {t('baths')}
                        </span>
                      )}
                      {property.area && (
                        <span className="flex items-center gap-1">
                          <Expand size={14} className="text-slate-400" /> {property.area} m²
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">{t('interestedTitle')}</h2>
          <p className="text-slate-600 text-sm mb-5">{t('interestedDescription')}</p>
          <Link
            href="/book"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            {t('bookConsultation')}
          </Link>
        </div>
      </section>
    </div>
  )
}
