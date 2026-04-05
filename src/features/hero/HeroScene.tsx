import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const THEMES = {
  dark: {
    accent: new THREE.Color("#c41e3a"),
    bg: "#0d0d0d",
  },
  light: {
    accent: new THREE.Color("#8b0000"),
    bg: "#f5f0e8",
  },
};

function generatePositions(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 4;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

const PARTICLE_POSITIONS = generatePositions(300);

function Particles({ color }: { color: THREE.Color }) {
  const ref = useRef<THREE.Points>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function EnsoRing({ color }: { color: THREE.Color }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    ref.current.rotation.z += delta * 0.12;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI * 0.15, 0, 0]}>
      <torusGeometry args={[2, 0.08, 16, 100, 5.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    smoothed.current.x += (mouse.current.x * 0.5 - smoothed.current.x) * 0.03;
    smoothed.current.y += (mouse.current.y * 0.3 - smoothed.current.y) * 0.03;
    state.camera.position.x = smoothed.current.x;
    state.camera.position.y = smoothed.current.y;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene({ theme }: { theme: "dark" | "light" }) {
  const { accent, bg } = THEMES[theme];

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[bg]} />

      <CameraRig />
      <Particles color={accent} />
      <EnsoRing color={accent} />
    </Canvas>
  );
}
