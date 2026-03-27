'use client'
import { useEffect, useState } from 'react'
import { api, GameDto, getEmoji } from '@/lib/api'
import { Card, Spinner, Empty } from '@/components/ui'

export default function GamesPage() {
  const [games, setGames]   = useState<GameDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.games.getAll()
      .then(setGames)
      .catch(() => setGames([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth:1400, margin:'0 auto', padding:32 }}>
      <h1 className="pixel animate-fadeUp" style={{ fontSize:18, color:'var(--yellow)', textShadow:'3px 3px 0 rgba(0,0,0,.5)', marginBottom:8 }}>
        GAMES
      </h1>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>All Mario games and their character rosters</p>

      {loading ? <Spinner/> : games.length === 0 ? (
        <Empty icon="🎮" title="NO GAMES" sub="Check API connection."/>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
          {games.map((g, i) => (
            <div key={g.id} className="animate-fadeUp" style={{ animationDelay:`${i*40}ms` }}>
              <Card hover="blue" style={{ cursor:'default' }}>
                {/* Title */}
                <div style={{ fontSize:17, fontWeight:800, marginBottom:6 }}>{g.title}</div>

                {/* Platform badge */}
                <span style={{
                  display:'inline-block', fontSize:10, fontWeight:700,
                  padding:'3px 10px', borderRadius:20, marginBottom:10,
                  background:'rgba(66,165,245,0.15)', color:'var(--blue2)',
                  border:'1px solid rgba(66,165,245,0.3)',
                }}>{g.platform}</span>

                <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>📅 {g.releaseYear} · {g.genre}</div>
                <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, marginBottom:16 }}>{g.description}</div>

                {/* Cast */}
                {g.characters.length > 0 && (
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>
                      Cast
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {g.characters.slice(0,6).map(c => (
                        <span key={c.id} style={{
                          fontSize:11, padding:'4px 10px', borderRadius:8,
                          background:'var(--dark3)', color:'var(--muted)',
                          border:'1px solid var(--border)',
                        }}>{getEmoji(c.name)} {c.name}</span>
                      ))}
                      {g.characters.length > 6 && (
                        <span style={{
                          fontSize:11, padding:'4px 10px', borderRadius:8,
                          background:'var(--dark3)', color:'var(--muted)',
                          border:'1px solid var(--border)',
                        }}>+{g.characters.length-6} more</span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
