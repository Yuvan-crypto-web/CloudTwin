import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Luminous 3D Holographic Cloud
 * Constructed from smoothly intersecting volumetric spheres with layered cyan-blue
 * emissive lighting, internal core glow, and restrained violet rim reflections.
 */
export function VolumetricCloud({ isHovered = false, onClick }) {
  const groupRef = useRef()
  const coreGlowRef = useRef()
  const rimGlowRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Gentle floating breathing motion
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08
    }
    if (coreGlowRef.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.05
      coreGlowRef.current.scale.set(pulse, pulse, pulse)
    }
    if (rimGlowRef.current) {
      rimGlowRef.current.rotation.z = t * 0.2
    }
  })

  // Cluster of spheres forming the organic cloud puff shape
  const cloudSpheres = [
    { pos: [0, 0, 0], scale: [1.35, 1.1, 1.15] },
    { pos: [-0.95, -0.15, 0.1], scale: [0.95, 0.85, 0.9] },
    { pos: [0.95, -0.1, -0.1], scale: [0.92, 0.82, 0.88] },
    { pos: [-0.5, 0.45, -0.15], scale: [0.9, 0.85, 0.85] },
    { pos: [0.45, 0.5, 0.1], scale: [0.95, 0.9, 0.9] },
    { pos: [0, -0.35, 0.25], scale: [1.1, 0.75, 0.85] },
    { pos: [-0.3, -0.2, -0.4], scale: [0.85, 0.7, 0.8] },
    { pos: [0.35, -0.15, -0.35], scale: [0.8, 0.7, 0.75] }
  ]

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Soft Cyan Internal Core Glow */}
      <mesh ref={coreGlowRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial 
          color="#00E5FF" 
          transparent 
          opacity={0.12} 
          side={THREE.BackSide} 
        />
      </mesh>

      {/* Layered Translucent Cloud Puffs */}
      {cloudSpheres.map((sphere, idx) => (
        <mesh key={idx} position={sphere.pos} scale={sphere.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#081530"
            emissive="#00E5FF"
            emissiveIntensity={isHovered ? 0.45 : 0.28}
            roughness={0.2}
            metalness={0.1}
            transmission={0.88}
            thickness={1.5}
            transparent={true}
            opacity={0.78}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            ior={1.33}
          />
        </mesh>
      ))}

      {/* Outer Restrained Violet Rim Shield */}
      <mesh ref={rimGlowRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.18}
          transparent={true}
          opacity={0.06}
          side={THREE.BackSide}
          wireframe={false}
        />
      </mesh>
    </group>
  )
}
