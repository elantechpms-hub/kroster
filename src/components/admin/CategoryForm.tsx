'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createCategory, updateCategory } from '@/app/admin/actions'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isVacant: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      isVacant: !!initialData.isVacant,
    } : { name: '', description: '', isVacant: false },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, data)
        toast.success('Category updated')
      } else {
        await createCategory(data)
        toast.success('Category created')
      }
      router.push('/admin/categories')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 premium-category-form">
      <div className="premium-card space-y-6">
        <h3 className="section-title">
          <span className="dot dot-primary"></span>
          Category Information
        </h3>
        
        <div className="input-group">
          <label>Name</label>
          <input {...register('name')} placeholder="e.g. Technology, Health" className="premium-input" />
          {errors.name && <span className="error-text">{errors.name.message}</span>}
        </div>

        <div className="input-group">
          <label>Description</label>
          <textarea {...register('description')} rows={4} placeholder="Brief description of the category..." className="premium-textarea" />
        </div>

        <div className="flex items-center gap-3 mt-4 premium-checkbox">
          <input type="checkbox" id="isVacant" {...register('isVacant')} />
          <label htmlFor="isVacant">Mark as Vacant Category (No active members, shown in vacant marquee)</label>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')} className="btn-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="btn-save">
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </div>

      <style>{`
        .premium-category-form {
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
