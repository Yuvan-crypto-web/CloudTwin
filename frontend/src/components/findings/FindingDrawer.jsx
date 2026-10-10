import React from 'react'
import { X, ShieldAlert, ArrowRight, CheckCircle2, Terminal, ExternalLink } from 'lucide-react'

export function FindingDrawer({ finding, onClose, onSimulateFix }) {
  if (!finding) return null

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 69, 103, 0.12)',
              border: '1px solid rgba(255, 69, 103, 0.3)',
              color: 'var(--critical)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {finding.title}
              </h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                Target: {finding.resource} · ID: {finding.id}
              </span>
            </div>
          </div>

          <button onClick={onClose} className="icon-button">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Finding Summary */}
          <div style={{
            background: 'rgba(12, 20, 38, 0.8)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cyan)', letterSpacing: '0.8px' }}>
                RISK CLASSIFICATION
              </span>
              <span className={`severity-pill ${finding.severity?.toLowerCase() || 'critical'}`}>
                {finding.severity}
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
              {finding.explanation}
            </p>
          </div>

          {/* Remediation Guidance */}
          <div style={{
            background: 'rgba(55, 214, 160, 0.06)',
            border: '1px solid rgba(55, 214, 160, 0.25)',
            borderRadius: '8px',
            padding: '14px'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--low)',
              letterSpacing: '0.8px',
              marginBottom: '6px'
            }}>
              <CheckCircle2 size={12} />
              RECOMMENDED REMEDIATION
            </span>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 10px 0' }}>
              {finding.recommendation}
            </p>

            {/* CLI Fix Snippet */}
            <div style={{
              background: '#050816',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              color: '#A5B4FC',
              lineHeight: '1.5'
            }}>
              <div style={{ color: '#52627D', marginBottom: '4px' }}># Remediation command:</div>
              {finding.id?.includes('bucket') ? (
                <code>gcloud storage buckets remove-iam-policy-binding gs://{finding.resource} \<br/>&nbsp;&nbsp;--member=allUsers --role=roles/storage.objectViewer</code>
              ) : (
                <code>gcloud compute firewall-rules update {finding.resource} \<br/>&nbsp;&nbsp;--source-ranges=10.240.0.0/16</code>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px' }}>
            <button className="btn-cyber btn-cyber-secondary" onClick={onClose} style={{ flex: 1 }}>
              Close
            </button>
            {onSimulateFix && (
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
