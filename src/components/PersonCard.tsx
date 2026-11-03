import { Link } from 'react-router-dom'
import type { Person } from '../types'
import { Card, Tag } from './ui'
import { useArchive, archiveStore } from '../lib/store'

export default function PersonCard({ person }: { person: Person }) {
  const { favoritePeople } = useArchive()
  const fav = favoritePeople.includes(person.slug)
  return (
    <Card hover className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/person/${person.slug}`} className="block group">
          <h3 className="text-lg font-bold group-hover:accent">{person.name}</h3>
          <p className="text-xs text-muted">
            {person.originalName}
          </p>
        </Link>
        <button
          onClick={() => archiveStore.togglePerson(person.slug)}
          aria-pressed={fav}
          aria-label={fav ? '取消收藏' : '收藏人物'}
          title={fav ? '取消收藏' : '收藏人物'}
          className="text-xl leading-none transition-transform hover:scale-110"
        >
          <span className={fav ? 'accent' : 'text-muted opacity-60'}>{fav ? '★' : '☆'}</span>
        </button>
      </div>

      <p className="mt-1 text-xs text-muted">
        {person.yearLabel} · {person.civilization}
      </p>

      <p className="mt-3 flex-1 text-sm leading-relaxed">{person.oneLiner}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {person.fields.map((f) => (
          <Tag key={f} neutral>
            {f}
          </Tag>
        ))}
        {person.depth === 'full' ? (
          <Tag>深度档案</Tag>
        ) : (
          <Tag neutral>骨架档案</Tag>
        )}
      </div>
    </Card>
  )
}
