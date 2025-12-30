'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AdminLogin() {
  const t = useTranslations('admin.login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<'invalidCredentials' | 'noAccess' | ''>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError('invalidCredentials')
      setLoading(false)
      return
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .single()

    if (!adminUser) {
      await supabase.auth.signOut()
      setError('noAccess')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8 bg-slate-50 dark:bg-[#0c0a1d]">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-[#13102b] p-6 rounded-lg border border-slate-200 dark:border-[#2d2a4a]">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 dark:bg-[#2d2a4a] mb-3">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{t('title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded text-sm">
                {t(error)}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {t('password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signingIn')}
                </span>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            {t('secureConnection')}
          </p>
        </div>
      </div>
    </div>
  )
}