import React, { useState, useMemo } from 'react'
import { Search, ShieldAlert, ArrowRight, ExternalLink, Filter, CheckCircle2 } from 'lucide-react'
import { FindingDrawer } from './FindingDrawer'

export function FindingsTable({ findings = [], onSimulateFix }) {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFinding, setSelectedFinding] = useState(null)

  // Enriched demo findings matching specification
  const allFindings = useMemo(() => {
    const defaultList = [
      {
        id: 'bucket-public-bucket-research',
        severity: 'CRITICAL',
        title: 'Public storage bucket access',
        resource: 'research-documents-demo',
        category: 'IAM & Object Storage',
        risk: 'High data exposure',
        status: 'Open',
        explanation: 'Bucket IAM policy contains allUsers with objectViewer role, allowing unauthenticated public internet read access.',
        recommendation: 'Enable Uniform Bucket-Level Access and remove allUsers from the storage IAM policy binding.'
      },
      {
        id: 'firewall-wide-fw-ssh',
        severity: 'HIGH',
        title: 'SSH exposed to the internet',
        resource: 'allow-ssh-from-anywhere-demo',
        category: 'Perimeter Ingress',
        risk: 'Brute force & scanner reachability',
        status: 'Open',
        explanation: 'Firewall rule permits 0.0.0.0/0 ingress on TCP port 22, exposing administrative SSH gateways to public internet scanners.',
        recommendation: 'Clamp source ranges to authorized corporate VPN CIDRs and enforce Google Cloud Identity-Aware Proxy (IAP).'
      },
      {
        id: 'firewall-wide-fw-rdp',
        severity: 'HIGH',
        title: 'Overly permissive firewall rule (RDP)',
        resource: 'allow-rdp-management-open',
        category: 'Perimeter Ingress',
        risk: 'Administrative port exposed',
        status: 'Open',
        explanation: 'Firewall allows inbound TCP port 3389 from 0.0.0.0/0 and ::/0, subjecting developer instances to automated credential stuffing.',
        recommendation: 'Restrict ingress to private subnet tunnels or disable the rule.'
      },
      {
        id: 'firewall-db-ingress',
        severity: 'MEDIUM',
        title: 'Unrestricted database ingress',
        resource: 'allow-postgres-cluster',
        category: 'Network Segmentation',
        risk: 'Broad internal reachability',
        status: 'Reviewing',
        explanation: 'Database port 5432 is reachable across broader subnets than the dedicated application tier.',
        recommendation: 'Scope network tags to restrict ingress strictly to app-server instances.'
      },
      {
        id: 'bucket-analytics-auth',
        severity: 'MEDIUM',
        title: 'Broad authenticated users binding',
        resource: 'analytics-raw-pipeline',
        category: 'IAM Policy',
        risk: 'Cross-tenant account access',
        status: 'Open',
        explanation: 'allAuthenticatedUsers is bound to the storage bucket, permitting any authenticated Google account to query data.',
        recommendation: 'Replace with specific service account principal bindings.'
      },
      {
        id: 'backup-unencrypted-tag',
        severity: 'LOW',
        title: 'Storage lifecycle transition absent',
        resource: 'internal-backups-demo',
        category: 'Compliance & Governance',
        risk: 'Stale retention risk',
        status: 'Compliant',
        explanation: 'Backup volume lacks automated archival lifecycle rules to Coldline storage tier.',
        recommendation: 'Configure 30-day lifecycle transition policy.'
      }
    ]

    // Merge with any dynamic backend findings
    if (findings.length > 0) {
      const merged = [...findings]
      defaultList.forEach(df => {
        if (!merged.some(f => f.id === df.id || f.resource === df.resource)) {
          merged.push(df)
        }
      })
      return merged
    }

    return defaultList
  }, [findings])

  // Filtering
  const filteredFindings = useMemo(() => {
    return allFindings.filter((f) => {
      const matchFilter = activeFilter === 'ALL' || f.severity?.toUpperCase() === activeFilter
      const matchQuery = !searchQuery || 
        f.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.resource?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchFilter && matchQuery
    })
  }, [allFindings, activeFilter, searchQuery])

  return (
    <div className="glass-panel findings-panel">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 className="chart-title" style={{ fontSize: '15px' }}>Security Findings</h3>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--cyan)',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.25)'
          }}>
            {filteredFindings.length} RECORDED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={13} className="search-icon" />
            <input
              type="text"
              placeholder="Search findings..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '180px' }}
            />
          </div>

          {/* Severity Filter Pills */}
          <div className="filter-pills-group">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setActiveFilter(sev)}
                className={`filter-pill ${activeFilter === sev ? 'active' : ''}`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Finding</th>
              <th>Affected Resource</th>
              <th>Category</th>
              <th>Risk Impact</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFindings.map((f, i) => (
              <tr key={`${f.id}-${i}`} onClick={() => setSelectedFinding(f)}>
                <td>
                  <span className={`severity-pill ${f.severity?.toLowerCase() || 'critical'}`}>
                    {f.severity}
                  </span>
                </td>

                <td>
                  <b style={{ color: 'var(--text-primary)', fontSize: '12.5px' }}>{f.title}</b>
                </td>

                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyan)' }}>
                    {f.resource}
                  </span>
                </td>

                <td>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {f.category || 'Security Policy'}
                  </span>
                </td>

                <td>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                    {f.risk || 'Policy variance'}
                  </span>
                </td>

                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: f.status === 'Compliant' ? 'var(--low)' : 'var(--high)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: f.status === 'Compliant' ? 'var(--low)' : 'var(--high)'
                    }} />
                    {f.status || 'Open'}
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn-cyber btn-cyber-secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFinding(f)
                    }}
                    style={{ padding: '4px 8px', fontSize: '10.5px' }}
                  >
                    <span>Inspect</span>
                    <ExternalLink size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selectedFinding && (
        <FindingDrawer
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onSimulateFix={onSimulateFix}
        />
      )}
    </div>
  )
}
