'use client'
import { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: number; msg: string; type: ToastType }
const ToastCtx = createContext<(msg: string, type?: ToastType) => void>(() => {})

export function useToast() { return useContext(ToastCtx) }

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' }
const COLORS = {
  success: { border: 'var(--green2)', color: 'var(--green2)' },
  error:   { border: 'var(--red2)',   color: 'var(--red2)'   },
  info:    { border: 'var(--blue2)',  color: 'var(--blue2)'  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  let nextId = 0

  const show = useCallback((msg: string, type: ToastType = 'info') => {
    const id = ++nextId
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-slideIn" style={{
            padding: '14px 20px', borderRadius: 12,
            fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 260,
            background: 'var(--dark2)',
            border: `1px solid ${COLORS[t.type].border}`,
            color: COLORS[t.type].color,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            <span>{ICONS[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
