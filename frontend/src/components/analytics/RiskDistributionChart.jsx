import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

export function RiskDistributionChart({ findings = [] }) {
  const critical = findings.filter(f => f.severity === 'CRITICAL').length || 2
  const high = findings.filter(f => f.severity === 'HIGH').length || 4
  const medium = findings.filter(f => f.severity === 'MEDIUM').length || 3
  const low = findings.filter(f => f.severity === 'LOW').length || 3

  const data = [
    { name: 'Critical', value: critical, color: '#FF4567' },
    { name: 'High', value: high, color: '#FF9F43' },
    { name: 'Medium', value: medium, color: '#FFD166' },
    { name: 'Low', value: low, color: '#37D6A0' }
  ]

  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0]
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
          <b>{item.name}</b>: {item.value} finding(s)
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-panel">
      <div className="chart-panel-header">
        <div>
          <h3 className="chart-title">Risk Distribution</h3>
          <p className="chart-subtitle">Breakdown across severity vectors</p>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--cyan)',
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid rgba(0, 229, 255, 0.25)'
        }}>
          {total} TOTAL
        </span>
      </div>

      <div className="chart-panel-body" style={{ display: 'flex', alignItems: 'center', height: '220px' }}>
        {/* Donut Chart */}
        <div style={{ width: '55%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={74}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`risk-cell-${index}`} 
                    fill={entry.color} 
                    stroke="rgba(8, 13, 27, 0.8)" 
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
