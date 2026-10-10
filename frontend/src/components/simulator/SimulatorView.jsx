import React, { useState } from 'react'
import { 
  SlidersHorizontal, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Zap,
  Layers
} from 'lucide-react'

export function SimulatorView({ 
  onRunSimulation, 
  findings = [], 
  onReset 
}) {
  const [selectedScenario, setSelectedScenario] = useState('combined')
  const [isSimulating, setIsSimulating] = useState(false)
  const [hasSimulated, setHasSimulated] = useState(false)
  const [simulationResult, setSimulationResult] = useState(null)

  const scenarios = [
    {
      id: 'combined',
      title: 'Harden Public Buckets + Clamp Open Firewalls (Combined)',
      category: 'Full Perimeter & IAM Hardening',
      description: 'Simultaneously strip public IAM bindings (allUsers) from storage buckets and clamp internet-wide firewall source ranges (0.0.0.0/0 on port 22/3389) to authorized VPC tunnels.',
      currentScore: 72,
      projectedScore: 94,
      mitigatedVectors: 2,
      riskReduction: 85
    },
    {
      id: 'restrict_public_bucket',
      title: 'Remove Public IAM Principals on Cloud Storage',
      category: 'Object Storage Protection',
      description: 'Hypothetically remove allUsers & allAuthenticatedUsers from bucket IAM bindings, restoring uniform access controls.',
      currentScore: 72,
      projectedScore: 84,
      mitigatedVectors: 1,
      riskReduction: 50
    },
    {
      id: 'restrict_open_firewall',
      title: 'Restrict Ingress on Sensitive Port Firewalls',
      category: 'Network Ingress Perimeter',
      description: 'Hypothetically replace 0.0.0.0/0 source ranges on SSH (22) and RDP (3389) with corporate VPN RFC1918 subnets.',
      currentScore: 72,
      projectedScore: 88,
      mitigatedVectors: 1,
      riskReduction: 60
    },
    {
      id: 'no_change',
      title: 'Baseline Ingestion Model (No Mitigations)',
      category: 'Baseline Audit',
      description: 'Analyze unchanged baseline digital twin topology to confirm baseline heuristic score.',
      currentScore: 72,
      projectedScore: 72,
      mitigatedVectors: 0,
      riskReduction: 0
    }
  ]

  const activeScenarioObj = scenarios.find(s => s.id === selectedScenario) || scenarios[0]

  const handleExecute = async () => {
    setIsSimulating(true)
    try {
      const res = await onRunSimulation(selectedScenario)
      setSimulationResult(res)
      setHasSimulated(true)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleResetSim = () => {
    setHasSimulated(false)
    setSimulationResult(null)
    if (onReset) onReset()
  }

  const currentScore = 72
  const projectedScore = hasSimulated ? activeScenarioObj.projectedScore : currentScore

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Simulator Control Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--cyan)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              IN-MEMORY BLAST RADIUS SIMULATOR
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-primary)' }}>
              Hypothetical Security Remediation Lab
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: 'rgba(55, 214, 160, 0.08)',
            border: '1px solid rgba(55, 214, 160, 0.25)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: 'var(--low)'
          }}>
            <Lock size={12} />
            <span>SAFE IN-MEMORY MODE</span>
          </div>
        </div>

        {/* Safety Warning */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <ShieldCheck size={16} color="var(--violet)" className="shrink-0" />
          <span>
            <b>Production Safety Guardrail:</b> CloudTwin simulations test hypothetical configuration diffs against the in-memory digital twin graph. Real cloud resources are never modified.
          </span>
        </div>

        {/* Scenario Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: 'var(--cyan)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            Select Hypothetical Policy Action
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {scenarios.map((sc) => {
              const isSelected = selectedScenario === sc.id
              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenario(sc.id)
                    setHasSimulated(false)
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(8, 13, 27, 0.6)',
                    border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 14px rgba(0, 229, 255, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <b style={{ fontSize: '13px', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                      {sc.title}
                    </b>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--cyan)', display: 'block', marginBottom: '6px' }}>
                    {sc.category}
                  </span>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                    {sc.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          {hasSimulated && (
            <button 
              className="btn-cyber btn-cyber-secondary" 
              onClick={handleResetSim}
            >
              <RotateCcw size={13} />
              <span>Reset Simulation</span>
            </button>
          )}

          <button 
            className="btn-cyber btn-cyber-primary" 
            onClick={handleExecute}
            disabled={isSimulating}
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            {isSimulating ? <Zap size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{isSimulating ? 'Evaluating Graph...' : 'Simulate Fix Outcome →'}</span>
          </button>
        </div>
      </div>

      {/* Before / After Score & Blast Radius Diff */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        {/* Scoreboard Comparison Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="chart-panel-header" style={{ padding: '0 0 14px 0', marginBottom: '16px' }}>
            <div>
              <h3 className="chart-title">Posture Score Projection</h3>
              <p className="chart-subtitle">Before vs After remediation outcome</p>
            </div>
            {hasSimulated && (
              <span className="severity-pill low">
                +{activeScenarioObj.projectedScore - currentScore} PTS GAIN
              </span>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 36px 1fr',
            alignItems: 'center',
            gap: '12px',
            margin: '16px 0'
          }}>
            {/* Before Score */}
            <div style={{
              background: 'rgba(8, 13, 27, 0.7)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Current Baseline
              </span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700, color: 'var(--high)', margin: '4px 0' }}>
                {currentScore}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>12 Open Vectors</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)' }}>
              <ArrowRight size={22} />
            </div>

            {/* After Score */}
            <div style={{
              background: hasSimulated ? 'rgba(55, 214, 160, 0.08)' : 'rgba(8, 13, 27, 0.7)',
              border: `1px solid ${hasSimulated ? 'rgba(55, 214, 160, 0.35)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: hasSimulated ? 'var(--low)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                Projected Outcome
              </span>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                fontWeight: 700,
                color: hasSimulated ? 'var(--low)' : 'var(--text-secondary)',
                margin: '4px 0'
              }}>
                {projectedScore}
              </div>
              <span style={{ fontSize: '11px', color: hasSimulated ? 'var(--low)' : 'var(--text-muted)' }}>
                {hasSimulated ? `${12 - activeScenarioObj.mitigatedVectors} Remaining` : 'Ready to simulate'}
              </span>
            </div>
          </div>

          {/* Risk Reduction Meter */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Attack Surface Reduction</span>
              <b style={{ color: hasSimulated ? 'var(--low)' : 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                {hasSimulated ? `${activeScenarioObj.riskReduction}% Reduced` : '0%'}
              </b>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(8, 13, 27, 0.8)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: hasSimulated ? `${activeScenarioObj.riskReduction}%` : '0%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--cyan) 0%, var(--low) 100%)',
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>
          </div>
        </div>

        {/* Resolved Vector Breakdown Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="chart-panel-header" style={{ padding: '0 0 14px 0', marginBottom: '16px' }}>
            <div>
              <h3 className="chart-title">Remediated Vectors</h3>
              <p className="chart-subtitle">Digital twin model resolution stream</p>
            </div>
          </div>

          {hasSimulated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedScenario === 'combined' || selectedScenario === 'restrict_public_bucket' ? (
                <div style={{
                  background: 'rgba(55, 214, 160, 0.06)',
                  border: '1px solid rgba(55, 214, 160, 0.25)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={14} color="var(--low)" />
                  <div>
                    <b style={{ color: '#fff', fontSize: '12px' }}>bucket-public-research-documents-demo</b>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>Public allUsers IAM principal removed</p>
                  </div>
                </div>
              ) : null}

              {selectedScenario === 'combined' || selectedScenario === 'restrict_open_firewall' ? (
                <div style={{
                  background: 'rgba(55, 214, 160, 0.06)',
                  border: '1px solid rgba(55, 214, 160, 0.25)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={14} color="var(--low)" />
                  <div>
                    <b style={{ color: '#fff', fontSize: '12px' }}>firewall-wide-allow-ssh-from-anywhere-demo</b>
                    <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>0.0.0.0/0 ingress replaced with VPN subnet</p>
                  </div>
                </div>
              ) : null}

              <div style={{
                marginTop: '10px',
                padding: '10px 12px',
                background: 'rgba(8, 13, 27, 0.6)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}>
                ✓ <b>Result:</b> Blast radius contained in sandbox copy. Production VPC state remains intact.
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '30px 16px',
              color: 'var(--text-muted)',
              fontSize: '12px'
            }}>
              <SlidersHorizontal size={28} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
              <p>Select a scenario and click <b>"Simulate Fix Outcome"</b> to preview resolved vectors.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
