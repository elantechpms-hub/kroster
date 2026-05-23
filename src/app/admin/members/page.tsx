import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Crown, Shield, Star, Users } from 'lucide-react'
import { getMemberRoleLabel, toTitleCase } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Members | Admin — BNI Krypton' }

const roleBadge: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  ED:         { label: 'ED',         bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', icon: Crown  },
  HEAD_TABLE: { label: 'Head Table', bg: 'rgba(129,140,248,0.12)', color: '#818cf8', icon: Star   },
  SUPPORT:    { label: 'Support',    bg: 'rgba(232,84,100,0.12)',  color: '#E85464', icon: Shield },
  MEMBER:     { label: 'Member',     bg: 'rgba(56,189,248,0.10)',  color: '#38bdf8', icon: Users  },
}

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: [{ memberRole: 'asc' }, { fullName: 'asc' }],
    include: { category: true }
  })

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{
            color: '#F0F0F0', fontSize: 22, fontWeight: 700,
            fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', marginBottom: 4,
          }}>
            Members
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            {members.length} total members in the directory
          </p>
        </div>
        <Link href="/admin/members/new" className="btn-primary" style={{ fontSize: 13 }}>
          <Plus size={14} /> Add Member
        </Link>
      </div>

      {/* Table */}
      <div style={{
        background: '#141414',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table" style={{ minWidth: 680 }}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const badge = roleBadge[member.memberRole] ?? roleBadge.MEMBER
                const BadgeIcon = badge.icon
                return (
                  <tr key={member.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10,
                          overflow: 'hidden', position: 'relative', flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <Image
                            src={member.profileImage || '/uploads/default-avatar.png'}
                            alt={toTitleCase(member.fullName)}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <div style={{ color: '#F0F0F0', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>
                            {toTitleCase(member.fullName)}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }}>
                            {member.businessName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 9px', borderRadius: 7,
                        background: badge.bg, color: badge.color,
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.03em',
                      }}>
                        <BadgeIcon size={11} />
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                      {member.category?.name || <span style={{ color: 'rgba(255,255,255,0.20)' }}>—</span>}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 9px', borderRadius: 7,
                        background: member.isActive ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
                        color: member.isActive ? '#4ade80' : '#f87171',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        <span style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: member.isActive ? '#4ade80' : '#f87171',
                          display: 'inline-block',
                        }} />
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/members/${member.id}/edit`} className="admin-edit-btn" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '7px 13px', borderRadius: 8,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: 12, fontWeight: 600,
                        textDecoration: 'none',
                      }}>
                        <Pencil size={12} /> Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 24px', color: 'rgba(255,255,255,0.30)' }}>
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
