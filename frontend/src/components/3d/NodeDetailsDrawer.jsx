import React from 'react'
import { X, ShieldAlert, CheckCircle2, HardDrive, Server, Flame, Network, Database, ArrowRight } from 'lucide-react'

export function NodeDetailsDrawer({ node, findings = [], onClose, onSimulateFix }) {
  if (!node) return null

  const nodeFindings = findings.filter(f => 
    f.resource === node.name || 
    f.resource_id === node.id || 
    (f.id && f.id.includes(node.id))
  )

  const isCritical = nodeFindings.some(f => f.severity === 'CRITICAL' || f.severity === 'HIGH')

  const getIcon = () => {
    switch (node.type) {
      case 'bucket': return <HardDrive size={18} color="var(--cyan)" />
      case 'vm': return <Server size={18} color="var(--blue)" />
      case 'firewall': return <Flame size={18} color="var(--critical)" />
      case 'vpc': return <Network size={18} color="var(--violet)" />
      default: return <Database size={18} color="var(--cyan)" />
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(12, 20, 38, 0.9)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getIcon()}
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {node.name}
              </h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                {node.type?.toUpperCase()} · {node.location || node.region || 'global'}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="icon-button"
            title="Close Drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Status / Posture Card */}
          <div style={{
            background: isCritical ? 'rgba(255, 69, 103, 0.08)' : 'rgba(55, 214, 160, 0.08)',
            border: `1px solid ${isCritical ? 'rgba(255, 69, 103, 0.28)' : 'rgba(55, 214, 160, 0.28)'}`,
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: isCritical ? 'var(--critical)' : 'var(--low)',
                letterSpacing: '0.8px'
              }}>
                {isCritical ? 'CRITICAL RISK EXPOSURE' : 'HEALTHY CONFIGURATION'}
              </span>
              <span className={`severity-pill ${isCritical ? 'critical' : 'low'}`}>
                {isCritical ? 'ATTENTION' : 'COMPLIANT'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              {isCritical 
                ? 'Unrestricted internet-facing ingress or public IAM access detected on this node.' 
                : 'All identity boundaries and subnet routing rules comply with the baseline security posture.'}
            </p>
          </div>

          {/* Associated Findings */}
          {nodeFindings.length > 0 && (
            <div>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                Detected Vulnerability Signals
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nodeFindings.map((f, i) => (
                  <div key={i} style={{
                    background: 'rgba(12, 20, 38, 0.8)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <b style={{ color: 'var(--text-primary)', fontSize: '12.5px' }}>{f.title}</b>
                      <span className={`severity-pill ${f.severity?.toLowerCase() || 'critical'}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '4px 0 8px 0' }}>
                      {f.explanation}
                    </p>
                    <div style={{
                      background: 'rgba(5, 8, 22, 0.8)',
                      padding: '6px 10px',
                      borderRadius: '5px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      color: 'var(--low)'
                    }}>
                      💡 {f.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Node Raw Metadata */}
          <div>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Resource Attributes
            </span>
            <pre style={{
              background: '#050816',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px',
              color: '#94A3B8',
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              overflowX: 'auto',
              lineHeight: '1.5'
            }}>
              {JSON.stringify(node, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px' }}>
            <button 
              className="btn-cyber btn-cyber-secondary" 
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Dismiss
            </button>
            {nodeFindings.length > 0 && onSimulateFix && (
              <button 
                className="btn-cyber btn-cyber-primary" 
                onClick={() => {
                  onClose()
                  onSimulateFix()
                }}
                style={{ flex: 1 }}
              >
                <span>Simulate Fix</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
