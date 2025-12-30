'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Star, GripVertical, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UploadingImage = {
  id: string
  file: File
  progress: number
  preview: string
}

type Props = {
  images: string[]
  onImagesChange: (images: string[]) => void
  folder: string
  maxImages?: number
  t: {
    dragDrop: string
    maxSize: string
    uploading: string
    uploadProgress: string
    uploadComplete: string
    removeImage: string
    setCover: string
    cover: string
  }
}

export default function ImageUploader({ images, onImagesChange, folder, maxImages = 20, t }: Props) {
  const [uploading, setUploading] = useState<UploadingImage[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const uploadFile = async (file: File, uploadId: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Simulate progress (Supabase doesn't provide real progress)
    const progressInterval = setInterval(() => {
      setUploading(prev => prev.map(u =>
        u.id === uploadId && u.progress < 90
          ? { ...u, progress: u.progress + 10 }
          : u
      ))
    }, 200)

    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      clearInterval(progressInterval)

      if (error) {
        console.error('Upload error:', error)
        return null
      }

      setUploading(prev => prev.map(u =>
        u.id === uploadId ? { ...u, progress: 100 } : u
      ))

      return fileName
    } catch (err) {
      clearInterval(progressInterval)
      console.error('Upload error:', err)
      return null
    }
  }

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    const availableSlots = maxImages - images.length - uploading.length
    const filesToUpload = fileArray.slice(0, availableSlots)

    if (filesToUpload.length === 0) return

    // Create preview entries
    const newUploading: UploadingImage[] = filesToUpload.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      preview: URL.createObjectURL(file)
    }))

    setUploading(prev => [...prev, ...newUploading])

    // Upload files
    const uploadPromises = newUploading.map(async (upload) => {
      const fileName = await uploadFile(upload.file, upload.id)
      return { id: upload.id, fileName }
    })

    const results = await Promise.all(uploadPromises)

    // Clean up and update images
    const successfulUploads = results.filter(r => r.fileName).map(r => r.fileName as string)

    // Clean up previews
    newUploading.forEach(u => URL.revokeObjectURL(u.preview))

    // Remove from uploading and add to images
    setUploading(prev => prev.filter(u => !results.find(r => r.id === u.id)))
    onImagesChange([...images, ...successfulUploads])
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [images, uploading])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)

    // Delete from storage
    await supabase.storage.from('images').remove([imageToRemove])
  }

  const setCoverImage = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const [removed] = newImages.splice(index, 1)
    newImages.unshift(removed)
    onImagesChange(newImages)
  }

  const canUpload = images.length + uploading.length < maxImages

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {canUpload && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragOver
              ? 'border-amber-400 bg-amber-50'
              : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? 'text-amber-500' : 'text-slate-400'}`} />
          <p className="text-sm text-slate-600">{t.dragDrop}</p>
          <p className="text-xs text-slate-400 mt-1">{t.maxSize}</p>
        </div>
      )}

      {/* Uploading Progress */}
      {uploading.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploading.map((upload) => (
            <div key={upload.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
              <img
                src={upload.preview}
                alt="Uploading"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray={`${upload.progress} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {upload.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={image} className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-slate-100">
              <img
                src={`${bucketUrl}${image}`}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Cover badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-slate-900 text-xs font-medium rounded">
                  {t.cover}
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(index)}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition"
                    title={t.setCover}
                  >
                    <Star size={16} className="text-amber-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition"
                  title={t.removeImage}
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && uploading.length === 0 && (
        <div className="flex items-center justify-center h-32 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-center text-slate-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-1" />
            <p className="text-xs">No images uploaded</p>
          </div>
        </div>
      )}
    </div>
  )
}
