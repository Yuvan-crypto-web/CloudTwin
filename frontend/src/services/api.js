/**
 * CloudTwin API Client & Fallback Simulation Service
 * Supports live FastAPI communication with seamless offline fallback simulation.
 */

const API_BASE = '/api'

export const FALLBACK_DEMO = {
  buckets: [
    {
      id: 'bucket-research',
      name: 'research-documents-demo',
      location: 'us-central1',
      public_principals: ['allUsers'],
      sensitivity: 'high',
      source: 'demo',
      storage_class: 'STANDARD',
      created: '2026-08-14T08:22:00Z'
    },
    {
      id: 'bucket-backups',
      name: 'internal-backups-demo',
      location: 'us-central1',
      public_principals: [],
      sensitivity: 'high',
      source: 'demo',
      storage_class: 'COLDLINE',
      created: '2026-07-01T12:00:00Z'
    },
    {
      id: 'bucket-analytics',
      name: 'analytics-raw-pipeline',
      location: 'us-east1',
      public_principals: ['allAuthenticatedUsers'],
      sensitivity: 'medium',
      source: 'demo',
      storage_class: 'STANDARD',
      created: '2026-09-02T16:45:00Z'
    }
  ],
  vpcs: [
    { id: 'vpc-prod', name: 'production-vpc-demo', source: 'demo', self_link: 'https://compute.googleapis.com/v1/projects/cloudtwin/global/networks/production-vpc' },
    { id: 'vpc-dev', name: 'development-vpc-demo', source: 'demo', self_link: 'https://compute.googleapis.com/v1/projects/cloudtwin/global/networks/dev-vpc' },
    { id: 'vpc-dmz', name: 'dmz-perimeter-vpc', source: 'demo', self_link: 'https://compute.googleapis.com/v1/projects/cloudtwin/global/networks/dmz-vpc' }
  ],
  subnets: [
    { id: 'subnet-app', name: 'private-app-subnet-demo', network: 'production-vpc-demo', region: 'us-central1', ip_cidr: '10.0.1.0/24', source: 'demo' },
    { id: 'subnet-data', name: 'private-data-subnet-demo', network: 'production-vpc-demo', region: 'us-central1', ip_cidr: '10.0.2.0/24', source: 'demo' },
    { id: 'subnet-dev', name: 'dev-workloads-subnet', network: 'development-vpc-demo', region: 'us-west1', ip_cidr: '172.16.1.0/24', source: 'demo' },
    { id: 'subnet-dmz', name: 'dmz-ingress-subnet', network: 'dmz-perimeter-vpc', region: 'us-central1', ip_cidr: '192.168.1.0/24', source: 'demo' }
  ],
  firewalls: [
    { id: 'fw-ssh', name: 'allow-ssh-from-anywhere-demo', source_ranges: ['0.0.0.0/0'], ports: ['22'], network: 'production-vpc-demo', direction: 'INGRESS', source: 'demo' },
    { id: 'fw-web', name: 'allow-https-demo', source_ranges: ['0.0.0.0/0'], ports: ['443'], network: 'production-vpc-demo', direction: 'INGRESS', source: 'demo' },
    { id: 'fw-rdp', name: 'allow-rdp-management-open', source_ranges: ['0.0.0.0/0', '::/0'], ports: ['3389'], network: 'development-vpc-demo', direction: 'INGRESS', source: 'demo' },
    { id: 'fw-db', name: 'allow-postgres-cluster', source_ranges: ['10.0.1.0/24'], ports: ['5432'], network: 'production-vpc-demo', direction: 'INGRESS', source: 'demo' }
  ],
  vms: [
    { id: 'vm-api-core', name: 'core-api-server-01', network: 'production-vpc-demo', subnet: 'private-app-subnet-demo', machine_type: 'e2-standard-4', status: 'RUNNING', zone: 'us-central1-a', tags: ['api', 'production'], source: 'demo' },
    { id: 'vm-db-primary', name: 'postgres-db-primary', network: 'production-vpc-demo', subnet: 'private-data-subnet-demo', machine_type: 'n2-highmem-8', status: 'RUNNING', zone: 'us-central1-b', tags: ['database', 'secure'], source: 'demo' },
    { id: 'vm-bastion', name: 'bastion-gateway-edge', network: 'dmz-perimeter-vpc', subnet: 'dmz-ingress-subnet', machine_type: 'e2-medium', status: 'RUNNING', zone: 'us-central1-c', tags: ['bastion', 'ingress'], source: 'demo' }
  ]
}

