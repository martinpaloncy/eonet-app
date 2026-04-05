import type { GlobeStyle } from './MapView'

const MODES: { key: GlobeStyle; label: string }[] = [
  { key: 'day', label: 'DAY' },
  { key: 'night', label: 'NIGHT' },
  { key: 'carto', label: 'MAP' },
]

interface HeaderProps {
  totalEvents: number
  isLoading: boolean
  sidebarOpen: boolean
  onToggleSidebar: () => void
  globeStyle: GlobeStyle
  onSetGlobeStyle: (s: GlobeStyle) => void
  onRefresh: () => void
}

export default function Header({
  totalEvents,
  isLoading,
  sidebarOpen,
  onToggleSidebar,
  globeStyle,
  onSetGlobeStyle,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="h-12 flex items-center px-4 z-50 relative flex-shrink-0 bg-[#080d18]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-[13px] font-semibold tracking-wide leading-none text-white/90">EONET</h1>
          <p className="text-[10px] text-white/25 leading-none mt-0.5 tracking-wider">NASA Earth Events</p>
        </div>
      </div>

      <div className="w-px h-5 bg-white/[0.06] mx-4 hidden sm:block" />

      {/* Live + count */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-medium text-emerald-400/80 tracking-widest">LIVE</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold font-mono text-white/90 tabular-nums">{totalEvents}</span>
          <span className="text-[10px] text-white/25">events</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* DAY / NIGHT / MAP segmented toggle */}
        <div className="flex p-[3px] bg-white/[0.03] rounded-lg border border-white/[0.04]">
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onSetGlobeStyle(key)}
              className={`
                px-2 py-1 text-[10px] font-semibold tracking-widest rounded-md
                transition-all duration-200
                ${globeStyle === key
                  ? 'text-white/80 bg-white/[0.08] shadow-sm'
                  : 'text-white/20 hover:text-white/45'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/[0.06] mx-1.5" />

        <button
          onClick={onRefresh}
          className="p-1.5 text-white/30 hover:text-white/70 rounded-lg transition-colors"
          title="Refresh data"
        >
          <svg
            className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            sidebarOpen
              ? 'text-blue-400/80 bg-blue-500/10'
              : 'text-white/30 hover:text-white/70'
          }`}
          title="Toggle panel"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm12 0v18" />
          </svg>
        </button>
      </div>
    </header>
  )
}
