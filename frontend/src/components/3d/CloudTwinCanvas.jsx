import React, { useMemo, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { ResourceNode3D } from './ResourceNode3D'
import { DataFlowLinks } from './DataFlowLinks'
import { SceneControls } from './SceneControls'
import { NodeDetailModal } from './NodeDetailModal'
import { Shield, Sparkles } from 'lucide-react'

// Cyber Grid Plane Component
function CyberGrid() {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Radial Grid helper */}
      <gridHelper args={[32, 32, '#00e5ff', '#1e293b']} position={[0, 0, 0]} />
      
      {/* Outer Holographic Glow Boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[14, 15.5, 64]} />
        <meshBasicMaterial color="#9d4edd" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <circleGeometry args={[16, 64]} />
        <meshBasicMaterial color="#060b1c" />
      </mesh>
    </group>
  )
}

export function CloudTwinCanvas({ 
  resources = [], 
  findings = [], 
  onNavigateToSimulator 
}) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [showLinks, setShowLinks] = useState(true)
  const controlsRef = useRef()

  // Generate 3D topological positioning for resources
  const { nodeMap, nodesList, linksList } = useMemo(() => {
    const list = []
    const map = new Map()
    const links = []

    // Group items by category
    const vpcs = resources.filter(r => r.self_link || (r.id || '').startsWith('vpc-') || r.type === 'vpc')
    const subnets = resources.filter(r => r.region || (r.id || '').startsWith('subnet-') || r.type === 'subnet')
    const buckets = resources.filter(r => r.public_principals !== undefined || r.type === 'bucket')
    const firewalls = resources.filter(r => r.source_ranges !== undefined || r.type === 'firewall')
    const vms = resources.filter(r => (r.id || '').startsWith('vm-') || r.machine_type || r.type === 'vm')

    // Find threat IDs
    const threatResourceNames = new Set(findings.map(f => f.resource))
    const threatResourceIds = new Set(findings.map(f => f.resource_id))

    // Position VPCs at center / inner ring
    vpcs.forEach((vpc, idx) => {
      const angle = (idx / Math.max(1, vpcs.length)) * Math.PI * 2
      const radius = 2.2
      const pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      const item = {
        ...vpc,
        type: 'vpc',
        position: pos,
        isThreat: threatResourceNames.has(vpc.name) || threatResourceIds.has(vpc.id)
      }
      list.push(item)
      map.set(vpc.name, item)
      map.set(vpc.id, item)
    })

    // Position Subnets in middle ring
    subnets.forEach((subnet, idx) => {
      const angle = ((idx + 0.5) / Math.max(1, subnets.length)) * Math.PI * 2
      const radius = 5.2
      const pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      const item = {
        ...subnet,
        type: 'subnet',
        position: pos,
        isThreat: threatResourceNames.has(subnet.name) || threatResourceIds.has(subnet.id)
      }
      list.push(item)
      map.set(subnet.name, item)
      map.set(subnet.id, item)

      // Connect to parent VPC if matched
      if (subnet.network && map.has(subnet.network)) {
        links.push({
          start: map.get(subnet.network).position,
          end: pos,
          isThreat: false
        })
      }
    })

    // Position Compute VMs & Storage Buckets in outer ring
    buckets.forEach((bucket, idx) => {
      const angle = ((idx + 0.2) / Math.max(1, buckets.length)) * Math.PI - (Math.PI / 2)
      const radius = 8.5
      const pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      const isThreat = threatResourceNames.has(bucket.name) || threatResourceIds.has(bucket.id)
      const item = {
        ...bucket,
        type: 'bucket',
        position: pos,
        isThreat
      }
      list.push(item)
      map.set(bucket.name, item)
      map.set(bucket.id, item)

      // Connect bucket to nearest subnet or VPC
      const target = subnets[0] || vpcs[0]
      if (target && map.has(target.name)) {
        links.push({
          start: map.get(target.name).position,
          end: pos,
          isThreat
        })
      }
    })

    // Position Firewalls as sentinel towers on perimeter
    firewalls.forEach((fw, idx) => {
      const angle = Math.PI / 2 + ((idx + 0.5) / Math.max(1, firewalls.length)) * Math.PI
      const radius = 8.8
      const pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      const isThreat = threatResourceNames.has(fw.name) || threatResourceIds.has(fw.id)
      const item = {
        ...fw,
        type: 'firewall',
        position: pos,
        isThreat
      }
      list.push(item)
      map.set(fw.name, item)
      map.set(fw.id, item)

      // Connect firewall to VPC
      if (fw.network && map.has(fw.network)) {
        links.push({
          start: map.get(fw.network).position,
          end: pos,
          isThreat
        })
      }
    })

    // Position VMs
    vms.forEach((vm, idx) => {
      const angle = ((idx + 0.8) / Math.max(1, vms.length)) * Math.PI * 2
      const radius = 6.8
      const pos = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      const item = {
        ...vm,
        type: 'vm',
        position: pos,
        isThreat: threatResourceNames.has(vm.name) || threatResourceIds.has(vm.id)
      }
      list.push(item)
      map.set(vm.name, item)
      map.set(vm.id, item)

      // Connect VM to Subnet
      if (vm.subnet && map.has(vm.subnet)) {
        links.push({
          start: map.get(vm.subnet).position,
          end: pos,
          isThreat: false
        })
      }
    })

    return { nodeMap: map, nodesList: list, linksList: links }
  }, [resources, findings])

  // Camera presets
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const handleTopDownView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 18, 0.001)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }

  const handleFocusThreats = () => {
    const firstThreat = nodesList.find(n => n.isThreat)
    if (firstThreat && controlsRef.current) {
      const [x, y, z] = firstThreat.position
      controlsRef.current.target.set(x, y, z)
      controlsRef.current.object.position.set(x + 3, y + 4, z + 5)
      controlsRef.current.update()
      setSelectedNode(firstThreat)
    }
  }

  return (
    <div className="scene-view-card">
      {/* Scene HUD Header */}
      <div className="scene-overlay-hud">
        <div className="scene-hud-left">
          <div className="scene-hud-title">
            <Shield size={16} color="var(--cyan-primary)" />
            <span>Topological Digital Twin 3D</span>
          </div>
          <div className="scene-hud-subtitle">
            {nodesList.length} Active Nodes · Real-time Ingress Graph
          </div>
        </div>

        {/* Scene Control Toolbar */}
        <SceneControls
          onResetCamera={handleResetCamera}
          onTopDownView={handleTopDownView}
          onFocusThreats={handleFocusThreats}
          showLinks={showLinks}
          onToggleLinks={() => setShowLinks(!showLinks)}
          threatCount={findings.length}
        />
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 9, 14], fov: 42 }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 15]} intensity={1.5} color="#dbeafe" />
        <pointLight position={[-10, 10, -10]} intensity={1.2} color="#00e5ff" />
        <pointLight position={[10, 5, 10]} intensity={1.0} color="#9d4edd" />

        {/* Background Cyber Starfield */}
        <Stars radius={60} depth={30} count={1200} factor={4} saturation={1} fade speed={1.2} />

        {/* Cyber Holographic Grid */}
        <CyberGrid />

        {/* 3D Nodes */}
        {nodesList.map((node) => (
          <ResourceNode3D
            key={node.id || node.name}
            node={node}
            position={node.position}
            isSelected={selectedNode?.id === node.id}
            onSelect={setSelectedNode}
            isThreat={node.isThreat}
            threatSeverity={findings.find(f => f.resource === node.name || f.resource_id === node.id)?.severity || 'HIGH'}
          />
        ))}

        {/* Animated Laser Data Links */}
        {showLinks && <DataFlowLinks links={linksList} />}

        {/* Smooth Interactive Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={4}
          maxDistance={28}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>

      {/* Legend Footer */}
      <div className="scene-legend-bar">
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#9d4edd' }} />
          <span>VPC Core</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#38bdf8' }} />
          <span>Subnet</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#00f5a0' }} />
          <span>Compute VM</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#00f2fe' }} />
          <span>Cloud Storage</span>
        </div>
        <div className="legend-item">
          <span className="legend-color-dot" style={{ background: '#ff758c' }} />
          <span>Firewall</span>
        </div>
        {findings.length > 0 && (
          <div className="legend-item" style={{ color: 'var(--crimson-threat)' }}>
            <span className="legend-color-dot" style={{ background: '#ff3366', boxShadow: '0 0 8px #ff3366' }} />
            <span>Active Risk ({findings.length})</span>
          </div>
        )}
      </div>

      {/* Selected Node Deep-dive Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          findings={findings}
          onClose={() => setSelectedNode(null)}
          onTestRemediation={onNavigateToSimulator}
        />
      )}
    </div>
  )
}
