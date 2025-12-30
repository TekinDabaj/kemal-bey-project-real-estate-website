'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeroSlide } from '@/types/database'
import { Plus, Pencil, Trash2, Upload, X, Image as ImageIcon, GripVertical } from 'lucide-react'

type Props = {
  initialSlides: HeroSlide[]
}

export default function HeroSlidesManager({ initialSlides }: Props) {
  const [slides, setSlides] = useState(initialSlides)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formImage, setFormImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const [formData, setFormData] = useState({
    title: '',
    highlight: '',
    subtitle: '',
    active: true
  })

  function openModal(slide?: HeroSlide) {
    if (slide) {
      setEditingSlide(slide)
      setFormData({
        title: slide.title,
        highlight: slide.highlight || '',
        subtitle: slide.subtitle || '',
        active: slide.active
      })
      setFormImage(slide.image)
    } else {
      setEditingSlide(null)
      setFormData({
        title: '',
        highlight: '',
        subtitle: '',
        active: true
      })
      setFormImage('')
    }
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingSlide(null)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    const file = files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `hero/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (!error) {
      setFormImage(fileName)
    } else {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formImage) {
      alert('Please upload an image')
      return
    }

    const slideData = {
      image: formImage,
      title: formData.title,
      highlight: formData.highlight || null,
      subtitle: formData.subtitle || null,
      active: formData.active,
      sort_order: editingSlide ? editingSlide.sort_order : slides.length
    }

    if (editingSlide) {
      const { data, error } = await supabase
        .from('hero_slides')
        .update(slideData)
        .eq('id', editingSlide.id)
        .select()
        .single()

      if (!error && data) {
        setSlides(slides.map(s => s.id === editingSlide.id ? data : s))
        closeModal()
      } else {
        alert('Failed to update slide')
      }
    } else {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert(slideData)
        .select()
        .single()

      if (!error && data) {
        setSlides([...slides, data])
        closeModal()
      } else {
        alert('Failed to create slide')
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this slide?')) return

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (!error) {
      setSlides(slides.filter(s => s.id !== id))
    } else {
      alert('Failed to delete slide')
    }
  }

  async function toggleActive(id: string, active: boolean) {
    const { error } = await supabase
      .from('hero_slides')
      .update({ active: !active })
      .eq('id', id)

    if (!error) {
      setSlides(slides.map(s => s.id === id ? { ...s, active: !active } : s))
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Hero Slider</h2>
          <p className="text-sm text-slate-500">Manage the homepage banner slides</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> Add Slide
        </button>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center text-slate-500 border border-slate-200">
          No slides yet. Add your first hero slide.
        </div>
      ) : (
        <div className="space-y-4">
          {slides
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((slide) => (
            <div key={slide.id} className="bg-white rounded-lg border border-slate-200 p-4 flex gap-4">
              {/* Thumbnail */}
              <div className="w-48 h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={`${bucketUrl}${slide.image}`}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {slide.highlight ? (
                        <>
                          {slide.title.split(slide.highlight)[0]}
                          <span className="text-amber-500">{slide.highlight}</span>
                          {slide.title.split(slide.highlight)[1]}
                        </>
                      ) : (
                        slide.title
                      )}
                    </h3>
                    {slide.subtitle && (
                      <p className="text-sm text-slate-500 mt-1">{slide.subtitle}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    slide.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {slide.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(slide.id, slide.active)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      slide.active 
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {slide.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openModal(slide)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingSlide ? 'Edit Slide' : 'Add Slide'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Background Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {formImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={`${bucketUrl}${formImage}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-medium"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition"
                  >
                    {uploading ? (
                      'Uploading...'
                    ) : (
                      <>
                        <Upload size={32} className="mb-2" />
                        <span>Click to upload image</span>
                        <span className="text-xs mt-1">Recommended: 1920x1080</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Expert Real Estate Guidance You Can Trust"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Highlight */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Highlighted Text
                </label>
                <input
                  type="text"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  placeholder="Guidance"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This text will be highlighted in amber color. Must be part of the title.
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Whether you're buying, selling, or investing..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">
                  Active (visible on homepage)
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
                  {editingSlide ? 'Update' : 'Create'} Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}