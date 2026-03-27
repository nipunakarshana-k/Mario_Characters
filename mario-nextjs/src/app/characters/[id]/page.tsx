'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, CharacterDto, FACTION_STYLE, ROLE_STYLE, getEmoji } from '@/lib/api'
import { Badge, Btn, Spinner, StatBar } from '@/components/ui'
import { useToast } from '@/components/Toast'

export default function CharacterDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const toast   = useToast()
  const [char, setChar]     = useState<CharacterDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.characters.getById(Number(id))
      .then(setChar)
      .catch(() => toast('Failed to load character.', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ maxWidth:800, margin:'0 auto', padding:32 }}><Spinner/></div>
  if (!char)   return <div style={{ maxWidth:800, margin:'0 auto', padding:32, color:'var(--muted)' }}>Character not found.</div>

  async function handleDelete() {
    if (!confirm(`Delete ${char!.name}? This cannot be undone.`)) return
    try {
      await api.characters.delete(char!.id)
      toast(`${char!.name} deleted.`, 'info')
      router.push('/')
    } catch { toast('Delete failed.', 'error') }
  }

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:32 }}>
      {/* Back */}
      <button onClick={() => router.back()} style={{
        background:'none', border:'none', color:'var(--muted)', cursor:'pointer',
        fontSize:13, marginBottom:24, display:'flex', alignItems:'center', gap:6,
      }}>← Back</button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:32 }}>
        {/* Left panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:20, padding:28, textAlign:'center',
          }}>
            <div style={{ fontSize:72, marginBottom:16 }}>{getEmoji(char.name)}</div>
            <h1 style={{ fontSize:24, fontWeight:900, marginBottom:6 }}>{char.name}</h1>
            <div style={{ fontSize:13, color:'var(--muted)', marginBottom:12 }}>{char.species}</div>
            <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
              <Badge label={char.faction} className={FACTION_STYLE[char.faction]??''}/>
              {char.isPlayable && <Badge label="Playable" className="bg-blue-500/15 text-blue-300 border border-blue-500/30"/>}
            </div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>🏠 {char.homeWorld || 'Unknown'}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>📅 First appeared {char.firstAppearanceYear}</div>
            <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>🎮 {char.firstGame}</div>
          </div>

          {/* Stats */}
          {char.stats.length > 0 && (
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:24 }}>
              <div className="pixel" style={{ fontSize:9, color:'var(--yellow)', marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
                STATS
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {char.stats.map(s => <StatBar key={s.id} name={s.statName} value={s.value}/>)}
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* Description */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:24 }}>
            <div className="pixel" style={{ fontSize:9, color:'var(--yellow)', marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
              ABOUT
            </div>
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8 }}>
              {char.description || 'No description available.'}
            </p>
          </div>

          {/* Abilities */}
          {char.abilities.length > 0 && (
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:24 }}>
              <div className="pixel" style={{ fontSize:9, color:'var(--yellow)', marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
                ABILITIES
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {char.abilities.map(a => (
                  <span key={a} style={{
                    fontSize:12, padding:'5px 12px', borderRadius:8,
                    background:'rgba(255,214,0,0.1)', color:'var(--yellow)',
                    border:'1px solid rgba(255,214,0,0.3)',
                  }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Games */}
          {char.games.length > 0 && (
            <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:24 }}>
              <div className="pixel" style={{ fontSize:9, color:'var(--yellow)', marginBottom:14, paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
                APPEARS IN
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {char.games.map(g => (
                  <div key={g.id} style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'10px 14px', borderRadius:10,
                    background:'var(--dark3)', border:'1px solid var(--border)',
                  }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700 }}>{g.title}</div>
                      <div style={{ fontSize:11, color:'var(--muted)' }}>{g.releaseYear}</div>
                    </div>
                    <span style={{
                      fontSize:10, padding:'3px 10px', borderRadius:20, fontWeight:700,
                    }} className={ROLE_STYLE[g.role]??''}>{g.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:12 }}>
            <Btn variant="primary" onClick={() => router.push(`/characters/${char.id}/edit`)}>✏ Edit Character</Btn>
            <Btn variant="danger"  onClick={handleDelete}>🗑 Delete</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
