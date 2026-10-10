import React, { useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export function SecurityTrendChart() {
  const [timeRange, setTimeRange] = useState('30D')

  const trendData30D = [
    { date: 'Day 1', score: 58, baseline: 70 },
    { date: 'Day 5', score: 61, baseline: 70 },
    { date: 'Day 10', score: 60, baseline: 70 },
    { date: 'Day 15', score: 66, baseline: 70 },
    { date: 'Day 20', score: 64, baseline: 70 },
    { date: 'Day 25', score: 69, baseline: 70 },
    { date: 'Day 30', score: 72, baseline: 70 }
  ]

  const trendData7D = [
    { date: 'Mon', score: 67 },
    { date: 'Tue', score: 68 },
    { date: 'Wed', score: 66 },
    { date: 'Thu', score: 70 },
    { date: 'Fri', score: 71 },
    { date: 'Sat', score: 71 },
    { date: 'Sun', score: 72 }
  ]

  const trendData90D = [
    { date: 'W1', score: 52 },
    { date: 'W3', score: 56 },
    { date: 'W6', score: 62 },
    { date: 'W9', score: 65 },
    { date: 'W12', score: 72 }
  ]

  const activeData = timeRange === '7D' ? trendData7D : timeRange === '90D' ? trendData90D : trendData30D

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(8, 13, 27, 0.95)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '6px',
          padding: '6px 10px',
          color: '#F0F6FF',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
        }}>
          <div><b>{label}</b></div>
          <div style={{ color: 'var(--cyan)' }}>Posture Score: {payload[0].value}/100</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-panel">
      <div className="chart-panel-header">
        <div>
          <h3 className="chart-title">Security Posture Trend</h3>
          <p className="chart-subtitle">Historical resilience tracking</p>
        </div>

        {/* Compact Time Range Selector */}
        <div className="filter-pills-group">
          {['7D', '30D', '90D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`filter-pill ${timeRange === range ? 'active' : ''}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-panel-body" style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="postureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3288FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(116, 160, 202, 0.08)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#52627D" 
              fontSize={10} 
              fontFamily="var(--font-mono)" 
              tickLine={false}
            />
            <YAxis 
              domain={[40, 100]} 
              stroke="#52627D" 
              fontSize={10} 
              fontFamily="var(--font-mono)" 
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#00E5FF" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#postureGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
