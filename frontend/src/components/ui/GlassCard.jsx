import React from 'react'

export function GlassCard({ children, glow = 'none', className = '', style = {}, onClick }) {
  const glowClass = glow === 'cyan' ? 'glow-cyan' : glow === 'violet' ? 'glow-violet' : ''
  return (
    <div 
      className={`glass-panel ${glowClass} ${className}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
