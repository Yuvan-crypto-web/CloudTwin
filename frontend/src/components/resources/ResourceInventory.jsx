import React, { useState, useMemo } from 'react'
import { 
  Database, 
  Search, 
  HardDrive, 
  Network, 
  Flame, 
  Server, 
  Cloud, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  Info
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { CyberBadge } from '../ui/CyberBadge'
import { NodeDetailModal } from '../3d/NodeDetailModal'

export function ResourceInventory({ 
  resources = [], 
  findings = [], 
  status = {}, 
  onDiscoverGcp, 
  busy = false, 
  discoveryNote = null,
  onNavigateToSimulator 
}) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [inspectNode, setInspectNode] = useState(null)

  const enrichedResources = useMemo(() => {
    return resources.map((r) => {
      let type = 'vpc'
      let typeLabel = 'VPC Network'
      let icon = Network
      let details = r.self_link || 'Global network'

      if (r.public_principals !== undefined || r.type === 'bucket') {
        type = 'bucket'
        typeLabel = 'Storage Bucket'
        icon = HardDrive
        details = r.public_principals?.length ? `Public: [${r.public_principals.join(', ')}]` : 'Private Storage'
      } else if (r.source_ranges !== undefined || r.type === 'firewall') {
        type = 'firewall'
        typeLabel = 'Firewall Rule'
        icon = Flame
        details = `Ports: ${(r.ports || []).join(', ')} · CIDR: ${(r.source_ranges || []).join(', ')}`
      } else if (r.region || (r.id || '').startsWith('subnet-') || r.type === 'subnet') {
        type = 'subnet'
        typeLabel = 'Subnetwork'
        icon = Network
        details = `Region: ${r.region || 'us-central1'} · Network: ${r.network || 'vpc-prod'}`
      } else if ((r.id || '').startsWith('vm-') || r.machine_type || r.type === 'vm') {
        type = 'vm'
        typeLabel = 'Compute VM'
        icon = Server
        details = `${r.machine_type || 'e2-standard-4'} · ${r.zone || 'us-central1-a'}`
      }

      const hasRisk = findings.some(f => f.resource === r.name || f.resource_id === r.id || (f.id && f.id.includes(r.id)))

      return {
        ...r,
        type,
        typeLabel,
        icon,
        details,
        hasRisk
      }
    })
  }, [resources, findings])

  const filtered = useMemo(() => {
    return enrichedResources.filter(r => {
      const matchType = typeFilter === 'ALL' || r.type === typeFilter
      const matchSearch = !search || 
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.id?.toLowerCase().includes(search.toLowerCase()) ||
        r.details?.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [enrichedResources, typeFilter, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Discovery Control Card */}
      <GlassCard glow="cyan">
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cloud size={18} color="var(--cyan-primary)" />
              <h3>Google Cloud Read-Only Discovery Sync</h3>
            </div>
            <small>Read-only metadata ingestion for live projects</small>
          </div>

          <button 
            className="cyber-btn cyber-btn-primary" 
            disabled={busy || !status?.enabled}
            onClick={onDiscoverGcp}
          >
            <RefreshCw size={13} className={busy ? 'animate-spin' : ''} />
            <span>{busy ? 'Ingesting Metadata...' : 'Run GCP Discovery'}</span>
          </button>
        </div>

        <div className="panel-body">
          {!status?.enabled ? (
            <div style={{
              background: 'rgba(255, 183, 3, 0.08)',
              border: '1px solid rgba(255, 183, 3, 0.3)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Info size={20} color="var(--amber-warning)" className="shrink-0" />
              <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                <b style={{ color: '#fff' }}>GCP Discovery Ingestion is Standby:</b>
                <span style={{ color: '#fde68a', marginLeft: '6px' }}>
                  To inspect a live Google Cloud project, set <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>CLOUDTWIN_ENABLE_GCP=true</code> and specify <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px' }}>CLOUDTWIN_GCP_PROJECT</code> in the backend environment.
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Target Project: <b style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{status.project_id}</b>
              </span>
              <CyberBadge variant="emerald">READ-ONLY AUDIT MODE ACTIVE</CyberBadge>
            </div>
          )}

          {discoveryNote && (
            <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ℹ {discoveryNote}
            </p>
          )}
        </div>
      </GlassCard>

      {/* Inventory Table Card */}
      <GlassCard>
        <div className="panel-header">
          <div className="panel-header-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--cyan-primary)" />
              <h3>Digital Twin Topology Assets</h3>
              <span className="count">{resources.length}</span>
            </div>
            <small>Deep asset inventory breakdown</small>
          </div>

          {/* Type Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'bucket', label: 'Storage' },
              { id: 'vpc', label: 'VPCs' },
              { id: 'subnet', label: 'Subnets' },
              { id: 'firewall', label: 'Firewalls' },
              { id: 'vm', label: 'VMs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`cyber-btn cyber-btn-secondary ${typeFilter === tab.id ? 'active-filter' : ''}`}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderColor: typeFilter === tab.id ? 'var(--cyan-primary)' : 'var(--border-subtle)',
                  color: typeFilter === tab.id ? 'var(--cyan-primary)' : 'var(--text-muted)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-body">
          {/* Search Input */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search resource by name, network, or parameters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

          {/* Cyber Table */}
          <div className="table-container">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Resource Name</th>
                  <th>Type</th>
                  <th>Configuration / Exposure</th>
                  <th>Location / Net</th>
                  <th>Posture</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const Icon = r.icon
                  return (
                    <tr key={`${r.id || r.name}-${i}`}>
                      <td>
                        <div className="table-resource-cell">
                          <div style={{
                            padding: '6px',
                            borderRadius: '6px',
                            background: 'rgba(79, 114, 180, 0.15)',
                            color: 'var(--cyan-primary)'
                          }}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <b style={{ color: '#fff', fontSize: '13px' }}>{r.name}</b>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                              {r.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <CyberBadge variant="cyan">{r.typeLabel}</CyberBadge>
                      </td>

                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {r.details}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {r.location || r.region || r.network || 'global'}
                        </span>
                      </td>

                      <td>
                        {r.hasRisk ? (
                          <CyberBadge variant="crimson">EXPOSED</CyberBadge>
                        ) : (
                          <CyberBadge variant="emerald">SECURE</CyberBadge>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="cyber-btn cyber-btn-secondary" 
                          onClick={() => setInspectNode(r)}
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          <span>Inspect</span>
                          <ExternalLink size={11} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      {/* Detail Modal */}
      {inspectNode && (
        <NodeDetailModal
          node={inspectNode}
          findings={findings}
          onClose={() => setInspectNode(null)}
          onTestRemediation={onNavigateToSimulator}
        />
      )}
    </div>
  )
}
