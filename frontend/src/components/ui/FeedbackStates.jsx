import React from 'react'
import { ShieldAlert, RefreshCw, AlertTriangle, Database } from 'lucide-react'
import { GlassCard } from './GlassCard'

export function LoadingState({ message = 'Synchronizing Cloud Security Digital Twin...' }) {
  return (
    <GlassCard className="text-center" style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '20px' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed var(--cyan-primary)',
          animation: 'rotateClockwise 8s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '2px solid var(--violet-primary)',
          animation: 'rotateCounter 5s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cyan-primary)'
        }}>
          <ShieldAlert size={24} />
        </div>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px' }}>
        {message}
      </h3>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
        Parsing IAM policy trees and topological graphs...
      </p>
    </GlassCard>
  )
}

export function ErrorState({ title = 'Action Failed', message, onRetry }) {
  return (
    <GlassCard style={{ padding: '24px', borderColor: 'rgba(255, 51, 102, 0.4)', background: 'rgba(255, 51, 102, 0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          background: 'rgba(255, 51, 102, 0.2)',
          color: 'var(--crimson-threat)',
          padding: '10px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 51, 102, 0.4)'
        }}>
          <AlertTriangle size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>{title}</h4>
          <p style={{ color: '#fca5a5', fontSize: '12.5px', lineHeight: '1.6', marginBottom: '12px' }}>
            {message}
          </p>
          {onRetry && (
            <button className="cyber-btn cyber-btn-secondary" onClick={onRetry} style={{ padding: '6px 12px', fontSize: '11.5px' }}>
              <RefreshCw size={13} />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

export function EmptyState({ title = 'No Resources Detected', message = 'No assets found matching the selected query or filter.', icon: Icon = Database }) {
  return (
    <GlassCard style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(79, 114, 180, 0.15)',
        color: 'var(--cyan-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto'
      }}>
        <Icon size={24} />
      </div>
      <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '6px' }}>{title}</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '380px', margin: '0 auto' }}>
        {message}
      </p>
    </GlassCard>
  )
}
