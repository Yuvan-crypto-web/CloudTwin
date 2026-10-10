import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export function DataFlowLinks({ links = [] }) {
  const particlesRef = useRef([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    particlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return
      const link = links[idx % links.length]
      if (!link) return
      const speed = 0.4 + (idx % 3) * 0.15
      const progress = (t * speed + idx * 0.3) % 1
      
      const start = new THREE.Vector3(...link.start)
      const end = new THREE.Vector3(...link.end)
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.max(start.y, end.y) + 0.8,
        (start.z + end.z) / 2
      )

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const pt = curve.getPoint(progress)
      mesh.position.copy(pt)
    })
  })

  return (
    <group>
      {links.map((link, idx) => {
        const start = new THREE.Vector3(...link.start)
        const end = new THREE.Vector3(...link.end)
        const mid = new THREE.Vector3(
          (start.x + end.x) / 2,
          Math.max(start.y, end.y) + 0.8,
          (start.z + end.z) / 2
        )
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        const points = curve.getPoints(24)

        const isThreatLink = link.isThreat
        const color = isThreatLink ? '#ff3366' : '#00e5ff'

        return (
          <group key={`link-${idx}`}>
            {/* Base Glowing Arc */}
            <Line
              points={points}
              color={color}
              lineWidth={isThreatLink ? 2.5 : 1.2}
              dashed={false}
              transparent
              opacity={isThreatLink ? 0.75 : 0.4}
            />

            {/* Traveling Data Packet Photon */}
            <mesh ref={(el) => (particlesRef.current[idx] = el)}>
              <sphereGeometry args={[isThreatLink ? 0.12 : 0.08, 12, 12]} />
              <meshBasicMaterial 
                color={isThreatLink ? '#ff0055' : '#ffffff'} 
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
