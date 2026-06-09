"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── Individual 3D Step Objects ─── */

function PencilSketch({ active, onClick }: { active: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (active ? 0.8 : 0.3);
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      const scale = hovered ? 1.15 : active ? 1.05 : 1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* Pencil body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial color={active ? "#facc15" : "#a1a1aa"} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Pencil tip */}
      <mesh position={[0.42, 0.42, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshStandardMaterial color={active ? "#fef08a" : "#d4d4d8"} />
      </mesh>
      {/* Eraser */}
      <mesh position={[-0.42, -0.42, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#f87171" />
      </mesh>
      {/* Sketch lines floating around */}
      {active && (
        <>
          <mesh position={[0.6, 0.6, 0.2]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.4, 0.02, 0.02]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.7, 0.5, -0.1]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.3, 0.02, 0.02]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.5, 0.7, 0.1]} rotation={[0, 0, 0.8]}>
            <boxGeometry args={[0.25, 0.02, 0.02]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}

function AIBrain({ active, onClick }: { active: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (active ? 0.6 : 0.2);
      const scale = hovered ? 1.15 : active ? 1.05 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2;
      const r = 0.35 + Math.random() * 0.15;
      positions.push([Math.cos(theta) * r, Math.sin(theta) * r, (Math.random() - 0.5) * 0.3]);
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef} onClick={onClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* Central sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshDistortMaterial
          color={active ? "#a78bfa" : "#52525b"}
          speed={2}
          distort={active ? 0.4 : 0.15}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {/* Neural network nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={active ? "#c4b5fd" : "#71717a"}
            emissive={active ? "#a78bfa" : "#000000"}
            emissiveIntensity={active ? 0.8 : 0}
          />
        </mesh>
      ))}
      {/* Connection lines when active */}
      {active && nodes.map((pos, i) => (
        <mesh key={`line-${i}`} position={[pos[0] / 2, pos[1] / 2, pos[2] / 2]}>
          <boxGeometry args={[0.01, 0.01, Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2)]} />
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function CADFile({ active, onClick }: { active: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (active ? 0.5 : 0.15);
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.0015) * 0.08;
      const scale = hovered ? 1.15 : active ? 1.05 : 1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* File body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.05]} />
        <meshStandardMaterial color={active ? "#34d399" : "#52525b"} metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Fold corner */}
      <mesh position={[0.22, 0.32, 0.03]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.2, 0.2, 0.04]} />
        <meshStandardMaterial color={active ? "#6ee7b7" : "#71717a"} />
      </mesh>
      {/* CAD lines on file */}
      {[0.2, 0, -0.2].map((y, i) => (
        <mesh key={i} position={[0, y - 0.05, 0.03]}>
          <boxGeometry args={[0.5, 0.02, 0.01]} />
          <meshStandardMaterial
            color={active ? "#a7f3d0" : "#a1a1aa"}
            emissive={active ? "#34d399" : "#000000"}
            emissiveIntensity={active ? 0.4 : 0}
          />
        </mesh>
      ))}
      {/* DWG label glow */}
      {active && (
        <mesh position={[0, 0.35, 0.04]}>
          <boxGeometry args={[0.25, 0.1, 0.01]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function OutputBuilding({ active, onClick }: { active: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (active ? 0.4 : 0.1);
      const scale = hovered ? 1.15 : active ? 1.05 : 1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      {/* Base */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.5]} />
        <meshStandardMaterial color={active ? "#facc15" : "#52525b"} metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Main tower */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.35, 0.65, 0.35]} />
        <meshStandardMaterial color={active ? "#fbbf24" : "#71717a"} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Crane arm */}
      <mesh position={[0.25, 0.55, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.04]} />
        <meshStandardMaterial color={active ? "#f59e0b" : "#a1a1aa"} />
      </mesh>
      {/* Crane vertical */}
      <mesh position={[0.05, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.04]} />
        <meshStandardMaterial color={active ? "#f59e0b" : "#a1a1aa"} />
      </mesh>
      {/* Output arrow when active */}
      {active && (
        <mesh position={[0.55, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.06, 0.15, 8]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1} />
        </mesh>
      )}
    </group>
  );
}

/* ─── Animated Connection Line ─── */

function ConnectionLine({ start, end, active }: { start: [number, number, number]; end: [number, number, number]; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current && active) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
    }
  });

  const midPoint = useMemo(() => [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ] as [number, number, number], [start, end]);

  const distance = useMemo(() => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const dz = end[2] - start[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }, [start, end]);

  const rotation = useMemo(() => {
    const dir = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const euler = new THREE.Euler().setFromQuaternion(quat);
    return [euler.x, euler.y, euler.z] as [number, number, number];
  }, [start, end]);

  return (
    <mesh ref={ref} position={midPoint} rotation={rotation}>
      <cylinderGeometry args={[0.015, 0.015, distance, 8]} />
      <meshStandardMaterial
        color={active ? "#a78bfa" : "#3f3f46"}
        emissive={active ? "#a78bfa" : "#000000"}
        emissiveIntensity={active ? 0.5 : 0}
        transparent
        opacity={active ? 1 : 0.4}
      />
    </mesh>
  );
}

