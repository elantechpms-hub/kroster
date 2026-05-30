'use client'

import { useEffect, useRef } from 'react'

export function ProfileTracker({ memberId }: { memberId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, action: 'VIEW' })
    }).catch(console.error)
  }, [memberId])

  return null
}

export function trackAction(memberId: string, action: 'CALL' | 'WHATSAPP' | 'WEB' | 'SHARE') {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, action })
  }).catch(console.error)
}
