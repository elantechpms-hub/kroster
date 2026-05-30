import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HomePageClient } from '@/components/sections/HomePageClient'
import { Skeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BNI Krypton — Connect With Nagpur\'s Elite Business Network',
  description:
    'Discover verified BNI Krypton members in Nagpur. Search businesses, connect with professionals, and build your referral network with our premium business directory.',
}

async function getMembers() {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: [
        { memberRole: 'asc' },
        { displayOrder: 'asc' },
        { fullName: 'asc' },
      ],
    })
    return members
  } catch (error) {
    console.error('Error fetching members from database:', error)
    return []
  }
}

import { ensureUpcomingTuesdayMeetings } from '@/lib/events'

async function getEvents() {
  try {
    // Automatically generate missing future Tuesday meetings
    await ensureUpcomingTuesdayMeetings()

    const now = new Date()
    now.setHours(0, 0, 0, 0) // keep events happening today visible

    const dbEvents = await prisma.event.findMany({
      where: { 
        isPublished: true,
        eventDate: { gte: now }
      },
      orderBy: { eventDate: 'asc' },
    });
    return dbEvents;
  } catch (error) {
    console.error('Error fetching events from database:', error)
    return [];
  }
}

async function getVacantCategories() {
  try {
    const vacantCats = await prisma.category.findMany({
      where: { isVacant: true },
      orderBy: { name: 'asc' },
    })
    return vacantCats.map(c => c.name)
  } catch (error) {
    console.error('Error fetching vacant categories from database:', error)
    return []
  }
}

export default async function HomePage() {
  const [members, events, vacantCategories] = await Promise.all([
    getMembers(),
    getEvents(),
    getVacantCategories()
  ])

  const eds = members.filter((m) => m.memberRole === 'ED')
  const support = members.filter((m) => m.memberRole === 'SUPPORT')
  const headTable = members.filter((m) => m.memberRole === 'HEAD_TABLE')
  const allMembers = members.filter((m) => m.memberRole === 'MEMBER')

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://krypton.bni-nagpur.in'}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Navbar />
      <main className="bg-[#0A0A0A] min-h-screen">
        <Suspense fallback={<div className="min-h-screen" />}>
          <HomePageClient
            eds={eds}
            support={support}
            headTable={headTable}
            members={allMembers}
            events={events}
            vacantCategories={vacantCategories}
          />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
