import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// This component handles loading the OBJ and textures
const Model = ({ objUrl, textureUrl, normalMapUrl }) => {
  const obj = useLoader(OBJLoader, objUrl);
  const texture = useLoader(TextureLoader, textureUrl);
  const normalMap = normalMapUrl ? useLoader(TextureLoader, normalMapUrl) : null;
  const groupRef = useRef();
  
  // Configure texture
  texture.flipY = true; // OBJ and texture coordinates may need this
  
  // Apply material to all mesh children
  useEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          normalMap: normalMap || null,
        });
        child.material = material;
      }
    });
  }, [obj, texture, normalMap]);

  // Center the model
  const { camera } = useThree();
  useEffect(() => {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Position model at center
    obj.position.sub(center);
    
    // Scale the model to fit in view
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    obj.scale.set(scale, scale, scale);
    
    // Position camera to look at the model from above and to the side
    camera.position.set(1, 1, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [obj, camera]);

  // Add rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
};

// Loading fallback - must be a Three.js object, not HTML
const LoadingFallback = () => {
  return (
    <Html center>
      <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '4px' }}>
        Loading...
      </div>
    </Html>
  );
};

// This is the main component exported for use
const ModelViewer = ({ objUrl, textureUrl, normalMapUrl }) => {
  return (
    <div className="model-viewer">
      <Canvas
        camera={{ position: [1, 1, 0], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={<LoadingFallback />}>
          <Model 
            objUrl={objUrl} 
            textureUrl={textureUrl} 
            normalMapUrl={normalMapUrl} 
          />
        </Suspense>
        <OrbitControls enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ModelViewer; 