'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 500

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport, size } = useThree()

  // Generate particle data
  const { positions, originalPositions, velocities, phases, sizes, depths } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const phases = new Float32Array(PARTICLE_COUNT)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const depths = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      // Spread particles across a wide area
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 15
      const z = (Math.random() - 0.5) * 8 // Depth for parallax effect

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      originalPositions[i3] = x
      originalPositions[i3 + 1] = y
      originalPositions[i3 + 2] = z

      // Random slow drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.003
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.003
      velocities[i3 + 2] = 0

      // Random phase for pulsing effect
      phases[i] = Math.random() * Math.PI * 2

      // Random sizes - smaller particles
      sizes[i] = Math.random() * 3 + 1.5

      // Store depth for parallax calculations
      depths[i] = z
    }

    return { positions, originalPositions, velocities, phases, sizes, depths }
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert to normalized device coordinates
      mouseRef.current.x = ((e.clientX / size.width) * 2 - 1) * (viewport.width / 2)
      mouseRef.current.y = -((e.clientY / size.height) * 2 - 1) * (viewport.height / 2)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [viewport.width, viewport.height, size.width, size.height])

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return

    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = positionAttr.array as Float32Array
    const sizeAttr = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute
    const sizeArray = sizeAttr.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      let x = posArray[i3]
      let y = posArray[i3 + 1]
      const z = posArray[i3 + 2]

      // Calculate distance to mouse (2D projection)
      const dx = x - mouseRef.current.x
      const dy = y - mouseRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Mouse repulsion - particles closer in z react more
      const depthFactor = 1 - (z + 4) / 8 // Closer particles (higher z) react more
      const influenceRadius = 2.5 * depthFactor
      const repelStrength = 0.08 * depthFactor

      if (dist < influenceRadius && dist > 0.01) {
        const force = (1 - dist / influenceRadius) * repelStrength
        const angle = Math.atan2(dy, dx)
        x += Math.cos(angle) * force
        y += Math.sin(angle) * force
      } else {
        // Subtle floating motion
        const floatX = Math.sin(time * 0.3 + phases[i]) * 0.015
        const floatY = Math.cos(time * 0.25 + phases[i] * 1.3) * 0.015

        // Return to original with drift
        const origX = originalPositions[i3]
        const origY = originalPositions[i3 + 1]

        x += (origX + floatX - x) * 0.02 + velocities[i3]
        y += (origY + floatY - y) * 0.02 + velocities[i3 + 1]
      }

      posArray[i3] = x
      posArray[i3 + 1] = y

      // Pulsing size effect
      const pulse = Math.sin(time * 1.2 + phases[i]) * 0.25 + 1
      sizeArray[i] = sizes[i] * pulse
    }

    positionAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  // Custom shader for glowing particles
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#c8c8c8') },
        uGlowColor: { value: new THREE.Color('#e0e0e0') },
      },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        varying float vDepth;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Size attenuation - closer particles appear larger
          gl_PointSize = size * (150.0 / -mvPosition.z);
          
          // Alpha based on depth - further particles more transparent
          vDepth = (position.z + 4.0) / 8.0;
          vAlpha = 0.08 + vDepth * 0.12;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying float vAlpha;
        varying float vDepth;
        
        void main() {
          // Create soft circular particle
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow falloff
          float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
          
          // Mix colors for subtle glow effect
          vec3 finalColor = mix(uColor, uGlowColor, smoothstep(0.4, 0.0, dist));
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
    </points>
  )
}

export function InteractiveCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
