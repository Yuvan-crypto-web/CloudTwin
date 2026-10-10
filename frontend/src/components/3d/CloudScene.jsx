import React, { useState, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { VolumetricCloud } from './VolumetricCloud'
import { TechnicalRings } from './TechnicalRings'
import { InfrastructureNode } from './InfrastructureNode'
import { OrbitConnections } from './OrbitConnections'
import { NodeDetailsDrawer } from './NodeDetailsDrawer'
import { RotateCcw, Play, Pause, ShieldAlert, Layers } from 'lucide-react'

export function CloudScene({ 
  resources = [], 
  findings = [], 
  onSimulateFix 
}) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showLinks, setShowLinks] = useState(true)
  const controlsRef = useRef()

  // Generate 8-12 orbiting infrastructure nodes around the cloud
  const { nodes, links } = useMemo(() => {
    // 10 key nodes representing multi-tier cloud infrastructure
    const baseNodes = [
      { id: 'bucket-research', name: 'research-documents-demo', type: 'bucket', angle: 0.2, radius: 3.8, y: 0.8, status: 'critical' },
      { id: 'fw-ssh', name: 'allow-ssh-from-anywhere-demo', type: 'firewall', angle: 0.8, radius: 4.3, y: -0.4, status: 'critical' },
      { id: 'vm-api', name: 'core-api-server-01', type: 'vm', angle: 1.4, radius: 3.9, y: 0.6, status: 'healthy' },
      { id: 'vpc-prod', name: 'production-vpc-demo', type: 'vpc', angle: 2.1, radius: 4.6, y: -0.7, status: 'neutral' },
      { id: 'bucket-backups', name: 'internal-backups-demo', type: 'bucket', angle: 2.8, radius: 4.1, y: 0.9, status: 'healthy' },
      { id: 'fw-web', name: 'allow-https-demo', type: 'firewall', angle: 3.4, radius: 3.7, y: -0.5, status: 'healthy' },
      { id: 'vm-db', name: 'postgres-db-primary', type: 'database', angle: 4.1, radius: 4.4, y: 0.4, status: 'warning' },
      { id: 'fw-rdp', name: 'allow-rdp-management-open', type: 'firewall', angle: 4.7, radius: 4.0, y: -0.6, status: 'critical' },
      { id: 'bucket-analytics', name: 'analytics-raw-pipeline', type: 'bucket', angle: 5.3, radius: 3.9, y: 0.7, status: 'warning' },
      { id: 'vm-bastion', name: 'bastion-gateway-edge', type: 'vm', angle: 5.9, radius: 4.5, y: -0.3, status: 'healthy' }
    ]

    const threatNames = new Set(findings.map(f => f.resource))
    const threatIds = new Set(findings.map(f => f.resource_id || f.id))

    const computedNodes = baseNodes.map(n => {
      const isFinding = threatNames.has(n.name) || threatIds.has(n.id) || n.status === 'critical'
      const isCritical = isFinding && (n.id === 'bucket-research' || n.id === 'fw-ssh' || n.id === 'fw-rdp')
      const isWarning = n.status === 'warning'
      const isHealthy = !isCritical && !isWarning

      const x = Math.cos(n.angle) * n.radius
      const z = Math.sin(n.angle) * n.radius * 0.75
      const y = n.y

      return {
        ...n,
        position: [x, y, z],
        isCritical,
        isWarning,
        isHealthy
      }
    })

    // Compute connection arcs (connecting nodes to the central cloud and adjacent layers)
    const computedLinks = []
    computedNodes.forEach((node, idx) => {
      // Connect to center cloud
      computedLinks.push({
        start: node.position,
        end: [0, 0, 0],
        isCritical: node.isCritical,
        isWarning: node.isWarning
      })

      // Connect to adjacent orbital neighbor
      if (idx % 2 === 0) {
        const nextNode = computedNodes[(idx + 1) % computedNodes.length]
        computedLinks.push({
          start: node.position,
          end: nextNode.position,
          isCritical: node.isCritical || nextNode.isCritical,
          isWarning: node.isWarning || nextNode.isWarning
        })
      }
    })

    return { nodes: computedNodes, links: computedLinks }
  }, [findings])

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const handleFocusRisks = () => {
    const criticalNode = nodes.find(n => n.isCritical)
    if (criticalNode && controlsRef.current) {
      const [x, y, z] = criticalNode.position
      controlsRef.current.target.set(x, y, z)
      controlsRef.current.object.position.set(x + 1.5, y + 1.2, z + 2.5)
      controlsRef.current.update()
      setSelectedNode(criticalNode)
    }
  }

  return (
    <div className="hero-3d-panel">
      {/* Top Overlay Banner & Scene Controls */}
      <div className="scene-overlay-top">
        <div className="scene-title-badge">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)' }} />
          <span>INTERACTIVE INFRASTRUCTURE MAP</span>
        </div>

        <div className="scene-controls-toolbar">
          <button 
            className="scene-ctrl-btn" 
            onClick={handleResetCamera}
            title="Reset 3D Perspective"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>

          <button 
            className={`scene-ctrl-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Orbital Rotation"
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
            <span>{autoRotate ? 'Orbit On' : 'Orbit Off'}</span>
          </button>

          <button 
            className="scene-ctrl-btn" 
            onClick={handleFocusRisks}
            style={{ color: 'var(--critical)', borderColor: 'rgba(255, 69, 103, 0.35)' }}
            title="Focus Critical Threat Vector"
          >
            <ShieldAlert size={12} />
            <span>Focus Risks</span>
          </button>

          <button 
            className={`scene-ctrl-btn ${showLinks ? 'active' : ''}`}
            onClick={() => setShowLinks(!showLinks)}
            title="Toggle Laser Data Lines"
          >
            <Layers size={12} />
            <span>Links</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 2.2, 8.2], fov: 42 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[8, 12, 10]} intensity={1.1} color="#D0E8FF" />
        <pointLight position={[0, 0, 0]} intensity={1.4} color="#00E5FF" distance={8} />
        <pointLight position={[-6, 4, -4]} intensity={0.9} color="#8B5CF6" distance={12} />
        <pointLight position={[6, -3, 5]} intensity={0.7} color="#3288FF" distance={10} />

        {/* Sparse Slow-moving Particle Stars */}
        <Stars radius={50} depth={20} count={600} factor={3} saturation={1} fade speed={0.6} />

        {/* Technical Rings & Planar Grid */}
        <TechnicalRings />

        {/* Translucent Luminous 3D Cloud Centerpiece */}
        <VolumetricCloud onClick={() => setSelectedNode(null)} />

        {/* Orbiting 3D Nodes */}
        {nodes.map((node) => (
          <InfrastructureNode
            key={node.id}
            node={node}
            position={node.position}
            isSelected={selectedNode?.id === node.id}
            onSelect={setSelectedNode}
            isCritical={node.isCritical}
            isWarning={node.isWarning}
            isHealthy={node.isHealthy}
          />
        ))}

        {/* Laser Orbit Links */}
        {showLinks && <OrbitConnections links={links} />}

        {/* OrbitControls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minDistance={4.2}
          maxDistance={14.0}
          maxPolarAngle={Math.PI / 1.95}
        />
      </Canvas>

      {/* Bottom Overlay Legend */}
      <div className="scene-overlay-bottom">
        <div>
          <span className="scene-legend-dot" style={{ background: 'var(--cyan)' }} />
          <span>Healthy</span>
        </div>
        <div>
          <span className="scene-legend-dot" style={{ background: 'var(--high)' }} />
          <span>Warning</span>
        </div>
        <div>
          <span className="scene-legend-dot" style={{ background: 'var(--critical)', boxShadow: '0 0 6px var(--critical)' }} />
          <span>Critical Risk</span>
        </div>
      </div>

      {/* Slide-Over Drawer on Node Select */}
      {selectedNode && (
        <NodeDetailsDrawer
          node={selectedNode}
          findings={findings}
          onClose={() => setSelectedNode(null)}
          onSimulateFix={onSimulateFix}
        />
      )}
    </div>
  )
}
