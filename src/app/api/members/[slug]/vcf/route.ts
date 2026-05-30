import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVCard } from '@/lib/vcard'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const member = await prisma.member.findUnique({
    where: { slug, isActive: true },
    include: { category: true }
  })

  if (!member) {
    return new NextResponse('Member not found', { status: 404 })
  }

  const categoryName = member.category?.name || ''
  const vcf = generateVCard(member, categoryName)

  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${member.slug}.vcf"`,
    },
  })
}
