import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { HardDrive, Server, Network, Flame, Database, ShieldAlert, CheckCircle2 } from 'lucide-react'

export function InfrastructureNode({
  node,
  position,
  isSelected,
  onSelect,
  isCritical = false,
  isWarning = false,
  isHealthy = false
}) {
  const meshRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Floating micro-animation
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t * 1.6 + position[0] * 2) * 0.08
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.9
    }
  })

  // Determine node color token
  const nodeColor = isCritical 
    ? '#FF4567' 
    : isWarning 
    ? '#FF9F43' 
    : isHealthy 
    ? '#00E5FF' 
    : '#3288FF'

  const glowColor = isCritical ? '#FF4567' : isWarning ? '#FF9F43' : isHealthy ? '#00E5FF' : '#3288FF'

  return (
    <group position={position}>
      {/* Critical/Warning Danger Pulse Ring */}
      {(isCritical || isWarning) && (
        <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
          <meshBasicMaterial 
            color={isCritical ? '#FF4567' : '#FF9F43'} 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Main 3D Node Mesh */}
      <group
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        scale={isSelected ? 1.3 : hovered ? 1.18 : 1}
      >
        {/* Node Shape based on Resource Category */}
        {node.type === 'bucket' && (
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.55, 12]} />
            <meshStandardMaterial
              color="#0B1730"
              emissive={nodeColor}
              emissiveIntensity={hovered || isSelected ? 0.9 : 0.45}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )}

        {node.type === 'vm' && (
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.42, 0.55, 0.42]} />
            <meshStandardMaterial
              color="#0B1730"
              emissive={nodeColor}
              emissiveIntensity={hovered || isSelected ? 0.9 : 0.45}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        )}

        {node.type === 'firewall' && (
          <mesh position={[0, 0.2, 0]}>
            <octahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial
              color="#170A18"
              emissive={nodeColor}
              emissiveIntensity={hovered || isSelected ? 1.0 : 0.6}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        )}

        {node.type === 'vpc' && (
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.25, 6]} />
            <meshStandardMaterial
              color="#100C24"
              emissive={nodeColor}
              emissiveIntensity={hovered || isSelected ? 0.85 : 0.4}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        )}

        {node.type === 'subnet' && (
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.12, 8]} />
            <meshStandardMaterial
              color="#08142C"
              emissive={nodeColor}
              emissiveIntensity={0.35}
              metalness={0.7}
            />
          </mesh>
        )}

        {node.type === 'database' && (
          <group position={[0, 0.18, 0]}>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.14, 16]} />
              <meshStandardMaterial color="#0B1730" emissive={nodeColor} emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.14, 16]} />
              <meshStandardMaterial color="#0B1730" emissive={nodeColor} emissiveIntensity={0.5} />
            </mesh>
          </group>
        )}

        {/* Orbit Ring on Hover / Select */}
        <mesh ref={ringRef} position={[0, 0.15, 0]}>
          <torusGeometry args={[0.52, 0.015, 12, 32]} />
          <meshBasicMaterial 
            color={glowColor} 
            transparent 
            opacity={hovered || isSelected ? 0.95 : 0.35} 
          />
        </mesh>
      </group>

      {/* Precise HTML Billboard Label */}
      <Html
        position={[0, 0.85, 0]}
        center
        distanceFactor={11}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{
          background: isSelected 
            ? 'rgba(0, 229, 255, 0.95)' 
            : isCritical 
            ? 'rgba(255, 69, 103, 0.92)' 
            : hovered 
            ? 'rgba(17, 29, 52, 0.95)' 
            : 'rgba(8, 13, 27, 0.85)',
          color: isSelected ? '#050816' : '#F0F6FF',
          border: `1px solid ${isSelected ? '#00E5FF' : isCritical ? '#FF4567' : hovered ? 'rgba(0, 229, 255, 0.4)' : 'rgba(116, 160, 202, 0.25)'}`,
          borderRadius: '5px',
          padding: '3px 7px',
          fontSize: '9.5px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          transform: isSelected ? 'scale(1.08)' : 'scale(1)'
        }}>
          {node.type === 'bucket' && <HardDrive size={10} />}
          {node.type === 'vm' && <Server size={10} />}
          {node.type === 'firewall' && <Flame size={10} />}
          {node.type === 'vpc' && <Network size={10} />}
          {node.type === 'database' && <Database size={10} />}
          <span>{node.name}</span>
          {isCritical && (
            <span style={{
              background: '#000',
              color: '#FF4567',
              padding: '1px 3px',
              borderRadius: '3px',
              fontSize: '8px',
              fontWeight: 700
            }}>
              CRITICAL
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}
