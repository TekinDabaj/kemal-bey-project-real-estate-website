'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Property } from '@/types/database'
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'

type Props = {
  initialProperties: Property[]
}

export default function PropertiesManager({ initialProperties }: Props) {
  const [properties, setProperties] = useState(initialProperties)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formImages, setFormImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: 'sale' as 'sale' | 'rent',
    status: 'active' as 'active' | 'sold' | 'rented' | 'inactive',
    featured: false
  })

  function openModal(property?: Property) {
    if (property) {
      setEditingProperty(property)
      setFormData({
        title: property.title,
        description: property.description || '',
        price: property.price?.toString() || '',
        location: property.location || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area: property.area?.toString() || '',
        type: property.type || 'sale',
        status: property.status,
        featured: property.featured
      })
      setFormImages(property.images || [])
    } else {
      setEditingProperty(null)
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        type: 'sale',
        status: 'active',
        featured: false
      })
      setFormImages([])
    }
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProperty(null)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `properties/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (!error) {
        setFormImages(prev => [...prev, fileName])
      } else {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function removeImage(fileName: string) {
    const { error } = await supabase.storage
      .from('images')
      .remove([fileName])

    if (!error) {
      setFormImages(formImages.filter(img => img !== fileName))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const propertyData = {
      title: formData.title,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      location: formData.location || null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      area: formData.area ? parseFloat(formData.area) : null,
      type: formData.type,
      status: formData.status,
      featured: formData.featured,
      images: formImages,
      updated_at: new Date().toISOString()
    }

    if (editingProperty) {
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', editingProperty.id)
        .select()
        .single()

      if (!error && data) {
        setProperties(properties.map(p => p.id === editingProperty.id ? data : p))
        closeModal()
      } else {
        alert('Failed to update property')
      }
    } else {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (!error && data) {
        setProperties([data, ...properties])
        closeModal()
      } else {
        alert('Failed to create property')
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (!error) {
      setProperties(properties.filter(p => p.id !== id))
    } else {
      alert('Failed to delete property')
    }
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    rented: 'bg-blue-100 text-blue-800',
    inactive: 'bg-slate-100 text-slate-800'
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Manage Properties</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> Add Property
        </button>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-slate-500 border border-slate-200">
          No properties yet. Add your first property.
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg border border-slate-200 p-4 flex gap-4">
              {/* Thumbnail */}
              <div className="w-32 h-24 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={`${bucketUrl}${property.images[0]}`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{property.title}</h3>
                    <p className="text-sm text-slate-500">{property.location || 'No location'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[property.status]}`}>
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  {property.price && (
                    <span className="font-medium text-amber-600">
                      ${property.price.toLocaleString()}
                      {property.type === 'rent' && '/mo'}
                    </span>
                  )}
                  {property.bedrooms && <span>{property.bedrooms} beds</span>}
                  {property.bathrooms && <span>{property.bathrooms} baths</span>}
                  {property.area && <span>{property.area} m²</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal(property)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingProperty ? 'Edit Property' : 'Add Property'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {formImages.map((img) => (
                    <div key={img} className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <img src={`${bucketUrl}${img}`} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition"
                  >
                    {uploading ? '...' : <Upload size={24} />}
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Bedrooms, Bathrooms, Area */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Area (m²)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Type & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sale' | 'rent' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'sold' | 'rented' | 'inactive' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="inactive">Inactive</option>
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
                <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                  Featured property (shown first)
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition"
                >
                  {editingProperty ? 'Update' : 'Create'} Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}