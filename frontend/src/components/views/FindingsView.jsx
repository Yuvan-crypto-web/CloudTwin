import React from 'react'
import { motion } from 'framer-motion'
import { FindingsTable } from '../findings/FindingsTable'
import { RiskDistributionChart } from '../analytics/RiskDistributionChart'
import { SecurityTrendChart } from '../analytics/SecurityTrendChart'

export function FindingsView({ findings = [], onSimulateFix }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div className="analytics-row">
        <RiskDistributionChart findings={findings} />
        <SecurityTrendChart />
      </div>

      <FindingsTable
        findings={findings}
        onSimulateFix={onSimulateFix}
      />
    </motion.div>
  )
}
