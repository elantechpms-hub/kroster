'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { updateSettings } from '@/app/admin/actions'
import { Settings, Save, ShieldCheck } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [chapterName, setChapterName] = useState(initialSettings.chapter_name || '')
  const [chapterCity, setChapterCity] = useState(initialSettings.chapter_city || '')
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || '')
  const [contactPhone, setContactPhone] = useState(initialSettings.contact_phone || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateSettings({
        chapter_name: chapterName,
        chapter_city: chapterCity,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      })
      toast.success('Chapter settings saved successfully')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
        <Settings size={18} style={{ color: '#B61F2B' }} />
        <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Roster Metadata</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="md:grid-cols-2">
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 6 }}>
            BNI Chapter Name
          </label>
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 14px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
            placeholder="e.g. BNI Krypton"
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 6 }}>
            Chapter City
          </label>
          <input
            type="text"
            value={chapterCity}
            onChange={(e) => setChapterCity(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 14px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
            placeholder="e.g. Nagpur"
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 12 }}>
        <ShieldCheck size={18} style={{ color: '#B61F2B' }} />
        <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>Contact Info & Helpdesk</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="md:grid-cols-2">
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 6 }}>
            Chapter Contact Email
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 14px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
            placeholder="e.g. chapter@bninagpur.com"
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', display: 'block', marginBottom: 6 }}>
            Support Phone
          </label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '10px 14px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
            }}
            placeholder="e.g. +91 98765 43210"
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, gap: 12 }}>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, #B61F2B, #7A111B)', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Save size={14} />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}
