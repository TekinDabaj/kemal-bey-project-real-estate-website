import { createClient } from '@/lib/supabase/server'
import { Bath, BedDouble, Expand, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { FilterProvider } from '@/components/properties/FilterContext'
import PropertyFilters from '@/components/properties/PropertyFilters'
import PropertiesGridWrapper from '@/components/properties/PropertiesGridWrapper'
import Pagination from '@/components/properties/Pagination'
import { PropertySkeletonGrid, FiltersSkeleton } from '@/components/properties/PropertySkeleton'

const ITEMS_PER_PAGE = 20

interface SearchParams {
  page?: string
  type?: string
  propertyType?: string
  minPrice?: string
  maxPrice?: string
  minArea?: string
  maxArea?: string
  bedrooms?: string
  bathrooms?: string
  minYear?: string
  maxYear?: string
  furnished?: string
  amenities?: string
}

interface PropertiesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const t = await getTranslations('properties')
  const params = await searchParams

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero */}
      <section className="relative text-white py-30 pt-40 md:pt-54 pb-28">
        <div className="absolute inset-0 z-0">
          <img
            src="/cityskyline.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70 dark:bg-[#0c0a1d]/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <FilterProvider>
        {/* Filters */}
        <section className="py-6 bg-slate-50 dark:bg-[#0c0a1d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<FiltersSkeleton />}>
              <PropertyFilters />
            </Suspense>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="pb-12 bg-slate-50 dark:bg-[#0c0a1d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PropertiesGridWrapper>
              <Suspense fallback={<PropertySkeletonGrid count={6} />}>
                <PropertiesGrid searchParams={params} />
              </Suspense>
            </PropertiesGridWrapper>
          </div>
        </section>
      </FilterProvider>

      {/* CTA */}
      <section className="py-12 bg-white dark:bg-[#13102b] dark:border-t dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('interestedTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">{t('interestedDescription')}</p>
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

async function PropertiesGrid({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('properties')
  const supabase = await createClient()

  // Parse pagination
  const currentPage = Math.max(1, parseInt(searchParams.page || '1', 10))
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Build base query for counting
  let countQuery = supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .in('status', ['active', 'sold', 'rented'])

  // Build data query
  let query = supabase
    .from('properties')
    .select('*')
    .in('status', ['active', 'sold', 'rented'])

  // Apply filters to both queries
  const applyFilters = (q: typeof query) => {
    // Sale type filter
    if (searchParams.type) {
      q = q.eq('type', searchParams.type)
    }

    // Property type filter
    if (searchParams.propertyType) {
      q = q.eq('property_type', searchParams.propertyType)
    }

    // Price range filters
    if (searchParams.minPrice) {
      q = q.gte('price', parseInt(searchParams.minPrice, 10))
    }
    if (searchParams.maxPrice) {
      q = q.lte('price', parseInt(searchParams.maxPrice, 10))
    }

    // Area range filters
    if (searchParams.minArea) {
      q = q.gte('area', parseInt(searchParams.minArea, 10))
    }
    if (searchParams.maxArea) {
      q = q.lte('area', parseInt(searchParams.maxArea, 10))
    }

    // Bedrooms filter (minimum)
    if (searchParams.bedrooms) {
      q = q.gte('bedrooms', parseInt(searchParams.bedrooms, 10))
    }

    // Bathrooms filter (minimum)
    if (searchParams.bathrooms) {
      q = q.gte('bathrooms', parseInt(searchParams.bathrooms, 10))
    }

    // Year built range filters
    if (searchParams.minYear) {
      q = q.gte('year_built', parseInt(searchParams.minYear, 10))
    }
    if (searchParams.maxYear) {
      q = q.lte('year_built', parseInt(searchParams.maxYear, 10))
    }

    // Furnished filter
    if (searchParams.furnished === 'true') {
      q = q.eq('furnished', true)
    } else if (searchParams.furnished === 'false') {
      q = q.eq('furnished', false)
    }

    // Amenities filter
    if (searchParams.amenities) {
      const amenitiesList = searchParams.amenities.split(',').filter(Boolean)
      if (amenitiesList.length > 0) {
        q = q.contains('amenities', amenitiesList)
      }
    }

    return q
  }

  // Apply filters
  countQuery = applyFilters(countQuery)
  query = applyFilters(query)

  // Get total count
  const { count: totalCount } = await countQuery

  // Get paginated data
  const { data: properties } = await query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  const totalItems = totalCount || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

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

  // Check if any filters are active
  const hasFilters = Object.entries(searchParams).some(([key, value]) => key !== 'page' && value)

  return (
    <>
      {/* Results count */}
      {totalItems > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {t('resultsFound', { count: totalItems })}
        </p>
      )}

      {!properties || properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            {hasFilters ? t('noResultsWithFilters') : t('noProperties')}
          </p>
          {hasFilters ? (
            <Link
              href="/properties"
              className="inline-block mt-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium text-sm"
            >
              {t('clearFilters')}
            </Link>
          ) : (
            <Link
              href="/contact"
              className="inline-block mt-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium text-sm"
            >
              {t('contactForListings')}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-purple-900/20 transition group border border-slate-100 dark:border-[#2d2a4a]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={`${bucketUrl}${property.images[0]}`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-sm">
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
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">{property.title}</h3>

                  {property.location && (
                    <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
                      <MapPin size={12} /> {property.location}
                    </p>
                  )}

                  {/* Description */}
                  {property.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-3">
                      {property.description}
                    </p>
                  )}

                  {/* Features */}
                  <div className="flex gap-3 text-slate-500 dark:text-slate-400 text-xs border-t border-slate-100 dark:border-[#2d2a4a] pt-3">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble size={14} className="text-slate-400 dark:text-slate-500" /> {property.bedrooms} {t('beds')}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath size={14} className="text-slate-400 dark:text-slate-500" /> {property.bathrooms} {t('baths')}
                      </span>
                    )}
                    {property.area && (
                      <span className="flex items-center gap-1">
                        <Expand size={14} className="text-slate-400 dark:text-slate-500" /> {property.area} m²
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </>
  )
}
