import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toTitleCase } from '@/lib/utils'
import { VacantToggle } from '@/components/admin/VacantToggle'
import { DeleteCategoryButton } from './DeleteCategoryButton'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { members: true } } }
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
          }}>Categories</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, fontWeight: 500 }}>Manage member business categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-[#E62738] hover:bg-[#B61F2B] text-white" style={{
            fontSize: 13.5,
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(230,39,56,0.3)',
            height: 'auto',
          }}>
            <Plus className="w-4 h-4 mr-2" /> Add Category
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
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Slug</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs text-center">Members</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs">Vacant</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-white/50 text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-medium text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-4 h-4 text-white/60" />
                      </div>
                      {toTitleCase(category.name)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-white/50 font-mono text-xs">{category.slug}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-white/5 border border-white/10 text-white/80 font-bold text-xs">
                      {category._count.members}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <VacantToggle id={category.id} initialValue={category.isVacant} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteCategoryButton id={category.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50 font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Hash className="w-8 h-8 opacity-20" />
                      <p>No categories found.</p>
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
