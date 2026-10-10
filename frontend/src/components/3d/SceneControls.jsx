import React from 'react'
import { Eye, ShieldAlert, Compass, RotateCcw, Layers } from 'lucide-react'

export function SceneControls({ 
  onResetCamera, 
  onFocusThreats, 
  onTopDownView, 
  showLinks, 
  onToggleLinks,
  threatCount = 0
}) {
  return (
    <div className="scene-controls-group">
      <button 
        className="scene-control-btn" 
        onClick={onResetCamera}
        title="Reset 3D Perspective"
      >
        <RotateCcw size={13} />
        <span>Reset</span>
      </button>

      <button 
        className="scene-control-btn" 
        onClick={onTopDownView}
        title="Top-Down Planar Grid"
      >
        <Compass size={13} />
        <span>2D Grid</span>
      </button>

      {threatCount > 0 && (
        <button 
          className="scene-control-btn" 
          onClick={onFocusThreats}
          style={{ borderColor: 'rgba(255, 51, 102, 0.4)', color: 'var(--crimson-threat)' }}
          title="Highlight Threat Nodes"
        >
          <ShieldAlert size={13} />
          <span>Threats ({threatCount})</span>
        </button>
      )}

      <button 
        className="scene-control-btn" 
        onClick={onToggleLinks}
        style={{ color: showLinks ? 'var(--cyan-primary)' : 'var(--text-muted)' }}
        title="Toggle Network Beams"
      >
        <Layers size={13} />
        <span>Beams</span>
      </button>
    </div>
  )
}
