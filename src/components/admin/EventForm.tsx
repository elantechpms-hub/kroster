'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createEvent, updateEvent } from '@/app/admin/actions'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  location: z.string().optional(),
  image: z.string().optional(),
  isPublished: z.boolean(),
})

type FormData = z.infer<typeof schema>

export function EventForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      eventDate: new Date(initialData.eventDate).toISOString().slice(0, 16) // Format for datetime-local
    } : { title: '', description: '', location: '', image: '', isPublished: true, eventDate: '' },
  })

  const image = watch('image')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const payload = { ...data, eventDate: new Date(data.eventDate) }
      if (initialData?.id) {
        await updateEvent(initialData.id, payload)
        toast.success('Event updated')
      } else {
        await createEvent(payload)
        toast.success('Event created')
      }
      router.push('/admin/events')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 premium-event-form">
      
      <div className="premium-card">
        <h3 className="section-title">
          <span className="dot dot-primary"></span>
          Event Details
        </h3>
        <div className="form-row-layout">
          <div className="form-image-col">
            <ImageUpload
              name="event"
              type="gallery"
              label="Event Image (Optional)"
              value={image}
              onChange={(url) => setValue('image', url)}
            />
            <p className="text-center text-xs text-white/40 mt-3 font-medium">Recommended: 16:9 ratio image</p>
          </div>
          
          <div className="form-info-col space-y-6">
            <div className="input-group">
              <label>Event Title</label>
              <input {...register('title')} placeholder="e.g. Chapter Meeting" className="premium-input" />
              {errors.title && <span className="error-text">{errors.title.message}</span>}
            </div>

            <div className="form-grid-2">
              <div className="input-group">
                <label>Date & Time</label>
                <input type="datetime-local" {...register('eventDate')} className="premium-input" />
                {errors.eventDate && <span className="error-text">{errors.eventDate.message}</span>}
              </div>
              <div className="input-group">
                <label>Location</label>
                <input {...register('location')} placeholder="e.g. Grand Hotel" className="premium-input" />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea {...register('description')} rows={4} placeholder="Event details and agenda..." className="premium-textarea" />
            </div>

            <div className="flex items-center gap-3 mt-6 premium-checkbox">
              <input type="checkbox" id="isPublished" {...register('isPublished')} />
              <label htmlFor="isPublished">Publish Event</label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/events')} className="btn-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="btn-save">
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </Button>
      </div>

      <style>{`
        .premium-event-form {
          font-family: 'Inter', sans-serif;
        }
        
        .premium-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 12px currentColor;
        }
        .dot-primary { color: #E62738; background-color: #E62738; }

        .form-row-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .form-image-col { width: 100%; }
        .form-info-col { width: 100%; }

        @media (min-width: 768px) {
          .form-row-layout { flex-direction: row; align-items: flex-start; }
          .form-image-col { width: 300px; flex-shrink: 0; }
          .form-info-col { flex: 1; }
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .premium-input, .premium-textarea {
          width: 100%;
          background: rgba(0,0,0,0.2) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 12px;
          padding: 12px 16px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
        }
        
        .premium-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .premium-input:focus, .premium-textarea:focus {
          background: rgba(255,255,255,0.03) !important;
          border-color: #E62738 !important;
          box-shadow: 0 0 0 3px rgba(230,39,56,0.15);
        }
        
        /* Time Input Special Fix */
        .premium-input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }

        .premium-checkbox {
          background: rgba(255,255,255,0.02);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .premium-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          border-radius: 6px;
          accent-color: #E62738;
          cursor: pointer;
        }

        .premium-checkbox label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          user-select: none;
        }

        .error-text {
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
          margin-top: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 16px;
        }

        .btn-cancel {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: rgba(255,255,255,0.7) !important;
          padding: 12px 28px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.05) !important;
          color: #ffffff !important;
        }

        .btn-save {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)) !important;
          color: #ffffff !important;
          border: none !important;
          padding: 12px 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 8px 20px rgba(230, 39, 56, 0.3) !important;
          transition: all 0.2s ease !important;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(230, 39, 56, 0.4) !important;
        }

        .btn-save:active {
          transform: translateY(0);
        }
        
        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </form>
  )
}
