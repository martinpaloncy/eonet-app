import { TIME_PRESETS } from '@/lib/constants'

interface Props {
  days: number
  onSetDays: (days: number) => void
}

export default function TimeRange({ days, onSetDays }: Props) {
  return (
    <div className="px-4 py-3 border-b border-white/[0.04]">
      <h3 className="text-[10px] font-medium text-white/20 uppercase tracking-[0.15em] mb-2">
        Time Range
      </h3>
      <div className="flex gap-1 p-0.5 bg-white/[0.02] rounded-lg">
        {TIME_PRESETS.map(preset => (
          <button
            key={preset.days}
            onClick={() => onSetDays(preset.days)}
            className={`
              flex-1 py-1.5 text-[11px] font-medium rounded-md
              transition-all duration-200
              ${days === preset.days
                ? 'bg-blue-500/15 text-blue-400/90 shadow-sm'
                : 'text-white/25 hover:text-white/50 hover:bg-white/[0.03]'
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
