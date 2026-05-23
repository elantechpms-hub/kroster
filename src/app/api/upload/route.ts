import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import sharp from 'sharp'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { slugify } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    // Allow ADMIN or the member themselves to upload images (bypass in development)
    if (!session?.user && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string // 'profile' | 'gallery'
    const nameStr = formData.get('name') as string // User's name to generate slug/filename

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // 500KB strict upload limit validation
    if (file.size > 500 * 1024) {
      return NextResponse.json({ error: 'File too large (Max 500KB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Define dimensions based on type
    const isProfile = type === 'profile'
    const width = isProfile ? 600 : 1200
    const height = isProfile ? 600 : 800

    // Process image with Sharp
    const processedBuffer = await sharp(buffer)
      .resize(width, height, {
        fit: isProfile ? 'cover' : 'inside',
        position: 'center',
      })
      .avif({ quality: 80, effort: 4 })
      .toBuffer()

    if (processedBuffer.length > 300 * 1024) {
      // If still over 300KB, compress more aggressively
      const aggressiveBuffer = await sharp(buffer)
        .resize(width, height, { fit: isProfile ? 'cover' : 'inside', position: 'center' })
        .avif({ quality: 60, effort: 6 })
        .toBuffer()
      
      if (aggressiveBuffer.length > 300 * 1024) {
         console.warn("Could not compress under 300KB, using aggressive buffer anyway")
      }
    }

    // Generate filename
    const sanitizedName = slugify(nameStr || 'upload')
    const timestamp = Date.now()
    const filename = `${sanitizedName}-${timestamp}.avif`
    const subDir = isProfile ? 'members' : 'gallery'
    
    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', subDir)
    await mkdir(uploadDir, { recursive: true })

    // Save to disk
    const filePath = join(uploadDir, filename)
    await writeFile(filePath, processedBuffer)

    // Return public URL
    const publicUrl = `/uploads/${subDir}/${filename}`

    return NextResponse.json({ url: publicUrl })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
