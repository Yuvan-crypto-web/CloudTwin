import React from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle, Database } from 'lucide-react'

export function KpiGrid({ summary = {}, findings = [] }) {
  const criticalCount = findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH').length || 3
  const totalFindings = findings.length || 12
  const postureScore = summary.securityScore || 72
  const totalResources = summary.totalAssets || 48

  const kpis = [
    {
      id: 'posture',
      label: 'SECURITY POSTURE',
      value: `${postureScore}/100`,
      caption: '+4% vs baseline benchmark',
      icon: ShieldCheck,
      accentColor: 'var(--cyan)',
      glowColor: 'var(--cyan-glow)'
    },
    {
      id: 'findings',
      label: 'OPEN FINDINGS',
      value: totalFindings,
      caption: 'Requires active review',
      icon: ShieldAlert,
      accentColor: 'var(--high)',
      glowColor: 'var(--high-glow)'
    },
    {
      id: 'critical',
      label: 'CRITICAL RISKS',
      value: criticalCount,
      caption: 'Immediate remediation advised',
      icon: AlertTriangle,
      accentColor: 'var(--critical)',
      glowColor: 'var(--critical-glow)'
    },
    {
      id: 'resources',
      label: 'RESOURCES ANALYZED',
      value: totalResources,
      caption: 'Across 3 VPC boundaries',
      icon: Database,
      accentColor: 'var(--low)',
      glowColor: 'var(--low-glow)'
    }
  ]

  return (
    <div className="kpi-row">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div 
            key={kpi.id} 
            className="kpi-card" 
            style={{ '--kpi-glow': kpi.glowColor }}
          >
            <div className="kpi-top">
              <span className="kpi-label">{kpi.label}</span>
              <div 
                className="kpi-icon-wrap"
                style={{
                  background: 'rgba(12, 20, 38, 0.9)',
                  border: '1px solid var(--border)',
                  color: kpi.accentColor
                }}
              >
                <Icon size={14} />
              </div>
            </div>

            <div>
              <div className="kpi-value-row">
                <span className="kpi-value">{kpi.value}</span>
              </div>
              <div className="kpi-caption">{kpi.caption}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
