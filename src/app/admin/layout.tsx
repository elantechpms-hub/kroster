import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090909' }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        padding: '40px 32px',
        maxWidth: '100%',
      }} className="w-full pl-0 md:pl-60">
        {children}
      </main>
    </div>
  )
}
