import React from 'react'
import { LayoutDashboard, Box, SlidersHorizontal, ShieldAlert, Database, RefreshCw, Cpu } from 'lucide-react'

export function Sidebar({ currentView, setView, isFallback, source, projectId, findingCount = 0 }) {
  const navItems = [
    { id: 'overview', label: 'Overview HUD', icon: LayoutDashboard },
    { id: 'twin3d', label: '3D Digital Twin', icon: Box },
    { id: 'simulation', label: 'What-If Simulator', icon: SlidersHorizontal, badge: 'SANDBOX', badgeType: 'safe' },
    { id: 'findings', label: 'Risk Findings', icon: ShieldAlert, badge: findingCount > 0 ? findingCount : null },
    { id: 'resources', label: 'Resource Inventory', icon: Database }
  ]

  return (
    <aside className="sidebar">
      {/* Brand & Logo */}
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Cpu size={22} color="#050b1a" />
        </div>
        <div className="brand-title">
          <span>CloudTwin</span>
          <small>Security Twin Engine</small>
        </div>
      </div>

      {/* Nav List */}
      <div className="nav-section-label">Platform Workspaces</div>
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              className={`nav-button ${isActive ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badgeType === 'safe' ? 'safe' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer with Telemetry Status */}
      <div className="sidebar-footer">
        <div className="env-status-card">
          <span className={`radar-dot ${isFallback ? 'fallback' : 'online'}`} />
          <div className="env-status-text">
            <b>{source === 'google-cloud-read-only' ? 'Google Cloud Read-Only' : isFallback ? 'Offline Twin Fallback' : 'Local Simulation'}</b>
            <span>{projectId || 'Sandbox Environment'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
