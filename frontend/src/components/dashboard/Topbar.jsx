import React from 'react'
import { RefreshCw, ShieldCheck, ShieldAlert, SlidersHorizontal, Sparkles } from 'lucide-react'
import { CyberBadge } from '../ui/CyberBadge'

export function Topbar({ 
  currentView, 
  onRefresh, 
  busy, 
  source, 
  securityScore = 78,
  onNavigateToSimulator 
}) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'overview': return 'Executive Security Overview'
      case 'twin3d': return '3D Topological Digital Twin'
      case 'simulation': return 'What-If Blast Radius Simulator'
      case 'findings': return 'Security Risks & Threat Signals'
      case 'resources': return 'Cloud Resource Topology Inventory'
      default: return 'CloudTwin Security Console'
    }
  }

  const scoreVariant = securityScore >= 80 ? 'emerald' : securityScore >= 60 ? 'amber' : 'crimson'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="breadcrumb-eyebrow">
            CLOUD DEFENSE · DIGITAL TWIN
          </div>
          <h1 className="page-title">{getViewTitle()}</h1>
        </div>
      </div>

      <div className="topbar-right">
        {/* Posture Score Pill */}
        <CyberBadge variant={scoreVariant}>
          {securityScore >= 80 ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
          Posture Index: {securityScore}/100
        </CyberBadge>

        {/* Source Mode Badge */}
        <CyberBadge variant={source === 'google-cloud-read-only' ? 'emerald' : 'cyan'}>
          {source === 'google-cloud-read-only' ? 'GCP · LIVE READ-ONLY' : 'SIMULATED TWIN'}
        </CyberBadge>

        {/* Action Buttons */}
        {currentView !== 'simulation' && onNavigateToSimulator && (
          <button 
            className="cyber-btn cyber-btn-violet"
            onClick={onNavigateToSimulator}
          >
            <SlidersHorizontal size={13} />
            <span>Open Simulator</span>
          </button>
        )}

        <button 
          className="cyber-btn cyber-btn-secondary" 
          onClick={onRefresh}
          disabled={busy}
          title="Refresh Digital Twin Snapshot"
        >
          <RefreshCw size={13} className={busy ? 'animate-spin' : ''} />
          <span>{busy ? 'Syncing...' : 'Sync Twin'}</span>
        </button>
      </div>
    </header>
  )
}