const SENSITIVE_PORTS = {
  22: 'SSH (Port 22)',
  3389: 'RDP (Port 3389)',
  5432: 'PostgreSQL (Port 5432)',
  3306: 'MySQL (Port 3306)',
  6379: 'Redis (Port 6379)'
}

export function localAnalyze(resources) {
  const findings = []
  
  // Storage bucket analysis
  for (const bucket of (resources.buckets || [])) {
    const principals = bucket.public_principals || []
    const publicList = principals.filter(p => p === 'allUsers' || p === 'allAuthenticatedUsers')
    if (publicList.length > 0) {
      findings.push({
        id: `bucket-public-${bucket.id}`,
        severity: 'HIGH',
        title: `Public IAM principal detected on ${bucket.name}`,
        resource: bucket.name,
        resource_id: bucket.id,
        category: 'IAM & Storage Exposure',
        explanation: `Bucket IAM includes [${publicList.join(', ')}]. Any unauthorized internet client may read or list assets depending on bound roles.`,
        recommendation: 'Enable Uniform Bucket-Level Access, enforce Domain Restricted Sharing, and strip public principals from IAM bindings.',
        riskScore: 88,
        affectedPorts: 'HTTP/S (Cloud Storage API)'
      })
    }
  }

  // Firewall rules analysis
  for (const fw of (resources.firewalls || [])) {
    const ranges = fw.source_ranges || []
    const isGlobal = ranges.some(r => r === '0.0.0.0/0' || r === '::/0')
    if (!isGlobal) continue

    const ports = (fw.ports || []).map(String)
    const isBroad = ports.some(p => ['all', '*', '0-65535'].includes(p.toLowerCase()))
    const sensitive = ports
      .filter(p => !isNaN(Number(p)) && SENSITIVE_PORTS[Number(p)])
      .map(p => SENSITIVE_PORTS[Number(p)])

    if (isBroad || sensitive.length > 0) {
      const portText = isBroad ? 'ALL open ports (0-65535)' : sensitive.join(', ')
      findings.push({
        id: `firewall-wide-${fw.id}`,
        severity: 'HIGH',
        title: `Unrestricted internet access to sensitive services: ${fw.name}`,
        resource: fw.name,
        resource_id: fw.id,
        category: 'Perimeter Network Exposure',
        explanation: `Firewall allows 0.0.0.0/0 source traffic targeting ${portText}. Exposes internal host vectors to automated scanners and brute force threats.`,
        recommendation: 'Restrict ingress CIDRs to trusted VPC/VPN tunnels and require Identity-Aware Proxy (IAP) for administrative access.',
        riskScore: 94,
        affectedPorts: portText
      })
    }
  }

  return findings
}

export function localSummarize(resources, findings) {
  const buckets = resources.buckets?.length || 0
  const vpcs = resources.vpcs?.length || 0
  const subnets = resources.subnets?.length || 0
  const firewalls = resources.firewalls?.length || 0
  const vms = resources.vms?.length || 0

  const high = findings.filter(f => f.severity === 'HIGH' || f.severity === 'CRITICAL').length
  const medium = findings.filter(f => f.severity === 'MEDIUM').length
  const low = findings.filter(f => f.severity === 'LOW').length

  // Calculate composite security posture index (0 - 100)
  const totalAssets = Math.max(1, buckets + vpcs + subnets + firewalls + vms)
  const penalty = (high * 28) + (medium * 12) + (low * 4)
  const securityScore = Math.max(15, Math.min(100, Math.round(100 - (penalty / totalAssets) * 10)))

  return {
    buckets,
    vpcs,
    subnets,
    firewalls,
    vms,
    totalAssets,
    high,
    medium,
    low,
    totalFindings: findings.length,
    securityScore
  }
}

export function buildPayload(resources, source = 'simulated', projectId = null, isFallback = false) {
  const findings = localAnalyze(resources)
  const flat = [
    ...(resources.buckets || []),
    ...(resources.vpcs || []),
    ...(resources.subnets || []),
    ...(resources.firewalls || []),
    ...(resources.vms || [])
  ]
  return {
    source,
    project_id: projectId,
    resources: flat,
    raw_resources: resources,
    findings,
    summary: localSummarize(resources, findings),
    is_fallback: isFallback
  }
}

