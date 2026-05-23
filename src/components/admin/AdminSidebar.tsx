'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Tag, Calendar, Settings, LogOut, BarChart3, ExternalLink } from 'lucide-react'
import { signOut } from 'next-auth/react'

const manageItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/events', label: 'Events', icon: Calendar },
]

const systemItems = [
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavItem({ href, label, icon: Icon, exact }: { href: string; label: string; icon: React.ElementType; exact?: boolean }) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 10, fontSize: 13.5,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? '#F0F0F0' : 'rgba(255,255,255,0.42)',
        textDecoration: 'none',
        background: isActive ? 'rgba(182,31,43,0.12)' : 'transparent',
        borderLeft: isActive ? '2px solid #B61F2B' : '2px solid transparent',
        transition: 'all 0.18s ease',
        marginLeft: -1,
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.80)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.42)';
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }
      }}
    >
      <Icon size={15} style={{ flexShrink: 0 }} />
      {label}
    </Link>
  )
}

export function AdminSidebar() {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 232,
      background: '#0F0F0F',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      zIndex: 30,
    }} className="hidden md:flex">

      {/* Logo */}
      <div style={{
        padding: '20px 20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #B61F2B, #6e0f19)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(182,31,43,0.4)',
            flexShrink: 0, position: 'relative',
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 10, fontFamily: '"Playfair Display", serif' }}>BNI</span>
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 7, height: 7, borderRadius: '50%',
              background: '#D4AF37', border: '1.5px solid #0F0F0F',
            }} />
          </div>
          <div>
            <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>BNI Krypton</div>
            <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Manage group */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
            padding: '0 12px', marginBottom: 6,
          }}>
            Manage
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {manageItems.map(item => <NavItem key={item.href} {...item} />)}
          </div>
        </div>

        {/* System group */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
            padding: '0 12px', marginBottom: 6,
          }}>
            System
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {systemItems.map(item => <NavItem key={item.href} {...item} />)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <Link href="/" target="_blank" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 12px', borderRadius: 10,
          color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 500,
          textDecoration: 'none',
          transition: 'all 0.18s ease',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <ExternalLink size={13} />
          View Public Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px', borderRadius: 10, width: '100%',
            background: 'transparent', border: 'none',
            color: 'rgba(239,68,68,0.55)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.18s ease', textAlign: 'left',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.07)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.55)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
