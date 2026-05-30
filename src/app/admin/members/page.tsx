import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'
import { AdminMembersList } from '@/components/admin/AdminMembersList'

export const metadata: Metadata = { title: 'Members | Admin — BNI Krypton' }

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
    orderBy: [{ memberRole: 'asc' }, { fullName: 'asc' }],
    include: { category: true }
  })

  // Serialize to plain objects for client component
  const serializedMembers = members.map(m => ({
    id: m.id,
    fullName: m.fullName,
    businessName: m.businessName,
    profileImage: m.profileImage,
    memberRole: m.memberRole,
    isActive: m.isActive,
    slug: m.slug,
    phone: m.phone,
    whatsapp: m.whatsapp,
    website: m.website,
    shortIntro: m.shortIntro,
    teamRole: m.teamRole,
    displayOrder: m.displayOrder,
    category: m.category ? { name: m.category.name, slug: m.category.slug } : null,
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
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
            Members Directory
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500 }}>
            {members.length} registered active and leadership members
          </p>
        </div>
        <Link href="/admin/members/new" className="btn-primary" style={{
          fontSize: 13.5,
          fontWeight: 700,
          padding: '12px 24px',
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(182,31,43,0.3)',
        }}>
          <Plus size={15} /> Add New Member
        </Link>
      </div>

      <AdminMembersList members={serializedMembers} />
    </div>
  )
}
