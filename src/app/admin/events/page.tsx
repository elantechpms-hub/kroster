import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteEventButton } from './DeleteEventButton'

import { ensureUpcomingTuesdayMeetings } from '@/lib/events'

export default async function AdminEventsPage() {
  // Automatically generate missing future Tuesday meetings
  await ensureUpcomingTuesdayMeetings()

  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
          }}>Events</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500 }}>Manage networking events and weekly conclave meetings</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-[#E62738] hover:bg-[#B61F2B] text-white" style={{
            fontSize: 13.5,
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(230,39,56,0.3)',
            height: 'auto',
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </Link>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        boxShadow: '0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}>
        <div className="overflow-x-auto">
          <table className="admin-table w-full text-left text-sm text-white">
            <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Title</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Location</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-medium text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-white/60" />
                      </div>
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-white/70 font-medium">
                    {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 text-white/60">{event.location || '-'}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      event.isPublished 
                        ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20' 
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}>
                      {event.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteEventButton id={event.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50 font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Calendar className="w-8 h-8 opacity-20" />
                      <p>No events found.</p>
                    </div>
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
