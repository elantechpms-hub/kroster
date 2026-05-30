import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { MemberForm } from '@/components/admin/MemberForm'

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, categories] = await Promise.all([
    prisma.member.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])
  
  if (!member) notFound()

  const session = await auth()
  const user = session?.user as any
  let isAdmin = false
  if (process.env.NODE_ENV === 'development' && (!user || user.id === 'dev-admin-id')) {
    isAdmin = true
  } else if (user?.role === 'ADMIN') {
    isAdmin = true
  }

  const isOwner = user?.email === member.email

  if (!isAdmin) {
    if (!user?.email || !isOwner) {
      return (
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
          <p className="text-white/60">You do not have permission to edit this profile.</p>
        </div>
      )
    }
  }

  // Null checks for react-hook-form string fields
  const cleanMember = {
    ...member,
    phone: member.phone || '',
    whatsapp: member.whatsapp || '',
    email: member.email || '',
    website: member.website || '',
    shortIntro: member.shortIntro || '',
    fullDescription: member.fullDescription || '',
    address: member.address || '',
    profileImage: member.profileImage || '',
    categoryId: member.categoryId || '',
    teamRole: member.teamRole || '',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          color: '#F0F0F0', fontSize: 22, fontWeight: 700,
          fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Edit Profile
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          Update member details and preferences
        </p>
      </div>
      <div>
        <MemberForm initialData={cleanMember} categories={categories} isSelfEdit={!isAdmin && isOwner} />
      </div>
    </div>
  )
}
