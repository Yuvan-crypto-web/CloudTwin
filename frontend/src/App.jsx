import React, { useEffect, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { OverviewView } from './components/views/OverviewView'
import { InfrastructureView } from './components/views/InfrastructureView'
import { FindingsView } from './components/views/FindingsView'
import { SimulatorView } from './components/simulator/SimulatorView'
import { ActivityView } from './components/views/ActivityView'
import { SettingsView } from './components/views/SettingsView'
import { LoadingState, ErrorState } from './components/ui/FeedbackStates'
import { fetchDashboard, fetchGcpStatus, runSimulation } from './services/api'

export function App() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)
  const [currentView, setView] = useState('overview')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function loadData() {
    setBusy(true)
    setError('')
    try {
      const [dashData, gcpStatus] = await Promise.all([
        fetchDashboard(),
        fetchGcpStatus()
      ])
      setData(dashData)
      setStatus(gcpStatus)
    } catch (err) {
      setError(`Failed to sync digital twin: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSimulate(scenario) {
    setBusy(true)
    setError('')
    try {
      const result = await runSimulation(scenario, data?.raw_resources)
      return result
    } catch (err) {
      setError(`Simulation failed: ${err.message}`)
      throw err
    } finally {
      setBusy(false)
    }
  }

  const resources = data?.resources || []
  const findings = data?.findings || []
  const summary = data?.summary || {}

  return (
    <div className="app-shell">
      {/* 1. Fixed Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setView={setView}
        findingCount={findings.length}
      />

      {/* 2. Main Workspace */}
      <div className="main-workspace">
        {/* Top Navigation */}
        <TopBar currentView={currentView} />

        {/* Content Area */}
        <main className="content-area">
          {/* Dashboard Header */}
          <DashboardHeader currentView={currentView} />

          {/* Error Banner */}
          {error && (
            <ErrorState
              title="Execution Notice"
              message={error}
              onRetry={loadData}
            />
          )}

          {/* Loading Initial State */}
          {!data && !error && (
            <LoadingState message="Initializing Cloud Security Command Center..." />
          )}

          {/* Active View Router */}
          {data && (
            <>
              {currentView === 'overview' && (
                <OverviewView
                  resources={resources}
                  findings={findings}
                  summary={summary}
                  onSimulateFix={() => setView('simulator')}
                />
              )}

              {currentView === 'infrastructure' && (
                <InfrastructureView
                  resources={resources}
                  findings={findings}
                  onSimulateFix={() => setView('simulator')}
                />
              )}

              {currentView === 'findings' && (
                <FindingsView
                  findings={findings}
                  onSimulateFix={() => setView('simulator')}
                />
              )}

              {currentView === 'simulator' && (
                <SimulatorView
                  onRunSimulation={handleSimulate}
                  findings={findings}
                  onReset={loadData}
                />
              )}

              {currentView === 'activity' && (
                <ActivityView />
              )}

              {currentView === 'settings' && (
                <SettingsView status={status} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
