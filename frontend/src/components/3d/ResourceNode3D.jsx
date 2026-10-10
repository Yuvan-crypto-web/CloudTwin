import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { Shield, HardDrive, Network, Server, Flame } from 'lucide-react'

export function ResourceNode3D({ 
  node, 
  position, 
  isSelected, 
  onSelect,
  isThreat = false,
  threatSeverity = 'HIGH'
}) {
  const meshRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Subtle floating animation
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.12
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8
      ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2
    }
  })

  // Color selection based on type & threat state
  const isHighRisk = isThreat && (threatSeverity === 'HIGH' || threatSeverity === 'CRITICAL')
  const baseColor = isHighRisk 
    ? '#ff3366' 
    : isThreat 
    ? '#ffb703' 
    : node.type === 'bucket' 
    ? '#00f2fe' 
    : node.type === 'firewall' 
    ? '#ff758c' 
    : node.type === 'vpc' 
    ? '#9d4edd' 
    : node.type === 'vm' 
    ? '#00f5a0' 
    : '#38bdf8'

  const glowColor = isHighRisk ? '#ff0055' : baseColor

  return (
    <group position={position}>
      {/* Blast Radius Warning Pulse for Threatened Nodes */}
      {isHighRisk && (
        <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial 
            color="#ff3366" 
            transparent 
            opacity={0.65} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Main 3D Geometry based on resource type */}
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
        scale={isSelected ? 1.25 : hovered ? 1.15 : 1}
      >
        {/* Hologram Base Plate */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.7, 0.8, 0.08, 6]} />
          <meshStandardMaterial 
            color="#09132b" 
            emissive={baseColor} 
            emissiveIntensity={0.25}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Dynamic shape depending on resource type */}
        {node.type === 'bucket' && (
          // Cyber Data Vault / Cylinder
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.9, 16]} />
            <meshStandardMaterial 
              color="#0d1f3d" 
              emissive={baseColor}
              emissiveIntensity={hovered || isSelected ? 0.9 : 0.4}
              metalness={0.9} 
              roughness={0.2}
            />
          </mesh>
        )}

        {node.type === 'firewall' && (
          // Firewall Laser Gate / Octahedron
          <mesh position={[0, 0.3, 0]}>
            <octahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial 
              color="#2a0d1b" 
              emissive={baseColor}
              emissiveIntensity={hovered || isSelected ? 1.0 : 0.6}
              metalness={0.7} 
              roughness={0.2}
              wireframe={false}
            />
          </mesh>
        )}

        {node.type === 'vpc' && (
          // Network Core Hub / Hex Prism
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.45, 6]} />
            <meshStandardMaterial 
              color="#1a0f30" 
              emissive={baseColor}
              emissiveIntensity={hovered || isSelected ? 0.85 : 0.35}
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
        )}

        {node.type === 'subnet' && (
          // Subnet Zone / Flat Disk
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.18, 8]} />
            <meshStandardMaterial 
              color="#0f172a" 
              emissive={baseColor}
              emissiveIntensity={0.3}
              metalness={0.6}
            />
          </mesh>
        )}

        {node.type === 'vm' && (
          // Compute Instance Tower / Box
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.6, 0.9, 0.6]} />
            <meshStandardMaterial 
              color="#06221c" 
              emissive={baseColor}
              emissiveIntensity={hovered || isSelected ? 0.9 : 0.4}
              metalness={0.8} 
              roughness={0.2}
            />
          </mesh>
        )}

        {/* Orbiting Tech Ring */}
        <mesh ref={ringRef} position={[0, 0.25, 0]}>
          <torusGeometry args={[0.75, 0.02, 16, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={hovered || isSelected ? 0.9 : 0.4} />
        </mesh>
      </group>

      {/* 3D Billboard Label */}
      <Html
        position={[0, 1.25, 0]}
        center
        distanceFactor={13}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{
          background: isHighRisk 
            ? 'rgba(255, 51, 102, 0.92)' 
            : hovered || isSelected 
            ? 'rgba(0, 229, 255, 0.92)' 
            : 'rgba(9, 14, 31, 0.88)',
          color: isHighRisk || (hovered || isSelected) ? '#050b1a' : '#f1f5f9',
          border: `1px solid ${isHighRisk ? '#ff3366' : hovered || isSelected ? '#00f2fe' : 'rgba(79, 114, 180, 0.4)'}`,
          borderRadius: '8px',
          padding: '4px 8px',
          fontSize: '10.5px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          transform: isSelected ? 'scale(1.1)' : 'scale(1)'
        }}>
          {node.type === 'bucket' && <HardDrive size={11} />}
          {node.type === 'firewall' && <Flame size={11} />}
          {node.type === 'vpc' && <Network size={11} />}
          {node.type === 'subnet' && <Shield size={11} />}
          {node.type === 'vm' && <Server size={11} />}
          <span>{node.name}</span>
          {isHighRisk && (
            <span style={{
              background: '#000',
              color: '#ff3366',
              padding: '1px 4px',
              borderRadius: '4px',
              fontSize: '8.5px'
            }}>
              RISK
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}
