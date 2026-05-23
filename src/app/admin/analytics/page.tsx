import { prisma } from '@/lib/prisma'
import { BarChart3, Users, Phone, MessageSquare, Globe, Share2 } from 'lucide-react'
import type { Metadata } from 'next'
import { toTitleCase } from '@/lib/utils'

export const metadata: Metadata = { title: 'Analytics Dashboard | BNI Krypton' }

async function getAnalyticsData() {
  const analyticsList = await prisma.memberAnalytics.findMany({
    include: {
      member: {
        select: {
          fullName: true,
          businessName: true,
          profileImage: true,
        }
      }
    },
    orderBy: {
      profileViews: 'desc'
    }
  })

  // Calculate Aggregates
  const aggregates = analyticsList.reduce(
    (acc, item) => {
      acc.views += item.profileViews
      acc.calls += item.callClicks
      acc.wa += item.waClicks
      acc.web += item.webClicks
      acc.shares += item.shareCount
      return acc
    },
    { views: 0, calls: 0, wa: 0, web: 0, shares: 0 }
  )

  return { analyticsList, aggregates }
}

export default async function AnalyticsPage() {
  const { analyticsList, aggregates } = await getAnalyticsData()

  const stats = [
    { label: 'Total Profile Views', value: aggregates.views, icon: Users, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
    { label: 'Total Call Clicks', value: aggregates.calls, icon: Phone, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
    { label: 'WhatsApp Clicks', value: aggregates.wa, icon: MessageSquare, color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
    { label: 'Website Clicks', value: aggregates.web, icon: Globe, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { label: 'Total Profile Shares', value: aggregates.shares, icon: Share2, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          color: '#F0F0F0', fontSize: 22, fontWeight: 700,
          fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Roster Analytics
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          Track views, interactions, and connections across the roster chapter
        </p>
      </div>

      {/* Aggregate Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            background: '#161616',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 16, right: 16,
              width: 28, height: 28, borderRadius: 8,
              background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={13} style={{ color }} />
            </div>
            <div style={{
              fontSize: 28, fontWeight: 850, color: '#F0F0F0',
              fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em',
              lineHeight: 1, marginBottom: 6,
            }}>
              {value}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: 11.5, fontWeight: 600 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics List Table */}
      <div style={{
        background: '#161616',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: '24px',
        overflowX: 'auto',
      }}>
        <h2 style={{
          color: 'rgba(255,255,255,0.70)', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18,
        }}>
          Member Interaction Log
        </h2>

        {analyticsList.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px 0', textAlign: 'center', fontSize: 14 }}>
            No analytics events logged yet. Clicks will compile as visitors browse profiles.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Company</th>
                <th style={{ textAlign: 'right' }}>Views</th>
                <th style={{ textAlign: 'right' }}>Calls</th>
                <th style={{ textAlign: 'right' }}>WhatsApp</th>
                <th style={{ textAlign: 'right' }}>Web Clicks</th>
                <th style={{ textAlign: 'right' }}>Shares</th>
              </tr>
            </thead>
            <tbody>
              {analyticsList.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: '#fff' }}>
                    {toTitleCase(item.member.fullName)}
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {item.member.businessName}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                    {item.profileViews}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#4ade80' }}>
                    {item.callClicks}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#25D366' }}>
                    {item.waClicks}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#a78bfa' }}>
                    {item.webClicks}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#f43f5e' }}>
                    {item.shareCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
