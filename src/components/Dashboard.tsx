'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useEonetEvents, useEonetCategories } from '@/lib/hooks'
import Header from './Header'
import Sidebar from './Sidebar'
import type { GlobeStyle } from './MapView'

const GlobeView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center" style={{ background: '#050a14' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border border-transparent border-t-blue-400/50 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        </div>
        <span className="text-[11px] text-white/20 tracking-[0.25em] uppercase">Initializing</span>
      </div>
    </div>
  ),
})

export default function Dashboard() {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [days, setDays] = useState(30)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [globeStyle, setGlobeStyle] = useState<GlobeStyle>('day')

  const { events, isLoading, error, mutate } = useEonetEvents(days)
  const { categories } = useEonetCategories()

  const filteredEvents = useMemo(() => {
    if (!events) return []
    return events.filter(event => {
      if (selectedCategories.size > 0) {
        if (!event.categories.some(c => selectedCategories.has(c.id))) return false
      }
      if (searchQuery) {
        if (!event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      }
      return true
    })
  }, [events, selectedCategories, searchQuery])

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }, [])

  const selectedEvent = useMemo(() => {
    if (!selectedEventId || !events) return null
    return events.find(e => e.id === selectedEventId) || null
  }, [selectedEventId, events])

  return (
    <div className="h-screen flex flex-col text-gray-100" style={{ background: '#050a14' }}>
      <Header
        totalEvents={filteredEvents.length}
        isLoading={isLoading}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        globeStyle={globeStyle}
        onSetGlobeStyle={setGlobeStyle}
        onRefresh={() => mutate()}
      />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GlobeView
            events={filteredEvents}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
            globeStyle={globeStyle}
          />
        </div>

        {/* Mobile backdrop */}
        <div
          className={`
            absolute inset-0 z-20 md:hidden
            bg-black/50 backdrop-blur-sm
            transition-opacity duration-300
            ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar panel */}
        <div
          className={`
            absolute top-0 right-0 bottom-0 z-30
            w-full sm:w-[400px]
            transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
            flex flex-col
          `}
        >
          <div className="flex flex-col h-full bg-[#0a0f1a]/90 backdrop-blur-xl border-l border-white/[0.06] sidebar-grid">
            <Sidebar
              events={filteredEvents}
              allEvents={events || []}
              categories={categories || []}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              days={days}
              onSetDays={setDays}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEventId}
              isLoading={isLoading}
              error={error}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            fixed bottom-6 right-6 z-40 md:hidden
            w-12 h-12 rounded-2xl
            bg-blue-600 hover:bg-blue-500
            text-white
            shadow-lg shadow-blue-600/25
            flex items-center justify-center
            transition-all duration-200
            active:scale-95
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  )
}
