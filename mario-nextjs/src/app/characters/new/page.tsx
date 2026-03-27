import CharacterForm from '@/components/CharacterForm'

export default function NewCharacterPage() {
  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:32 }}>
      <h1 className="pixel" style={{ fontSize:16, color:'var(--yellow)', textShadow:'3px 3px 0 rgba(0,0,0,.5)', marginBottom:8 }}>
        ADD CHARACTER
      </h1>
      <p style={{ color:'var(--muted)', fontSize:14, marginBottom:28 }}>Create a new Mario Universe character</p>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:32 }}>
        <CharacterForm/>
      </div>
    </div>
  )
}
