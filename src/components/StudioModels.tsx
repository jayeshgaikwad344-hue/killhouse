import React from 'react';
import { Box, Cylinder, Sphere, MeshWobbleMaterial } from '@react-three/drei';

export const Synthesizer = () => (
  <group>
    <Box args={[4, 0.5, 2]} position={[0, -0.25, 0]}>
      <meshStandardMaterial color="#1a1a1a" />
    </Box>
    <Box args={[3.8, 0.1, 0.8]} position={[0, 0.1, 0.5]}>
      <meshStandardMaterial color="#333" />
    </Box>
    {[...Array(20)].map((_, i) => (
      <Box key={i} args={[0.15, 0.1, 1]} position={[-1.7 + i * 0.18, 0.1, -0.4]}>
        <meshStandardMaterial color={i % 7 === 0 || i % 7 === 3 ? "#111" : "#fff"} />
      </Box>
    ))}
  </group>
);

export const StudioMonitor = () => (
  <group>
    <Box args={[2, 3, 2]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#111" />
    </Box>
    <Sphere args={[0.7, 32, 32]} position={[0, 0.5, 1.01]}>
      <meshStandardMaterial color="#222" />
    </Sphere>
    <Sphere args={[0.4, 32, 32]} position={[0, -0.8, 1.01]}>
      <meshStandardMaterial color="#333" />
    </Sphere>
  </group>
);

export const Microphone = () => (
  <group>
    <Cylinder args={[0.3, 0.3, 2, 32]} position={[0, -1, 0]}>
      <meshStandardMaterial color="#222" />
    </Cylinder>
    <Sphere args={[0.5, 32, 32]} position={[0, 0.2, 0]}>
      <MeshWobbleMaterial color="#C0C0C0" factor={0.1} speed={1} />
    </Sphere>
  </group>
);

export const Headphones = () => (
  <group>
    <Box args={[0.5, 1.5, 1.5]} position={[-1, 0, 0]} castShadow>
      <meshStandardMaterial color="#111" />
    </Box>
    <Box args={[0.5, 1.5, 1.5]} position={[1, 0, 0]} castShadow>
      <meshStandardMaterial color="#111" />
    </Box>
    <Box args={[2.5, 0.2, 0.5]} position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
      <meshStandardMaterial color="#222" />
    </Box>
  </group>
);

export const Turntable = () => (
  <group>
    <Box args={[4, 0.4, 3]} position={[0, -0.2, 0]}>
      <meshStandardMaterial color="#1a1a1a" />
    </Box>
    <Cylinder args={[1.2, 1.2, 0.1, 64]} position={[-0.5, 0.05, 0]}>
      <meshStandardMaterial color="#111" />
    </Cylinder>
    <Box args={[0.1, 0.8, 0.1]} position={[1.2, 0.3, 0.8]} rotation={[0.5, 0, -0.5]}>
      <meshStandardMaterial color="#aaa" />
    </Box>
  </group>
);
