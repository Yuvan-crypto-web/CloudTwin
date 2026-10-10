import React, { useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

export function TopBar({ currentView }) {
  const [search, setSearch] = useState('')

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'overview': return 'Overview'
      case 'infrastructure': return 'Infrastructure'
      case 'findings': return 'Security Findings'
      case 'simulator': return 'What-If Simulator'
      case 'activity': return 'Activity'
      case 'settings': return 'Settings'
      default: return 'Overview'
    }
  }

  return (
    <header className="top-navigation">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <span className="breadcrumb-segment">CloudTwin</span>
        <span>/</span>
        <span className="breadcrumb-active">{getBreadcrumb()}</span>
      </div>

      {/* Right Actions */}
      <div className="top-actions-area">
        {/* Environment Selector */}
        <div className="env-selector-pill">
          <span />
          <span>Demo Environment</span>
          <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Search Box */}
        <div className="search-input-wrapper">
          <Search size={13} className="search-icon" />
          <input
            type="text"
            placeholder="Search resources, CVEs..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Notifications Icon Button */}
        <button className="icon-button" title="Alerts & Notifications">
          <Bell size={15} />
          <span className="notification-badge" />
        </button>

        {/* User Avatar Initials */}
        <div className="user-avatar-initials" title="CloudTwin Security Admin">
          CT
        </div>
      </div>
    </header>
  )
}
