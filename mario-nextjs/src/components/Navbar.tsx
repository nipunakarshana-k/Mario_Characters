'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/',           label: 'Characters' },
  { href: '/games',      label: 'Games'      },
  { href: '/characters/new', label: '+ Add' },
]

export default function Navbar() {
  const path = usePathname()
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch('/api-proxy/api/Characters', { signal: AbortSignal.timeout(4000) })
        setOnline(r.ok)
      } catch { setOnline(false) }
    }
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(13,13,26,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '2px solid var(--red)',
      padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
      boxShadow: '0 4px 32px rgba(232,23,58,0.2)',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span className="pixel animate-pulse-glow" style={{
          fontSize: 13, color: 'var(--yellow)',
          letterSpacing: 1,
        }}>🍄 MARIO API</span>
      </Link>

      <nav style={{ display: 'flex', gap: 8 }}>
        {links.map(l => {
          const active = l.href === '/' ? path === '/' : path.startsWith(l.href)
          return (
            <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
              <span className="pixel" style={{
                fontSize: 9, padding: '8px 14px', borderRadius: 8,
                border: `2px solid ${active ? 'var(--red2)' : 'transparent'}`,
                background: active ? 'var(--red)' : 'var(--dark3)',
                color: active ? '#fff' : 'var(--muted)',
                cursor: 'pointer', display: 'block',
                boxShadow: active ? '0 0 16px rgba(232,23,58,0.4)' : 'none',
                transition: 'all .2s',
              }}>{l.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: online === null ? '#555' : online ? 'var(--green2)' : 'var(--red)',
          boxShadow: online ? '0 0 8px var(--green2)' : 'none',
        }} className={online ? 'animate-blink' : ''} />
        <span>{online === null ? 'Connecting...' : online ? 'API Online' : 'API Offline'}</span>
      </div>
    </header>
  )
}
