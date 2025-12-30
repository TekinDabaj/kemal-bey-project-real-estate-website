'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/types/database'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Upload,
  ArrowLeft,
  Save,
  Send,
  Palette,
  X
} from 'lucide-react'

type TranslationsType = {
  pageTitle: string
  editPageTitle: string
  backToBlog: string
  title: string
  titlePlaceholder: string
  slug: string
  slugPlaceholder: string
  excerpt: string
  excerptPlaceholder: string
  content: string
  contentPlaceholder: string
  featuredImage: string
  uploadImage: string
  changeImage: string
  removeImage: string
  author: string
  authorPlaceholder: string
  status: string
  published: string
  draft: string
  featured: string
  featuredDescription: string
  saveDraft: string
  publish: string
  update: string
  saving: string
  publishing: string
  validation: {
    titleRequired: string
    slugRequired: string
    contentRequired: string
    authorRequired: string
  }
  success: {
    created: string
    updated: string
  }
  error: {
    createFailed: string
    updateFailed: string
    uploadFailed: string
  }
  toolbar: {
    bold: string
    italic: string
    underline: string
    strikethrough: string
    heading1: string
    heading2: string
    heading3: string
    bulletList: string
    orderedList: string
    alignLeft: string
    alignCenter: string
    alignRight: string
    link: string
    image: string
    code: string
    quote: string
    undo: string
    redo: string
    textColor: string
  }
}

type Props = {
  post?: BlogPost | null
  t: TranslationsType
}

