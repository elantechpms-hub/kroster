import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminEventsPage() {
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
          <Button className="bg-[#B61F2B] hover:bg-[#7A111B] text-white" style={{
            fontSize: 13.5,
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(182,31,43,0.3)',
            height: 'auto',
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </Link>
      </div>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-white/5 text-white/60 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{event.title}</td>
                  <td className="px-6 py-4 text-white/60">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white/60">{event.location || '-'}</td>
                  <td className="px-6 py-4 text-white/60">
                    <span className={`px-2 py-1 rounded text-xs ${event.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/50'}`}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/50">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
