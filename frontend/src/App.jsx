import { useEffect, useState } from 'react'
const API = '/api'
function Severity({value}) { return <span className={'severity '+String(value).toLowerCase()}>{value}</span> }
function App() {
  const [data,setData] = useState(null), [status,setStatus] = useState(null)
  const [scenario,setScenario] = useState('combined'), [result,setResult] = useState(null)
  const [view,setView] = useState('overview'), [busy,setBusy] = useState(false), [error,setError] = useState('')
  async function load() {
    setError('')
    try {
      const [d,s] = await Promise.all([fetch(API+'/dashboard'),fetch(API+'/gcp/status')])
      if (!d.ok || !s.ok) throw new Error('API unavailable')
      setData(await d.json()); setStatus(await s.json())
    } catch(e) { setError(e.message+'. Start the backend on port 8000 and refresh.') }
  }
  useEffect(()=>{load()},[])
  async function simulate() {
    setBusy(true); setError('')
    try {
      const r = await fetch(API+'/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario})})
      const j = await r.json(); if(!r.ok) throw new Error(j.detail || 'Simulation failed')
      setResult(j); setView('simulation')
    } catch(e) {setError(e.message)} finally {setBusy(false)}
  }
  async function discover() {
    setBusy(true); setError('')
    try {
      const r=await fetch(API+'/gcp/discover'), j=await r.json()
      if(!r.ok) throw new Error(j.detail || 'Discovery failed')
      setData(j); setResult(null); setView('overview')
    } catch(e) {setError(e.message)} finally {setBusy(false)}
  }
  const resources=data?.resources||[], findings=data?.findings||[], summary=data?.summary||{}
  const buckets=resources.filter(r=>r.public_principals!==undefined)
  const firewalls=resources.filter(r=>r.source_ranges!==undefined)
  const vpcs=resources.filter(r=>r.self_link || (r.id||'').startsWith('vpc-'))
  const subnets=resources.filter(r=>r.region || (r.id||'').startsWith('subnet-'))
  return <div className="shell">
    <aside className="sidebar"><div className="brand"><div className="logo">CT</div><div><b>CloudTwin</b><small>Cloud change intelligence</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <button className={view==='overview'?'nav active':'nav'} onClick={()=>setView('overview')}>◫　Overview</button>
      <button className={view==='simulation'?'nav active':'nav'} onClick={()=>setView('simulation')}>⇄　What-if simulator</button>
      <button className={view==='resources'?'nav active':'nav'} onClick={()=>setView('resources')}>⌘　Resources</button>
      <div className="side-bottom"><span className="green-dot"></span><div><b>{data?.source==='google-cloud-read-only'?'Google Cloud read-only':'Local simulation'}</b><small>{data?.project_id||'No project connected'}</small></div></div>
    </aside>
    <main><header><div><small className="eyebrow">CLOUD SECURITY / DIGITAL TWIN</small><h1>{view==='simulation'?'What-if simulator':view==='resources'?'Resource inventory':'Infrastructure overview'}</h1></div>
      <div className="top-actions"><span className="pill">{data?.source==='google-cloud-read-only'?'GCP · READ ONLY':'DEMO ENVIRONMENT'}</span><button className="btn secondary" onClick={load}>↻ Refresh demo</button></div></header>
      {error&&<div className="error"><b>Action failed</b><p>{error}</p></div>}
      {!data&&!error&&<div className="card">Loading…</div>}
      {data&&view==='overview'&&<>
        <section className="hero card"><div><small className="eyebrow purple">PREDICT BEFORE YOU DEPLOY</small><h2>Understand the blast radius<br/>before a cloud change.</h2><p>Map cloud resources, detect risky exposure, and test hypothetical fixes against a copy of the infrastructure model.</p><button className="btn primary" onClick={()=>setView('simulation')}>Open simulator →</button></div><div className="orb"><span>☁</span><i>VPC</i><i>BUCKET</i><i>FIREWALL</i></div></section>
        <section className="stats">
          <div className="card stat"><small>Storage buckets</small><b>{summary.buckets??buckets.length}</b><small>Cloud object storage</small></div>
          <div className="card stat"><small>VPC networks</small><b>{summary.vpcs??vpcs.length}</b><small>Virtual networks</small></div>
          <div className="card stat"><small>Firewall rules</small><b>{summary.firewalls??firewalls.length}</b><small>Network controls</small></div>
          <div className="card stat"><small>High-risk findings</small><b>{summary.high??0}</b><small>Needs review</small></div>
        </section>
        <section className="columns"><div className="card panel"><div className="panel-title"><div><h3>Risk findings</h3><small>Prioritized configuration signals</small></div><span className="count">{findings.length}</span></div>
          {findings.length?findings.map(f=><div className="finding" key={f.id}><span className="bang">!</span><div className="finding-text"><b>{f.title}</b><small>{f.resource}</small></div><Severity value={f.severity}/></div>):<p className="muted">No findings from the current ruleset.</p>}
        </div><div className="card panel"><div className="panel-title"><div><h3>Resource map</h3><small>Current inventory snapshot</small></div><span className="tag">{data.source==='google-cloud-read-only'?'LIVE READ':'SYNTHETIC'}</span></div>
          {[['OBJECT STORAGE',buckets],['NETWORKING',[...vpcs,...subnets,...firewalls]]].map(([label,items])=><div className="resource-group" key={label}><small>{label}</small>{items.slice(0,4).map(r=><div className="resource" key={r.id}><span>◇</span>{r.name}</div>)}</div>)}
          <p className="note">Findings are heuristic signals, not proof of exploitability.</p>
        </div></section>
      </>}
      {data&&view==='simulation'&&<section className="card panel simulation"><div className="panel-title"><div><h3>What-if change lab</h3><small>All changes run against an in-memory copy.</small></div><span className="tag green">SAFE MODE</span></div>
        <div className="callout"><b>Production guardrail enabled</b><p>CloudTwin never applies a proposed change to Google Cloud. It only compares findings from a hypothetical model.</p></div>
        <label htmlFor="scenario">Scenario to simulate</label><select id="scenario" value={scenario} onChange={e=>setScenario(e.target.value)}>
          <option value="combined">Harden bucket access + firewall rules</option><option value="restrict_public_bucket">Remove public bucket principals</option><option value="restrict_open_firewall">Restrict broad firewall sources</option><option value="no_change">Baseline — no changes</option>
        </select><button className="btn primary" onClick={simulate} disabled={busy}>{busy?'Analyzing…':'Run simulation →'}</button>
        {result&&<div className="results"><div className="panel-title"><div><small className="eyebrow">SIMULATION COMPLETE</small><h3>{result.resolved_finding_ids.length} finding(s) resolved in model</h3><small>{result.mode}</small></div><span className="tag green">IN-MEMORY</span></div>
          <div className="compare"><div><small>Before</small><b>{result.before.findings.length}</b><small>findings</small></div><span>→</span><div><small>After</small><b>{result.after.findings.length}</b><small>findings</small></div></div>
          <h4>Resolved findings</h4>{result.resolved_finding_ids.length?result.resolved_finding_ids.map(id=><div className="result-row good" key={id}>✓　{id}</div>):<p className="muted">No findings resolved in this scenario.</p>}
          <h4>Remaining findings</h4>{result.after.findings.length?result.after.findings.map(f=><div className="result-row" key={f.id}><Severity value={f.severity}/>{f.title} — {f.resource}</div>):<p className="good">✓ No findings remain under this ruleset.</p>}
          <p className="note">{result.note}</p></div>}
      </section>}
      {data&&view==='resources'&&<section className="card panel"><div className="panel-title"><div><h3>Resource inventory</h3><small>Metadata only · {resources.length} resources</small></div><button className="btn secondary" disabled={busy||!status?.enabled} onClick={discover}>{busy?'Reading…':'Discover Google Cloud'}</button></div>
        {!status?.enabled&&<div className="callout"><b>Cloud discovery is disabled</b><p>Configure ADC and explicitly enable read-only discovery in the backend environment before using this action.</p></div>}
        <div className="table-wrap"><table><thead><tr><th>Resource</th><th>Type</th><th>Location / network</th><th>Source</th></tr></thead><tbody>{resources.map(r=>{const type=r.public_principals!==undefined?'Cloud Storage bucket':r.source_ranges!==undefined?'Firewall rule':r.region||(r.id||'').startsWith('subnet-')?'Subnet':'VPC network';return <tr key={type+r.id}><td>{r.name}</td><td>{type}</td><td>{r.location||r.region||r.network||'—'}</td><td>{r.source||data.source}</td></tr>})}</tbody></table></div>
        {data.discovery_note&&<p className="note">{data.discovery_note}</p>}
      </section>}
      <footer>CloudTwin prototype <span>Read-only discovery · Simulations never modify cloud resources</span></footer>
    </main>
  </div>
}
export default App
