import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useStore } from '../store';
import { PLANETS } from '../constants';

const Planet = ({ planet }: { planet: typeof PLANETS[0] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const { speedMultiplier, showOrbits, showLabels } = useStore();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += planet.speed * speedMultiplier;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed * speedMultiplier;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += planet.rotationSpeed * 0.5 * speedMultiplier;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[planet.distance, 0, 0]}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshStandardMaterial color={planet.color} roughness={0.7} metalness={0.1} />
        </mesh>
        
        {planet.hasRings && (
          <mesh ref={ringsRef} rotation={[Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
            <meshStandardMaterial color="#cda87c" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}
        {planet.moons && planet.moons.map((moon, index) => (
          <Moon key={index} moon={moon} />
        ))}
        {showLabels && (
          <Html distanceFactor={15} center position={[0, planet.size + 0.5, 0]}>
            <div className="text-white text-xs font-sans tracking-widest bg-black/50 px-2 py-1 rounded-md whitespace-nowrap select-none pointer-events-none">
              {planet.name}
            </div>
          </Html>
        )}
      </group>
      {/* Orbit path */}
      {showOrbits && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.distance - 0.05, planet.distance + 0.05, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

const Moon = ({ moon }: { moon: { name: string, size: number, distance: number, speed: number } }) => {
  const moonGroupRef = useRef<THREE.Group>(null);
  const { speedMultiplier, showOrbits } = useStore();

  useFrame(() => {
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += moon.speed * speedMultiplier;
    }
  });

  return (
    <group ref={moonGroupRef}>
      <mesh position={[moon.distance, 0, 0]}>
        <sphereGeometry args={[moon.size, 16, 16]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.8} metalness={0.1} />
      </mesh>
      {showOrbits && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[moon.distance - 0.02, moon.distance + 0.02, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);
  const { speedMultiplier, showLabels } = useStore();

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005 * speedMultiplier;
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial color={[2, 1.5, 0]} toneMapped={false} />
      </mesh>
      <pointLight color="#ffcc00" intensity={500} distance={300} decay={1.5} />
      {showLabels && (
        <Html distanceFactor={15} center position={[0, 5, 0]}>
          <div className="text-white text-xs font-sans tracking-widest bg-black/50 px-2 py-1 rounded-md whitespace-nowrap select-none pointer-events-none">
            Sun
          </div>
        </Html>
      )}
    </group>
  );
};

export default function SolarSystem() {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.05} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sun />
      
      {PLANETS.map((planet) => (
        <Planet key={planet.name} planet={planet} />
      ))}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={300}
        makeDefault
      />
      
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
}
