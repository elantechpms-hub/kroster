'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

export function HeroSection({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleChange = (v: string) => {
    setQuery(v)
    onSearch(v)
  }
  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <section id="hero" style={{ 
      width: '100%', 
      paddingTop: 112, 
      paddingBottom: 64, 
      paddingLeft: 16, 
      paddingRight: 16, 
      position: 'relative', 
      overflow: 'hidden', 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center' 
    }}>
      {/* Background gradients */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(182,31,43,0.15) 0%, rgba(10,10,10,1) 70%)',
      }} />
      
      {/* Subtle grid mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Nagpur Outline SVG Background */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        pointerEvents: 'none',
        opacity: 0.03,
        backgroundImage: 'url(/nagpur_outline.svg)',
        backgroundPosition: 'bottom center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0) invert(1)',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Bento Grid */}
        <div className="custom-bento-grid">
          
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bento-hero bento-card"
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '48px', position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Inner glow */}
            <div style={{
              position: 'absolute', top: -160, left: -160, width: 320, height: 320,
              background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none'
            }} />
            
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999,
              border: '1px solid rgba(234, 179, 8, 0.2)', background: 'rgba(234, 179, 8, 0.05)',
              color: '#eab308', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 32, width: 'fit-content'
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: '#eab308',
                boxShadow: '0 0 8px rgba(234, 179, 8, 0.8)', animation: 'pulse-glow 2s infinite'
              }} />
              BNI KRYPTON • NAGPUR
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#fff',
              letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 24, fontFamily: '"Playfair Display", serif'
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #ef4444, #f59e0b, #eab308)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                Krypton
              </span>{' '}Connects You<br/>to the Right People
            </h1>
            
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(15px, 1.8vw, 18px)', maxWidth: 500, lineHeight: 1.6 }}>
              Nagpur&apos;s most trusted BNI chapter — building relationships that drive real business growth.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bento-search bento-card"
            style={{
              padding: '32px', position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}
          >
            <div style={{
              position: 'absolute', bottom: -160, right: -160, width: 320, height: 320,
              background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
              transition: 'background 0.7s ease'
            }} />
            
            <div style={{ marginBottom: 24 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
                <Search color="rgba(255,255,255,0.6)" size={24} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Quick Search</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Find members, businesses, or specific categories instantly.</p>
            </div>

            <div style={{ position: 'relative', marginTop: 'auto' }}>
              <input
                type="search"
                value={query}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search..."
                style={{
                  width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '16px 40px 16px 48px', color: '#fff', fontSize: 15,
                  outline: 'none', transition: 'all 0.2s',
                  boxShadow: focused ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 0 0 4px rgba(239, 68, 68, 0.1)' : 'inset 0 1px 1px rgba(255,255,255,0.05)'
                }}
              />
              <Search size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
              {query && (
                <button onClick={handleClear} style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: 4,
                  cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex'
                }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Compact Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="stats-strip"
          >
            {[
              { label: 'Members', value: '70+', color: '#60a5fa' },
              { label: 'Referrals', value: '₹200Cr+', color: '#4ade80' },
              { label: 'Years', value: '5+', color: '#c084fc' },
              { label: 'Categories', value: '40+', color: '#fb923c' },
            ].map((stat) => (
              <div key={stat.label} className="stat-pill">
                <span className="stat-pill-value" style={{ color: stat.color }}>{stat.value}</span>
                <span className="stat-pill-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
          
        </div>
      </div>

      <style>{`
        .custom-bento-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .bento-hero { grid-column: span 2; }
        .bento-search { grid-column: span 2; }

        .bento-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
          transition: border-color 0.3s;
        }
        .bento-card:hover {
          border-color: rgba(255,255,255,0.1);
        }

        /* Stats Strip */
        .stats-strip {
          grid-column: span 2;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: border-color 0.3s, background 0.3s;
        }
        .stat-pill:hover {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
        }
        .stat-pill-value {
          font-size: 16px;
          font-weight: 700;
          font-family: "Playfair Display", serif;
          white-space: nowrap;
        }
        .stat-pill-label {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(234, 179, 8, 0.8); }
          50% { opacity: 0.5; box-shadow: 0 0 2px rgba(234, 179, 8, 0.3); }
        }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }

        @media (min-width: 768px) {
          .custom-bento-grid {
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
          }
          .bento-hero { grid-column: span 8 !important; }
          .bento-search { grid-column: span 4 !important; }
          .stats-strip {
            grid-column: span 12 !important;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
          .stat-pill {
            padding: 14px 20px;
            border-radius: 16px;
          }
          .stat-pill-value {
            font-size: 18px;
          }
          .stat-pill-label {
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  )
}