export default function BlogEditor({ post, t }: Props) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'en'
  const supabase = createClient()
  const isEditing = !!post

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    author: post?.author || '',
    status: post?.status || 'draft' as 'published' | 'draft',
    featured: post?.featured || false
  })
  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.featured_image || null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorImageInputRef = useRef<HTMLInputElement>(null)
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-500 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg'
        }
      }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: t.contentPlaceholder
      })
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none'
      }
    }
  })

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  // Handle featured image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const file = files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (!error) {
      setFeaturedImage(fileName)
    } else {
      alert(t.error.uploadFailed)
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle editor image upload
  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !editor) return

    setUploading(true)
    const file = files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (!error) {
      editor.chain().focus().setImage({ src: `${bucketUrl}${fileName}` }).run()
    } else {
      alert(t.error.uploadFailed)
    }

    setUploading(false)
    if (editorImageInputRef.current) {
      editorImageInputRef.current.value = ''
    }
  }

  // Add link
  const addLink = () => {
    if (!editor) return
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  // Set text color
  const setColor = (color: string) => {
    if (!editor) return
    editor.chain().focus().setColor(color).run()
    setShowColorPicker(false)
  }

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = t.validation.titleRequired
    }
    if (!formData.slug.trim()) {
      newErrors.slug = t.validation.slugRequired
    }
    if (!editor?.getHTML() || editor.getHTML() === '<p></p>') {
      newErrors.content = t.validation.contentRequired
    }
    if (!formData.author.trim()) {
      newErrors.author = t.validation.authorRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (asDraft: boolean = false) => {
    if (!validate()) return

    setSaving(true)

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: editor?.getHTML() || '',
      featured_image: featuredImage,
      author: formData.author,
      status: asDraft ? 'draft' : formData.status,
      featured: formData.featured,
      published_at: !asDraft && formData.status === 'published' ? new Date().toISOString() : post?.published_at || null,
      updated_at: new Date().toISOString()
    }

    if (isEditing && post) {
      const { error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', post.id)

      if (error) {
        alert(t.error.updateFailed)
        setSaving(false)
        return
      }
    } else {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          created_at: new Date().toISOString()
        })

      if (error) {
        alert(t.error.createFailed)
        setSaving(false)
        return
      }
    }

    router.push(`/${locale}/admin`)
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', '#F59E0B',
    '#22C55E', '#14B8A6', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0a1d]">
      {/* Header */}
      <div className="bg-white dark:bg-[#13102b] border-b border-slate-200 dark:border-[#2d2a4a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/${locale}/admin`)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft size={20} />
              {t.backToBlog}
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-[#2d2a4a] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1a1735] transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? t.saving : t.saveDraft}
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition disabled:opacity-50"
              >
                <Send size={18} />
                {saving ? t.publishing : isEditing ? t.update : t.publish}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          {isEditing ? t.editPageTitle : t.pageTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.title} *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder={t.titlePlaceholder}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none ${
                  errors.title ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.slug} *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder={t.slugPlaceholder}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none ${
                  errors.slug ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                }`}
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.content} *
              </label>

              {/* Toolbar */}
              <div className="bg-white dark:bg-[#13102b] border border-slate-300 dark:border-[#2d2a4a] rounded-t-lg p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('bold') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.bold}
                >
                  <Bold size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('italic') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.italic}
                >
                  <Italic size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('underline') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.underline}
                >
                  <UnderlineIcon size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('strike') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.strikethrough}
                >
                  <Strikethrough size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Headings */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.heading1}
                >
                  <Heading1 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.heading2}
                >
                  <Heading2 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.heading3}
                >
                  <Heading3 size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Lists */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('bulletList') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.bulletList}
                >
                  <List size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('orderedList') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.orderedList}
                >
                  <ListOrdered size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Alignment */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.alignLeft}
                >
                  <AlignLeft size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.alignCenter}
                >
                  <AlignCenter size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.alignRight}
                >
                  <AlignRight size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Link & Image */}
                <button
                  type="button"
                  onClick={addLink}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('link') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.link}
                >
                  <LinkIcon size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editorImageInputRef.current?.click()}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition"
                  title={t.toolbar.image}
                >
                  <ImageIcon size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Code & Quote */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('codeBlock') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.code}
                >
                  <Code size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition ${
                    editor?.isActive('blockquote') ? 'bg-slate-200 dark:bg-[#2d2a4a]' : ''
                  }`}
                  title={t.toolbar.quote}
                >
                  <Quote size={18} className="text-slate-600 dark:text-slate-400" />
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Color Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition"
                    title={t.toolbar.textColor}
                  >
                    <Palette size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-[#13102b] border border-slate-300 dark:border-[#2d2a4a] rounded-lg shadow-lg z-10 grid grid-cols-6 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setColor(color)}
                          className="w-6 h-6 rounded border border-slate-200 dark:border-[#2d2a4a]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-slate-300 dark:bg-[#2d2a4a] mx-1 self-center" />

                {/* Undo/Redo */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition disabled:opacity-50"
                  title={t.toolbar.undo}
                >
                  <Undo size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className="p-2 rounded hover:bg-slate-100 dark:hover:bg-[#1a1735] transition disabled:opacity-50"
                  title={t.toolbar.redo}
                >
                  <Redo size={18} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Editor Content */}
              <div className={`bg-white dark:bg-[#1a1735] border border-t-0 rounded-b-lg ${
                errors.content ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
              }`}>
                <EditorContent editor={editor} />
              </div>
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}

              {/* Hidden file inputs */}
              <input
                ref={editorImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditorImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {t.featuredImage}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {featuredImage ? (
                <div className="relative">
                  <img
                    src={`${bucketUrl}${featuredImage}`}
                    alt="Featured"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white/90 rounded-lg text-slate-700 hover:bg-white"
                    >
                      <Upload size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="p-2 bg-red-500/90 rounded-lg text-white hover:bg-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full aspect-video border-2 border-dashed border-slate-300 dark:border-[#2d2a4a] rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-amber-400 hover:text-amber-500 transition"
                >
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm">{uploading ? 'Uploading...' : t.uploadImage}</span>
                </button>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.excerpt}
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder={t.excerptPlaceholder}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
              />
            </div>

            {/* Author */}
            <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t.author} *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder={t.authorPlaceholder}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm ${
                  errors.author ? 'border-red-500' : 'border-slate-300 dark:border-[#2d2a4a]'
                }`}
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>

            {/* Status & Featured */}
            <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t.status}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                >
                  <option value="draft">{t.draft}</option>
                  <option value="published">{t.published}</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                />
                <div>
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t.featured}
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.featuredDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
