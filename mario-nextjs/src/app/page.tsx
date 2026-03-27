'use client'
import { useEffect, useState, useCallback } from 'react'
import { api, CharacterSummaryDto } from '@/lib/api'
import CharacterCard from '@/components/CharacterCard'
import { Spinner, Empty } from '@/components/ui'

export default function HomePage() {
  const [chars, setChars]     = useState<CharacterSummaryDto[]>([])
  const [filtered, setFiltered] = useState<CharacterSummaryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [faction, setFaction] = useState('')
  const [playable, setPlayable] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.characters.getAll()
      setChars(data)
      setFiltered(data)
    } catch { setChars([]); setFiltered([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    let f = [...chars]
    if (search)  f = f.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.species.toLowerCase().includes(search.toLowerCase()))
    if (faction) f = f.filter(c => c.faction === faction)
    if (playable !== '') f = f.filter(c => String(c.isPlayable) === playable)
    setFiltered(f)
  }, [search, faction, playable, chars])

  const heroes   = chars.filter(c => c.faction === 'Hero').length
  const villains = chars.filter(c => c.faction === 'Villain').length
  const playableCount = chars.filter(c => c.isPlayable).length

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 32, position:'relative', zIndex:1 }}>

      {/* Page title */}
      <h1 className="pixel animate-fadeUp" style={{ fontSize:18, color:'var(--yellow)', textShadow:'3px 3px 0 rgba(0,0,0,.5)', marginBottom:8 }}>
        CHARACTERS
      </h1>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Browse and manage all Mario Universe characters</p>

      {/* Stats Bar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
        {[
          { icon:'🎮', val: chars.length,   label:'Total Characters', accent:'var(--red)'   },
          { icon:'⭐', val: heroes,          label:'Heroes',           accent:'var(--green2)'},
          { icon:'💀', val: villains,        label:'Villains',         accent:'var(--red)'  },
          { icon:'🕹️', val: playableCount,   label:'Playable',         accent:'var(--yellow)'},
        ].map(s => (
          <div key={s.label} style={{
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:16, padding:'20px 24px',
            position:'relative', overflow:'hidden',
            transition:'transform .2s',
          }}
          onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-4px)')}
          onMouseLeave={e=>(e.currentTarget.style.transform='')}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:s.accent }}/>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div className="pixel" style={{ fontSize:22, marginBottom:4 }}>{loading ? '—' : s.val}</div>
            <div style={{ fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍  Search characters..."
          style={{
            flex:1, minWidth:200,
            background:'var(--dark3)', border:'2px solid var(--border)',
            borderRadius:12, padding:'10px 16px',
            color:'var(--text)', fontFamily:'Nunito,sans-serif', fontSize:14,
            outline:'none',
          }}
          onFocus={e=>(e.target.style.borderColor='var(--red)')}
          onBlur={e=>(e.target.style.borderColor='var(--border)')}
        />
        {[
          { val: faction,  setter: setFaction,  options: [['','All Factions'],['Hero','Heroes'],['Villain','Villains'],['Neutral','Neutral']] },
          { val: playable, setter: setPlayable, options: [['','All Types'],['true','Playable'],['false','Non-Playable']] },
        ].map((f,i) => (
          <select key={i} value={f.val} onChange={e=>f.setter(e.target.value)} style={{
            background:'var(--dark3)', border:'2px solid var(--border)',
            borderRadius:12, padding:'10px 16px',
            color:'var(--text)', fontFamily:'Nunito,sans-serif', fontSize:14,
            outline:'none', cursor:'pointer',
          }}>
            {f.options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <button onClick={load} className="pixel" style={{
          fontSize:9, padding:'11px 16px', borderRadius:10,
          background:'var(--dark3)', color:'var(--muted)',
          border:'2px solid var(--border)', cursor:'pointer',
        }}>↺ Refresh</button>
      </div>

      {/* Grid */}
      {loading ? <Spinner/> : filtered.length === 0 ? (
        <Empty icon="🔍" title="NO RESULTS" sub="Try a different search or filter."/>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {filtered.map((c, i) => (
            <div key={c.id} className="animate-fadeUp" style={{ animationDelay:`${i*40}ms` }}>
              <CharacterCard char={c} onDeleted={load}/>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
