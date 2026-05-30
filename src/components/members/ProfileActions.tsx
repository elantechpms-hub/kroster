'use client'

import { Phone, MessageCircle, Globe, Mail, Download } from 'lucide-react'
import { trackAction } from './ProfileTracker'

export function ProfileActions({ 
  memberId, 
  phone, 
  waUrl, 
  email, 
  website, 
  vcfUrl, 
  accentColor 
}: { 
  memberId: string
  phone?: string | null
  waUrl?: string | null
  email?: string | null
  website?: string | null
  vcfUrl: string
  accentColor: string
}) {
  return (
    <>
      <style>{`
        .profile-actions-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: 100%;
        }
        @media (max-width: 860px) {
          .profile-actions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
          .action-pill {
            justify-content: center;
            width: 100%;
          }
          .action-pill-full {
            grid-column: 1 / -1;
            padding: 12px 14px;
            font-size: 14px;
          }
        }
      `}</style>
      <div className="profile-actions-grid">
        {phone && (
          <a 
            href={`tel:${phone}`} 
            onClick={() => trackAction(memberId, 'CALL')}
            className="action-pill hover-bg" 
            style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.20)', color: '#4ade80' }}
          >
            <Phone size={14} /> Call
          </a>
        )}
        {waUrl && (
          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => trackAction(memberId, 'WHATSAPP')}
            className="action-pill hover-bg" 
            style={{ background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.20)', color: '#25D366' }}
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        )}
        {email && (
          <a 
            href={`mailto:${email}`} 
            className="action-pill hover-bg" 
            style={{ background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.20)', color: '#60a5fa' }}
          >
            <Mail size={14} /> Email
          </a>
        )}
        {website && (
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => trackAction(memberId, 'WEB')}
            className="action-pill hover-bg" 
            style={{ background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.20)', color: '#a78bfa' }}
          >
            <Globe size={14} /> Website
          </a>
        )}
        <a 
          href={vcfUrl} 
          onClick={() => trackAction(memberId, 'SHARE')}
          className="action-pill action-pill-full hover-bg" 
          style={{ background: `${accentColor}1A`, borderColor: `${accentColor}40`, color: accentColor }}
        >
          <Download size={16} style={{ marginRight: 2 }} /> Save Contact
        </a>
      </div>
    </>
  )
}
