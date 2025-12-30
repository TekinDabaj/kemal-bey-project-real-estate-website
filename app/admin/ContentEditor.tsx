'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Image as ImageIcon, Home } from 'lucide-react'

type Props = {
  initialImages: {
    homepage: string[]
  }
}

export default function ContentEditor({ initialImages }: Props) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const categories = [
    {
      id: 'homepage',
      label: 'Home Page Property Images',
      icon: Home,
      description: 'These images appear in the gallery section on the homepage.'
    }
  ]

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, folder: string) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(folder)

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (!error) {
        setImages(prev => ({
          ...prev,
          [folder]: [...prev[folder as keyof typeof prev], fileName]
        }))
      } else {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    setUploading(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleDelete(fileName: string, folder: string) {
    if (!confirm('Are you sure you want to delete this image?')) return

    const { error } = await supabase.storage
      .from('images')
      .remove([fileName])

    if (!error) {
      setImages(prev => ({
        ...prev,
        [folder]: prev[folder as keyof typeof prev].filter(img => img !== fileName)
      }))
    } else {
      alert('Failed to delete image')
    }
  }

  function openUpload(categoryId: string) {
    setActiveCategory(categoryId)
    setTimeout(() => fileInputRef.current?.click(), 100)
  }

  return (
    <div className="space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => activeCategory && handleUpload(e, activeCategory)}
        className="hidden"
      />

      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{category.label}</h3>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </div>
              </div>
              <button
                onClick={() => openUpload(category.id)}
                disabled={uploading === category.id}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
              >
                <Upload size={16} />
                {uploading === category.id ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {images[category.id as keyof typeof images].length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images[category.id as keyof typeof images].map((fileName) => (
                  <div key={fileName} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={`${bucketUrl}${fileName}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleDelete(fileName, category.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}