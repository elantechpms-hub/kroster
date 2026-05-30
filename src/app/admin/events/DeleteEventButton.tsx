'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteEvent } from '@/app/admin/actions'

export function DeleteEventButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    
    setIsDeleting(true)
    try {
      await deleteEvent(id)
      toast.success('Event deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event')
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
      title="Delete Event"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
