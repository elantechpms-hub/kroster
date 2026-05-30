'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import Cropper from 'react-easy-crop'

// Helper to crop image using HTML5 Canvas
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (error) => reject(error))
    img.setAttribute('crossOrigin', 'anonymous') // avoid CORS issues
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      resolve(blob)
    }, 'image/jpeg', 0.9)
  })
}

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  type?: 'profile' | 'gallery'
  name: string // used for generating the filename
  label?: string
}

export function ImageUpload({ value, onChange, type = 'profile', name, label = 'Upload Image' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Portal mount state
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const originalFileRef = useRef<File | null>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, WEBP, or AVIF image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Max size is 10MB.')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('name', name)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await res.json()
      onChange(data.url)
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, WEBP, or AVIF image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Max size is 10MB.')
      return
    }

    originalFileRef.current = file

    if (type === 'profile') {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result as string)
      })
      reader.readAsDataURL(file)
    } else {
      handleUpload(file)
    }
  }

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return

    setIsUploading(true)
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels)
      const croppedFile = new File(
        [croppedBlob],
        originalFileRef.current?.name || `${name || 'profile'}.jpg`,
        { type: 'image/jpeg' }
      )

      const formData = new FormData()
      formData.append('file', croppedFile)
      formData.append('type', type)
      formData.append('name', name)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await res.json()
      onChange(data.url)
      toast.success('Profile photo cropped and saved successfully')
      setCropImageSrc(null)
    } catch (error: any) {
      toast.error(error.message || 'Error cropping image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const renderCropperModal = () => {
    if (!cropImageSrc || !isMounted) return null

    const modalMarkup = (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999, // extremely high to overlay sheets/dialogs
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 450,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#121212',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }} className="custom-scroll">
          <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>Crop Profile Photo</h3>

          {/* Cropper Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#000',
          }}>
            <Cropper
              image={cropImageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              onZoomChange={setZoom}
            />
          </div>

          {/* Zoom Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#B61F2B',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCropImageSrc(null)}
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropSave}
              disabled={isUploading}
              style={{
                background: 'linear-gradient(135deg, #B61F2B, #7A111B)',
                color: '#fff',
                border: 'none',
              }}
            >
              {isUploading ? 'Saving...' : 'Save Profile Pic'}
            </Button>
          </div>
        </div>
      </div>
    )

    if (typeof document !== 'undefined') {
      return createPortal(modalMarkup, document.body)
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-white/80">{label}</div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-square max-w-[200px]">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {type === 'profile' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-full bg-white text-black border-none hover:bg-white/80 font-semibold text-xs"
                onClick={() => {
                  originalFileRef.current = null
                  setCropImageSrc(value)
                }}
              >
                Crop
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="w-8 h-8 rounded-full"
              onClick={() => onChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative rounded-xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-3 cursor-pointer
            ${dragActive ? 'border-[#B61F2B] bg-[#B61F2B]/10' : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
            }}
            disabled={isUploading}
          />

          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/60">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-white">
              {isUploading ? 'Uploading...' : 'Click or drag image to upload'}
            </p>
            <p className="text-xs text-white/50 mt-1">
              JPG, PNG, WEBP, AVIF (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {renderCropperModal()}
    </div>
  )
}
