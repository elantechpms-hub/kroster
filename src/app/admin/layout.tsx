import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090909' }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        marginLeft: 0,
        padding: '40px 32px',
        maxWidth: '100%',
      }} className="md-main-offset">
        {children}
      </main>
      <style>{`
        @media (min-width: 768px) {
          .md-main-offset { margin-left: 232px; }
        }
      `}</style>
    </div>
  )
}
