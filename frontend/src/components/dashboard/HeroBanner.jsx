import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Box, SlidersHorizontal } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { CyberBadge } from '../ui/CyberBadge'

export function HeroBanner({ onOpenSimulator, onOpen3DTwin, totalThreats = 2 }) {
  return (
    <GlassCard className="hero-radar-banner" glow="cyan">
      <div className="hero-content">
        <CyberBadge variant="violet" icon={Sparkles} className="mb-2">
          PREDICT BLAST RADIUS BEFORE DEPLOYMENT
        </CyberBadge>
        <h2>Simulate cloud security changes without touching production.</h2>
        <p>
          CloudTwin ingests read-only cloud topologies into an in-memory digital twin. 
          Inspect multi-tier VPC networks, spot perimeter exposures, and preview hypothetical policy fixes before applying Terraform or IAM commits.
        </p>
        <div className="hero-actions">
          <button className="cyber-btn cyber-btn-primary" onClick={onOpenSimulator}>
            <span>Launch What-If Lab</span>
            <ArrowRight size={14} />
          </button>
          <button className="cyber-btn cyber-btn-secondary" onClick={onOpen3DTwin}>
            <Box size={14} />
            <span>Explore 3D Twin</span>
          </button>
        </div>
      </div>

      {/* Holographic Radar Visualizer */}
      <div className="hero-visualizer">
        <div className="holo-core">
          <div className="holo-ring-outer" />
          <div className="holo-center-icon">🛡️</div>
          <div className="holo-satellite sat-1">VPC CORE</div>
          <div className="holo-satellite sat-2">IAM GUARD</div>
          {totalThreats > 0 && (
            <div className="holo-satellite sat-3">! {totalThreats} EXPOSURES</div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
