'use client'

import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { QrCode, Share2, Download, Check, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  profileUrl: string
  whatsappUrl: string
  memberName: string
}

export function QRCard({ profileUrl, whatsappUrl, memberName }: Props) {
  const [copied, setCopied] = useState(false)
  const [qrType, setQrType] = useState<'profile' | 'whatsapp'>('profile')
  const qrRef = useRef<HTMLDivElement>(null)

  const activeUrl = qrType === 'profile' ? profileUrl : whatsappUrl

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${memberName} | BNI Krypton`,
          text: `Check out ${memberName}'s premium business profile on BNI Krypton!`,
          url: activeUrl,
        })
      } catch (err) {
        console.error('Error sharing: ', err)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleDownloadQR = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgString = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const URL = window.URL || window.webkitURL || window
    const blobURL = URL.createObjectURL(svgBlob)
    
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 400
      const context = canvas.getContext('2d')
      if (context) {
        // Draw white background
        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, 400, 400)
        // Draw SVG onto canvas
        context.drawImage(image, 20, 20, 360, 360)
        
        const pngURL = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngURL
        downloadLink.download = `${slugify(memberName)}-qr-${qrType}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
    image.src = blobURL
  }

  // Simple slugify helper for filename
  function slugify(text: string) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)',
      border: '1px solid rgba(212,175,55,0.22)',
      borderRadius: 16,
      padding: '36px 32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: 440,
      width: '100%',
      margin: '0 auto',
    }} className="group">
      {/* Premium accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-60 pointer-events-none" />

      <h3 style={{
        color: '#ffffff',
        fontWeight: 800,
        fontSize: 16,
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'Inter, sans-serif',
      }}>
        <QrCode className="w-4 h-4 text-[#D4AF37]" />
        Share & Connect
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 20, maxWidth: 280 }}>
        Scan to view digital card or start immediate WhatsApp chat
      </p>

      {/* QR Code Container */}
      <div 
        ref={qrRef}
        style={{
          background: '#ffffff',
          padding: 16,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          transition: 'all 0.3s ease',
        }}
        className="transform group-hover:scale-[1.03]"
      >
        <QRCode
          value={activeUrl}
          size={148}
          level="H"
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        />
      </div>

      {/* Toggle Buttons */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.03)',
        padding: 4,
        borderRadius: 12,
        width: '100%',
        border: '1px solid rgba(255,255,255,0.07)',
        marginTop: 24,
        gap: 4,
      }}>
        <button
          onClick={() => setQrType('profile')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            qrType === 'profile' 
              ? 'bg-gradient-to-br from-[#B61F2B] to-[#7A111B] text-white shadow-md' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Profile QR
        </button>
        <button
          onClick={() => setQrType('whatsapp')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            qrType === 'whatsapp' 
              ? 'bg-[#25D366] text-black shadow-md' 
              : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          WhatsApp QR
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 12 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          style={{
            flex: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          className="hover:text-white hover:bg-white/10"
        >
          <Share2 className="w-3.5 h-3.5 text-[#B61F2B]" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          style={{
            flex: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            height: 36,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          className="hover:text-white hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              Copy URL
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownloadQR}
          title="Download QR Code image"
          style={{
            width: 36,
            height: 36,
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover:text-white hover:bg-white/10"
        >
          <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
        </Button>
      </div>
    </div>
  )
}
