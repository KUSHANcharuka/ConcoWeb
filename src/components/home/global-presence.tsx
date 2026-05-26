"use client"

import { useRef, useState, Suspense, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import * as THREE from "three"
import { FileText, Users, TrendingDown, Clock } from "lucide-react"

const locations = [
  { name: "Al Habtoor Construction", city: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Keppel Land", city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Lendlease Projects", city: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Berkeley Group", city: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Turner Construction", city: "New York, USA", lat: 40.7128, lng: -74.006 },
  { name: "Shimizu Corporation", city: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Odebrecht", city: "Sao Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Hochtief", city: "Frankfurt, Germany", lat: 50.1109, lng: 8.6821 },
]

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return new THREE.Vector3(x, y, z)
}

interface PinMarkerProps {
  location: typeof locations[0]
  position: THREE.Vector3
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function PinMarker({ location, position, isHovered, onHover, onLeave }: PinMarkerProps) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(isHovered ? 1.5 : 1, isHovered ? 1.5 : 1, isHovered ? 1.5 : 1), 0.1)
    }
  })

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
    >
      {/* Pin marker */}
      <mesh>
        <coneGeometry args={[0.06, 0.15, 8]} />
        <meshPhongMaterial
          color={isHovered ? "#FCFF42" : "#D4A800"}
          emissive={isHovered ? "#F5C400" : "#C49000"}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Pin base circle */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshPhongMaterial
          color={isHovered ? "#FCFF42" : "#D4A800"}
          emissive={isHovered ? "#F5C400" : "#C49000"}
        />
      </mesh>

      {/* Tooltip */}
      {isHovered && (
        <Html
          center
          style={{
            transition: "all 0.2s",
            opacity: isHovered ? 1 : 0,
            transform: `scale(${isHovered ? 1 : 0.5})`,
          }}
        >
          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
            <p className="text-sm font-semibold text-foreground">{location.name}</p>
            <p className="text-xs text-muted-foreground">{location.city}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

interface GlobeProps {
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

function WorldGlobe({ hoveredIndex, setHoveredIndex }: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const continentsRef = useRef<THREE.Group>(null)
  const [continentsMesh, setContinentsMesh] = useState<THREE.Mesh | null>(null)

  useEffect(() => {
    // Create simplified continents using basic geometries
    const group = new THREE.Group()

    // Create continent shapes using parametric surface
    const geometry = new THREE.IcosahedronGeometry(1, 4)
    
    // Add noise to create landmass appearance
    const positionAttribute = geometry.getAttribute("position")
    const originalPositions = new Float32Array(positionAttribute.array as ArrayLike<number>)
    
    for (let i = 0; i < originalPositions.length; i += 3) {
      const x = originalPositions[i]
      const y = originalPositions[i + 1]
      const z = originalPositions[i + 2]
      
      // Create simple landmass distribution
      const noise = Math.sin(x * 3) * Math.cos(y * 2) * Math.sin(z * 2.5)
      const landValue = (noise + 1) / 2
      
      // Only show certain regions as land
      if (landValue > 0.4) {
        positionAttribute.setXYZ(
          i / 3,
          x * (1 + noise * 0.1),
          y * (1 + noise * 0.1),
          z * (1 + noise * 0.1)
        )
      }
    }
    
    positionAttribute.needsUpdate = true
    
    const material = new THREE.MeshPhongMaterial({
      color: "#b8a68f",
      emissive: "#8b7d6b",
      emissiveIntensity: 0.2,
      flatShading: true,
      wireframe: false,
      side: THREE.FrontSide,
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    group.add(mesh)
    setContinentsMesh(mesh)

    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [])

  useFrame((state) => {
    if (globeRef.current) {
      const rotation = state.clock.elapsedTime * 0.08
      globeRef.current.rotation.y = rotation
    }
  })

  return (
    <group ref={globeRef}>
      {/* World map globe with continents */}
      <mesh ref={continentsRef}>
        <icosahedronGeometry args={[1, 5]} />
        <meshPhongMaterial
          color="#c4a87d"
          emissive="#a0886d"
          emissiveIntensity={0.25}
          flatShading={true}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Ocean/atmosphere glow */}
      <mesh>
        <icosahedronGeometry args={[1.02, 5]} />
        <meshBasicMaterial
          color="#e8f1f5"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Location pins */}
      {locations.map((location, index) => {
        const position = latLngToVector3(location.lat, location.lng, 1.08)
        return (
          <PinMarker
            key={location.name}
            location={location}
            position={position}
            isHovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
          />
        )
      })}

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 3, 5]} intensity={0.8} />
    </group>
  )
}

const benefits = [
  {
    icon: FileText,
    title: "Paperwork reduced",
    value: "85%",
    description: "Less manual documentation",
  },
  {
    icon: Users,
    title: "Teams connected",
    value: "10K+",
    description: "Global users collaborating",
  },
  {
    icon: TrendingDown,
    title: "Cost overruns down",
    value: "45%",
    description: "Better budget control",
  },
  {
    icon: Clock,
    title: "Time saved weekly",
    value: "12hrs",
    description: "Per project manager",
  },
]

export function GlobalPresence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section ref={containerRef} className="py-24 px-6 bg-card/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Scale the team,<br />
              <span className="text-foreground">shrink the paperwork</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join construction leaders in 120+ countries who trust Concolabs to streamline their operations.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <benefit.icon className="w-5 h-5 text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground">{benefit.value}</div>
                  <div className="text-sm text-muted-foreground">{benefit.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - 3D Globe with World Map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-20" />
            <Canvas
              camera={{ position: [0, 0, 2.8], fov: 45 }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <WorldGlobe hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
              </Suspense>
            </Canvas>

            {/* Location List */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {locations.slice(0, 4).map((location, index) => (
                  <motion.button
                    key={location.city}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      hoveredIndex === index
                        ? "bg-primary text-black"
                        : "bg-card/80 text-muted-foreground border border-border hover:border-primary/50"
                    }`}
                  >
                    {location.city.split(",")[0]}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
