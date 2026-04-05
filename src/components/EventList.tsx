import { CATEGORY_STYLES } from '@/lib/constants'
import type { EONETEvent } from '@/lib/types'

interface Props {
  events: EONETEvent[]
  isLoading: boolean
  error: unknown
  onSelectEvent: (id: string) => void
}

export default function EventList({ events, isLoading, error, onSelectEvent }: Props) {
  if (error) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-[13px] text-red-400/80 font-medium">Failed to load events</p>
        <p className="text-[11px] text-white/20 mt-1">Check your connection and try again</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <div
              className="h-[50px] rounded-lg"
              style={{
                background: `linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 100%)`,
                backgroundSize: '200% 100%',
                animation: `shimmer 1.5s ease-in-out infinite ${i * 0.08}s`,
              }}
            />
          </div>
        ))}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/[0.03] flex items-center justify-center">
          <svg className="w-5 h-5 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-[13px] text-white/30">No events found</p>
        <p className="text-[11px] text-white/15 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="px-3 py-2">
      <div className="text-[10px] text-white/15 uppercase tracking-[0.15em] font-medium px-1 mb-1">
        {events.length} event{events.length !== 1 ? 's' : ''}
      </div>
      <div className="space-y-px">
        {events.map(event => {
          const latest = event.geometry[event.geometry.length - 1]
          const catId = event.categories[0]?.id || 'default'
          const { color } = CATEGORY_STYLES[catId] || CATEGORY_STYLES.default

          return (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="
                w-full text-left px-3 py-2.5 rounded-lg
                hover:bg-white/[0.04] active:bg-white/[0.06]
                transition-all duration-150 group
              "
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="w-[7px] h-[7px] rounded-full mt-[6px] flex-shrink-0 transition-shadow duration-200 group-hover:shadow-[0_0_6px_var(--glow)]"
                  style={{ backgroundColor: color, '--glow': `${color}60` } as React.CSSProperties}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white/60 font-medium truncate group-hover:text-white/90 transition-colors">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-white/20">
                    <span>{event.categories[0]?.title}</span>
                    {latest && (
                      <>
                        <span className="text-white/10">·</span>
                        <span>{formatDate(latest.date)}</span>
                      </>
                    )}
                    {!event.closed && (
                      <>
                        <span className="text-white/10">·</span>
                        <span className="text-emerald-400/70 font-semibold tracking-wider">ACTIVE</span>
                      </>
                    )}
                  </div>
                </div>
                <svg
                  className="w-3 h-3 text-white/10 group-hover:text-white/30 mt-1.5 flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
