import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import BlogEditor from '@/components/admin/BlogEditor'

export default async function CreateBlogPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ edit?: string }>
}) {
  const { locale } = await params
  const { edit } = await searchParams
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/admin/login`)
  }

  // Check admin access
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!adminUser) {
    redirect(`/${locale}/admin/login`)
  }

  // Get translations
  const t = await getTranslations('admin.blogEditor')

  // If editing, fetch the blog post
  let post = null
  if (edit) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', edit)
      .single()
    post = data
  }

  // Build translations object
  const translations = {
    pageTitle: t('pageTitle'),
    editPageTitle: t('editPageTitle'),
    backToBlog: t('backToBlog'),
    title: t('title'),
    titlePlaceholder: t('titlePlaceholder'),
    slug: t('slug'),
    slugPlaceholder: t('slugPlaceholder'),
    excerpt: t('excerpt'),
    excerptPlaceholder: t('excerptPlaceholder'),
    content: t('content'),
    contentPlaceholder: t('contentPlaceholder'),
    featuredImage: t('featuredImage'),
    uploadImage: t('uploadImage'),
    changeImage: t('changeImage'),
    removeImage: t('removeImage'),
    author: t('author'),
    authorPlaceholder: t('authorPlaceholder'),
    status: t('status'),
    published: t('published'),
    draft: t('draft'),
    featured: t('featured'),
    featuredDescription: t('featuredDescription'),
    saveDraft: t('saveDraft'),
    publish: t('publish'),
    update: t('update'),
    saving: t('saving'),
    publishing: t('publishing'),
    validation: {
      titleRequired: t('validation.titleRequired'),
      slugRequired: t('validation.slugRequired'),
      contentRequired: t('validation.contentRequired'),
      authorRequired: t('validation.authorRequired')
    },
    success: {
      created: t('success.created'),
      updated: t('success.updated')
    },
    error: {
      createFailed: t('error.createFailed'),
      updateFailed: t('error.updateFailed'),
      uploadFailed: t('error.uploadFailed')
    },
    toolbar: {
      bold: t('toolbar.bold'),
      italic: t('toolbar.italic'),
      underline: t('toolbar.underline'),
      strikethrough: t('toolbar.strikethrough'),
      heading1: t('toolbar.heading1'),
      heading2: t('toolbar.heading2'),
      heading3: t('toolbar.heading3'),
      bulletList: t('toolbar.bulletList'),
      orderedList: t('toolbar.orderedList'),
      alignLeft: t('toolbar.alignLeft'),
      alignCenter: t('toolbar.alignCenter'),
      alignRight: t('toolbar.alignRight'),
      link: t('toolbar.link'),
      image: t('toolbar.image'),
      code: t('toolbar.code'),
      quote: t('toolbar.quote'),
      undo: t('toolbar.undo'),
      redo: t('toolbar.redo'),
      textColor: t('toolbar.textColor')
    }
  }

  return <BlogEditor post={post} t={translations} />
}
