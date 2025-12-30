'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, Building2, MapPin, Camera, Settings2, LayoutGrid, Sparkles,
  Plus, Trash2, ChevronDown, ChevronUp, Check, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Property, RoomSpec } from '@/types/database'
import ImageUploader from './ImageUploader'
import MapPicker from './MapPicker'

type Props = {
  property?: Property | null
  t: any // Translations object
}

const AMENITIES = [
  'pool', 'gym', 'sauna', 'garden', 'elevator', 'security', 'concierge', 'parking',
  'balcony', 'terrace', 'fireplace', 'airConditioning', 'heating', 'laundry',
  'storage', 'petFriendly', 'seaView', 'cityView', 'mountainView', 'smartHome',
  'solarPanels', 'generator'
]

const PROPERTY_TYPES = [
  'apartment', 'house', 'villa', 'penthouse', 'studio', 'duplex',
  'townhouse', 'land', 'commercial', 'office'
]

export default function PropertyListingForm({ property, t }: Props) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'en'
  const supabase = createClient()
  const isEditing = !!property

  // Form state
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price?.toString() || '',
    type: property?.type || 'sale',
    status: property?.status || 'active',
    featured: property?.featured || false,
    location: property?.location || '',
    latitude: property?.latitude || null as number | null,
    longitude: property?.longitude || null as number | null,
    property_type: property?.property_type || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    area: property?.area?.toString() || '',
    year_built: property?.year_built?.toString() || '',
    floor_number: property?.floor_number?.toString() || '',
    total_floors: property?.total_floors?.toString() || '',
    parking_spaces: property?.parking_spaces?.toString() || '',
    furnished: property?.furnished === true ? 'yes' : property?.furnished === false ? 'no' : '',
    heating_type: property?.heating_type || '',
    cooling_type: property?.cooling_type || '',
  })

  const [images, setImages] = useState<string[]>(property?.images || [])
  const [floorPlans, setFloorPlans] = useState<string[]>(property?.floor_plans || [])
  const [rooms, setRooms] = useState<RoomSpec[]>(property?.rooms || [])
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || [])

  const [isMapOpen, setIsMapOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    location: true,
    media: true,
    specs: false,
    rooms: false,
    amenities: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Room management
  const addRoom = () => {
    setRooms([...rooms, { name: '', area: 0 }])
  }

  const updateRoom = (index: number, field: keyof RoomSpec, value: string | number) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
  }

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index))
  }

  // Amenities management
  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity))
    } else {
      setAmenities([...amenities, amenity])
    }
  }

  // Map confirmation
  const handleMapConfirm = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
  }

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = t.validation.titleRequired
    if (!formData.price.trim()) newErrors.price = t.validation.priceRequired
    if (!formData.description.trim()) newErrors.description = t.validation.descriptionRequired
    if (!formData.location.trim()) newErrors.location = t.validation.locationRequired
    if (!formData.type) newErrors.type = t.validation.typeRequired
    if (images.length === 0) newErrors.images = t.validation.imagesRequired

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit
  const handleSubmit = async (asDraft: boolean = false) => {
    if (!validate()) return

    setSaving(true)

    const propertyData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price) || null,
      type: formData.type as 'sale' | 'rent',
      status: asDraft ? 'inactive' : formData.status as 'active' | 'sold' | 'rented' | 'inactive',
      featured: formData.featured,
      location: formData.location,
      latitude: formData.latitude,
      longitude: formData.longitude,
      property_type: formData.property_type || null,
      bedrooms: parseInt(formData.bedrooms) || null,
      bathrooms: parseInt(formData.bathrooms) || null,
      area: parseFloat(formData.area) || null,
      year_built: parseInt(formData.year_built) || null,
      floor_number: parseInt(formData.floor_number) || null,
      total_floors: parseInt(formData.total_floors) || null,
      parking_spaces: parseInt(formData.parking_spaces) || null,
      furnished: formData.furnished === 'yes' ? true : formData.furnished === 'no' ? false : null,
      heating_type: formData.heating_type || null,
      cooling_type: formData.cooling_type || null,
      images,
      floor_plans: floorPlans.length > 0 ? floorPlans : null,
      rooms: rooms.filter(r => r.name && r.area > 0).length > 0
        ? rooms.filter(r => r.name && r.area > 0)
        : null,
      amenities: amenities.length > 0 ? amenities : null,
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id)

        if (error) throw error
        alert(t.success.updated)
      } else {
        const { error } = await supabase
          .from('properties')
          .insert(propertyData)

        if (error) throw error
        alert(t.success.created)
      }

      router.push(`/${locale}/admin`)
    } catch (error) {
      console.error('Error saving property:', error)
      alert(isEditing ? t.error.updateFailed : t.error.createFailed)
    } finally {
      setSaving(false)
    }
  }

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, section }: { icon: any, title: string, section: keyof typeof expandedSections }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1a1735] hover:bg-slate-100 dark:hover:bg-[#2d2a4a] transition rounded-t-lg"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-amber-500" />
        <span className="font-medium text-slate-900 dark:text-white">{title}</span>
      </div>
      <span className="text-slate-500 dark:text-slate-400">{expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0c0a1d]">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition text-sm"
          >
            <ArrowLeft size={18} />
            {t.backToProperties}
          </Link>
          <div className="h-4 w-px bg-slate-700 dark:bg-[#2d2a4a]" />
          <h1 className="text-lg font-semibold">
            {isEditing ? t.editPageTitle : t.pageTitle}
          </h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false) }} className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Basic Info Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={Building2} title={t.sections.basicInfo} section="basicInfo" />
          {expandedSections.basicInfo && (
            <div className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.fields.title} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t.fields.titlePlaceholder}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white ${
                    errors.title ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.fields.description} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.fields.descriptionPlaceholder}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white ${
                    errors.description ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Price, Type, Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.fields.price} ({t.fields.currency}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder={t.fields.pricePlaceholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white ${
                      errors.price ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                    }`}
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.fields.type} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="sale">{t.fields.forSale}</option>
                    <option value="rent">{t.fields.forRent}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.fields.status}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'sold' | 'rented' | 'inactive' })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="active">{t.fields.active}</option>
                    <option value="sold">{t.fields.sold}</option>
                    <option value="rented">{t.fields.rented}</option>
                    <option value="inactive">{t.fields.inactive}</option>
                  </select>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <label htmlFor="featured" className="text-sm text-slate-700 dark:text-slate-300">
                  {t.fields.featured}
                  <span className="text-slate-500 dark:text-slate-400 ml-1">({t.fields.featuredHelp})</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={MapPin} title={t.sections.location} section="location" />
          {expandedSections.location && (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.location.address} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t.location.addressPlaceholder}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                  }`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#1a1735] hover:bg-slate-200 dark:hover:bg-[#2d2a4a] text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition"
                >
                  <MapPin size={16} />
                  {t.location.pinOnMap}
                </button>

                {formData.latitude && formData.longitude && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>{t.location.latitude}: {formData.latitude.toFixed(6)}</span>
                    <span>{t.location.longitude}: {formData.longitude.toFixed(6)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={Camera} title={t.sections.media} section="media" />
          {expandedSections.media && (
            <div className="p-4 space-y-6">
              {/* Property Images */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.media.propertyImages} <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.media.propertyImagesHelp}</p>
                <ImageUploader
                  images={images}
                  onImagesChange={setImages}
                  folder="properties"
                  t={t.media}
                />
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>

              {/* Floor Plans */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.media.floorPlans}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.media.floorPlansHelp}</p>
                <ImageUploader
                  images={floorPlans}
                  onImagesChange={setFloorPlans}
                  folder="floorplans"
                  maxImages={5}
                  t={t.media}
                />
              </div>
            </div>
          )}
        </div>

        {/* Specifications Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={Settings2} title={t.sections.specifications} section="specs" />
          {expandedSections.specs && (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.propertyType}
                  </label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="">-</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{t.specs.types[type]}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.bedrooms}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.bathrooms}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Total Area */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.totalArea}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.yearBuilt}
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year_built}
                    onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Floor Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.floorNumber}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.floor_number}
                    onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Total Floors */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.totalFloors}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.total_floors}
                    onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Parking */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.parkingSpaces}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.parking_spaces}
                    onChange={(e) => setFormData({ ...formData, parking_spaces: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  />
                </div>

                {/* Furnished */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.furnished}
                  </label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => setFormData({ ...formData, furnished: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="">-</option>
                    <option value="yes">{t.specs.furnishedOptions.yes}</option>
                    <option value="no">{t.specs.furnishedOptions.no}</option>
                    <option value="partial">{t.specs.furnishedOptions.partial}</option>
                  </select>
                </div>

                {/* Heating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.heatingType}
                  </label>
                  <select
                    value={formData.heating_type}
                    onChange={(e) => setFormData({ ...formData, heating_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="">-</option>
                    <option value="central">{t.specs.heatingTypes.central}</option>
                    <option value="individual">{t.specs.heatingTypes.individual}</option>
                    <option value="floor">{t.specs.heatingTypes.floor}</option>
                    <option value="none">{t.specs.heatingTypes.none}</option>
                  </select>
                </div>

                {/* Cooling */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.specs.coolingType}
                  </label>
                  <select
                    value={formData.cooling_type}
                    onChange={(e) => setFormData({ ...formData, cooling_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  >
                    <option value="">-</option>
                    <option value="central">{t.specs.coolingTypes.central}</option>
                    <option value="split">{t.specs.coolingTypes.split}</option>
                    <option value="none">{t.specs.coolingTypes.none}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Room Details Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={LayoutGrid} title={t.sections.rooms} section="rooms" />
          {expandedSections.rooms && (
            <div className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.rooms.help}</p>

              {rooms.length > 0 && (
                <div className="space-y-2 mb-3">
                  {rooms.map((room, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={room.name}
                        onChange={(e) => updateRoom(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                      >
                        <option value="">{t.rooms.roomName}</option>
                        {Object.entries(t.rooms.commonRooms).map(([key, value]) => (
                          <option key={key} value={key}>{value as string}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={room.area || ''}
                        onChange={(e) => updateRoom(index, 'area', parseFloat(e.target.value) || 0)}
                        placeholder={t.rooms.roomArea}
                        className="w-24 px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={addRoom}
                className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition"
              >
                <Plus size={16} />
                {t.rooms.addRoom}
              </button>
            </div>
          )}
        </div>

        {/* Amenities Section */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] overflow-hidden">
          <SectionHeader icon={Sparkles} title={t.sections.amenities} section="amenities" />
          {expandedSections.amenities && (
            <div className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{t.amenities.help}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      amenities.includes(amenity)
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-2 border-amber-400 dark:border-amber-600'
                        : 'bg-slate-50 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-[#2d2a4a]'
                    }`}
                  >
                    {amenities.includes(amenity) && <Check size={14} />}
                    {t.amenities[amenity]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1735] rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {t.actions.saveDraft}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? t.actions.publishing : (isEditing ? t.actions.update : t.actions.publish)}
          </button>
        </div>
      </form>

      {/* Map Picker Modal */}
      <MapPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialLat={formData.latitude || undefined}
        initialLng={formData.longitude || undefined}
        t={t.location}
      />
    </div>
  )
}
