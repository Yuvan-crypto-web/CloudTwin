import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CloudScene } from '../3d/CloudScene'
import { Search, HardDrive, Server, Flame, Network, Database, ExternalLink } from 'lucide-react'
import { NodeDetailsDrawer } from '../3d/NodeDetailsDrawer'

export function InfrastructureView({ 
  resources = [], 
  findings = [], 
  onSimulateFix 
}) {
  const [filterType, setFilterType] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedNode, setSelectedNode] = useState(null)

  const enrichedResources = useMemo(() => {
    return resources.map((r) => {
      let type = 'vpc'
      let typeLabel = 'VPC Network'
      let icon = Network
      let details = r.self_link || 'Global Network Mesh'

      if (r.public_principals !== undefined || r.type === 'bucket') {
        type = 'bucket'
        typeLabel = 'Storage Bucket'
        icon = HardDrive
        details = r.public_principals?.length ? `Public IAM: [${r.public_principals.join(', ')}]` : 'Private Storage Vault'
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

      const hasCriticalRisk = findings.some(f => 
        (f.resource === r.name || f.resource_id === r.id || (f.id && f.id.includes(r.id))) && 
        (f.severity === 'CRITICAL' || f.severity === 'HIGH')
      )

      return {
        ...r,
        type,
        typeLabel,
        icon,
        details,
        hasCriticalRisk
      }
    })
  }, [resources, findings])

  const filtered = useMemo(() => {
    return enrichedResources.filter(r => {
      const matchType = filterType === 'ALL' || r.type === filterType
      const matchSearch = !search || 
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.id?.toLowerCase().includes(search.toLowerCase()) ||
        r.details?.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [enrichedResources, filterType, search])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* Expanded 3D Canvas */}
      <CloudScene
        resources={resources}
        findings={findings}
        onSimulateFix={onSimulateFix}
      />

      {/* Asset Inventory Table */}
      <div className="glass-panel">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 className="chart-title" style={{ fontSize: '15px' }}>Modeled Cloud Assets</h3>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--cyan)',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.25)'
            }}>
              {filtered.length} TOTAL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search Box */}
            <div className="search-input-wrapper">
              <Search size={13} className="search-icon" />
              <input
                type="text"
                placeholder="Search assets..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '180px' }}
              />
            </div>

            {/* Filter Pills */}
            <div className="filter-pills-group">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'bucket', label: 'Storage' },
                { id: 'vpc', label: 'VPCs' },
                { id: 'subnet', label: 'Subnets' },
                { id: 'firewall', label: 'Firewalls' },
                { id: 'vm', label: 'VMs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`filter-pill ${filterType === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Type</th>
                <th>Network Configuration / Ingress</th>
                <th>Region / Zone</th>
                <th>Posture</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const Icon = r.icon
                return (
                  <tr key={`${r.id || r.name}-${idx}`} onClick={() => setSelectedNode(r)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          padding: '5px',
                          borderRadius: '5px',
                          background: 'rgba(12, 20, 38, 0.9)',
                          border: '1px solid var(--border)',
                          color: 'var(--cyan)'
                        }}>
                          <Icon size={12} />
                        </div>
                        <div>
                          <b style={{ color: 'var(--text-primary)', fontSize: '12.5px' }}>{r.name}</b>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--text-muted)' }}>
                            {r.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--cyan)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(0, 229, 255, 0.08)'
                      }}>
                        {r.typeLabel}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {r.details}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {r.location || r.region || r.network || 'global'}
                      </span>
                    </td>

                    <td>
                      {r.hasCriticalRisk ? (
                        <span className="severity-pill critical">EXPOSED</span>
                      ) : (
                        <span className="severity-pill low">HEALTHY</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-cyber btn-cyber-secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedNode(r)
                        }}
                        style={{ padding: '4px 8px', fontSize: '10.5px' }}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Node Drawer */}
      {selectedNode && (
        <NodeDetailsDrawer
          node={selectedNode}
          findings={findings}
          onClose={() => setSelectedNode(null)}
          onSimulateFix={onSimulateFix}
        />
      )}
    </motion.div>
  )
}
