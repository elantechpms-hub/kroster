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
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '60svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 70% at 50% -10%, #2d0c10 0%, #090909 60%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        paddingTop: 48,
        paddingBottom: 48,
      }}
    >
      {/* Subtle grid mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        opacity: 0.8,
      }} />

      {/* Radial glow center */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(182,31,43,0.08) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 1200, width: '100%',
        margin: '0 auto', padding: '68px 24px 20px',
        textAlign: 'center',
      }}>

        {/* Chapter badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 999,
            background: 'rgba(212,175,55,0.07)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#D4AF37', fontSize: 11, fontWeight: 600,
            marginBottom: 20, letterSpacing: '0.05em',
          }}
        >
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#D4AF37', flexShrink: 0,
            boxShadow: '0 0 8px #D4AF37',
            animation: 'pulse 2.5s ease-in-out infinite',
          }} />
          BNI Krypton Chapter • Nagpur
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          style={{
            fontSize: 'clamp(32px, 5.5vw, 60px)',
            fontWeight: 800,
            color: '#F0F0F0',
            fontFamily: '"Playfair Display", serif',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            marginBottom: 16,
            maxWidth: 800,
            margin: '0 auto 16px',
          }}
        >
          Connect With Trusted{' '}
          <span style={{
            background: 'linear-gradient(135deg, #B61F2B 0%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            BNI Krypton
          </span>{' '}
          Professionals
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'rgba(255,255,255,0.4)',
            maxWidth: 500,
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Discover Nagpur&apos;s most elite business networking chapter.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}
        >
          <div style={{
            position: 'relative',
            display: 'flex', alignItems: 'center',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: focused ? '1px solid rgba(182,31,43,0.4)' : '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: focused
              ? '0 0 0 3px rgba(182,31,43,0.1), 0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}>
            <Search size={15} style={{ position: 'absolute', left: 16, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input
              type="search"
              value={query}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search members, businesses, categories..."
              style={{
                width: '100%',
                padding: '14px 44px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#F0F0F0',
                fontSize: 13.5,
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.01em',
              }}
            />
            {query && (
              <button onClick={handleClear} style={{
                position: 'absolute', right: 12,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6, cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)', padding: '3px 4px',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.15s ease',
              }}>
                <X size={12} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Tighter Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 540,
            margin: '36px auto 0',
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Members', value: '50+', color: '#B61F2B' },
            { label: 'Referrals Passed', value: '₹2Cr+', color: '#D4AF37' },
            { label: 'Years Active', value: '5+', color: '#818cf8' },
            { label: 'Categories', value: '40+', color: '#38bdf8' },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label} style={{
              flex: 1,
              padding: '14px 8px',
              textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 800,
                color,
                fontFamily: '"Playfair Display", serif',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {value}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9.5, marginTop: 4, letterSpacing: '0.02em' }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #D4AF37; }
          50% { opacity: 0.5; box-shadow: 0 0 3px #D4AF37; }
        }
        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </section>
  )
}

