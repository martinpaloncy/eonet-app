import { CATEGORY_STYLES } from '@/lib/constants'
import type { EONETEvent } from '@/lib/types'

interface Props {
  event: EONETEvent
  onBack: () => void
}

export default function EventDetail({ event, onBack }: Props) {
  const latest = event.geometry[event.geometry.length - 1]
  const catId = event.categories[0]?.id || 'default'
  const { color } = CATEGORY_STYLES[catId] || CATEGORY_STYLES.default

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      {/* Back */}
      <div className="px-4 py-2.5 border-b border-white/[0.04] flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/60 transition-colors group"
        >
          <svg className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to list
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
            />
            <span className="text-[11px] text-white/30">{event.categories[0]?.title}</span>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md tracking-wider ${
                event.closed
                  ? 'bg-white/[0.05] text-white/30'
                  : 'bg-emerald-500/10 text-emerald-400/80 border border-emerald-500/15'
              }`}
            >
              {event.closed ? 'CLOSED' : 'ACTIVE'}
            </span>
          </div>
          <h2 className="text-[15px] font-semibold text-white/90 leading-snug">{event.title}</h2>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-[13px] text-white/35 leading-relaxed">{event.description}</p>
        )}

        {/* Key details */}
        <div className="space-y-2 bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
          {latest && (
            <>
              <Row label="Date" value={formatDateTime(latest.date)} />
              <Row
                label="Location"
                value={`${latest.coordinates[1].toFixed(4)}, ${latest.coordinates[0].toFixed(4)}`}
                mono
              />
              {latest.magnitudeValue != null && (
                <Row
                  label="Magnitude"
                  value={`${latest.magnitudeValue} ${latest.magnitudeUnit || ''}`}
                  mono
                />
              )}
            </>
          )}
          {event.closed && <Row label="Closed" value={formatDateTime(event.closed)} />}
          <Row label="Event ID" value={event.id} mono />
        </div>

        {/* Position history */}
        {event.geometry.length > 1 && (
          <div>
            <h3 className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-2">
              Position History ({event.geometry.length})
            </h3>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-white/[0.04] divide-y divide-white/[0.03]">
              {[...event.geometry].reverse().map((geo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 text-[11px] hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white/30">
                    {new Date(geo.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-white/20 font-mono tabular-nums">
                    {geo.coordinates[1].toFixed(2)}, {geo.coordinates[0].toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {event.sources.length > 0 && (
          <div>
            <h3 className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-2">
              Sources
            </h3>
            <div className="space-y-1">
              {event.sources.map(source => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-1.5 text-[13px] text-blue-400/70
                    hover:text-blue-400 transition-colors group
                  "
                >
                  {source.id}
                  <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* EONET link */}
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-1 text-[11px] text-white/15
            hover:text-white/40 transition-colors pt-3 border-t border-white/[0.04]
          "
        >
          View on NASA EONET
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-white/25 flex-shrink-0">{label}</span>
      <span className={`text-[12px] text-white/60 text-right ${mono ? 'font-mono tabular-nums' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
