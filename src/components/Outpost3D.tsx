import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Destination, EventType, ModuleLevels } from '../game/types';

interface Outpost3DProps {
  destination: Destination;
  modules: ModuleLevels;
  crewSize: number;
  lastEvent: EventType;
  isNight: boolean;
}

export const Outpost3D: React.FC<Outpost3DProps> = ({
  destination,
  modules,
  crewSize,
  lastEvent,
  isNight,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const skyHex =
      destination === 'moon'
        ? 0x070b12
        : lastEvent === 'dust_storm'
        ? 0x4a2c1d
        : 0x241814;
    scene.background = new THREE.Color(skyHex);
    scene.fog = new THREE.FogExp2(skyHex, destination === 'mars' ? 0.032 : 0.015);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(8.5, 5.2, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNight ? 0.55 : 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 18;
    controls.target.set(0, 0.8, 0);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(
      destination === 'moon' ? 0x8fa6cb : 0xe8b87d,
      0x1a1a1a,
      isNight ? 0.35 : 0.7
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(
      destination === 'moon' ? 0xfff5e4 : 0xffd2a6,
      isNight ? 0.4 : 2.1
    );
    keyLight.position.set(10, 14, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    // Procedural regolith bump texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 256;
    texCanvas.height = 256;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = Math.random() * 3 + 0.5;
        const shade = Math.floor(90 + Math.random() * 80);
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const bumpTex = new THREE.CanvasTexture(texCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(8, 8);

    // Terrain
    const groundGeo = new THREE.CircleGeometry(30, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: destination === 'moon' ? 0x3b414a : 0x7a3e26,
      roughness: 0.92,
      metalness: 0.05,
      bumpMap: bumpTex,
      bumpScale: 0.18,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    scene.add(ground);

    // Scattered planetary rocks (InstancedMesh)
    const rockGeo = new THREE.DodecahedronGeometry(0.28, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: destination === 'moon' ? 0x525864 : 0x8f492e,
      roughness: 0.9,
      metalness: 0.05,
    });
    const rockCount = 32;
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < rockCount; i++) {
      const angle = (i / rockCount) * Math.PI * 2 + (i % 3) * 0.4;
      const radius = 5.5 + (i % 7) * 2.1;
      dummy.position.set(Math.cos(angle) * radius, 0.08, Math.sin(angle) * radius);
      dummy.rotation.set(i * 0.5, i * 1.1, 0);
      const s = 0.6 + (i % 5) * 0.25;
      dummy.scale.set(s, s * 0.7, s);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
    }
    rocks.instanceMatrix.needsUpdate = true;
    scene.add(rocks);

    // Composite Habitat Core (Group of 5 parts)
    const habGroup = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xede7da, roughness: 0.45, metalness: 0.25 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.5 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x5e9c94, roughness: 0.3, metalness: 0.4 });

    const basePad = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.2, 24), trimMat);
    basePad.position.y = 0.1;
    basePad.receiveShadow = true;
    habGroup.add(basePad);

    const mainHull = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.3, 24), hullMat);
    mainHull.position.y = 0.85;
    mainHull.castShadow = true;
    mainHull.receiveShadow = true;
    habGroup.add(mainHull);

    const domeCap = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      hullMat
    );
    domeCap.position.y = 1.5;
    domeCap.castShadow = true;
    habGroup.add(domeCap);

    const airlock = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 1.1), trimMat);
    airlock.position.set(0, 0.6, 1.85);
    airlock.castShadow = true;
    habGroup.add(airlock);

    const hatch = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.1), accentMat);
    hatch.position.set(0, 0.55, 2.41);
    habGroup.add(hatch);
    scene.add(habGroup);

    // Solar Arrays
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.2, metalness: 0.75 });
    for (let i = 0; i < modules.solar_array; i++) {
      const solarGroup = new THREE.Group();
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 8), trimMat);
      mast.position.y = 0.6;
      mast.castShadow = true;
      solarGroup.add(mast);

      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.9), solarMat);
      panel.position.y = 1.25;
      panel.rotation.x = 0.35;
      panel.castShadow = true;
      solarGroup.add(panel);

      solarGroup.position.set(-3.4 - i * 1.4, 0, -1.2 + i * 1.6);
      scene.add(solarGroup);
    }

    // Greenhouse
    if (modules.greenhouse > 0) {
      const ghGroup = new THREE.Group();
      const ghBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 1.6), trimMat);
      ghBase.position.y = 0.125;
      ghGroup.add(ghBase);

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x5e9c94,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.55,
      });
      const ghDome = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 2.0, 16, 1, false, 0, Math.PI), glassMat);
      ghDome.rotation.z = Math.PI / 2;
      ghDome.rotation.y = Math.PI / 2;
      ghDome.position.y = 0.25;
      ghGroup.add(ghDome);

      ghGroup.position.set(3.2, 0, 0.4);
      scene.add(ghGroup);
    }

    // Water Recycler
    if (modules.water_recycler > 0) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.6, 16), accentMat);
      tank.position.set(2.4, 0.8, -2.0);
      tank.castShadow = true;
      scene.add(tank);
    }

    // Storm Shelter
    if (modules.storm_shelter > 0) {
      const shelterMat = new THREE.MeshStandardMaterial({ color: 0xe8622c, roughness: 0.5, metalness: 0.3 });
      const shelter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.2), shelterMat);
      shelter.position.set(-2.4, 0.45, 2.1);
      shelter.castShadow = true;
      scene.add(shelter);
    }

    // Walking 3D Astronauts
    const astronauts: { group: THREE.Group; radius: number; speed: number; offset: number }[] = [];
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xede7da, roughness: 0.6, metalness: 0.1 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0xe8622c, roughness: 0.2, metalness: 0.7 });
    for (let i = 0; i < crewSize; i++) {
      const astro = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.42, 10), suitMat);
      body.position.y = 0.35;
      body.castShadow = true;
      astro.add(body);

      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), suitMat);
      helmet.position.y = 0.66;
      helmet.castShadow = true;
      astro.add(helmet);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.08), visorMat);
      visor.position.set(0, 0.67, 0.11);
      astro.add(visor);

      scene.add(astro);
      astronauts.push({
        group: astro,
        radius: 3.1 + i * 0.55,
        speed: 0.45 + i * 0.08,
        offset: (i / crewSize) * Math.PI * 2,
      });
    }

    let animId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      for (const a of astronauts) {
        const angle = t * a.speed + a.offset;
        a.group.position.x = Math.cos(angle) * a.radius;
        a.group.position.z = Math.sin(angle) * a.radius;
        a.group.position.y = Math.abs(Math.sin(t * 7 + a.offset)) * 0.06;
        a.group.rotation.y = -angle;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 280;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      bumpTex.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      controls.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [destination, modules, crewSize, lastEvent, isNight]);

  return (
    <div className="relative w-full border border-[#EDE7DA]/20 bg-[#0B1320] rounded-[3px] overflow-hidden">
      <div ref={mountRef} className="w-full h-[260px] sm:h-[300px]" />
      <div className="px-3 py-1.5 border-t border-[#EDE7DA]/15 flex items-center justify-between font-mono text-[11px] text-[#EDE7DA]/75">
        <span>3D OUTPOST VIEW · DRAG TO ORBIT · SCROLL TO ZOOM</span>
        <span>{isNight ? 'LUNAR NIGHT' : lastEvent === 'dust_storm' ? 'DUST STORM' : 'CLEAR SKY'}</span>
      </div>
    </div>
  );
};
