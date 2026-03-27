'use client'
import { useRouter } from 'next/navigation'
import { CharacterSummaryDto, FACTION_STYLE, getEmoji } from '@/lib/api'
import { Badge, Btn, Card, StatBar } from './ui'
import { useToast } from './Toast'
import { api } from '@/lib/api'

interface Props {
  char: CharacterSummaryDto
  stats?: { statName: string; value: number }[]
  onDeleted?: () => void
  style?: React.CSSProperties
}

export default function CharacterCard({ char, stats, onDeleted, style }: Props) {
  const router = useRouter()
  const toast  = useToast()

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Delete ${char.name}? This cannot be undone.`)) return
    try {
      await api.characters.delete(char.id)
      toast(`${char.name} deleted.`, 'info')
      onDeleted?.()
    } catch { toast('Delete failed.', 'error') }
  }

  return (
    <Card onClick={() => router.push(`/characters/${char.id}`)} style={style}>
      {/* Avatar */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--dark3)', border: '3px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 14,
      }}>{getEmoji(char.name)}</div>

      {/* Name & Species */}
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{char.name}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{char.species}</div>

      {/* Faction badge */}
      <div style={{ marginBottom: 10 }}>
        <Badge label={char.faction} className={FACTION_STYLE[char.faction] ?? ''} />
        {char.isPlayable && (
          <Badge label="Playable" className="bg-blue-500/15 text-blue-300 border border-blue-500/30" />
        )}
      </div>

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap: 6, marginBottom: 14 }}>
          {stats.slice(0,4).map(s => <StatBar key={s.statName} name={s.statName} value={s.value}/>)}
        </div>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap: 8, marginTop: 14 }} onClick={e => e.stopPropagation()}>
        <Btn size="sm" variant="secondary" onClick={() => router.push(`/characters/${char.id}/edit`)}>✏ Edit</Btn>
        <Btn size="sm" variant="danger"    onClick={handleDelete}>🗑 Del</Btn>
      </div>
    </Card>
  )
}
