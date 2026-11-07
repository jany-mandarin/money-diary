import type { Category } from '../types'

interface Props {
  categories: Category[]
  value: string
  onChange: (id: string) => void
}

export default function CategoryPicker({ categories, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const active = c.id === value
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`btn-press flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-sm font-bold transition-colors ${
              active ? 'text-white border-transparent' : 'bg-white text-cocoa-600 border-pudding-200'
            }`}
            style={active ? { backgroundColor: c.color } : undefined}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        )
      })}
    </div>
  )
}