export const SCENARIO_DESCRIPTIONS = {
  combined: 'Hypothetically harden both bucket IAM policies and firewall ingress rules.',
  restrict_public_bucket: 'Hypothetically remove public IAM principals (allUsers/allAuthenticatedUsers) from modeled storage.',
  restrict_open_firewall: 'Hypothetically clamp internet-wide firewall source ranges (0.0.0.0/0) to internal RFC1918 subnets.',
  no_change: 'Analyze the unchanged baseline digital twin model.'
}

export function runLocalSimulation(resources, scenario) {
  const beforeModel = JSON.parse(JSON.stringify(resources))
  const afterModel = JSON.parse(JSON.stringify(resources))

  const beforeFindings = localAnalyze(beforeModel)

  if (scenario === 'restrict_public_bucket' || scenario === 'combined') {
    for (const b of (afterModel.buckets || [])) {
      b.public_principals = (b.public_principals || []).filter(
        p => p !== 'allUsers' && p !== 'allAuthenticatedUsers'
      )
    }
  }

  if (scenario === 'restrict_open_firewall' || scenario === 'combined') {
    for (const fw of (afterModel.firewalls || [])) {
      const ranges = fw.source_ranges || []
      if (ranges.includes('0.0.0.0/0') || ranges.includes('::/0')) {
        fw.source_ranges = ['10.240.0.0/16'] // Replaced with corporate VPN CIDR
      }
    }
  }

  const afterFindings = localAnalyze(afterModel)
  const beforeIds = new Set(beforeFindings.map(f => f.id))
  const afterIds = new Set(afterFindings.map(f => f.id))

  const resolvedFindingIds = [...beforeIds].filter(id => !afterIds.has(id))
  const remainingFindingIds = [...afterIds]

  return {
    scenario,
    description: SCENARIO_DESCRIPTIONS[scenario] || 'Custom security simulation run',
    mode: 'IN-MEMORY DIGITAL TWIN — No actual cloud assets modified',
    before: {
      findings: beforeFindings,
      summary: localSummarize(beforeModel, beforeFindings),
      resources: beforeModel
    },
    after: {
      findings: afterFindings,
      summary: localSummarize(afterModel, afterFindings),
      resources: afterModel
    },
    resolved_finding_ids: resolvedFindingIds,
    remaining_finding_ids: remainingFindingIds,
    note: 'Simulated resolution applies isolated IAM and network ingress boundaries against the twin graph.'
  }
}

export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, { signal: AbortSignal.timeout(3500) })
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch dashboard`)
    const data = await res.json()
    // Enrich with fallback VM nodes if not present in legacy backend
    if (data.resources && !data.resources.some(r => r.id && r.id.startsWith('vm-'))) {
      data.resources = [...data.resources, ...FALLBACK_DEMO.vms]
      data.summary.vms = FALLBACK_DEMO.vms.length
      data.summary.totalAssets = (data.resources.length || 0)
    }
    return { ...data, is_fallback: false }
  } catch (err) {
    console.warn('[CloudTwin API] Backend unavailable, engaging fallback digital twin dataset.', err.message)
    return buildPayload(FALLBACK_DEMO, 'local-twin-fallback', 'cloudtwin-sim-sandbox', true)
  }
}

export async function fetchGcpStatus() {
  try {
    const res = await fetch(`${API_BASE}/gcp/status`, { signal: AbortSignal.timeout(3000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    return {
      enabled: false,
      project_configured: false,
      project_id: null,
      mode: 'offline demo / simulated twin'
    }
  }
}

export async function runSimulation(scenario = 'combined', currentResources = FALLBACK_DEMO) {
  try {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
      signal: AbortSignal.timeout(4000)
    })
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      throw new Error(errJson.detail || `Simulation API error (${res.status})`)
    }
    return await res.json()
  } catch (err) {
    console.warn('[CloudTwin Simulation] Falling back to client-side in-memory simulator engine.', err.message)
    return runLocalSimulation(currentResources, scenario)
  }
}

export async function discoverGcp() {
  const res = await fetch(`${API_BASE}/gcp/discover`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Google Cloud discovery failed')
  return data
}
