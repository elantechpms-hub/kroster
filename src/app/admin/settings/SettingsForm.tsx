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
    <form onSubmit={handleSubmit} className="space-y-10 premium-settings-form">
      <div className="premium-card space-y-8">
        <div>
          <div className="section-header">
            <Settings size={20} className="text-[#E62738]" />
            <h2 className="section-title">Roster Metadata</h2>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label>BNI Chapter Name</label>
              <input
                type="text"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                required
                className="premium-input"
                placeholder="e.g. BNI Krypton"
              />
            </div>

            <div className="input-group">
              <label>Chapter City</label>
              <input
                type="text"
                value={chapterCity}
                onChange={(e) => setChapterCity(e.target.value)}
                required
                className="premium-input"
                placeholder="e.g. Nagpur"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="section-header">
            <ShieldCheck size={20} className="text-[#E62738]" />
            <h2 className="section-title">Contact Info & Helpdesk</h2>
          </div>

          <div className="form-grid-2">
            <div className="input-group">
              <label>Chapter Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="premium-input"
                placeholder="e.g. chapter@bninagpur.com"
              />
            </div>

            <div className="input-group">
              <label>Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                className="premium-input"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          className="btn-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="btn-save flex items-center gap-2"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <style>{`
        .premium-settings-form {
          font-family: 'Inter', sans-serif;
        }

        .premium-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .premium-input {
          width: 100%;
          background: rgba(0,0,0,0.2) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px;
          padding: 14px 16px;
          color: #ffffff;
          font-size: 15px;
          transition: all 0.2s ease;
          outline: none;
        }

        .premium-input:focus {
          background: rgba(255,255,255,0.03) !important;
          border-color: #E62738 !important;
          box-shadow: 0 0 0 3px rgba(230,39,56,0.15);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 16px;
        }

        .btn-cancel {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: rgba(255,255,255,0.7) !important;
          padding: 12px 28px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #ffffff !important;
        }

        .btn-save {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)) !important;
          color: #ffffff !important;
          border: none !important;
          padding: 12px 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 8px 20px rgba(230, 39, 56, 0.3) !important;
          transition: all 0.2s ease !important;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(230, 39, 56, 0.4) !important;
        }

        .btn-save:active {
          transform: translateY(0);
        }
        
        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </form>
  )
}
