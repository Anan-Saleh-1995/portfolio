import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { THEME_ACCENT_HEX, type Theme } from "@/shared/config/theme";
import { useMouseParallax } from "./useMouseParallax";

const THEME_ACCENTS: Record<Theme, { accent: THREE.Color }> = {
  dark: { accent: new THREE.Color(THEME_ACCENT_HEX.dark) },
  light: { accent: new THREE.Color(THEME_ACCENT_HEX.light) },
};

const generatePositions = (count: number): Float32Array => {
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
};

const PARTICLE_POSITIONS = generatePositions(300);

const Particles = ({ color }: { color: THREE.Color }) => {
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
};

const EnsoRing = ({ color }: { color: THREE.Color }) => {
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
};

const CameraRig = () => {
  const mouse = useMouseParallax();
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    smoothed.current.x += (mouse.current.x * 0.5 - smoothed.current.x) * 0.03;
    smoothed.current.y += (mouse.current.y * 0.3 - smoothed.current.y) * 0.03;
    state.camera.position.x = smoothed.current.x;
    state.camera.position.y = smoothed.current.y;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

const HeroScene = ({ theme }: { theme: Theme }) => {
  const { accent } = THEME_ACCENTS[theme];

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      <CameraRig />
      <Particles color={accent} />
      <EnsoRing color={accent} />
    </Canvas>
  );
};

export default HeroScene;
