// ── Types ────────────────────────────────────────────────
export interface StatDto {
  id: number
  statName: string
  value: number
}

export interface GameSummaryDto {
  id: number
  title: string
  releaseYear: number
  role: string
}

export interface CharacterSummaryDto {
  id: number
  name: string
  species: string
  faction: string
  isPlayable: boolean
  imageUrl: string
}

export interface CharacterDto {
  id: number
  name: string
  description: string
  species: string
  faction: string
  abilities: string[]
  homeWorld: string
  firstAppearanceYear: number
  firstGame: string
  isPlayable: boolean
  imageUrl: string
  stats: StatDto[]
  games: GameSummaryDto[]
}

export interface CreateCharacterDto {
  name: string
  description: string
  species: string
  faction: string
  abilities: string[]
  homeWorld: string
  firstAppearanceYear: number
  firstGame: string
  isPlayable: boolean
  imageUrl: string
  stats: { statName: string; value: number }[]
}

export interface GameDto {
  id: number
  title: string
  releaseYear: number
  platform: string
  genre: string
  description: string
  characters: CharacterSummaryDto[]
}

// ── API Base — uses Next.js rewrite proxy to avoid cert issues ──
const BASE = '/api-proxy'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  if (res.status === 204) return undefined as T
  return res.json()
}

// ── Characters ───────────────────────────────────────────
export const api = {
  characters: {
    getAll: (params?: { faction?: string; species?: string; isPlayable?: boolean }) => {
      const q = new URLSearchParams()
      if (params?.faction)    q.set('faction', params.faction)
      if (params?.species)    q.set('species', params.species)
      if (params?.isPlayable !== undefined) q.set('isPlayable', String(params.isPlayable))
      return request<CharacterSummaryDto[]>(`/api/Characters?${q}`)
    },
    getById:  (id: number) => request<CharacterDto>(`/api/Characters/${id}`),
    search:   (q: string)  => request<CharacterSummaryDto[]>(`/api/Characters/search?q=${encodeURIComponent(q)}`),
    create:   (body: CreateCharacterDto) => request<CharacterDto>('/api/Characters', { method: 'POST', body: JSON.stringify(body) }),
    update:   (id: number, body: Partial<CreateCharacterDto>) => request<CharacterDto>(`/api/Characters/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete:   (id: number) => request<void>(`/api/Characters/${id}`, { method: 'DELETE' }),
  },
  games: {
    getAll:  () => request<GameDto[]>('/api/Games'),
    getById: (id: number) => request<GameDto>(`/api/Games/${id}`),
    create:  (body: { title: string; releaseYear: number; platform: string; genre: string; description: string }) =>
      request<GameDto>('/api/Games', { method: 'POST', body: JSON.stringify(body) }),
    delete:  (id: number) => request<void>(`/api/Games/${id}`, { method: 'DELETE' }),
  },
}

// ── Helpers ──────────────────────────────────────────────
export const CHAR_EMOJI: Record<string, string> = {
  'Mario': '🔴', 'Luigi': '🟢', 'Princess Peach': '👸', 'Bowser': '🐢',
  'Yoshi': '🦕', 'Toad': '🍄', 'Donkey Kong': '🦍', 'Wario': '💛',
  'Waluigi': '🟣', 'Rosalina': '⭐', 'Bowser Jr.': '🧡', 'Kamek': '🔮',
  'Princess Daisy': '🌼', 'Birdo': '🩷',
}
export const getEmoji = (name: string) => CHAR_EMOJI[name] ?? '🎮'

export const FACTION_STYLE: Record<string, string> = {
  Hero:    'bg-green-500/20 text-green-300 border border-green-500/40',
  Villain: 'bg-red-500/20 text-red-300 border border-red-500/40',
  Neutral: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
}

export const ROLE_STYLE: Record<string, string> = {
  Main:        'bg-blue-500/20 text-blue-300',
  Boss:        'bg-red-500/20 text-red-300',
  Supporting:  'bg-green-500/20 text-green-300',
  Cameo:       'bg-yellow-500/15 text-yellow-300',
}
