import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { SettingsForm } from './SettingsForm'

export const metadata: Metadata = { title: 'Chapter Settings | BNI Krypton' }

async function getSettings() {
  const dbSettings = await prisma.setting.findMany()
  const settingsObj: Record<string, string> = {
    chapter_name: 'BNI Krypton',
    chapter_city: 'Nagpur',
    contact_email: 'krypton@bninagpur.com',
    contact_phone: '+91-98765-43210',
  }

  dbSettings.forEach((s) => {
    settingsObj[s.key] = s.value
  })

  return settingsObj
}

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          color: '#F0F0F0', fontSize: 22, fontWeight: 700,
          fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Chapter Settings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          Configure regional settings, BNI parameters, and global chapter metadata
        </p>
      </div>

      <div style={{
        background: '#161616',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20,
        padding: '36px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  )
}
