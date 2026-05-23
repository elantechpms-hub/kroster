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
  } catch {
    return []
  }
}

function generateWeeklyEvents() {
  const events = [];
  const now = new Date();
  
  const dates = [
    { date: new Date('2026-05-26T07:30:00'), isMilestone: false, isFvd: false, isBizTalk: true },
    { date: new Date('2026-06-02T07:30:00'), isMilestone: true, isFvd: false, isBizTalk: false },
    { date: new Date('2026-06-09T07:30:00'), isMilestone: false, isFvd: false, isBizTalk: false },
    { date: new Date('2026-06-16T07:30:00'), isMilestone: false, isFvd: true, isBizTalk: false },
    { date: new Date('2026-06-23T07:30:00'), isMilestone: false, isFvd: false, isBizTalk: false }
  ];

  for (const item of dates) {
    let title = "Weekly Business Conclave — BNI Krypton";
    let slug = `weekly-meeting-${item.date.toISOString().split('T')[0]}`;
    let description = "Join BNI Krypton's weekly networking meeting to pitch your business, swap high-quality referrals, and collaborate with Nagpur's elite business professionals.";
    let image = null;

    if (item.isBizTalk) {
      title = "🎤 BizTalk Show — BNI Krypton Tuesday Meeting";
      slug = "biztalk-show-may-2026";
      description = "An extraordinary networking experience! BNI Krypton presents the high-impact BizTalk Show. We are honored to host our prominent special guest speakers:\n\n" +
        "• Mr. Dilip Kamdar\n" +
        "• Mr. Mithilesh Wazalwar\n\n" +
        "Gain exclusive business insights, witness professional keynote showcases, and network with Nagpur's premier business network.";
    } else if (item.isMilestone) {
      title = "🏆 300th Landmark Weekly Meeting — BNI Krypton";
      slug = "300th-milestone-meeting";
      description = "A momentous milestone! Celebrate our 300th weekly chapter meeting of BNI Krypton. Witness premium networking, special leadership keynotes, and massive business opportunities with Nagpur's leading business network.";
    } else if (item.isFvd) {
      title = "🚀 Focus Visitors Day (FVD) — BNI Krypton";
      slug = "focus-visitors-day-2026";
      description = "Grow your business exponentially! BNI Krypton is hosting its mega Focus Visitors Day. A high-energy referral day custom-tailored for selected key industries to showcase and connect. Special invitations for:\n\n" + 
        "• Real Estate: Architects (Commercial/Residential/Landscape), PEB Shed, HVAC Consultant, Civil Lawyers, CCTV, Housekeeping, Water Purifiers\n" +
        "• Automobile & Transport: Tyre/Accessories Dealers, Taxi Services, Logistics\n" +
        "• Health & Wellness: Gynaecologists, Cardiologists, Pediatricians, Nutritionists, Gym Owners\n" +
        "• Events & Lifestyle: Bakers, Banquets, Wedding/Event Planners, Cafés, Graphic Designers, Printing\n" +
        "• Business Services: Company Secretaries, Manpower Consultants, Grocery Merchants, Stationery, White Goods Dealers.";
    }

    events.push({
      id: `dynamic-${slug}`,
      title,
      slug,
      description,
      eventDate: item.date,
      location: "Hotel Centre Point, Ramdaspeth, Nagpur",
      image,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return events;
}

async function getEvents() {
  try {
    const dbEvents = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: 'asc' },
    });
    
    // Filter database events: exclude any weekly meetings that are not on a Tuesday
    const cleanDbEvents = dbEvents.filter(event => {
      const date = new Date(event.eventDate);
      const isTuesday = date.getDay() === 2;
      const isWeeklyGeneric = event.title.toLowerCase().includes('weekly') || event.title.toLowerCase().includes('chapter meeting');
      if (isWeeklyGeneric && !isTuesday) {
        return false;
      }
      return true;
    });

    const dynamicEvents = generateWeeklyEvents();
    const allEvents = [...cleanDbEvents, ...dynamicEvents];
    
    // Sort all events by date ascending
    allEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    
    // Return the upcoming events (limit to next 6 so the layout is balanced)
    return allEvents.slice(0, 6);
  } catch {
    return generateWeeklyEvents();
  }
}

export default async function HomePage() {
  const [members, events] = await Promise.all([getMembers(), getEvents()])

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
          />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
