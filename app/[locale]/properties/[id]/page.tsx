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
    <div className="bg-slate-50 dark:bg-[#0c0a1d] min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#13102b] border-b border-slate-200 dark:border-[#2d2a4a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
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
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="mb-4">
          <ImageGallery
            images={property.images || []}
            title={property.title}
            bucketUrl={bucketUrl}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & Price Card */}
            <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
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
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{property.title}</h1>
                  {property.location && (
                    <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-1">
                      <MapPin size={14} /> {property.location}
                    </p>
                  )}
                </div>
                {property.price && (
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      ${property.price.toLocaleString()}
                    </p>
                    {property.type === 'rent' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t('perMonth')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 py-3 border-t border-slate-100 dark:border-[#2d2a4a]">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <BedDouble size={16} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{t('bedrooms')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Bath size={16} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{t('bathrooms')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Expand size={16} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{t('area')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{property.area} m²</p>
                    </div>
                  </div>
                )}
                {property.parking_spaces && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#1a1735] flex items-center justify-center">
                      <Car size={16} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">{t('parking')}</p>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{property.parking_spaces}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">{t('description')}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Specifications */}
            {hasSpecs && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">{t('specifications')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.property_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Building2 size={16} className="text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('propertyType')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{propertyTypeLabels[property.property_type] || property.property_type}</p>
                      </div>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Clock size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('yearBuilt')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{property.year_built}</p>
                      </div>
                    </div>
                  )}
                  {(property.floor_number || property.total_floors) && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Layers size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('floor')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {property.floor_number && property.total_floors
                            ? `${property.floor_number} / ${property.total_floors}`
                            : property.floor_number || property.total_floors
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {property.furnished !== null && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Sofa size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('furnished')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{furnishedLabels[String(property.furnished)] || '-'}</p>
                      </div>
                    </div>
                  )}
                  {property.heating_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Flame size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('heating')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{heatingLabels[property.heating_type] || property.heating_type}</p>
                      </div>
                    </div>
                  )}
                  {property.cooling_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <Snowflake size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{t('cooling')}</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{coolingLabels[property.cooling_type] || property.cooling_type}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Details */}
            {hasRooms && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">{t('roomDetails')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(property.rooms as RoomSpec[]).map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#1a1735] rounded-lg">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{roomLabels[room.name] || room.name}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{room.area} m²</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {hasAmenities && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">{t('amenities')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(property.amenities as string[]).map((amenity) => {
                    const Icon = amenityIcons[amenity] || Check
                    return (
                      <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                        <Icon size={14} className="shrink-0" />
                        <span className="text-sm">{tAdmin(`amenities.${amenity}`)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Floor Plans */}
            {hasFloorPlans && (
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon size={16} /> {t('floorPlans')}
                </h2>
                <div className="grid grid-cols-2 gap-2">
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
              <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MapPin size={16} /> {t('location')}
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
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> {property.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block space-y-4">
            {/* Contact Card */}
            <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a] sticky top-20">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2">{t('interested')}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t('interestedDescription')}</p>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2.5 rounded-lg font-semibold transition text-sm"
              >
                <Calendar size={16} /> {t('bookConsultation')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center justify-center gap-2 w-full border border-slate-300 dark:border-[#2d2a4a] hover:border-amber-500 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-4 py-2.5 rounded-lg font-medium transition mt-2 text-sm"
              >
                {t('contactUs')}
              </Link>
            </div>

            {/* Quick Highlights */}
            <div className="bg-white dark:bg-[#13102b] rounded-xl p-5 shadow-sm dark:shadow-purple-900/10 dark:border dark:border-[#2d2a4a]">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">{t('highlights')}</h2>
              <ul className="space-y-2">
                {[
                  property.type === 'sale' ? t('availableForPurchase') : t('availableForRent'),
                  property.bedrooms && `${property.bedrooms} ${t('bedroomsShort')}`,
                  property.bathrooms && `${property.bathrooms} ${t('bathroomsShort')}`,
                  property.area && `${property.area} m² ${t('livingSpace')}`,
                  property.year_built && `${t('builtIn')} ${property.year_built}`,
                  property.parking_spaces && `${property.parking_spaces} ${t('parkingSpaces')}`,
                ].filter(Boolean).map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Property ID */}
            <div className="bg-slate-100 dark:bg-[#1a1735] rounded-xl p-4 text-center dark:border dark:border-[#2d2a4a]">
              <p className="text-xs text-slate-500 dark:text-slate-500">{t('propertyId')}</p>
              <p className="font-mono text-sm text-slate-700 dark:text-slate-300">{property.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white dark:bg-[#13102b] border-t border-slate-200 dark:border-[#2d2a4a] p-4 z-40 shadow-lg shadow-black/10 dark:shadow-purple-900/20">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Link
            href={`/${locale}/book`}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-3 rounded-lg font-semibold transition text-sm"
          >
            <Calendar size={18} /> {t('bookConsultation')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="flex items-center justify-center gap-2 border border-slate-300 dark:border-[#2d2a4a] hover:border-amber-500 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 px-4 py-3 rounded-lg font-medium transition text-sm"
          >
            {t('contactUs')}
          </Link>
        </div>
      </div>

      {/* Spacer for fixed bottom bar on mobile */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
