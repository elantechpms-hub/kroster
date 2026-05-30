import { prisma } from '@/lib/prisma'
import { MemberForm } from '@/components/admin/MemberForm'

export default async function NewMemberPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          color: '#F0F0F0', fontSize: 22, fontWeight: 700,
          fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Add Member
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
          Create a new member profile and assign their chapter role
        </p>
      </div>
      <div>
        <MemberForm categories={categories} />
      </div>
    </div>
  )
}
