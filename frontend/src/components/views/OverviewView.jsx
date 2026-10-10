import React from 'react'
import { motion } from 'framer-motion'
import { CloudScene } from '../3d/CloudScene'
import { KpiGrid } from '../kpi/KpiGrid'
import { RiskDistributionChart } from '../analytics/RiskDistributionChart'
import { SecurityTrendChart } from '../analytics/SecurityTrendChart'
import { FindingsTable } from '../findings/FindingsTable'

export function OverviewView({ 
  resources = [], 
  findings = [], 
  summary = {}, 
  onSimulateFix 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      {/* 1. Primary 3D Hero Scene */}
      <CloudScene
        resources={resources}
        findings={findings}
        onSimulateFix={onSimulateFix}
      />

      {/* 2. KPI Cards Row */}
      <KpiGrid
        summary={summary}
        findings={findings}
      />

      {/* 3. Analytics Two-Column Section */}
      <div className="analytics-row">
        <RiskDistributionChart findings={findings} />
        <SecurityTrendChart />
      </div>

      {/* 4. Wide Security Findings Table */}
      <FindingsTable
        findings={findings}
        onSimulateFix={onSimulateFix}
      />
    </motion.div>
  )
}
