import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Bath, BedDouble, Expand, MapPin, ArrowLeft, Calendar, Car, Home,
  Building2, Layers, Flame, Snowflake, Sofa, Clock, Check, Image as ImageIcon,
  Waves, Dumbbell, TreeDeciduous, Shield, Phone, Sparkles, Mountain, Building, Zap, Sun
} from 'lucide-react'
import ImageGallery from '@/components/property/ImageGallery'

type Props = {
  params: Promise<{ id: string; locale: string }>
}

type RoomSpec = {
  name: string
  area: number
}

const amenityIcons: Record<string, React.ElementType> = {
  pool: Waves,
  gym: Dumbbell,
  sauna: Flame,
  garden: TreeDeciduous,
  elevator: Building2,
  security: Shield,
  concierge: Phone,
  parking: Car,
  balcony: Layers,
  terrace: Layers,
  fireplace: Flame,
  airConditioning: Snowflake,
  heating: Flame,
  laundry: Home,
  storage: Home,
  petFriendly: Sparkles,
  seaView: Waves,
  cityView: Building,
  mountainView: Mountain,
  smartHome: Zap,
  solarPanels: Sun,
  generator: Zap
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id, locale } = await params
  const supabase = await createClient()
  const t = await getTranslations('propertyDetail')
  const tAdmin = await getTranslations('admin.listProperty')

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (!property) {
    notFound()
  }

  // Fetch random related properties (max 6, excluding current property)
  const { data: relatedProperties } = await supabase
    .from('properties')
    .select('id, title, location, price, type, images, bedrooms, bathrooms, area, status')
    .neq('id', id)
    .in('status', ['active', 'sold', 'rented'])
    .limit(20)

  // Shuffle and take 6 random properties
  const shuffledProperties = relatedProperties
    ? [...relatedProperties].sort(() => Math.random() - 0.5).slice(0, 6)
    : []

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    sold: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    rented: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    inactive: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: tAdmin('specs.types.apartment'),
    house: tAdmin('specs.types.house'),
    villa: tAdmin('specs.types.villa'),
    penthouse: tAdmin('specs.types.penthouse'),
    studio: tAdmin('specs.types.studio'),
    duplex: tAdmin('specs.types.duplex'),
    townhouse: tAdmin('specs.types.townhouse'),
    land: tAdmin('specs.types.land'),
    commercial: tAdmin('specs.types.commercial'),
    office: tAdmin('specs.types.office')
  }

  const heatingLabels: Record<string, string> = {
    central: tAdmin('specs.heatingTypes.central'),
    individual: tAdmin('specs.heatingTypes.individual'),
    floor: tAdmin('specs.heatingTypes.floor'),
    none: tAdmin('specs.heatingTypes.none')
  }

  const coolingLabels: Record<string, string> = {
    central: tAdmin('specs.coolingTypes.central'),
    split: tAdmin('specs.coolingTypes.split'),
    none: tAdmin('specs.coolingTypes.none')
  }

  const furnishedLabels: Record<string, string> = {
    true: tAdmin('specs.furnishedOptions.yes'),
    false: tAdmin('specs.furnishedOptions.no')
  }

  const roomLabels: Record<string, string> = {
    livingRoom: tAdmin('rooms.commonRooms.livingRoom'),
    bedroom: tAdmin('rooms.commonRooms.bedroom'),
    kitchen: tAdmin('rooms.commonRooms.kitchen'),
    bathroom: tAdmin('rooms.commonRooms.bathroom'),
    balcony: tAdmin('rooms.commonRooms.balcony'),
    terrace: tAdmin('rooms.commonRooms.terrace'),
    garage: tAdmin('rooms.commonRooms.garage'),
    storage: tAdmin('rooms.commonRooms.storage'),
    office: tAdmin('rooms.commonRooms.office'),
    diningRoom: tAdmin('rooms.commonRooms.diningRoom')
  }

  const hasSpecs = property.property_type || property.year_built || property.floor_number ||
    property.total_floors || property.parking_spaces || property.furnished !== null ||
    property.heating_type || property.cooling_type

  const hasRooms = property.rooms && Array.isArray(property.rooms) && property.rooms.length > 0
  const hasAmenities = property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0
  const hasFloorPlans = property.floor_plans && Array.isArray(property.floor_plans) && property.floor_plans.length > 0
  const hasCoordinates = property.latitude && property.longitude

  return (
    <div className="bg-slate-50 dark:bg-[#0c0a1d] min-h-screen pt-16 md:pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition text-sm font-medium"
          >
            <ArrowLeft size={16} /> {t('backToProperties')}
          </Link>
          <div className="flex items-center gap-2">
            {property.featured && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700">
                {t('featured')}
              </span>
            )}
            {property.status && property.status !== 'active' && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[property.status]}`}>
                {t(`status.${property.status}`)}
              </span>
            )}
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Image Gallery */}
        <div className="mb-3 md:mb-4">
          <ImageGallery
            images={property.images || []}
            title={property.title}
            bucketUrl={bucketUrl}
          />
        </div>

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3 lg:col-span-2 space-y-3 md:space-y-4">
            {/* Title & Price Card */}
            <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
              <div className="flex flex-wrap items-start justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      property.type === 'sale'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                    }`}>
                      {property.type === 'sale' ? t('forSale') : t('forRent')}
                    </span>
                    {property.property_type && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400">
                        {propertyTypeLabels[property.property_type] || property.property_type}
                      </span>
                    )}
                  </div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{property.title}</h1>
                  {property.location && (
                    <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-1">
                      <MapPin size={14} /> {property.location}
                    </p>
                  )}
                </div>
                {property.price && (
                  <div className="text-right shrink-0">
                    <p className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">
                      ${property.price.toLocaleString()}
                    </p>
                    {property.type === 'rent' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t('perMonth')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 md:gap-4 py-2.5 md:py-3 border-t border-slate-100 dark:border-[#2d2a4a]">
                {property.bedrooms && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <BedDouble size={14} className="md:w-4 md:h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('bedrooms')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs md:text-sm">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Bath size={14} className="md:w-4 md:h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('bathrooms')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs md:text-sm">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Expand size={14} className="md:w-4 md:h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('area')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs md:text-sm">{property.area} m²</p>
                    </div>
                  </div>
                )}
                {property.parking_spaces && (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Car size={14} className="md:w-4 md:h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('parking')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs md:text-sm">{property.parking_spaces}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-1.5 md:mb-2 uppercase tracking-wide">{t('description')}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Specifications */}
            {hasSpecs && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-wide">{t('specifications')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {property.property_type && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Building2 size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('propertyType')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white truncate">{propertyTypeLabels[property.property_type] || property.property_type}</p>
                      </div>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Clock size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('yearBuilt')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">{property.year_built}</p>
                      </div>
                    </div>
                  )}
                  {(property.floor_number || property.total_floors) && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Layers size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('floor')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">
                          {property.floor_number && property.total_floors
                            ? `${property.floor_number} / ${property.total_floors}`
                            : property.floor_number || property.total_floors
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {property.furnished !== null && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Sofa size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('furnished')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">{furnishedLabels[String(property.furnished)] || '-'}</p>
                      </div>
                    </div>
                  )}
                  {property.heating_type && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Flame size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('heating')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">{heatingLabels[property.heating_type] || property.heating_type}</p>
                      </div>
                    </div>
                  )}
                  {property.cooling_type && (
                    <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Snowflake size={14} className="md:w-4 md:h-4 text-amber-500 shrink-0" />
                      <div>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-500">{t('cooling')}</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-white">{coolingLabels[property.cooling_type] || property.cooling_type}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Details */}
            {hasRooms && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-wide">{t('roomDetails')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
                  {(property.rooms as RoomSpec[]).map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-2 md:p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300">{roomLabels[room.name] || room.name}</span>
                      <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white">{room.area} m²</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {hasAmenities && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-wide">{t('amenities')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
                  {(property.amenities as string[]).map((amenity) => {
                    const Icon = amenityIcons[amenity] || Check
                    return (
                      <div key={amenity} className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Icon size={12} className="md:w-3.5 md:h-3.5 shrink-0" />
                        <span className="text-xs md:text-sm">{tAdmin(`amenities.${amenity}`)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {hasFloorPlans && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                  <ImageIcon size={14} className="md:w-4 md:h-4" /> {t('floorPlans')}
                </h2>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                  {(property.floor_plans as string[]).map((plan, index) => (
                    <div key={plan} className="aspect-[4/3] bg-slate-100 dark:bg-[#1a1735] rounded-lg overflow-hidden">
                      <img
                        src={`${bucketUrl}${plan}`}
                        alt={`Floor plan ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {hasCoordinates && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 md:p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-wide flex items-center gap-1.5 md:gap-2">
                  <MapPin size={14} className="md:w-4 md:h-4" /> {t('location')}
                </h2>
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100 dark:bg-[#1a1735]">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${property.latitude},${property.longitude}&zoom=15`}
                  />
                </div>
                {property.location && (
                  <p className="mt-1.5 md:mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={10} className="md:w-3 md:h-3" /> {property.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block space-y-4">
            {/* Contact Card */}
            <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{t('interested')}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{t('interestedDescription')}</p>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-2 rounded-lg font-semibold transition text-xs"
              >
                <Calendar size={14} /> {t('bookConsultation')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center justify-center gap-2 w-full border border-slate-300 dark:border-[#2d2a4a] hover:border-amber-500 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-3 py-2 rounded-lg font-medium transition mt-2 text-xs"
              >
                {t('contactUs')}
              </Link>
            </div>

            {/* Related Properties - Desktop vertical column */}
            {shuffledProperties.length > 0 && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-4 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">{t('relatedProperties')}</h2>
                <div className="space-y-3">
                  {shuffledProperties.map((relatedProperty) => (
                    <Link
                      key={relatedProperty.id}
                      href={`/${locale}/properties/${relatedProperty.id}`}
                      className="block bg-slate-50 dark:bg-[#1a1735] rounded-lg overflow-hidden hover:bg-slate-100 dark:hover:bg-[#1f1b40] transition group"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#13102b]">
                        {relatedProperty.images && relatedProperty.images.length > 0 ? (
                          <img
                            src={`${bucketUrl}${relatedProperty.images[0]}`}
                            alt={relatedProperty.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs">
                            {t('noImage')}
                          </div>
                        )}
                        {/* Type Badge */}
                        {relatedProperty.type && (
                          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500 text-slate-900">
                            {relatedProperty.type === 'sale' ? t('forSale') : t('forRent')}
                          </div>
                        )}
                        {/* Price Overlay */}
                        {relatedProperty.price && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                            <p className="text-sm font-bold text-white">
                              ${relatedProperty.price.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-2.5">
                        <h3 className="font-medium text-slate-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">{relatedProperty.title}</h3>
                        {relatedProperty.location && (
                          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                            <MapPin size={10} /> <span className="line-clamp-1">{relatedProperty.location}</span>
                          </p>
                        )}
                        {/* Features */}
                        <div className="flex gap-2 text-slate-500 dark:text-slate-400 text-[10px] mt-1.5 pt-1.5 border-t border-slate-200 dark:border-[#2d2a4a]">
                          {relatedProperty.bedrooms && (
                            <span className="flex items-center gap-0.5">
                              <BedDouble size={10} /> {relatedProperty.bedrooms}
                            </span>
                          )}
                          {relatedProperty.bathrooms && (
                            <span className="flex items-center gap-0.5">
                              <Bath size={10} /> {relatedProperty.bathrooms}
                            </span>
                          )}
                          {relatedProperty.area && (
                            <span className="flex items-center gap-0.5">
                              <Expand size={10} /> {relatedProperty.area}m²
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Property ID */}
            <div className="bg-slate-100 dark:bg-[#1a1735] rounded-xl p-3 text-center dark:border dark:border-[#2d2a4a]">
              <p className="text-[10px] text-slate-500 dark:text-slate-500">{t('propertyId')}</p>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-300">{property.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Related Properties - Mobile horizontal scroll */}
        {shuffledProperties.length > 0 && (
          <div className="lg:hidden mt-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm px-1">{t('relatedProperties')}</h2>
            <div className="overflow-x-auto pb-2 -mx-3 px-3 scrollbar-hide">
              <div className="flex gap-3" style={{ width: 'max-content' }}>
                {shuffledProperties.map((relatedProperty) => (
                  <Link
                    key={relatedProperty.id}
                    href={`/${locale}/properties/${relatedProperty.id}`}
                    className="w-[200px] flex-shrink-0 bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm border border-slate-100 dark:border-[#2d2a4a] hover:shadow-md transition group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
                      {relatedProperty.images && relatedProperty.images.length > 0 ? (
                        <img
                          src={`${bucketUrl}${relatedProperty.images[0]}`}
                          alt={relatedProperty.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs">
                          {t('noImage')}
                        </div>
                      )}
                      {/* Type Badge */}
                      {relatedProperty.type && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500 text-slate-900">
                          {relatedProperty.type === 'sale' ? t('forSale') : t('forRent')}
                        </div>
                      )}
                      {/* Price Overlay */}
                      {relatedProperty.price && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                          <p className="text-sm font-bold text-white">
                            ${relatedProperty.price.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-2.5">
                      <h3 className="font-medium text-slate-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-1">{relatedProperty.title}</h3>
                      {relatedProperty.location && (
                        <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                          <MapPin size={10} /> <span className="line-clamp-1">{relatedProperty.location}</span>
                        </p>
                      )}
                      {/* Features */}
                      <div className="flex gap-2 text-slate-500 dark:text-slate-400 text-[10px] mt-1.5 pt-1.5 border-t border-slate-100 dark:border-[#2d2a4a]">
                        {relatedProperty.bedrooms && (
                          <span className="flex items-center gap-0.5">
                            <BedDouble size={10} /> {relatedProperty.bedrooms}
                          </span>
                        )}
                        {relatedProperty.bathrooms && (
                          <span className="flex items-center gap-0.5">
                            <Bath size={10} /> {relatedProperty.bathrooms}
                          </span>
                        )}
                        {relatedProperty.area && (
                          <span className="flex items-center gap-0.5">
                            <Expand size={10} /> {relatedProperty.area}m²
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-[#13102b] border-t border-slate-200 dark:border-[#2d2a4a] p-3 z-40 shadow-lg shadow-black/10 dark:shadow-purple-900/20">
        <div className="flex gap-2 max-w-lg mx-auto">
          <Link
            href={`/${locale}/book`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-2.5 rounded-lg font-semibold transition text-xs"
          >
            <Calendar size={16} /> {t('bookConsultation')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center justify-center gap-1.5 border border-slate-300 dark:border-[#2d2a4a] hover:border-amber-500 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-3 py-2.5 rounded-lg font-medium transition text-xs"
          >
            {t('contactUs')}
          </Link>
        </div>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
