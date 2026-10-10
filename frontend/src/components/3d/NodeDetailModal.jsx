import React from 'react'
import { X, ShieldAlert, CheckCircle2, HardDrive, Network, Server, Flame, ArrowRight, ExternalLink } from 'lucide-react'
import { SeverityBadge, CyberBadge } from '../ui/CyberBadge'

export function NodeDetailModal({ node, findings = [], onClose, onTestRemediation }) {
  if (!node) return null

  const nodeFindings = findings.filter(f => 
    f.resource === node.name || 
    f.resource_id === node.id || 
    (f.id && f.id.includes(node.id))
  )

  const isHighRisk = nodeFindings.some(f => f.severity === 'HIGH' || f.severity === 'CRITICAL')

  const getIcon = () => {
    switch (node.type) {
      case 'bucket': return <HardDrive size={22} className="text-cyan-400" />
      case 'firewall': return <Flame size={22} className="text-pink-400" />
      case 'vpc': return <Network size={22} className="text-purple-400" />
      case 'vm': return <Server size={22} className="text-emerald-400" />
      default: return <Network size={22} className="text-blue-400" />
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
              {getIcon()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', color: '#fff', fontWeight: 700 }}>{node.name}</h3>
                <CyberBadge variant="cyan">{node.type?.toUpperCase()}</CyberBadge>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                ID: {node.id} · Region: {node.location || node.region || 'global'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Risk Banner */}
          {nodeFindings.length > 0 ? (
            <div style={{
              background: 'rgba(255, 51, 102, 0.12)',
              border: '1px solid rgba(255, 51, 102, 0.35)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="var(--crimson-threat)" />
                  <b style={{ color: '#fff', fontSize: '13.5px' }}>
                    Active Security Findings ({nodeFindings.length})
                  </b>
                </div>
                <SeverityBadge severity={nodeFindings[0].severity} />
              </div>
              {nodeFindings.map((f, i) => (
                <div key={i} style={{ borderTop: '1px solid rgba(255, 51, 102, 0.2)', paddingTop: '8px' }}>
                  <div style={{ fontWeight: 600, color: '#fca5a5', fontSize: '12.5px', marginBottom: '4px' }}>
                    {f.title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5', marginBottom: '8px' }}>
                    {f.explanation}
                  </p>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: 'var(--emerald-safe)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    💡 {f.recommendation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(0, 245, 160, 0.08)',
              border: '1px solid rgba(0, 245, 160, 0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} color="var(--emerald-safe)" />
              <div>
                <b style={{ color: 'var(--emerald-safe)', fontSize: '13px' }}>Node Secure</b>
                <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', margin: 0 }}>
                  No open exposure or high-severity misconfigurations detected on this asset.
                </p>
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyan-primary)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Resource Configuration
            </h4>
            <div className="code-block-cyber">
              <pre>{JSON.stringify(node, null, 2)}</pre>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="cyber-btn cyber-btn-secondary" onClick={onClose}>
              Close Inspector
            </button>
            {nodeFindings.length > 0 && onTestRemediation && (
              <button 
                className="cyber-btn cyber-btn-primary" 
                onClick={() => {
                  onClose()
                  onTestRemediation()
                }}
              >
                <span>Test Fix in Simulator</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
