'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CATEGORY_STYLES } from '@/lib/constants'
import type { EONETEvent } from '@/lib/types'

interface Props {
  events: EONETEvent[]
}

export default function StatsPanel({ events }: Props) {
  const { active, closed, chartData } = useMemo(() => {
    let activeCount = 0
    let closedCount = 0
    const byCat: Record<string, number> = {}

    events.forEach(e => {
      if (e.closed) closedCount++
      else activeCount++
      const catId = e.categories[0]?.id || 'default'
      byCat[catId] = (byCat[catId] || 0) + 1
    })

    const data = Object.entries(byCat)
      .map(([id, count]) => ({
        name: CATEGORY_STYLES[id]?.label || id,
        value: count,
        color: CATEGORY_STYLES[id]?.color || '#6b7280',
      }))
      .sort((a, b) => b.value - a.value)

    return { active: activeCount, closed: closedCount, chartData: data }
  }, [events])

  return (
    <div className="px-4 py-4 border-b border-white/[0.04]">
      <div className="flex items-center gap-3">
        {/* Main number */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tabular-nums tracking-tight">
              {events.length}
            </span>
            <span className="text-[10px] text-white/20 uppercase tracking-widest">events</span>
          </div>
          <div className="flex gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              <span className="text-white/40 tabular-nums font-mono">{active}</span>
              <span className="text-white/20">active</span>
            </span>
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="text-white/30 tabular-nums font-mono">{closed}</span>
              <span className="text-white/15">closed</span>
            </span>
          </div>
        </div>

        {/* Mini donut */}
        {chartData.length > 0 && (
          <div className="w-[68px] h-[68px] flex-shrink-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={30}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10, 15, 26, 0.95)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    color: '#f0f2f5',
                    fontSize: '11px',
                    padding: '6px 10px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                  itemStyle={{ color: '#d1d5db' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category breakdown bars */}
      {chartData.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {chartData.slice(0, 5).map(item => (
            <div key={item.name} className="flex items-center gap-2 text-[11px] group">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-150"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/35 flex-1 truncate group-hover:text-white/60 transition-colors">
                {item.name}
              </span>
              <span className="text-white/25 font-mono tabular-nums text-[10px]">{item.value}</span>
              <div className="w-14 h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.value / events.length) * 100}%`,
                    backgroundColor: item.color,
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
