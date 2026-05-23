import { prisma } from '@/lib/prisma'
import { Users, Tag, Calendar, Crown, Shield, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard | BNI Krypton' }

async function getStats() {
  const [totalMembers, totalCategories, totalEvents, membersByRole] = await Promise.all([
    prisma.member.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.member.groupBy({
      by: ['memberRole'],
      _count: { _all: true },
      where: { isActive: true },
    }),
  ])
  const roleCount = Object.fromEntries(membersByRole.map((r) => [r.memberRole, r._count._all]))
  return { totalMembers, totalCategories, totalEvents, roleCount }
}

export default async function AdminDashboard() {
  const { totalMembers, totalCategories, totalEvents, roleCount } = await getStats()

  const stats = [
    { label: 'Total Members',       value: totalMembers,         icon: Users,    topColor: '#B61F2B', href: '/admin/members' },
    { label: 'Categories',          value: totalCategories,      icon: Tag,      topColor: '#3b82f6', href: '/admin/categories' },
    { label: 'Published Events',    value: totalEvents,          icon: Calendar, topColor: '#a855f7', href: '/admin/events' },
    { label: 'Executive Directors', value: roleCount['ED'] ?? 0, icon: Crown,    topColor: '#D4AF37', href: '/admin/members?role=ED' },
  ]

  const roleBreakdown = [
    { label: 'Executive Directors', count: roleCount['ED'] ?? 0,         icon: Crown,  color: '#D4AF37', bg: 'rgba(212,175,55,0.10)' },
    { label: 'Head Table',          count: roleCount['HEAD_TABLE'] ?? 0, icon: Star,   color: '#818cf8', bg: 'rgba(129,140,248,0.10)' },
    { label: 'Support Team',        count: roleCount['SUPPORT'] ?? 0,    icon: Shield, color: '#E85464', bg: 'rgba(232,84,100,0.10)' },
    { label: 'Members',             count: roleCount['MEMBER'] ?? 0,     icon: Users,  color: '#38bdf8', bg: 'rgba(56,189,248,0.10)' },
  ]

  const quickActions = [
    { href: '/admin/members/new',   label: 'Add New Member',   icon: Users    },
    { href: '/admin/events/new',    label: 'Create Event',     icon: Calendar },
    { href: '/admin/categories/new',label: 'Add Category',     icon: Tag      },
    { href: '/',                    label: 'View Public Site', icon: TrendingUp},
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{
            color: '#F0F0F0',
            fontSize: 28,
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-0.02em',
            marginBottom: 6,
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500 }}>
            Executive oversight & network metrics for BNI Krypton Chapter, Nagpur
          </p>
        </div>
        <div style={{
          display: 'inline-flex',
          padding: '6px 14px',
          borderRadius: 8,
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          color: '#D4AF37',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          🛡️ Admin authorized
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: 20, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon, topColor, href }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="admin-stat-card" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: `1px solid rgba(255,255,255,0.07)`,
              borderTop: `3px solid ${topColor}`,
              borderRadius: 20,
              padding: '28px 24px',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s ease',
            }}>
              {/* Icon top-right */}
              <div style={{
                position: 'absolute', top: 22, right: 22,
                width: 36, height: 36, borderRadius: 10,
                background: `${topColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${topColor}30`
              }}>
                <Icon size={16} style={{ color: topColor }} />
              </div>
              {/* Value */}
              <div style={{
                fontSize: 38, fontWeight: 900, color: '#F0F0F0',
                fontFamily: '"Playfair Display", serif', letterSpacing: '-0.03em',
                lineHeight: 1, marginBottom: 12,
              }}>
                {value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em' }}>
                {label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: 24 }}>

        {/* Role Breakdown */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '28px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          <h2 style={{
            color: '#F0F0F0', fontSize: 14, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24,
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37' }} />
            Chapter Composition
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {roleBreakdown.map(({ label, count, icon: Icon, color, bg }) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${color}20`
                    }}>
                      <Icon size={13} style={{ color }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13.5, fontWeight: 600 }}>{label}</span>
                  </div>
                  <span style={{ color: '#F0F0F0', fontWeight: 800, fontSize: 15 }}>{count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    width: `${totalMembers > 0 ? Math.max((count / totalMembers) * 100, count > 0 ? 4 : 0) : 0}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '28px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
          <h2 style={{
            color: '#F0F0F0', fontSize: 14, fontWeight: 800,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B61F2B' }} />
            Quick Administration
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {quickActions.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="admin-quick-action" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={15} style={{ color: '#B61F2B' }} />
                  {label}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
