'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Presentation, Plus, Pencil, X } from 'lucide-react'
import { HeroSlide } from '@/types/database'
import { useTranslations } from 'next-intl'

type Props = {
  initialHeroSlides: HeroSlide[]
}

export default function ContentEditor({ initialHeroSlides }: Props) {
  const t = useTranslations('admin.content.heroSlider')
  const tCommon = useTranslations('common')
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides)
  const [uploading, setUploading] = useState<string | null>(null)
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [slideFormImage, setSlideFormImage] = useState<string>('')
  const [slideFormData, setSlideFormData] = useState({
    title: '',
    highlight: '',
    subtitle: '',
    active: true
  })

  const slideFileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // --- Hero Slides Functions ---
  function openSlideModal(slide?: HeroSlide) {
    if (slide) {
      setEditingSlide(slide)
      setSlideFormData({
        title: slide.title,
        highlight: slide.highlight || '',
        subtitle: slide.subtitle || '',
        active: slide.active
      })
      setSlideFormImage(slide.image)
    } else {
      setEditingSlide(null)
      setSlideFormData({
        title: '',
        highlight: '',
        subtitle: '',
        active: true
      })
      setSlideFormImage('')
    }
    setIsSlideModalOpen(true)
  }

  function closeSlideModal() {
    setIsSlideModalOpen(false)
    setEditingSlide(null)
  }

  async function handleSlideImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading('hero')

    const file = files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `hero/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (!error) {
      setSlideFormImage(fileName)
    } else {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    }

    setUploading(null)
    if (slideFileInputRef.current) {
      slideFileInputRef.current.value = ''
    }
  }

  async function handleSlideSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!slideFormImage) {
      alert(t('pleaseUpload'))
      return
    }

    const slideData = {
      image: slideFormImage,
      title: slideFormData.title,
      highlight: slideFormData.highlight || null,
      subtitle: slideFormData.subtitle || null,
      active: slideFormData.active,
      sort_order: editingSlide ? editingSlide.sort_order : heroSlides.length
    }

    if (editingSlide) {
      const { data, error } = await supabase
        .from('hero_slides')
        .update(slideData)
        .eq('id', editingSlide.id)
        .select()
        .single()

      if (!error && data) {
        setHeroSlides(heroSlides.map(s => s.id === editingSlide.id ? data : s))
        closeSlideModal()
      } else {
        alert(t('updateFailed'))
      }
    } else {
      const { data, error } = await supabase
        .from('hero_slides')
        .insert(slideData)
        .select()
        .single()

      if (!error && data) {
        setHeroSlides([...heroSlides, data])
        closeSlideModal()
      } else {
        alert(t('createFailed'))
      }
    }
  }

  async function handleSlideDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return

    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id)

    if (!error) {
      setHeroSlides(heroSlides.filter(s => s.id !== id))
    } else {
      alert(t('deleteFailed'))
    }
  }

  async function toggleSlideActive(id: string, active: boolean) {
    const { error } = await supabase
      .from('hero_slides')
      .update({ active: !active })
      .eq('id', id)

    if (!error) {
      setHeroSlides(heroSlides.map(s => s.id === id ? { ...s, active: !active } : s))
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Slider Section */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Presentation className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{t('title')}</h3>
                <p className="text-sm text-slate-500">{t('description')}</p>
              </div>
            </div>
            <button
              onClick={() => openSlideModal()}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm transition"
            >
              <Plus size={16} /> {t('addSlide')}
            </button>
          </div>
        </div>

        <div className="p-6">
          {heroSlides.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <Presentation className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">{t('noSlides')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {heroSlides
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((slide) => (
                  <div key={slide.id} className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-40 h-24 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={`${bucketUrl}${slide.image}`}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-slate-900 truncate">
                          {slide.highlight ? (
                            <>
                              {slide.title.split(slide.highlight)[0]}
                              <span className="text-amber-500">{slide.highlight}</span>
                              {slide.title.split(slide.highlight)[1]}
                            </>
                          ) : (
                            slide.title
                          )}
                        </h4>
                        <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                          slide.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {slide.active ? t('activate') : t('deactivate')}
                        </span>
                      </div>
                      {slide.subtitle && (
                        <p className="text-sm text-slate-500 truncate mt-1">{slide.subtitle}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => toggleSlideActive(slide.id, slide.active)}
                          className="text-xs px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          {slide.active ? t('deactivate') : t('activate')}
                        </button>
                        <button
                          onClick={() => openSlideModal(slide)}
                          className="p-1.5 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-100"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleSlideDelete(slide.id)}
                          className="p-1.5 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Slide Modal */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingSlide ? t('editSlide') : t('addSlide')}
              </h3>
              <button onClick={closeSlideModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSlideSubmit} className="p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('backgroundImage')} *
                </label>
                <input
                  ref={slideFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSlideImageUpload}
                  className="hidden"
                />

                {slideFormImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={`${bucketUrl}${slideFormImage}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => slideFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white font-medium"
                    >
                      {t('changeImage')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => slideFileInputRef.current?.click()}
                    disabled={uploading === 'hero'}
                    className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-500 transition"
                  >
                    {uploading === 'hero' ? (
                      t('uploading')
                    ) : (
                      <>
                        <Upload size={32} className="mb-2" />
                        <span>{t('uploadImage')}</span>
                        <span className="text-xs mt-1">{t('recommendedSize')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('slideTitle')} *
                </label>
                <input
                  type="text"
                  required
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  placeholder={t('titlePlaceholder')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Highlight */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('highlight')}
                </label>
                <input
                  type="text"
                  value={slideFormData.highlight}
                  onChange={(e) => setSlideFormData({ ...slideFormData, highlight: e.target.value })}
                  placeholder={t('highlightPlaceholder')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {t('highlightDescription')}
                </p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('subtitle')}
                </label>
                <textarea
                  rows={2}
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  placeholder={t('subtitlePlaceholder')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={slideFormData.active}
                  onChange={(e) => setSlideFormData({ ...slideFormData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <label htmlFor="slideActive" className="text-sm font-medium text-slate-700">
                  {t('activeLabel')}
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeSlideModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition"
                >
                  {editingSlide ? t('updateSlide') : t('createSlide')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}