import { useMemo } from 'react'
import { CATEGORY_STYLES } from '@/lib/constants'
import type { EONETEvent, EONETCategoryDetail } from '@/lib/types'

interface Props {
  categories: EONETCategoryDetail[]
  events: EONETEvent[]
  selectedCategories: Set<string>
  onToggle: (id: string) => void
}

export default function CategoryFilter({ categories, events, selectedCategories, onToggle }: Props) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    events.forEach(e => {
      e.categories.forEach(cat => {
        c[cat.id] = (c[cat.id] || 0) + 1
      })
    })
    return c
  }, [events])

  if (!categories.length) return null

  return (
    <div className="px-4 py-3 border-b border-white/[0.04]">
      <h3 className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-2">
        Categories
      </h3>
      <div className="flex flex-wrap gap-1">
        {categories.map(cat => {
          const style = CATEGORY_STYLES[cat.id] || CATEGORY_STYLES.default
          const count = counts[cat.id] || 0
          const isSelected = selectedCategories.has(cat.id)
          const dimmed = selectedCategories.size > 0 && !isSelected

          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className={`
                flex items-center gap-1.5 px-2 py-[5px] rounded-md text-[11px]
                transition-all duration-200
                ${isSelected
                  ? 'bg-white/[0.08] shadow-sm'
                  : dimmed
                    ? 'opacity-25 hover:opacity-50'
                    : 'hover:bg-white/[0.04]'
                }
              `}
            >
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0 transition-shadow duration-200"
                style={{
                  backgroundColor: style.color,
                  boxShadow: isSelected ? `0 0 6px ${style.color}60` : 'none',
                }}
              />
              <span className={`transition-colors ${dimmed ? 'text-white/30' : 'text-white/55'}`}>
                {cat.title}
              </span>
              {count > 0 && (
                <span className={`font-mono text-[9px] tabular-nums ${dimmed ? 'text-white/15' : 'text-white/25'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
