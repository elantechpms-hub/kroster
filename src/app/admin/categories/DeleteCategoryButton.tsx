'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteCategory } from '@/app/admin/actions'

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return
    
    setIsDeleting(true)
    try {
      await deleteCategory(id)
      toast.success('Category deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-transparent border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors"
      title="Delete Category"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
