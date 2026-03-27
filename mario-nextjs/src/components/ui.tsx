// Spinner
export function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: 60 }}>
      <div className="animate-spin" style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '4px solid var(--dark3)',
        borderTopColor: 'var(--red)',
      }}/>
    </div>
  )
}

// Empty state
export function Empty({ icon='🔍', title='NO RESULTS', sub='' }: { icon?:string; title?:string; sub?:string }) {
  return (
    <div style={{ textAlign:'center', padding: '60px 20px', color: 'var(--muted)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <div className="pixel" style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>{title}</div>
      {sub && <div style={{ fontSize: 14 }}>{sub}</div>}
    </div>
  )
}

// Stat bar
export function StatBar({ name, value }: { name:string; value:number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      <span style={{ fontSize: 10, color: 'var(--muted)', width: 52, flexShrink: 0 }}>{name}</span>
      <div style={{ flex:1, height: 6, background: 'var(--dark3)', borderRadius: 3, overflow:'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${value * 10}%`,
          background: 'linear-gradient(90deg, var(--red), var(--yellow))',
          transition: 'width .6s ease',
        }}/>
      </div>
      <span style={{ fontSize: 10, color: 'var(--muted)', width: 20, textAlign:'right' }}>{value}</span>
    </div>
  )
}

// Badge
export function Badge({ label, className }: { label:string; className:string }) {
  return (
    <span className={className} style={{
      display:'inline-block', fontSize: 10, fontWeight: 700,
      padding: '3px 10px', borderRadius: 20,
      textTransform:'uppercase', letterSpacing:'.08em',
    }}>{label}</span>
  )
}

// Card
export function Card({ children, onClick, hover='red', style }: {
  children: React.ReactNode
  onClick?: () => void
  hover?: 'red'|'blue'
  style?: React.CSSProperties
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: 24,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform .25s, box-shadow .25s, border-color .25s',
        ...style,
      }}
      onMouseEnter={e => {
        if (!onClick) return
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)'
        el.style.borderColor = hover === 'blue' ? 'var(--blue2)' : 'var(--red)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = 'var(--border)'
      }}
    >{children}</div>
  )
}

// Button
export function Btn({
  children, onClick, variant='primary', size='md', type='button', disabled
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary'|'secondary'|'danger'
  size?: 'md'|'sm'
  type?: 'button'|'submit'
  disabled?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: 'var(--red)',     color: '#fff',          border: '2px solid var(--red2)',  boxShadow: '0 4px 16px rgba(232,23,58,0.3)' },
    secondary: { background: 'var(--dark3)',   color: 'var(--muted)',  border: '2px solid var(--border)' },
    danger:    { background: 'transparent',    color: 'var(--red)',    border: '2px solid var(--red)'    },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="pixel"
      style={{
        fontSize: size==='sm' ? 8 : 9,
        padding: size==='sm' ? '7px 12px' : '11px 20px',
        borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all .2s',
        ...styles[variant],
      }}
    >{children}</button>
  )
}

// Input / Select / Textarea
const inputStyle: React.CSSProperties = {
  background: 'var(--dark3)', border: '2px solid var(--border)',
  borderRadius: 10, padding: '10px 14px',
  color: 'var(--text)', fontFamily: 'Nunito, sans-serif', fontSize: 14,
  outline: 'none', width: '100%',
  transition: 'border-color .2s',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }}
    onFocus={e => (e.target.style.borderColor = 'var(--red)')}
    onBlur={e  => (e.target.style.borderColor = 'var(--border)')}/>
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputStyle, ...props.style, cursor:'pointer' }}
    onFocus={e => (e.target.style.borderColor = 'var(--red)')}
    onBlur={e  => (e.target.style.borderColor = 'var(--border)')}/>
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, resize:'vertical', minHeight: 80, ...props.style }}
    onFocus={e => (e.target.style.borderColor = 'var(--red)')}
    onBlur={e  => (e.target.style.borderColor = 'var(--border)')}/>
}

export function FormGroup({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
