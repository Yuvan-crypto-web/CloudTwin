import React from 'react'
import { X, ShieldAlert, ArrowRight, CheckCircle, Terminal, HelpCircle } from 'lucide-react'
import { SeverityBadge, CyberBadge } from '../ui/CyberBadge'

export function FindingDetailModal({ finding, onClose, onTestInSimulator }) {
  if (!finding) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '10px',
              background: 'rgba(255, 51, 102, 0.15)',
              border: '1px solid rgba(255, 51, 102, 0.4)',
              color: 'var(--crimson-threat)'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>{finding.title}</h3>
                <SeverityBadge severity={finding.severity} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                Target Resource: {finding.resource} · ID: {finding.id}
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

        {/* Body */}
        <div className="modal-body">
          {/* Risk Analysis Card */}
          <div style={{
            background: 'rgba(14, 21, 44, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '18px'
          }}>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--cyan-primary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>
              Attack Surface Explanation
            </h4>
            <p style={{ color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.7' }}>
              {finding.explanation}
            </p>
          </div>

          {/* Recommended Remediation Action */}
          <div style={{
            background: 'rgba(0, 245, 160, 0.08)',
            border: '1px solid rgba(0, 245, 160, 0.3)',
            borderRadius: '12px',
            padding: '18px'
          }}>
            <h4 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--emerald-safe)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle size={14} />
              Remediation Strategy
            </h4>
            <p style={{ color: '#d1fae5', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>
              {finding.recommendation}
            </p>

            {/* Illustrative CLI / Terraform fix snippet */}
            <div className="code-block-cyber" style={{ fontSize: '11px' }}>
              <div style={{ color: '#94a3b8', marginBottom: '4px' }}># In-Memory Simulated Fix Command:</div>
              {finding.id?.includes('bucket') ? (
                <code>gcloud storage buckets remove-iam-policy-binding gs://{finding.resource} \<br/>&nbsp;&nbsp;--member=allUsers --role=roles/storage.objectViewer</code>
              ) : (
                <code>gcloud compute firewall-rules update {finding.resource} \<br/>&nbsp;&nbsp;--source-ranges=10.240.0.0/16</code>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="cyber-btn cyber-btn-secondary" onClick={onClose}>
              Close
            </button>
            {onTestInSimulator && (
              <button 
                className="cyber-btn cyber-btn-primary" 
                onClick={() => {
                  onClose()
                  onTestInSimulator()
                }}
              >
                <span>Simulate Blast Radius Fix</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
