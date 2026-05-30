import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  memberId: z.string().min(1),
  action: z.enum(['VIEW', 'CALL', 'WHATSAPP', 'WEB', 'SHARE'])
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { memberId, action } = schema.parse(body)

    const updateData: any = {}
    if (action === 'VIEW') updateData.profileViews = { increment: 1 }
    if (action === 'CALL') updateData.callClicks = { increment: 1 }
    if (action === 'WHATSAPP') updateData.waClicks = { increment: 1 }
    if (action === 'WEB') updateData.webClicks = { increment: 1 }
    if (action === 'SHARE') updateData.shareCount = { increment: 1 }

    await prisma.memberAnalytics.upsert({
      where: { memberId },
      update: updateData,
      create: {
        memberId,
        profileViews: action === 'VIEW' ? 1 : 0,
        callClicks: action === 'CALL' ? 1 : 0,
        waClicks: action === 'WHATSAPP' ? 1 : 0,
        webClicks: action === 'WEB' ? 1 : 0,
        shareCount: action === 'SHARE' ? 1 : 0,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics Error:', error)
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
