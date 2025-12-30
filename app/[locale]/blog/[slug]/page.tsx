import { createClient } from '@/lib/supabase/server'
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = await getTranslations('blog')
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return minutes
  }

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, featured_image, published_at')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <div className="bg-white dark:bg-[#0c0a1d]">
      {/* Hero with Featured Image */}
      <section className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-6"
          >
            <ArrowLeft size={16} />
            {t('backToBlog')}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
            <span className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </span>
            {post.published_at && (
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {calculateReadTime(post.content)} {t('minRead')}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <img
              src={`${bucketUrl}${post.featured_image}`}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover rounded-lg"
            />
          </div>
        )}
      </section>

      {/* Content */}
      <article className="py-12 bg-white dark:bg-[#0c0a1d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg prose-slate dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-p:text-slate-600 dark:prose-p:text-slate-300
              prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-900 dark:prose-strong:text-white
              prose-blockquote:border-amber-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-[#13102b] prose-blockquote:rounded-r-lg prose-blockquote:py-1
              prose-code:text-amber-600 dark:prose-code:text-amber-400 prose-code:bg-slate-100 dark:prose-code:bg-[#1a1735] prose-code:px-1 prose-code:rounded
              prose-pre:bg-slate-900 dark:prose-pre:bg-[#13102b]
              prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 bg-slate-50 dark:bg-[#0c0a1d] dark:border-t dark:border-[#2d2a4a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('relatedPosts')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="bg-white dark:bg-[#13102b] rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-purple-900/20 transition group border border-slate-100 dark:border-[#2d2a4a]"
                >
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-[#1a1735]">
                    {relatedPost.featured_image ? (
                      <img
                        src={`${bucketUrl}${relatedPost.featured_image}`}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                        <span className="text-4xl">📝</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    {relatedPost.published_at && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        {format(new Date(relatedPost.published_at), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-white dark:bg-[#13102b] dark:border-t dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('ctaTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-5">{t('ctaDescription')}</p>
          <Link
            href={`/${locale}/book`}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  )
}
