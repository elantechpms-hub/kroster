'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pencil, Crown, Shield, Star, Users, LayoutGrid, List } from 'lucide-react'
import { getMemberRoleLabel, toTitleCase } from '@/lib/utils'
import { MemberCard } from '@/components/members/MemberCard'

type AdminMember = {
  id: string
  fullName: string
  businessName: string
  profileImage: string | null
  memberRole: string
  isActive: boolean
  slug: string
  phone: string | null
  whatsapp: string | null
  website: string | null
  shortIntro: string | null
  teamRole: string | null
  displayOrder: number | null
  category: { name: string; slug: string } | null
}

const roleBadge: Record<string, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  ED:         { label: 'ED',         bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37', icon: Crown  },
  HEAD_TABLE: { label: 'Head Table', bg: 'rgba(129,140,248,0.12)', color: '#818cf8', icon: Star   },
  SUPPORT:    { label: 'Support',    bg: 'rgba(232,84,100,0.12)',  color: '#E85464', icon: Shield },
  MEMBER:     { label: 'Member',     bg: 'rgba(56,189,248,0.10)',  color: '#38bdf8', icon: Users  },
}

export function AdminMembersList({ members }: { members: AdminMember[] }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  return (
    <>
      {/* View Toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        marginBottom: 20,
      }}>
        <div style={{
          display: 'flex', gap: 2, padding: 3, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            onClick={() => setViewMode('list')}
            title="Table view"
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: viewMode === 'list' ? 'rgba(182, 31, 43, 0.25)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s',
            }}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: viewMode === 'grid' ? 'rgba(182, 31, 43, 0.25)' : 'transparent',
              color: viewMode === 'grid' ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s',
            }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'list' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ minWidth: 800 }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
                  <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Member Details</th>
                  <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Role / Status</th>
                  <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Business Category</th>
                  <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em' }}>Directory Status</th>
                  <th style={{ padding: '18px 24px', fontSize: 11, letterSpacing: '0.08em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  const badge = roleBadge[member.memberRole] ?? roleBadge.MEMBER
                  const BadgeIcon = badge.icon
                  return (
                    <tr key={member.id} className="transition-colors hover:bg-white/[0.02]">
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            overflow: 'hidden', position: 'relative', flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: '#111111'
                          }}>
                            <Image
                              src={member.profileImage || '/uploads/default-avatar.png'}
                              alt={toTitleCase(member.fullName)}
                              fill
                              style={{ objectFit: 'cover', objectPosition: 'top center' }}
                            />
                          </div>
                          <div>
                            <div style={{ color: '#F0F0F0', fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em' }}>
                              {toTitleCase(member.fullName)}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12, marginTop: 2 }}>
                              {toTitleCase(member.businessName)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '5px 10px', borderRadius: 8,
                          background: badge.bg, color: badge.color,
                          fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          border: `1px solid ${badge.color}25`
                        }}>
                          <BadgeIcon size={12} />
                          {getMemberRoleLabel(member.memberRole, member.fullName)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.55)', fontSize: 13.5, fontWeight: 500 }}>
                        {member.category?.name ? toTitleCase(member.category.name) : <span style={{ color: 'rgba(255,255,255,0.20)' }}>—</span>}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '5px 10px', borderRadius: 8,
                          background: member.isActive ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)',
                          color: member.isActive ? '#4ade80' : '#f87171',
                          fontSize: 11, fontWeight: 700,
                          border: member.isActive ? '1px solid rgba(34,197,94,0.20)' : '1px solid rgba(239,68,68,0.20)'
                        }}>
                          <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: member.isActive ? '#4ade80' : '#f87171',
                            display: 'inline-block',
                          }} />
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <Link href={`/admin/members/${member.id}/edit`} className="admin-edit-btn" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '8px 14px', borderRadius: 10,
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.65)',
                          fontSize: 12.5, fontWeight: 700,
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                        }}>
                          <Pencil size={12} style={{ color: '#D4AF37' }} /> Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.30)' }}>
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {members.map((member, i) => (
            <div key={member.id} style={{ position: 'relative' }}>
              <MemberCard
                member={member as any}
                index={i}
                variant="grid"
              />
              {/* Edit overlay button */}
              <Link
                href={`/admin/members/${member.id}/edit`}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 20,
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#D4AF37',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                title="Edit member"
              >
                <Pencil size={14} />
              </Link>
            </div>
          ))}
          {members.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.30)' }}>
              No members found.
            </div>
          )}
        </div>
      )}
    </>
  )
}
