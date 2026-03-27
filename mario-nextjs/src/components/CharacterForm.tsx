'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, CharacterDto, CreateCharacterDto } from '@/lib/api'
import { Btn, FormGroup, Input, Select, Textarea } from './ui'
import { useToast } from './Toast'

const DEFAULT_STATS = [
  { statName: 'Speed',   value: 5 },
  { statName: 'Power',   value: 5 },
  { statName: 'Jump',    value: 5 },
  { statName: 'Defense', value: 5 },
]

export default function CharacterForm({ initial }: { initial?: CharacterDto }) {
  const router = useRouter()
  const toast  = useToast()
  const isEdit = !!initial

  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:                initial?.name               ?? '',
    description:         initial?.description        ?? '',
    species:             initial?.species             ?? '',
    faction:             initial?.faction             ?? 'Hero',
    homeWorld:           initial?.homeWorld           ?? '',
    firstAppearanceYear: initial?.firstAppearanceYear ?? new Date().getFullYear(),
    firstGame:           initial?.firstGame           ?? '',
    imageUrl:            initial?.imageUrl            ?? '',
    isPlayable:          initial?.isPlayable          ?? true,
    abilities:           initial?.abilities?.join(', ') ?? '',
  })
  const [stats, setStats] = useState<{ statName:string; value:number }[]>(
    initial?.stats?.length ? initial.stats.map(s=>({statName:s.statName,value:s.value})) : DEFAULT_STATS
  )

  const set = (k: string, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { toast('Name is required!', 'error'); return }
    setSaving(true)
    const body: CreateCharacterDto = {
      ...form,
      firstAppearanceYear: Number(form.firstAppearanceYear),
      abilities: form.abilities.split(',').map(s=>s.trim()).filter(Boolean),
      stats,
    }
    try {
      if (isEdit) {
        await api.characters.update(initial!.id, body)
        toast(`${form.name} updated!`, 'success')
      } else {
        await api.characters.create(body)
        toast(`${form.name} added!`, 'success')
      }
      router.push('/')
      router.refresh()
    } catch { toast('Save failed. Check API.', 'error') }
    finally { setSaving(false) }
  }

  const STAT_ICONS: Record<string,string> = { Speed:'⚡', Power:'💪', Jump:'🦘', Defense:'🛡️' }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        <FormGroup label="Name *">
          <Input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Princess Daisy"/>
        </FormGroup>
        <FormGroup label="Species *">
          <Input value={form.species} onChange={e=>set('species',e.target.value)} placeholder="e.g. Human"/>
        </FormGroup>
        <FormGroup label="Faction *">
          <Select value={form.faction} onChange={e=>set('faction',e.target.value)}>
            <option value="Hero">Hero</option>
            <option value="Villain">Villain</option>
            <option value="Neutral">Neutral</option>
          </Select>
        </FormGroup>
        <FormGroup label="Home World">
          <Input value={form.homeWorld} onChange={e=>set('homeWorld',e.target.value)} placeholder="e.g. Mushroom Kingdom"/>
        </FormGroup>
        <FormGroup label="First Appearance Year">
          <Input type="number" value={form.firstAppearanceYear} onChange={e=>set('firstAppearanceYear',e.target.value)} placeholder="1985"/>
        </FormGroup>
        <FormGroup label="First Game">
          <Input value={form.firstGame} onChange={e=>set('firstGame',e.target.value)} placeholder="e.g. Super Mario Bros."/>
        </FormGroup>
        <FormGroup label="Image URL">
          <Input value={form.imageUrl} onChange={e=>set('imageUrl',e.target.value)} placeholder="https://..."/>
        </FormGroup>
        <FormGroup label="Playable?">
          <Select value={String(form.isPlayable)} onChange={e=>set('isPlayable',e.target.value==='true')}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        </FormGroup>
        <div style={{ gridColumn:'1/-1' }}>
          <FormGroup label="Description">
            <Textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Describe the character..."/>
          </FormGroup>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <FormGroup label="Abilities (comma separated)">
            <Input value={form.abilities} onChange={e=>set('abilities',e.target.value)} placeholder="Super Jump, Fire Flower, Invincibility Star"/>
          </FormGroup>
        </div>

        {/* Stats */}
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.08em', display:'block', marginBottom:10 }}>
            Stats (1–10)
          </label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {stats.map((s,i) => (
              <div key={s.statName} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:12, color:'var(--muted)', width:80 }}>
                  {STAT_ICONS[s.statName]} {s.statName}
                </span>
                <Input
                  type="number" min={1} max={10} value={s.value}
                  onChange={e => setStats(st => st.map((x,j)=>j===i?{...x,value:Number(e.target.value)}:x))}
                  style={{ width:80 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:12, marginTop:28, justifyContent:'flex-end' }}>
        <Btn variant="secondary" onClick={() => router.back()}>Cancel</Btn>
        <Btn variant="primary" type="submit" disabled={saving}>
          {saving ? 'SAVING...' : isEdit ? 'UPDATE CHARACTER' : 'SAVE CHARACTER'}
        </Btn>
      </div>
    </form>
  )
}
