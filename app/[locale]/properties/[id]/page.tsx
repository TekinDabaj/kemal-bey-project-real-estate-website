import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Bath, BedDouble, Expand, MapPin, ArrowLeft, Calendar, Home, Car,
  Building2, Layers, Flame, Snowflake, Sofa, Clock, Check, Image as ImageIcon,
  Waves, Dumbbell, TreeDeciduous, Shield, Phone, Sparkles, Eye, Mountain, Building, Zap, Sun
} from 'lucide-react'

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
    active: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    sold: 'bg-red-500/10 text-red-700 border-red-200',
    rented: 'bg-blue-500/10 text-blue-700 border-blue-200',
    inactive: 'bg-slate-500/10 text-slate-700 border-slate-200'
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
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-amber-600 transition text-sm font-medium"
          >
            <ArrowLeft size={16} /> {t('backToProperties')}
          </Link>
          <div className="flex items-center gap-2">
            {property.featured && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
          {property.images && property.images.length > 0 ? (
            <div className="grid grid-cols-4 gap-1">
              {/* Main Image */}
              <div className="col-span-4 md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto md:h-80 bg-slate-200">
                <img
                  src={`${bucketUrl}${property.images[0]}`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thumbnails */}
              {property.images.slice(1, 5).map((img: string, index: number) => (
                <div key={img} className="aspect-[4/3] md:h-[158px] bg-slate-200 relative">
                  <img
                    src={`${bucketUrl}${img}`}
                    alt={`${property.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && property.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold">+{property.images.length - 5}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 bg-slate-100 flex items-center justify-center text-slate-400">
              <Home size={48} />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title & Price Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      property.type === 'sale'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {property.type === 'sale' ? t('forSale') : t('forRent')}
                    </span>
                    {property.property_type && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {propertyTypeLabels[property.property_type] || property.property_type}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">{property.title}</h1>
                  {property.location && (
                    <p className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                      <MapPin size={14} /> {property.location}
                    </p>
                  )}
                </div>
                {property.price && (
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-amber-600">
                      ${property.price.toLocaleString()}
                    </p>
                    {property.type === 'rent' && (
                      <p className="text-xs text-slate-500">{t('perMonth')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 py-3 border-t border-slate-100">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <BedDouble size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('bedrooms')}</p>
                      <p className="font-semibold text-slate-900 text-sm">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Bath size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('bathrooms')}</p>
                      <p className="font-semibold text-slate-900 text-sm">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Expand size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('area')}</p>
                      <p className="font-semibold text-slate-900 text-sm">{property.area} m²</p>
                    </div>
                  </div>
                )}
                {property.parking_spaces && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Car size={16} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('parking')}</p>
                      <p className="font-semibold text-slate-900 text-sm">{property.parking_spaces}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wide">{t('description')}</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Specifications */}
            {hasSpecs && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">{t('specifications')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.property_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Building2 size={16} className="text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">{t('propertyType')}</p>
                        <p className="text-sm font-medium text-slate-900 truncate">{propertyTypeLabels[property.property_type] || property.property_type}</p>
                      </div>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Clock size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t('yearBuilt')}</p>
                        <p className="text-sm font-medium text-slate-900">{property.year_built}</p>
                      </div>
                    </div>
                  )}
                  {(property.floor_number || property.total_floors) && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Layers size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t('floor')}</p>
                        <p className="text-sm font-medium text-slate-900">
                          {property.floor_number && property.total_floors
                            ? `${property.floor_number} / ${property.total_floors}`
                            : property.floor_number || property.total_floors
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {property.furnished !== null && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Sofa size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t('furnished')}</p>
                        <p className="text-sm font-medium text-slate-900">{furnishedLabels[String(property.furnished)] || '-'}</p>
                      </div>
                    </div>
                  )}
                  {property.heating_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Flame size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t('heating')}</p>
                        <p className="text-sm font-medium text-slate-900">{heatingLabels[property.heating_type] || property.heating_type}</p>
                      </div>
                    </div>
                  )}
                  {property.cooling_type && (
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                      <Snowflake size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">{t('cooling')}</p>
                        <p className="text-sm font-medium text-slate-900">{coolingLabels[property.cooling_type] || property.cooling_type}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Details */}
            {hasRooms && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">{t('roomDetails')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(property.rooms as RoomSpec[]).map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{roomLabels[room.name] || room.name}</span>
                      <span className="text-sm font-semibold text-slate-900">{room.area} m²</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {hasAmenities && (
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">{t('amenities')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(property.amenities as string[]).map((amenity) => {
                    const Icon = amenityIcons[amenity] || Check
                    return (
                      <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-700">
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
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <ImageIcon size={16} /> {t('floorPlans')}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {(property.floor_plans as string[]).map((plan, index) => (
                    <div key={plan} className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden">
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
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MapPin size={16} /> {t('location')}
                </h2>
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-slate-100">
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
                  <p className="mt-2 text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {property.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-20">
              <h2 className="font-semibold text-slate-900 mb-2">{t('interested')}</h2>
              <p className="text-sm text-slate-600 mb-4">{t('interestedDescription')}</p>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2.5 rounded-lg font-semibold transition text-sm"
              >
                <Calendar size={16} /> {t('bookConsultation')}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="flex items-center justify-center gap-2 w-full border border-slate-300 hover:border-amber-500 text-slate-700 hover:text-amber-600 px-4 py-2.5 rounded-lg font-medium transition mt-2 text-sm"
              >
                {t('contactUs')}
              </Link>
            </div>

            {/* Quick Highlights */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3">{t('highlights')}</h2>
              <ul className="space-y-2">
                {[
                  property.type === 'sale' ? t('availableForPurchase') : t('availableForRent'),
                  property.bedrooms && `${property.bedrooms} ${t('bedroomsShort')}`,
                  property.bathrooms && `${property.bathrooms} ${t('bathroomsShort')}`,
                  property.area && `${property.area} m² ${t('livingSpace')}`,
                  property.year_built && `${t('builtIn')} ${property.year_built}`,
                  property.parking_spaces && `${property.parking_spaces} ${t('parkingSpaces')}`,
                ].filter(Boolean).map((highlight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Property ID */}
            <div className="bg-slate-100 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500">{t('propertyId')}</p>
              <p className="font-mono text-sm text-slate-700">{property.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
