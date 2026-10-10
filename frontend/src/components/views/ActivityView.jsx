import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, ShieldAlert, SlidersHorizontal, CheckCircle2, Clock } from 'lucide-react'

export function ActivityView() {
  const events = [
    {
      id: 'evt-1',
      type: 'SIMULATION_EXEC',
      title: 'Simulated In-Memory Hardening Run',
      desc: 'Executed scenario "Harden bucket access + firewall rules" against digital twin graph.',
      time: '12 minutes ago',
      actor: 'Security Engineer (Admin)',
      status: 'SUCCESS',
      icon: SlidersHorizontal,
      color: 'var(--cyan)'
    },
    {
      id: 'evt-2',
      type: 'RISK_SIGNAL',
      title: 'Critical IAM Exposure Flagged',
      desc: 'Discovered allUsers principal on storage bucket research-documents-demo.',
      time: '1 hour ago',
      actor: 'Digital Twin Heuristic Engine',
      status: 'CRITICAL',
      icon: ShieldAlert,
      color: 'var(--critical)'
    },
    {
      id: 'evt-3',
      type: 'PERIMETER_SCAN',
      title: 'Firewall Ingress Rules Evaluated',
      desc: 'Evaluated 4 network firewall rules across production-vpc-demo and development-vpc-demo.',
      time: '3 hours ago',
      actor: 'Automated Policy Auditor',
      status: 'INFO',
      icon: Activity,
      color: 'var(--blue)'
    },
    {
      id: 'evt-4',
      type: 'TOPOLOGY_SYNC',
      title: 'Digital Twin Model Initialized',
      desc: 'In-memory graph generated with 10 assets and 6 topological boundary links.',
      time: '6 hours ago',
      actor: 'CloudTwin Core',
      status: 'SUCCESS',
      icon: ShieldCheck,
      color: 'var(--low)'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="chart-panel-header" style={{ padding: '0 0 14px 0', marginBottom: '18px' }}>
          <div>
            <h3 className="chart-title">Security Activity Stream</h3>
            <p className="chart-subtitle">Chronological audit trail of digital twin telemetry and simulation runs</p>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--cyan)',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.25)'
          }}>
            REAL-TIME LOG
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((evt) => {
            const Icon = evt.icon
            return (
              <div
                key={evt.id}
                style={{
                  background: 'rgba(8, 13, 27, 0.65)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(12, 20, 38, 0.9)',
                  border: '1px solid var(--border)',
                  color: evt.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={16} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <b style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{evt.title}</b>
                    <span className={`severity-pill ${evt.status === 'CRITICAL' ? 'critical' : 'low'}`}>
                      {evt.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: 0 }}>
                    {evt.desc}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-muted)'
                  }}>
                    <span>Actor: {evt.actor}</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} />
                      {evt.time}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
