import { createClient } from '@/lib/supabase/server'
import { Calendar, User, Clock } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { format } from 'date-fns'

export default async function BlogPage() {
  const t = await getTranslations('blog')
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return minutes
  }

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero */}
      <section className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white py-12 pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
          <p className="text-slate-300 dark:text-slate-400 max-w-2xl mx-auto text-sm">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 bg-slate-50 dark:bg-[#0c0a1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">{t('noPosts')}</p>
              <p className="mt-2 text-slate-400 dark:text-slate-500 text-sm">{t('checkBackSoon')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-purple-900/20 transition group border border-slate-100 dark:border-[#2d2a4a]"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
                    {post.featured_image ? (
                      <img
                        src={`${bucketUrl}${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500 text-slate-900">
                        {t('featured')}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-2">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap gap-3 text-slate-500 dark:text-slate-400 text-xs border-t border-slate-100 dark:border-[#2d2a4a] pt-3">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-slate-400 dark:text-slate-500" />
                        {post.author}
                      </span>
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400 dark:text-slate-500" />
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400 dark:text-slate-500" />
                        {calculateReadTime(post.content)} {t('minRead')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white dark:bg-[#13102b] dark:border-t dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('ctaTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">{t('ctaDescription')}</p>
          <Link
            href="/book"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}
