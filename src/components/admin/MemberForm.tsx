'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { createMember, updateMember } from '@/app/admin/actions'
import { toTitleCase } from '@/lib/utils'

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  businessName: z.string().min(1, 'Business name is required'),
  categoryId: z.string().optional(),
  memberRole: z.enum(['ED', 'SUPPORT', 'HEAD_TABLE', 'MEMBER']),
  teamRole: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  shortIntro: z.string().optional(),
  fullDescription: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

export function MemberForm({ initialData, categories, isSelfEdit = false }: { initialData?: any, categories: any[], isSelfEdit?: boolean }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { 
      fullName: '', businessName: '', memberRole: 'MEMBER', teamRole: '', isActive: true,
      phone: '', whatsapp: '', email: '', website: '', shortIntro: '', fullDescription: '', address: '', profileImage: ''
    },
  })

  const profileImage = watch('profileImage')
  const fullName = watch('fullName')
  const memberRole = watch('memberRole')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateMember(initialData.id, data)
        toast.success('Profile updated successfully')
      } else {
        await createMember(data)
        toast.success('Member created successfully')
      }
      if (isSelfEdit) {
         router.push(`/members/${initialData?.slug || ''}`)
      } else {
         router.push('/admin/members')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 premium-member-form">
      {/* Top Section - Image & Basic Info */}
      <div className="premium-card">
        <h3 className="section-title">
          <span className="dot dot-primary"></span>
          Personal & Business Info
        </h3>
        <div className="form-row-layout">
          <div className="form-image-col">
            <ImageUpload
              name={fullName || 'member'}
              type="profile"
              label="Profile Image"
              value={profileImage}
              onChange={(url) => setValue('profileImage', url)}
            />
            <p className="text-center text-xs text-white/40 mt-3 font-medium">Recommended: Square image, max 2MB</p>
          </div>
          
          <div className="form-info-col space-y-6">
            <div className="form-grid-2">
              <div className="input-group">
                <label>Full Name</label>
                <input {...register('fullName')} placeholder="e.g. John Doe" className="premium-input" />
                {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
              </div>
              <div className="input-group">
                <label>Business Name</label>
                <input {...register('businessName')} placeholder="e.g. Acme Corp" className="premium-input" />
                {errors.businessName && <span className="error-text">{errors.businessName.message}</span>}
              </div>
            </div>

            <div className={`form-grid-3 mt-4 ${memberRole === 'SUPPORT' ? 'form-grid-2' : ''}`}>
              {memberRole !== 'SUPPORT' && (
                <div className="input-group">
                  <label>Category</label>
                  <div className="select-wrapper">
                    <select {...register('categoryId')} className="premium-select" disabled={isSelfEdit}>
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{toTitleCase(c.name)}</option>
                      ))}
                    </select>
                    <div className="select-arrow">▼</div>
                  </div>
                </div>
              )}
              <div className="input-group">
                <label>Member Role</label>
                <div className="select-wrapper">
                  <select {...register('memberRole')} className="premium-select" disabled={isSelfEdit}>
                    <option value="MEMBER">Member</option>
                    <option value="HEAD_TABLE">Head Table</option>
                    <option value="SUPPORT">Support Team</option>
                    <option value="ED">Executive Director</option>
                  </select>
                  <div className="select-arrow">▼</div>
                </div>
              </div>
              <div className="input-group">
                <label>Team Role (Optional)</label>
                <input {...register('teamRole')} placeholder="e.g. Chapter Growth Coordinator" className="premium-input" disabled={isSelfEdit} />
                <span className="help-text">Only editable by admins</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6 premium-checkbox">
              <input type="checkbox" id="isActive" {...register('isActive')} disabled={isSelfEdit} />
              <label htmlFor="isActive">Active Member Status</label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-sections-grid">
        <div className="premium-card space-y-5">
          <h3 className="section-title">
            <span className="dot dot-info"></span>
            Contact Details
          </h3>
          <div className="input-group">
            <label>Phone Number</label>
            <input {...register('phone')} placeholder="+91..." className="premium-input" />
          </div>
          <div className="input-group">
            <label>WhatsApp Number</label>
            <input {...register('whatsapp')} placeholder="+91..." className="premium-input" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input {...register('email')} type="email" placeholder="john@example.com" className="premium-input" />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>
          <div className="input-group">
            <label>Website URL</label>
            <input {...register('website')} placeholder="https://..." className="premium-input" />
          </div>
        </div>

        <div className="premium-card space-y-5">
          <h3 className="section-title">
            <span className="dot dot-warning"></span>
            Profile Content
          </h3>
          <div className="input-group">
            <label>Short Intro (Tagline)</label>
            <input {...register('shortIntro')} placeholder="A brief description of what you do" className="premium-input" />
          </div>
          <div className="input-group">
            <label>Full Description</label>
            <textarea {...register('fullDescription')} rows={4} placeholder="Detailed information about your business and services..." className="premium-textarea" />
          </div>
          <div className="input-group">
            <label>Address</label>
            <textarea {...register('address')} rows={2} placeholder="Business address" className="premium-textarea" />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="outline" onClick={() => isSelfEdit ? router.back() : router.push('/admin/members')} className="btn-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="btn-save">
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>

      <style>{`
        .premium-member-form {
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
        .dot-primary { color: #B61F2B; background-color: #B61F2B; }
        .dot-info { color: #38bdf8; background-color: #38bdf8; }
        .dot-warning { color: #fb923c; background-color: #fb923c; }

        .form-row-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .form-image-col { width: 100%; }
        .form-info-col { width: 100%; }

        @media (min-width: 768px) {
          .form-row-layout { flex-direction: row; align-items: flex-start; }
          .form-image-col { width: 220px; flex-shrink: 0; }
          .form-info-col { flex: 1; }
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
          .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }

        .form-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .form-sections-grid { grid-template-columns: 1fr 1fr; }
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

        .premium-input, .premium-select, .premium-textarea {
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

        .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
          background: rgba(255,255,255,0.03) !important;
          border-color: #B61F2B !important;
          box-shadow: 0 0 0 3px rgba(182,31,43,0.15);
        }
        
        .premium-input:disabled, .premium-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .select-wrapper {
          position: relative;
        }

        .premium-select {
          appearance: none;
          padding-right: 40px;
        }

        .premium-select option {
          background-color: #0f0f0f;
          color: #fff;
        }

        .select-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.4);
          font-size: 10px;
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
          accent-color: #B61F2B;
          cursor: pointer;
        }
        
        .premium-checkbox input[type="checkbox"]:disabled {
          cursor: not-allowed;
          opacity: 0.6;
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
        
        .help-text {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-weight: 400;
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
          background: linear-gradient(135deg, #B61F2B, #7A111B) !important;
          color: #ffffff !important;
          border: none !important;
          padding: 12px 36px !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 8px 20px rgba(182, 31, 43, 0.3) !important;
          transition: all 0.2s ease !important;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(182, 31, 43, 0.4) !important;
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
