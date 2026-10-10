import React from 'react'

export function DashboardHeader({ currentView }) {
  const getHeaderDetails = () => {
    switch (currentView) {
      case 'overview':
        return {
          eyebrow: 'CLOUD SECURITY INTELLIGENCE',
          title: 'Security Overview',
          subtitle: 'Monitor your cloud posture. Predict risk. Simulate remediation.'
        }
      case 'infrastructure':
        return {
          eyebrow: 'TOPOLOGICAL TOPOLOGY',
          title: 'Cloud Infrastructure Twin',
          subtitle: 'Interactive 3D representation of multi-tier VPC networks, storage vaults, and sentinels.'
        }
      case 'findings':
        return {
          eyebrow: 'THREAT VECTOR AUDIT',
          title: 'Security Findings & Signals',
          subtitle: 'Prioritized misconfigurations, public exposure vectors, and compliance signals.'
        }
      case 'simulator':
        return {
          eyebrow: 'BLAST RADIUS SANDBOX',
          title: 'What-If Remediation Simulator',
          subtitle: 'Test hypothetical security policy changes against in-memory digital twin models.'
        }
      case 'activity':
        return {
          eyebrow: 'AUDIT & TELEMETRY LOGS',
          title: 'Security Activity Stream',
          subtitle: 'Chronological timeline of model ingestions, risk alerts, and simulated remediation runs.'
        }
      case 'settings':
        return {
          eyebrow: 'SYSTEM CONFIGURATION',
          title: 'Security Platform Settings',
          subtitle: 'Manage digital twin policies, heuristic thresholds, and optional GCP read-only discovery.'
        }
      default:
        return {
          eyebrow: 'CLOUD SECURITY INTELLIGENCE',
          title: 'Security Overview',
          subtitle: 'Monitor your cloud posture. Predict risk. Simulate remediation.'
        }
    }
  }

  const { eyebrow, title, subtitle } = getHeaderDetails()

  return (
    <div className="dashboard-header">
      <div className="header-left">
        <span className="header-eyebrow">{eyebrow}</span>
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-right">
        <div className="status-badge-live">
          <span className="live-dot" />
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </div>
  )
}
