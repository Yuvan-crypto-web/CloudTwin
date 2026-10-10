import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Shield, Sliders, Cloud, CheckCircle2, Lock } from 'lucide-react'

export function SettingsView({ status = {} }) {
  const [strictIam, setStrictIam] = useState(true)
  const [portAudit, setPortAudit] = useState(true)
  const [autoSimulate, setAutoSimulate] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* Policy Rules & Heuristics */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="chart-panel-header" style={{ padding: '0 0 14px 0', marginBottom: '18px' }}>
          <div>
            <h3 className="chart-title">Policy Heuristics & Analysis Rules</h3>
            <p className="chart-subtitle">Customize digital twin detection and blast radius calculations</p>
          </div>
          <span className="severity-pill low">ENGINE V1.2</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Strict IAM */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(8, 13, 27, 0.6)',
            border: '1px solid var(--border)'
          }}>
            <div>
              <b style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Enforce Zero Public IAM Principals</b>
              <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', margin: 0 }}>
                Flag any storage bucket with allUsers or allAuthenticatedUsers as CRITICAL.
              </p>
            </div>
            <input
              type="checkbox"
              checked={strictIam}
              onChange={(e) => setStrictIam(e.target.checked)}
              style={{ accentColor: 'var(--cyan)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>

          {/* Port Audit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(8, 13, 27, 0.6)',
            border: '1px solid var(--border)'
          }}>
            <div>
              <b style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Sensitive Port Ingress Scanning</b>
              <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', margin: 0 }}>
                Audit ports 22 (SSH), 3389 (RDP), 5432 (PostgreSQL), 3306 (MySQL), 6379 (Redis) for 0.0.0.0/0 exposures.
              </p>
            </div>
            <input
              type="checkbox"
              checked={portAudit}
              onChange={(e) => setPortAudit(e.target.checked)}
              style={{ accentColor: 'var(--cyan)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>

          {/* Auto Simulation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(8, 13, 27, 0.6)',
            border: '1px solid var(--border)'
          }}>
            <div>
              <b style={{ color: 'var(--text-primary)', fontSize: '13px' }}>Auto-Simulate Proposed Changes on Ingestion</b>
              <p style={{ color: 'var(--text-muted)', fontSize: '11.5px', margin: 0 }}>
                Automatically evaluate the combined hardening scenario whenever a new topology is loaded.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoSimulate}
              onChange={(e) => setAutoSimulate(e.target.checked)}
              style={{ accentColor: 'var(--cyan)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Cloud Connection Configuration */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="chart-panel-header" style={{ padding: '0 0 14px 0', marginBottom: '18px' }}>
          <div>
            <h3 className="chart-title">Google Cloud Discovery Configuration</h3>
            <p className="chart-subtitle">Optional read-only metadata ingestion settings</p>
          </div>
          <span className="severity-pill low">AUDIT ONLY</span>
        </div>

        <div style={{
          background: 'rgba(5, 8, 22, 0.7)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '8px' }}>
            <b style={{ color: '#fff' }}>Environment Status:</b> {status?.enabled ? 'Connected to GCP' : 'Offline / Local Demo Simulation'}
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
            To enable live read-only ingestion, execute in your backend shell:
          </p>
          <pre style={{
            background: '#050816',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '10px 12px',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px'
          }}>
            $env:CLOUDTWIN_ENABLE_GCP="true"<br/>
            $env:CLOUDTWIN_GCP_PROJECT="your-gcp-project-id"
          </pre>
        </div>
      </div>
    </motion.div>
  )
}
