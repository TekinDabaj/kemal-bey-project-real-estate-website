'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Property } from '@/types/database'
import { Plus, Pencil, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = {
  initialProperties: Property[]
}

export default function PropertiesManager({ initialProperties }: Props) {
  const t = useTranslations('admin.properties')
  const params = useParams()
  const locale = params.locale as string || 'en'
  const [properties, setProperties] = useState(initialProperties)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (!error) {
      setProperties(properties.filter(p => p.id !== id))
    } else {
      alert(t('deleteFailed'))
    }
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    sold: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    rented: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-400'
  }

  const statusLabels = {
    active: t('active'),
    sold: t('sold'),
    rented: t('rented'),
    inactive: t('inactive')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('title')}</h2>
        <Link
          href={`/${locale}/admin/listproperty`}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> {t('addProperty')}
        </Link>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="bg-white dark:bg-[#13102b] rounded-lg p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#2d2a4a]">
          {t('noProperties')}
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property) => (
            <div key={property.id} className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4 flex gap-4">
              {/* Thumbnail */}
              <div className="w-32 h-24 bg-slate-100 dark:bg-[#1a1735] rounded-lg overflow-hidden shrink-0">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={`${bucketUrl}${property.images[0]}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{property.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{property.location || t('noLocation')}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[property.status]}`}>
                      {statusLabels[property.status]}
                    </span>
                    {property.featured && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        {t('featured')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {property.price && (
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      ${property.price.toLocaleString()}
                      {property.type === 'rent' && '/mo'}
                    </span>
                  )}
                  {property.bedrooms && <span>{property.bedrooms} {t('beds')}</span>}
                  {property.bathrooms && <span>{property.bathrooms} {t('baths')}</span>}
                  {property.area && <span>{property.area} m²</span>}
                </div>

                {/* Property Type & Additional Info */}
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {property.property_type && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#1a1735] rounded">
                      {property.property_type}
                    </span>
                  )}
                  {property.amenities && property.amenities.length > 0 && (
                    <span className="text-slate-400 dark:text-slate-500">
                      +{property.amenities.length} amenities
                    </span>
                  )}
                  {property.rooms && property.rooms.length > 0 && (
                    <span className="text-slate-400 dark:text-slate-500">
                      {property.rooms.length} rooms detailed
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/${locale}/properties/${property.id}`}
                  target="_blank"
                  className="p-2 bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2d2a4a] transition"
                  title="View"
                >
                  <ExternalLink size={16} />
                </Link>
                <Link
                  href={`/${locale}/admin/listproperty?edit=${property.id}`}
                  className="p-2 bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2d2a4a] transition"
                  title={t('editProperty')}
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
