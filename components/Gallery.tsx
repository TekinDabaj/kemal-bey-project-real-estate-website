import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Gallery() {
  const supabase = await createClient()
  
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, images')
    .in('status', ['active', 'sold', 'rented'])
    .not('images', 'eq', '{}')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(6)

  const propertiesWithImages = properties?.filter(p => p.images && p.images.length > 0) || []

  if (propertiesWithImages.length === 0) return null

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Our Properties</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertiesWithImages.map((property) => (
            <Link 
              key={property.id} 
              href={`/properties/${property.id}`}
              className="group aspect-video rounded-xl overflow-hidden shadow-md"
            >
              <img
                src={`${bucketUrl}${property.images[0]}`}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/properties"
            className="inline-block text-amber-600 hover:text-amber-700 font-medium"
          >
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  )
}