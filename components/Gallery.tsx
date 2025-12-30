import { createClient } from '@/lib/supabase/server'

export default async function Gallery() {
  const supabase = await createClient()
  
  const { data: imageFiles } = await supabase.storage
    .from('images')
    .list('homepage')

  const images = imageFiles?.filter(f => f.name !== '.emptyFolderPlaceholder') || []

  if (images.length === 0) return null

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/homepage/`

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Properties</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.name} className="aspect-video rounded-xl overflow-hidden shadow-md">
              <img
                src={`${bucketUrl}${image.name}`}
                alt="Property"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}