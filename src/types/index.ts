import type { Member, Category, MemberAnalytics, Testimonial } from '@prisma/client'

export type MemberRole = 'ED' | 'SUPPORT' | 'HEAD_TABLE' | 'MEMBER'
export type UserRole = 'ADMIN' | 'MEMBER' | 'PUBLIC'

export type MemberWithRelations = Member & {
  category?: Category | null
  analytics?: MemberAnalytics | null
  testimonials?: Testimonial[]
}

export type MemberCardData = {
  id: string
  fullName: string
  slug: string
  businessName: string
  category?: { name: string; slug: string } | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  website?: string | null
  shortIntro?: string | null
  profileImage?: string | null
  memberRole: MemberRole
  teamRole?: string | null
  displayOrder: number
  featured: boolean
}

export type SearchFilters = {
  query?: string
  role?: MemberRole | ''
  category?: string
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}
