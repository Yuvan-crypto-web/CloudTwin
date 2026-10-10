import React from 'react'

export function CyberBadge({ variant = 'cyan', children, icon: Icon, className = '' }) {
  return (
    <span className={`cyber-chip ${variant} ${className}`}>
      {Icon && <Icon size={11} className="shrink-0" />}
      {children}
    </span>
  )
}

export function SeverityBadge({ severity }) {
  const s = String(severity || '').toUpperCase()
  if (s === 'CRITICAL' || s === 'HIGH') {
    return <CyberBadge variant="crimson">{s}</CyberBadge>
  }
  if (s === 'MEDIUM') {
    return <CyberBadge variant="amber">{s}</CyberBadge>
  }
  if (s === 'LOW') {
    return <CyberBadge variant="cyan">{s}</CyberBadge>
  }
  return <CyberBadge variant="emerald">{s || 'SECURE'}</CyberBadge>
}
