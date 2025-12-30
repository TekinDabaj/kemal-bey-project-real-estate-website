'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Trash2, Save, Image as ImageIcon } from 'lucide-react'

type Props = {
  initialImages: string[]
}

export default function ContentEditor({ initialImages }: Props) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (!error) {
        setImages(prev => [...prev, fileName])
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

  async function handleDelete(fileName: string) {
    if (!confirm('Are you sure you want to delete this image?')) return

    const { error } = await supabase.storage
      .from('images')
      .remove([fileName])

    if (!error) {
      setImages(images.filter(img => img !== fileName))
    } else {
      alert('Failed to delete image')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Gallery Images</h2>
        <p className="text-slate-600 text-sm mb-4">
          Upload images to display on the website. Recommended size: 1200x800px.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          <Upload size={18} />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((fileName) => (
            <div key={fileName} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden">
              <img
                src={`${bucketUrl}${fileName}`}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(fileName)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-2">How to use these images</h3>
        <p className="text-slate-500 text-sm">
          These images can be displayed on the homepage or services page. Copy the URL below to use anywhere:
        </p>
        {images.length > 0 && (
          <code className="block mt-2 p-2 bg-slate-100 rounded text-xs text-slate-600 break-all">
            {bucketUrl}{images[0]}
          </code>
        )}
      </div>
    </div>
  )
}