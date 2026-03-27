'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api, CharacterDto } from '@/lib/api'
import CharacterForm from '@/components/CharacterForm'
import { Spinner } from '@/components/ui'

export default function EditCharacterPage() {
  const { id } = useParams<{ id: string }>()
  const [char, setChar]     = useState<CharacterDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.characters.getById(Number(id))
      .then(setChar)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:32 }}>
      <h1 className="pixel" style={{ fontSize:16, color:'var(--yellow)', textShadow:'3px 3px 0 rgba(0,0,0,.5)', marginBottom:8 }}>
        EDIT CHARACTER
      </h1>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>
        {char ? `Editing: ${char.name}` : 'Loading...'}
      </p>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:32 }}>
        {loading ? <Spinner/> : char ? <CharacterForm initial={char}/> : <p style={{color:'var(--muted)'}}>Character not found.</p>}
      </div>
    </div>
  )
}
