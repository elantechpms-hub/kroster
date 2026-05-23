'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn('nodemailer', {
        email,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('Failed to send login email. Please try again.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#B61F2B]/8 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B61F2B] to-[#7A111B] flex items-center justify-center shadow-xl">
              <span className="text-white font-bold">BNI</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">BNI Krypton</div>
              <div className="text-white/40 text-xs">Member Portal</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-gold rounded-3xl p-10 border border-amber-500/20 shadow-2xl glow-gold relative overflow-hidden">
          {/* Subtle light shimmer/gradient inside card */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent pointer-events-none" />

          {!sent ? (
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold text-white text-center mb-2 font-['Playfair_Display'] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-white/60 text-center text-sm mb-8">
                Enter your email to receive a secure login link.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    pointerEvents: 'none',
                  }} />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: '100%',
                      height: '52px',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    className="focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/25 text-white"
                    aria-label="Email address"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    width: '100%',
                    height: '52px',
                    background: 'linear-gradient(135deg, #B61F2B 0%, #7A111B 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(182, 31, 43, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" /> Sending...</>
                  ) : (
                    <>Send Login Link <ArrowRight style={{ width: '16px', height: '16px' }} /></>
                  )}
                </Button>
              </form>

              <p className="text-center text-white/40 text-xs mt-8 font-medium">
                No password needed. We&apos;ll send you a secure link.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-950/20">
                <Mail className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 font-['Playfair_Display']">Check Your Email</h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
                We&apos;ve sent a login link to <span className="text-white font-semibold">{email}</span>.
                Click the link in your email to sign in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 text-white/40 hover:text-white/70 text-sm font-semibold transition-colors border-b border-white/10 hover:border-white/30 pb-0.5"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors font-medium">
            &larr; Back to directory
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
