import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  const modelRef = useRef();
  const { camera, scene } = useThree();

  useEffect(() => {
    if (gltf) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Ajusta a escala do modelo se for muito pequeno ou muito grande
      const scale = 10 / Math.max(size.x, size.y, size.z);
      gltf.scene.scale.setScalar(scale);

      // Recalcula o tamanho após o ajuste de escala
      box.setFromObject(gltf.scene);
      box.getCenter(center);
      box.getSize(size);

      // Posiciona a câmera para ver todo o modelo
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      const minZ = Math.max(size.x, size.y) / (2 * Math.tan(fov / 2));
      cameraZ = Math.max(minZ, cameraZ);

      // Posiciona a câmera em um ângulo mais adequado para visualização de planta
      const cameraX = center.x + cameraZ * 0.5;
      const cameraY = center.y + cameraZ * 0.5;
      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(center);

      // Centraliza o modelo
      gltf.scene.position.set(-center.x, 0, -center.z);

      scene.add(gltf.scene);
    }
  }, [gltf, camera, scene]);

  return <primitive object={gltf.scene} ref={modelRef} />;
};

const SketchupViewer = ({ modelUrl }) => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas camera={{ fov: 50, near: 0.1, far: 1000 }}>
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model url={modelUrl} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Grid infiniteGrid followCamera={false} cellSize={1} sectionSize={5} />
        <Environment preset="studio" background={false} />
      </Canvas>
    </div>
  );
};

export default SketchupViewer;