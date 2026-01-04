'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/types/database'
import { Plus, Pencil, Trash2, Image as ImageIcon, ExternalLink, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'

type Props = {
  initialPosts: BlogPost[]
}

export default function BlogManager({ initialPosts }: Props) {
  const t = useTranslations('admin.blog')
  const params = useParams()
  const locale = params.locale as string || 'en'
  const [posts, setPosts] = useState(initialPosts)
  const supabase = createClient()

  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (!error) {
      setPosts(posts.filter(p => p.id !== id))
    } else {
      alert(t('deleteFailed'))
    }
  }

  const statusColors = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  const statusLabels = {
    published: t('published'),
    draft: t('draft')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('title')}</h2>
        <Link
          href={`/${locale}/admin/createblog`}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} /> {t('createNew')}
        </Link>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-white dark:bg-[#13102b] rounded-lg p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#2d2a4a]">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p>{t('noPosts')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4">
              {/* Mobile: Stacked layout, Desktop: Horizontal layout */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnail */}
                <div className="w-full sm:w-32 h-40 sm:h-24 bg-slate-100 dark:bg-[#1a1735] rounded-lg overflow-hidden shrink-0">
                  {post.featured_image ? (
                    <img
                      src={`${bucketUrl}${post.featured_image}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  {/* Title and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate">{post.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 sm:truncate">
                        {post.excerpt || t('noExcerpt')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[post.status]}`}>
                        {statusLabels[post.status]}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          {t('featured')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Author and Date */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>{t('by')} {post.author}</span>
                    <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Actions - Full width on mobile */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-[#2d2a4a] sm:mt-0 sm:pt-0 sm:border-0">
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  target="_blank"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2d2a4a] transition text-sm sm:text-base"
                  title={t('view')}
                >
                  <ExternalLink size={16} />
                  <span className="sm:hidden">View</span>
                </Link>
                <Link
                  href={`/${locale}/admin/createblog?edit=${post.id}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2d2a4a] transition text-sm sm:text-base"
                  title={t('edit')}
                >
                  <Pencil size={16} />
                  <span className="sm:hidden">Edit</span>
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm sm:text-base"
                  title={t('delete')}
                >
                  <Trash2 size={16} />
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
