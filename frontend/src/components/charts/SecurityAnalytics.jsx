import React from 'react'
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts'
import { Shield, PieChart as PieIcon, BarChart3, Activity } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { CyberBadge } from '../ui/CyberBadge'

export function SecurityAnalytics({ summary = {}, findings = [], resources = [] }) {
  // Category radar data
  const radarData = [
    { subject: 'IAM Access', score: findings.some(f => f.id?.includes('bucket')) ? 45 : 95 },
    { subject: 'Perimeter FW', score: findings.some(f => f.id?.includes('firewall')) ? 30 : 90 },
    { subject: 'VPC Isolation', score: 85 },
    { subject: 'Subnet Zones', score: 80 },
    { subject: 'Storage Encryption', score: 92 },
    { subject: 'Compute Hardening', score: 88 }
  ]

  // Assets posture breakdown
  const highRisks = findings.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').length
  const mediumRisks = findings.filter(f => f.severity === 'MEDIUM').length
  const safeAssets = Math.max(0, (resources.length || 6) - highRisks - mediumRisks)

  const pieData = [
    { name: 'Secured Assets', value: safeAssets, color: '#00f5a0' },
    { name: 'High Risk Assets', value: highRisks, color: '#ff3366' },
    { name: 'Medium Alert', value: mediumRisks, color: '#ffb703' }
  ].filter(d => d.value > 0)

  // Resource breakdown
  const resourceTypeData = [
    { name: 'Buckets', count: summary.buckets || 2, fill: '#00f2fe' },
    { name: 'VPCs', count: summary.vpcs || 2, fill: '#9d4edd' },
    { name: 'Subnets', count: summary.subnets || 2, fill: '#38bdf8' },
    { name: 'Firewalls', count: summary.firewalls || 2, fill: '#ff758c' },
    { name: 'VMs', count: summary.vms || 3, fill: '#00f5a0' }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(9, 14, 31, 0.95)',
          border: '1px solid var(--border-glow)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
          <b>{payload[0].name || payload[0].payload.subject}</b>: {payload[0].value}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Posture Radar Chart */}
      <GlassCard className="analytics-card">
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--cyan-primary)" />
              <h3>Security Vector Health</h3>
            </div>
            <small>Multi-domain posture assessment</small>
          </div>
          <CyberBadge variant="cyan">RADAR 360°</CyberBadge>
        </div>
        <div className="panel-body" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(79, 114, 180, 0.25)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10.5, fontFamily: 'var(--font-mono)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(79, 114, 180, 0.2)" />
              <Radar 
                name="Security Index" 
                dataKey="score" 
                stroke="#00f2fe" 
                fill="#00f2fe" 
                fillOpacity={0.25} 
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Exposure Donut Breakdown */}
      <GlassCard className="analytics-card">
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={16} color="var(--emerald-safe)" />
              <h3>Exposure Surface Breakdown</h3>
            </div>
            <small>Asset risk classification</small>
          </div>
          <CyberBadge variant={highRisks > 0 ? 'crimson' : 'emerald'}>
            {highRisks > 0 ? `${highRisks} Exposed` : 'Protected'}
          </CyberBadge>
        </div>
        <div className="panel-body" style={{ height: '260px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '55%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
            {pieData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <b style={{ marginLeft: 'auto', color: '#fff', fontFamily: 'var(--font-mono)' }}>{item.value}</b>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Resource Count Distribution */}
      <GlassCard className="analytics-card">
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={16} color="var(--violet-primary)" />
              <h3>Cloud Topology Density</h3>
            </div>
            <small>Active resource inventory tally</small>
          </div>
          <CyberBadge variant="violet">{resources.length || 9} Total</CyberBadge>
        </div>
        <div className="panel-body" style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10.5} fontFamily="var(--font-mono)" />
              <YAxis stroke="#64748b" fontSize={10.5} fontFamily="var(--font-mono)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {resourceTypeData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  )
}
