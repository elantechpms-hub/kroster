'use client'

import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { QrCode, Check, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  profileUrl: string
  whatsappUrl?: string
  memberName: string
  vcardText: string
}

export function QRCard({ profileUrl, memberName, vcardText }: Props) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
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
        downloadLink.download = `${slugify(memberName)}-contact-qr.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    }
    image.src = blobURL
  }

  function slugify(text: string) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)',
      border: '1px solid rgba(212,175,55,0.22)',
      borderRadius: 24,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '100%',
      boxShadow: 'inset 0 1px 1px rgba(212,175,55,0.1)'
    }} className="group custom-qr-layout">
      {/* Premium accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent opacity-60 pointer-events-none" />

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }} className="qr-inner">
        {/* Left Side: Info & Actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 16,
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'Inter, sans-serif',
          }}>
            <QrCode className="w-4 h-4 text-[#D4AF37]" />
            Digital Business Card
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16, lineHeight: 1.4 }}>
            Scan the QR code to instantly save {memberName.split(' ')[0]}'s complete contact details to your phone.
          </p>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: 6, width: '100%' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              style={{
                flex: 1, borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.04)', fontSize: 12, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              className="hover:text-white hover:bg-white/10"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> URL Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Profile URL</>}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownloadQR}
              title="Download QR Code Image"
              style={{
                width: 36, height: 36, borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}
              className="hover:text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
            </Button>
          </div>
        </div>

        {/* Right Side: QR Code Container */}
        <div 
          ref={qrRef}
          style={{
            background: '#ffffff', padding: 14, borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(212, 175, 55, 0.25)',
            transition: 'all 0.3s ease', flexShrink: 0
          }}
          className="transform group-hover:scale-[1.03]"
        >
          <QRCode
            value={vcardText}
            size={160}
            level="L"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .qr-inner {
            flex-direction: column-reverse;
            text-align: center;
          }
          .qr-inner h3 {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
