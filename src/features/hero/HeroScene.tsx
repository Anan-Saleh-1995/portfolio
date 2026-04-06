import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  Points,
} from "three";
import { THEME_ACCENT_HEX, type Theme } from "@/shared/config/theme";
import { useMouseParallax } from "./useMouseParallax";

const THEME_ACCENTS: Record<Theme, { accent: Color }> = {
  dark: { accent: new Color(THEME_ACCENT_HEX.dark) },
  light: { accent: new Color(THEME_ACCENT_HEX.light) },
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

const PARTICLE_POSITIONS = generatePositions(160);

const Particles = ({ color }: { color: Color }) => {
  const ref = useRef<Points>(null!);
  const geometry = useMemo(() => {
    const instance = new BufferGeometry();
    instance.setAttribute(
      "position",
      new Float32BufferAttribute(PARTICLE_POSITIONS, 3),
    );
    return instance;
  }, []);

  return (
    <points ref={ref}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.42}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const EnsoRing = ({ color }: { color: Color }) => {
  const ref = useRef<Mesh>(null!);
  return (
    <mesh ref={ref} rotation={[Math.PI * 0.18, 0, 0.08]}>
      <torusGeometry args={[2, 0.065, 12, 72, 5.5]} />
      <meshBasicMaterial color={color} transparent opacity={0.88} />
    </mesh>
  );
};

const CameraRig = () => {
  const { invalidate } = useThree();
  const mouse = useMouseParallax(invalidate);
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    smoothed.current.x += (mouse.current.x * 0.35 - smoothed.current.x) * 0.08;
    smoothed.current.y += (mouse.current.y * 0.2 - smoothed.current.y) * 0.08;
    state.camera.position.x = smoothed.current.x;
    state.camera.position.y = smoothed.current.y;
    state.camera.lookAt(0, 0, 0);

    const stillMoving =
      Math.abs(mouse.current.x * 0.35 - smoothed.current.x) > 0.001 ||
      Math.abs(mouse.current.y * 0.2 - smoothed.current.y) > 0.001;

    if (stillMoving) {
      invalidate();
    }
  });

  return null;
};

const HeroScene = ({ theme }: { theme: Theme }) => {
  const { accent } = THEME_ACCENTS[theme];

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      <CameraRig />
      <Particles color={accent} />
      <EnsoRing color={accent} />
    </Canvas>
  );
};

export default HeroScene;
