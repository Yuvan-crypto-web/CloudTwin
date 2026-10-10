import React from 'react'
import { 
  LayoutDashboard, 
  Box, 
  ShieldAlert, 
  SlidersHorizontal, 
  Activity, 
  Settings, 
  CloudRain 
} from 'lucide-react'

export function Sidebar({ currentView, setView, findingCount = 3 }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'infrastructure', label: 'Infrastructure', icon: Box },
    { id: 'findings', label: 'Security Findings', icon: ShieldAlert, badge: findingCount > 0 ? findingCount : null },
    { id: 'simulator', label: 'What-If Simulator', icon: SlidersHorizontal },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <aside className="sidebar">
      {/* Brand & Wordmark */}
      <div className="sidebar-brand">
        <div className="brand-emblem">
          <CloudRain size={20} />
        </div>
        <div className="brand-text">
          <span className="brand-title">CloudTwin</span>
          <span className="brand-subtitle">SECURITY INTELLIGENCE</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-icon">
                <Icon size={16} />
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge-pill">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer with Demo Status */}
      <div className="sidebar-bottom">
        <div className="connection-card">
          <span className="connection-dot" />
          <div className="connection-text">
            <b>DEMO ENVIRONMENT</b>
            <span>Live cloud connection disabled</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
