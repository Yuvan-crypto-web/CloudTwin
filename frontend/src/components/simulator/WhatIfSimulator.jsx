import React, { useState } from 'react'
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Lock,
  Layers
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { CyberBadge, SeverityBadge } from '../ui/CyberBadge'

export function WhatIfSimulator({ 
  onRunSimulation, 
  busy = false, 
  initialResult = null, 
  findings = [] 
}) {
  const [scenario, setScenario] = useState('combined')
  const [simulationResult, setSimulationResult] = useState(initialResult)
  const [localBusy, setLocalBusy] = useState(false)

  const scenarios = [
    {
      id: 'combined',
      title: 'Full Hardening Policy (Combined)',
      desc: 'Simultaneously strip public storage IAM bindings & restrict open firewall ingress to RFC1918 VPN tunnels.'
    },
    {
      id: 'restrict_public_bucket',
      title: 'Harden Bucket IAM Permissions',
      desc: 'Hypothetically remove allUsers & allAuthenticatedUsers from storage IAM bindings.'
    },
    {
      id: 'restrict_open_firewall',
      title: 'Clamp Open Firewall Ingress',
      desc: 'Hypothetically replace 0.0.0.0/0 source ranges with trusted internal IP boundaries.'
    },
    {
      id: 'no_change',
      title: 'Baseline Ingestion Model',
      desc: 'Evaluate unchanged baseline digital twin without applying hypothetical mitigations.'
    }
  ]

  const handleSimulate = async () => {
    setLocalBusy(true)
    try {
      const res = await onRunSimulation(scenario)
      setSimulationResult(res)
    } finally {
      setLocalBusy(false)
    }
  }

  const isLoading = busy || localBusy
  const beforeCount = simulationResult ? simulationResult.before.findings.length : findings.length
  const afterCount = simulationResult ? simulationResult.after.findings.length : 0
  const resolvedCount = simulationResult ? simulationResult.resolved_finding_ids.length : 0
  const reductionPercent = beforeCount > 0 
    ? Math.round((resolvedCount / beforeCount) * 100) 
    : 100

  return (
    <div className="simulator-panel">
      {/* Simulation Engine Header */}
      <GlassCard glow="violet">
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={18} color="var(--violet-primary)" />
              <h3>What-If Cloud Blast Radius Simulator</h3>
            </div>
            <small>Deterministic sandbox running purely against the in-memory twin model</small>
          </div>
          <CyberBadge variant="emerald" icon={Lock}>
            ZERO-MUTATION SANDBOX
          </CyberBadge>
        </div>

        <div className="panel-body">
          {/* Safety Guardrail Notice */}
          <div style={{
            background: 'rgba(157, 78, 221, 0.12)',
            border: '1px solid rgba(157, 78, 221, 0.35)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Lock size={20} color="var(--violet-primary)" className="shrink-0" />
            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
              <b style={{ color: '#fff' }}>Production Safety Guardrail Active:</b>
              <span style={{ color: '#d8b4fe', marginLeft: '6px' }}>
                Simulations execute strictly in-memory. CloudTwin never makes mutating calls or alters live cloud infrastructure.
              </span>
            </div>
          </div>

          {/* Scenario Selection Cards */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--cyan-primary)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Select Change Hypothesis
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setScenario(sc.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: scenario === sc.id ? 'rgba(0, 242, 254, 0.1)' : 'rgba(9, 14, 31, 0.7)',
                    border: `1px solid ${scenario === sc.id ? 'var(--cyan-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: scenario === sc.id ? '0 0 16px rgba(0, 242, 254, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <b style={{ fontSize: '13px', color: scenario === sc.id ? '#fff' : 'var(--text-secondary)' }}>
                      {sc.title}
                    </b>
                    {scenario === sc.id && <span style={{ color: 'var(--cyan-primary)', fontSize: '12px' }}>● ACTIVE</span>}
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {sc.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Run Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="cyber-btn cyber-btn-primary" 
              onClick={handleSimulate} 
              disabled={isLoading}
              style={{ padding: '12px 24px', fontSize: '13.5px' }}
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{isLoading ? 'Executing In-Memory Model...' : 'Execute Hypothetical Simulation →'}</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Simulation Results Section */}
      {simulationResult && (
        <GlassCard glow="emerald">
          <div className="panel-header">
            <div className="panel-header-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--emerald-safe)" />
                <h3>Simulation Results & Blast Radius Diff</h3>
              </div>
              <small>{simulationResult.description}</small>
            </div>
            <CyberBadge variant="emerald">
              {reductionPercent}% THREAT REDUCTION
            </CyberBadge>
          </div>

          <div className="panel-body">
            {/* Before vs After Visual Scoreboard */}
            <div className="comparison-grid">
              <div className="compare-card">
                <span className="compare-title">Baseline Threat Count</span>
                <span className="compare-metric" style={{ color: 'var(--crimson-threat)' }}>
                  {beforeCount}
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Identified in current model
                </div>
              </div>

              <div className="compare-arrow">
                <ArrowRight size={24} />
              </div>

              <div className="compare-card after">
                <span className="compare-title">Post-Simulation Threats</span>
                <span className="compare-metric" style={{ color: afterCount === 0 ? 'var(--emerald-safe)' : 'var(--amber-warning)' }}>
                  {afterCount}
                </span>
                <div style={{ fontSize: '11px', color: 'var(--emerald-safe)', marginTop: '4px' }}>
                  {resolvedCount} Finding(s) Resolved
                </div>
              </div>
            </div>

            {/* Resolved Findings Stream */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--emerald-safe)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={14} />
                Mitigated Security Vectors ({resolvedCount})
              </h4>

              {resolvedCount > 0 ? (
                <div className="resolution-stream">
                  {simulationResult.resolved_finding_ids.map((id) => (
                    <div key={id} className="resolution-pill resolved">
                      <CheckCircle2 size={14} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{id}</span>
                      <span style={{ color: '#a7f3d0', marginLeft: 'auto', fontSize: '11px' }}>MITIGATED IN TWIN</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  No findings resolved under the selected baseline scenario.
                </p>
              )}
            </div>

            {/* Remaining Findings Stream */}
            {afterCount > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--crimson-threat)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={14} />
                  Remaining Open Vectors ({afterCount})
                </h4>
                <div className="resolution-stream">
                  {simulationResult.after.findings.map((f) => (
                    <div key={f.id} className="resolution-pill remaining">
                      <SeverityBadge severity={f.severity} />
                      <span style={{ fontWeight: 600, color: '#fff' }}>{f.title}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 'auto', fontSize: '11px' }}>{f.resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {simulationResult.note && (
              <div style={{
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                ℹ Note: {simulationResult.note}
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
