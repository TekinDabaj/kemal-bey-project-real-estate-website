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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-amber-400 mb-4">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                {t(error)}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}