/* ─── Floating Particles ─── */

function Particles({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(150);
    for (let i = 0; i < 150; i++) {
      arr[i] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current && active) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#a78bfa" transparent opacity={active ? 0.6 : 0.1} sizeAttenuation />
    </points>
  );
}

/* ─── Main Scene ─── */

function Scene({ activeStep, onStepClick }: { activeStep: number; onStepClick: (step: number) => void }) {
  const steps = [
    { pos: [-2.4, 0, 0] as [number, number, number], component: PencilSketch },
    { pos: [-0.8, 0, 0] as [number, number, number], component: AIBrain },
    { pos: [0.8, 0, 0] as [number, number, number], component: CADFile },
    { pos: [2.4, 0, 0] as [number, number, number], component: OutputBuilding },
  ];

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[3, -2, 3]} intensity={0.3} color="#facc15" />

      <Particles active={activeStep >= 0} />

      {steps.map((step, i) => {
        const StepComponent = step.component;
        return (
          <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={step.pos}>
              <StepComponent active={activeStep === i} onClick={() => onStepClick(i)} />
            </group>
          </Float>
        );
      })}

      {/* Connection lines */}
      <ConnectionLine start={[-1.8, 0, 0]} end={[-1.4, 0, 0]} active={activeStep >= 1} />
      <ConnectionLine start={[-0.2, 0, 0]} end={[0.2, 0, 0]} active={activeStep >= 2} />
      <ConnectionLine start={[1.4, 0, 0]} end={[1.8, 0, 0]} active={activeStep >= 3} />
    </>
  );
}

/* ─── Exported Component ─── */

export function WorkflowScene() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { step: "1", title: "Hand Sketch", desc: "Photograph or scan hand-drawn sketch" },
    { step: "2", title: "Hand Drawn to AutoCAD", desc: "AI analyzes and produces clean CAD vector" },
    { step: "3", title: "Clean CAD File", desc: "DWG/DXF ready for structural modelling" },
    { step: "4", title: "Output", desc: "Feeds into Auto Conversion or Revit workflows" },
  ];

  return (
    <div className="w-full">
      {/* 3D Canvas */}
      <div className="h-[350px] md:h-[400px] w-full cursor-pointer rounded-2xl overflow-hidden mb-12">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene activeStep={activeStep} onStepClick={setActiveStep} />
        </Canvas>
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {steps.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`relative text-center p-4 rounded-2xl transition-all duration-500 cursor-pointer group ${
              activeStep === i
                ? "bg-zinc-800/80 border border-primary/30 shadow-lg shadow-primary/10"
                : "bg-transparent border border-transparent hover:bg-zinc-800/40 hover:border-zinc-700/50"
            }`}
          >
            {/* Active indicator dot */}
            <div
              className={`w-2 h-2 rounded-full mx-auto mb-3 transition-all duration-300 ${
                activeStep === i ? "bg-primary shadow-lg shadow-primary/50" : "bg-zinc-600 group-hover:bg-zinc-500"
              }`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block mb-1 transition-colors duration-300 ${
                activeStep === i ? "text-primary" : "text-zinc-500 group-hover:text-zinc-400"
              }`}
            >
              Step {item.step}
            </span>
            <h4
              className={`font-bold text-sm md:text-lg transition-colors duration-300 ${
                activeStep === i ? "text-white" : "text-zinc-300 group-hover:text-white"
              }`}
            >
              {item.title}
            </h4>
            <p
              className={`text-xs md:text-sm mt-1 transition-colors duration-300 ${
                activeStep === i ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"
              }`}
            >
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Auto-advance hint */}
      <p className="text-center text-xs text-zinc-600 mt-6">
        Click any step to explore • Hover over 3D objects for interaction
      </p>
    </div>
  );
}
