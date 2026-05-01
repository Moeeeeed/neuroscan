'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

function BrainModel() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Left Hemisphere */}
      <mesh position={[-0.8, 0.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" wireframe={true} transparent={true} opacity={0.15} />
        <mesh>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshPhysicalMaterial color="#1e3a8a" transparent={true} opacity={0.3} roughness={0.5} />
        </mesh>
      </mesh>

      {/* Right Hemisphere */}
      <mesh position={[0.8, 0.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" wireframe={true} transparent={true} opacity={0.15} />
        <mesh>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshPhysicalMaterial color="#1e3a8a" transparent={true} opacity={0.3} roughness={0.5} />
        </mesh>
      </mesh>

      {/* Cerebellum / Brain Stem */}
      <mesh position={[0, -1, -0.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" wireframe={true} transparent={true} opacity={0.15} />
        <mesh>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshPhysicalMaterial color="#1e3a8a" transparent={true} opacity={0.4} roughness={0.5} />
        </mesh>
      </mesh>
    </group>
  );
}

function TumorIndicator({ position, details }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial 
        color={hovered ? "#ff6b6b" : "#ff3333"} 
        emissive="#ff0000" 
        emissiveIntensity={hovered ? 3 : 1.5} 
      />
      
      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(11, 15, 25, 0.95)',
            border: '1px solid var(--danger)',
            color: 'white',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            minWidth: '180px',
            transform: 'translate3d(-50%, -120%, 0)',
            pointerEvents: 'none',
            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.2)'
          }}>
            <div style={{ color: 'var(--danger)', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '6px' }}>
              Anomaly Detected
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Region:</span>
              <span style={{ textAlign: 'right' }}>{details?.region || 'Unknown'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>Confidence:</span>
              <span style={{ textAlign: 'right', color: 'var(--danger)' }}>{details?.confidence || 0}%</span>
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function Brain3DView({ result }) {
  // Extract coords and details
  const coords = result?.locationCoords || [0, 0, 0];
  const physicalPos = [coords[0] * 1.5, coords[1] * 1.5, coords[2] * 1.5];
  
  const details = {
    region: result?.locationText,
    confidence: result?.confidence ? (result.confidence * 100).toFixed(1) : 0
  };

  return (
    <div style={{ height: '400px', width: '100%', background: 'radial-gradient(circle at center, #0b1120 0%, #050811 100%)', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
      <div style={{ position: 'absolute', top: 15, left: 15, zIndex: 10, pointerEvents: 'none' }}>
        <h4 style={{ color: 'var(--accent-blue)', margin: 0 }}>Interactive 3D Localization</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>Hover over the red anomaly for details.<br/>Drag to rotate, scroll to zoom.</p>
      </div>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <BrainModel />
        
        {/* Only show tumor indicator if it's actually a tumor */}
        {result?.diagnosis !== "No Tumor" && (
          <TumorIndicator position={physicalPos} details={details} />
        )}
        
        <OrbitControls enablePan={false} autoRotate={true} autoRotateSpeed={0.8} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}
