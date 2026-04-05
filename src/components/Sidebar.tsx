import CategoryFilter from './CategoryFilter'
import TimeRange from './TimeRange'
import EventList from './EventList'
import EventDetail from './EventDetail'
import StatsPanel from './StatsPanel'
import type { EONETEvent, EONETCategoryDetail } from '@/lib/types'

interface SidebarProps {
  events: EONETEvent[]
  allEvents: EONETEvent[]
  categories: EONETCategoryDetail[]
  selectedCategories: Set<string>
  onToggleCategory: (id: string) => void
  days: number
  onSetDays: (days: number) => void
  searchQuery: string
  onSearch: (q: string) => void
  selectedEvent: EONETEvent | null
  onSelectEvent: (id: string | null) => void
  isLoading: boolean
  error: unknown
  onClose: () => void
}

export default function Sidebar({
  events,
  allEvents,
  categories,
  selectedCategories,
  onToggleCategory,
  days,
  onSetDays,
  searchQuery,
  onSearch,
  selectedEvent,
  onSelectEvent,
  isLoading,
  error,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 flex-shrink-0 border-b border-white/[0.04]">
        <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">
          Control Panel
        </span>
        <button
          onClick={onClose}
          className="md:hidden p-1 text-white/25 hover:text-white/60 rounded-md transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {selectedEvent ? (
        <EventDetail event={selectedEvent} onBack={() => onSelectEvent(null)} />
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          <StatsPanel events={events} />
          <CategoryFilter
            categories={categories}
            events={allEvents}
            selectedCategories={selectedCategories}
            onToggle={onToggleCategory}
          />
          <TimeRange days={days} onSetDays={onSetDays} />

          {/* Search */}
          <div className="px-4 py-3 border-b border-white/[0.04]">
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search events..."
                className="
                  w-full pl-8 pr-3 py-1.5
                  bg-white/[0.03] border border-white/[0.06] rounded-lg
                  text-[13px] text-white/80 placeholder-white/15
                  focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05]
                  transition-all duration-200
                "
              />
            </div>
          </div>

          <EventList
            events={events}
            isLoading={isLoading}
            error={error}
            onSelectEvent={id => onSelectEvent(id)}
          />
        </div>
      )}
    </div>
  )
}
