import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function TechnicalRings() {
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.05
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.03
    }
  })

  return (
    <group position={[0, -0.2, 0]}>
      {/* Primary Technical Orbital Ring */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[4.2, 4.25, 64]} />
        <meshBasicMaterial 
          color="#00E5FF" 
          transparent 
          opacity={0.18} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Outer Dashed Orbit Ring */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[5.6, 5.64, 64]} />
        <meshBasicMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={0.14} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Subtle Planar Grid on Ground */}
      <gridHelper 
        args={[24, 24, '#00E5FF', '#111D36']} 
        position={[0, -2.2, 0]} 
      />
    </group>
  )
}
