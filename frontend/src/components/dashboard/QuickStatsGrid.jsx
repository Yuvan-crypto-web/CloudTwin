import React from 'react'
import { HardDrive, Network, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { CyberBadge } from '../ui/CyberBadge'

export function QuickStatsGrid({ summary = {}, rawResources = {} }) {
  const buckets = summary.buckets ?? (rawResources.buckets?.length || 0)
  const vpcs = summary.vpcs ?? (rawResources.vpcs?.length || 0)
  const firewalls = summary.firewalls ?? (rawResources.firewalls?.length || 0)
  const highRisk = summary.high ?? 0
  const mediumRisk = summary.medium ?? 0

  const stats = [
    {
      id: 'buckets',
      label: 'Cloud Storage Buckets',
      value: buckets,
      subtext: 'Object storage vaults',
      icon: HardDrive,
      color: '#00f2fe',
      bg: 'rgba(0, 242, 254, 0.12)',
      badge: `${buckets} Modeled`,
      badgeVariant: 'cyan'
    },
    {
      id: 'networks',
      label: 'VPC & Subnet Meshes',
      value: vpcs + (summary.subnets || 0),
      subtext: `${vpcs} VPCs · ${summary.subnets || 0} Subnets`,
      icon: Network,
      color: '#9d4edd',
      bg: 'rgba(157, 78, 221, 0.14)',
      badge: 'Segmented',
      badgeVariant: 'violet'
    },
    {
      id: 'firewalls',
      label: 'Firewall Ingress Rules',
      value: firewalls,
      subtext: 'Perimeter network filters',
      icon: Flame,
      color: '#ff758c',
      bg: 'rgba(255, 117, 140, 0.12)',
      badge: `${firewalls} Policies`,
      badgeVariant: 'amber'
    },
    {
      id: 'threats',
      label: 'High-Risk Blast Vectors',
      value: highRisk,
      subtext: highRisk > 0 ? `${highRisk} requires attention` : 'All perimeter checks passed',
      icon: highRisk > 0 ? ShieldAlert : CheckCircle2,
      color: highRisk > 0 ? '#ff3366' : '#00f5a0',
      bg: highRisk > 0 ? 'rgba(255, 51, 102, 0.15)' : 'rgba(0, 245, 160, 0.12)',
      badge: highRisk > 0 ? 'ACTION REQUIRED' : 'OPTIMAL',
      badgeVariant: highRisk > 0 ? 'crimson' : 'emerald'
    }
  ]

  return (
    <div className="stats-grid">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <GlassCard key={s.id} className="stat-card" glow={s.id === 'threats' && highRisk > 0 ? 'crimson' : 'cyan'}>
            <div className="stat-header">
              <span className="stat-header-label">{s.label}</span>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <Icon size={18} />
              </div>
            </div>

            <div>
              <div className="stat-value-row">
                <span className="stat-value">{s.value}</span>
                <CyberBadge variant={s.badgeVariant}>{s.badge}</CyberBadge>
              </div>
              <span className="stat-subtext">{s.subtext}</span>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
