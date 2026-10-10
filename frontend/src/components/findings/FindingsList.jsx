import React, { useState, useMemo } from 'react'
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Filter, ArrowRight, ShieldCheck } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { SeverityBadge, CyberBadge } from '../ui/CyberBadge'
import { FindingDetailModal } from './FindingDetailModal'

export function FindingsList({ findings = [], onNavigateToSimulator, compact = false }) {
  const [selectedFinding, setSelectedFinding] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFindings = useMemo(() => {
    return findings.filter(f => {
      const matchSeverity = filterSeverity === 'ALL' || f.severity === filterSeverity
      const matchSearch = !searchQuery || 
        f.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.resource?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.explanation?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSeverity && matchSearch
    })
  }, [findings, filterSeverity, searchQuery])

  return (
    <GlassCard className="findings-panel" glow="none">
      <div className="panel-header">
        <div className="panel-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3>Threat Signals & Exposures</h3>
            <span className="count">{findings.length}</span>
          </div>
          <small>Heuristic policy checks & perimeter blast radius</small>
        </div>

        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Severity Filter Buttons */}
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`cyber-btn cyber-btn-secondary ${filterSeverity === sev ? 'active-filter' : ''}`}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  borderColor: filterSeverity === sev ? 'var(--cyan-primary)' : 'var(--border-subtle)',
                  color: filterSeverity === sev ? 'var(--cyan-primary)' : 'var(--text-muted)'
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="panel-body">
        {!compact && (
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter findings by resource, port, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                background: 'rgba(9, 14, 31, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                outline: 'none'
              }}
            />
          </div>
        )}

        {filteredFindings.length > 0 ? (
          <div className="findings-container">
            {filteredFindings.map((f) => (
              <div 
                key={f.id} 
                className="finding-row"
                onClick={() => setSelectedFinding(f)}
              >
                <div className={`finding-severity-indicator ${f.severity?.toLowerCase() || 'high'}`}>
                  <ShieldAlert size={18} />
                </div>
                
                <div className="finding-info">
                  <div className="finding-title">{f.title}</div>
                  <div className="finding-meta">
                    <span style={{ color: 'var(--cyan-primary)' }}>◇ {f.resource}</span>
                    <span>·</span>
                    <span>{f.category || 'Security Exposure'}</span>
                  </div>
                </div>

                <SeverityBadge severity={f.severity} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            background: 'rgba(0, 245, 160, 0.05)',
            border: '1px dashed rgba(0, 245, 160, 0.3)',
            borderRadius: '12px'
          }}>
            <ShieldCheck size={32} color="var(--emerald-safe)" style={{ margin: '0 auto 8px auto' }} />
            <b style={{ color: 'var(--emerald-safe)', display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Zero Risk Findings Detected
            </b>
            <p style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
              Current ruleset detected no active IAM or perimeter misconfigurations.
            </p>
          </div>
        )}

        {compact && findings.length > 0 && onNavigateToSimulator && (
          <div style={{ marginTop: '14px', textAlign: 'right' }}>
            <button 
              className="cyber-btn cyber-btn-secondary" 
              onClick={onNavigateToSimulator}
              style={{ fontSize: '11.5px', padding: '6px 12px' }}
            >
              <span>Test All in Simulator</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {selectedFinding && (
        <FindingDetailModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onTestInSimulator={onNavigateToSimulator}
        />
      )}
    </GlassCard>
  )
}
