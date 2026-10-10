import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export function OrbitConnections({ links = [] }) {
  const particlesRef = useRef([])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    particlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return
      const link = links[idx % links.length]
      if (!link) return
      const speed = 0.35 + (idx % 4) * 0.1
      const progress = (t * speed + idx * 0.25) % 1
      
      const start = new THREE.Vector3(...link.start)
      const end = new THREE.Vector3(...link.end)
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.max(start.y, end.y) + 0.4,
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
          Math.max(start.y, end.y) + 0.4,
          (start.z + end.z) / 2
        )
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        const points = curve.getPoints(20)

        const isCritical = link.isCritical
        const isWarning = link.isWarning
        const color = isCritical ? '#FF4567' : isWarning ? '#FF9F43' : '#00E5FF'

        return (
          <group key={`orbit-link-${idx}`}>
            {/* Fine Laser Line */}
            <Line
              points={points}
              color={color}
              lineWidth={isCritical ? 2.0 : 1.0}
              transparent
              opacity={isCritical ? 0.65 : 0.28}
            />

            {/* Light Photon Traversing the Connection */}
            <mesh ref={(el) => (particlesRef.current[idx] = el)}>
              <sphereGeometry args={[isCritical ? 0.08 : 0.05, 10, 10]} />
              <meshBasicMaterial 
                color={isCritical ? '#FF4567' : '#F0F6FF'} 
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
