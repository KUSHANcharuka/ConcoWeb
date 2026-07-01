"use client"

import { Suspense, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import * as THREE from "three"

type Location = {
  country: string
  city: string
  lat: number
  lng: number
}

type GeoPoint = [number, number]

const locations: Location[] = [
  { country: "Sri Lanka", city: "Colombo", lat: 6.9271, lng: 79.8612 },
  { country: "India", city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { country: "Singapore", city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { country: "Australia", city: "Sydney", lat: -33.8688, lng: 151.2093 },
  { country: "New Zealand", city: "Auckland", lat: -36.8485, lng: 174.7633 },
  { country: "UK", city: "London", lat: 51.5074, lng: -0.1278 },
  { country: "UAE", city: "Dubai", lat: 25.2048, lng: 55.2708 },
  { country: "Bahrain", city: "Manama", lat: 26.2285, lng: 50.5860 },
  { country: "Qatar", city: "Doha", lat: 25.2854, lng: 51.5310 },
  { country: "Nigeria", city: "Lagos", lat: 6.5244, lng: 3.3792 },
]

// Coarse land polygons (lng, lat) used to build a dotted world silhouette without external assets.
const LAND_POLYGONS: GeoPoint[][] = [
  // North America
  [
    [-168, 15], [-160, 36], [-145, 58], [-125, 72], [-94, 73], [-60, 52], [-82, 24], [-105, 14], [-135, 10], [-168, 15],
  ],
  // South America
  [[-82, 13], [-70, 8], [-55, -8], [-52, -28], [-62, -55], [-78, -42], [-82, -5], [-82, 13]],
  // Africa
  [[-18, 36], [4, 37], [20, 33], [34, 20], [51, 9], [43, -20], [30, -35], [8, -34], [-8, -7], [-18, 12], [-18, 36]],
  // Europe + Asia
  [
    [-10, 35], [5, 44], [22, 49], [45, 54], [70, 58], [96, 74], [136, 58], [160, 52], [178, 40], [168, 18], [136, 8], [104, 6], [70, 20],
    [52, 27], [42, 37], [28, 40], [16, 43], [3, 41], [-10, 35],
  ],
  // Australia
  [[112, -11], [130, -10], [151, -23], [151, -39], [131, -44], [114, -34], [112, -11]],
  // Greenland
  [[-74, 58], [-60, 76], [-28, 82], [-16, 68], [-38, 58], [-74, 58]],
  // Japan / Korea
  [[126, 31], [131, 43], [146, 45], [143, 34], [133, 30], [126, 31]],
  // UK + Ireland
  [[-11, 50], [-5, 58], [2, 58], [2, 51], [-8, 50], [-11, 50]],
]

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return new THREE.Vector3(x, y, z)
}

function isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]) {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi
    if (intersects) inside = !inside
  }

  return inside
}

function isLand(lat: number, lng: number) {
  return LAND_POLYGONS.some((polygon) => isPointInPolygon([lng, lat], polygon))
}

function GlobeLocationMarker({ location }: { location: Location }) {
  const groupRef = useRef<THREE.Group>(null)
  const [isVisible, setIsVisible] = useState(false)
  const worldPos = useMemo(() => new THREE.Vector3(), [])
  const position = useMemo(() => latLngToVector3(location.lat, location.lng, 1.02), [location.lat, location.lng])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.getWorldPosition(worldPos)
    const nextVisible = worldPos.z > 0.03
    setIsVisible((prev) => (prev === nextVisible ? prev : nextVisible))
  })

  return (
    <group ref={groupRef} position={position}>
      {isVisible && (
        <mesh>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#1f1f1f" />
        </mesh>
      )}
      {isVisible && (
        <Html center style={{ transform: "translate3d(0, -12px, 0)", pointerEvents: "none" }}>
          <div
            className="whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 shadow-sm"
            style={{ fontSize: "11px", lineHeight: 1.1 }}
          >
            <div className="font-semibold text-zinc-900">{location.country}</div>
            <div className="mt-0.5 text-[10px] text-zinc-500">{location.city}</div>
          </div>
        </Html>
      )}
    </group>
  )
}

export function RotatingDotGlobe() {
  const globeRef = useRef<THREE.Group>(null)

  const dotPositions = useMemo(() => {
    const positions: number[] = []
    const radius = 1.005

    for (let lat = -88; lat <= 88; lat += 2.8) {
      const latRadius = Math.cos((Math.abs(lat) * Math.PI) / 180) * radius
      const circumference = latRadius * Math.PI * 2
      const dotsForLat = Math.max(12, Math.floor(circumference * 32))

      for (let i = 0; i < dotsForLat; i++) {
        const lng = -180 + (i * 360) / dotsForLat
        if (!isLand(lat, lng)) continue

        const seed = Math.sin((lat + 90) * 12.9898 + lng * 78.233) * 43758.5453
        const fract = seed - Math.floor(seed)
        const jitterLat = lat + (fract - 0.5) * 0.35
        const jitterLng = lng + (((fract * 1.618) % 1) - 0.5) * 0.35
        const v = latLngToVector3(jitterLat, jitterLng, radius)
        positions.push(v.x, v.y, v.z)
      }
    }

    return new Float32Array(positions)
  }, [])

  useFrame((_, delta) => {
    if (!globeRef.current) return
    globeRef.current.rotation.y += delta * 0.2
  })

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1, 80, 80]} />
        <meshBasicMaterial color="#d9d9d9" transparent opacity={0.35} />
      </mesh>

      <mesh renderOrder={1}>
        <sphereGeometry args={[1, 80, 80]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>

      <points renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#2f2f2f" size={1.8} sizeAttenuation={false} depthWrite={false} />
      </points>

      <mesh scale={1.11}>
        <sphereGeometry args={[1, 72, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {locations.map((location) => (
        <GlobeLocationMarker key={location.country} location={location} />
      ))}
    </group>
  )
}
