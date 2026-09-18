import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  FileText, 
  Building2, 
  FileCheck2, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  Heart,
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export default function HaqDaarAILoader({
  isLoading = true,
  traces = [],
  onRetry,
  onComplete,
  lang = 'en'
}) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [showTraceDetails, setShowTraceDetails] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const sceneObjectsRef = useRef({});

  // Calculate current progress & step based on REAL traces array
  const traceCount = traces ? traces.length : 0;
  
  // Dynamic step: 1 to 5
  // traceCount 0 -> Step 1 (Understand Request)
  // traceCount 1 -> Step 2 (Finding Health Schemes)
  // traceCount 2 -> Step 3 (Locating Empanelled Hospitals)
  // traceCount 3 -> Step 4 (Checking Required Documents)
  // traceCount 4 -> Step 5 (Verifying Information / Synthesis)
  // traceCount >= 5 or !isLoading -> Completed
  const currentStep = Math.min(5, Math.max(1, traceCount + 1));
  const progressPercent = Math.min(100, Math.max(15, (traceCount / 5) * 100));

  // Determine active status message based on real agent state
  const getStatusMessage = () => {
    if (isCompleted || (!isLoading && traceCount >= 4)) {
      return 'Healthcare guidance ready! Loading verified dossier...';
    }
    switch (traceCount) {
      case 0:
        return 'Understanding your request...';
      case 1:
        return 'Finding relevant health schemes...';
      case 2:
        return 'Locating empanelled hospitals...';
      case 3:
        return 'Checking required documents...';
      case 4:
      case 5:
        return 'Verifying information & synthesizing guidance...';
      default:
        return 'Processing your healthcare query...';
    }
  };

  // Watch for completion
  useEffect(() => {
    if (!isLoading && traceCount > 0 && !isCompleted) {
      setIsCompleted(true);
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 900);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, traceCount, isCompleted, onComplete]);

  // Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 560;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ==========================================
    // 1. LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x061e38, 2.5);
    scene.add(ambientLight);

    // Front high-key cyan glow
    const frontCyanLight = new THREE.PointLight(0x00f0ff, 3.5, 20);
    frontCyanLight.position.set(0, 1.5, 4.5);
    scene.add(frontCyanLight);

    // Top subtle turquoise rim
    const topLight = new THREE.DirectionalLight(0x00ffcc, 1.8);
    topLight.position.set(3, 5, 2);
    scene.add(topLight);

    // Back dark blue rim light
    const backRimLight = new THREE.DirectionalLight(0x0066ff, 2.8);
    backRimLight.position.set(-4, -2, -4);
    scene.add(backRimLight);

    // Bottom holographic projector light
    const pedestalLight = new THREE.PointLight(0x00e5ff, 5.0, 8);
    pedestalLight.position.set(0, -1.8, 0);
    scene.add(pedestalLight);

    // ==========================================
    // 2. PROCEDURAL TEXTURE FOR EARTH & INDIA
    // ==========================================
    const createEarthTexture = () => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 2048;
      texCanvas.height = 1024;
      const ctx = texCanvas.getContext('2d');

      // Deep space ocean base
      const grad = ctx.createLinearGradient(0, 0, 0, texCanvas.height);
      grad.addColorStop(0, '#030c1e');
      grad.addColorStop(0.5, '#051833');
      grad.addColorStop(1, '#020917');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Spherical Latitude & Longitude Grid Lines
      ctx.strokeStyle = 'rgba(0, 225, 255, 0.15)';
      ctx.lineWidth = 1.2;
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = ((90 - lat) / 180) * texCanvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(texCanvas.width, y);
        ctx.stroke();
      }
      for (let lon = -180; lon <= 180; lon += 20) {
        const x = ((lon + 180) / 360) * texCanvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, texCanvas.height);
        ctx.stroke();
      }

      // Major Continents Silhouettes (Stylized holographic landmasses)
      ctx.fillStyle = 'rgba(10, 45, 85, 0.7)';
      ctx.strokeStyle = 'rgba(0, 180, 255, 0.35)';
      ctx.lineWidth = 2;

      const drawLand = (coords) => {
        ctx.beginPath();
        coords.forEach(([lon, lat], i) => {
          const x = ((lon + 180) / 360) * texCanvas.width;
          const y = ((90 - lat) / 180) * texCanvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Stylized continents (Africa, Europe, Asia, Americas, Australia)
      // Africa
      drawLand([[-15, 35], [35, 30], [50, 12], [42, -10], [28, -34], [18, -34], [10, 4], [-17, 14]]);
      // Europe
      drawLand([[-10, 36], [0, 48], [15, 55], [30, 60], [45, 50], [30, 40], [10, 38]]);
      // Asia Mainland
      drawLand([[50, 40], [70, 55], [100, 60], [130, 55], [120, 35], [105, 20], [80, 25], [60, 25]]);
      // South East Asia & Australia
      drawLand([[115, -15], [145, -15], [150, -35], [120, -35], [115, -22]]);
      // Americas (North)
      drawLand([[-130, 50], [-90, 55], [-60, 45], [-75, 25], [-105, 20], [-125, 35]]);
      // Americas (South)
      drawLand([[-80, 10], [-50, -5], [-40, -20], [-65, -50], [-75, -20]]);

      // Global Network Nodes (city points)
      const cities = [
        [77.2, 28.6], [72.8, 18.9], [77.6, 12.9], [80.2, 13.0], [88.3, 22.5], // India hubs
        [55.3, 25.2], [139.7, 35.7], [-0.1, 51.5], [-74.0, 40.7], [151.2, -33.8] // World hubs
      ];
      cities.forEach(([lon, lat]) => {
        const x = ((lon + 180) / 360) * texCanvas.width;
        const y = ((90 - lat) / 180) * texCanvas.height;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      });

      // ==========================================
      // PROMINENT GLOWING INDIA MAP HIGHLIGHT
      // Accurate lat: 8°N to 37°N, lon: 68°E to 97°E
      // ==========================================
      const indiaPolygon = [
        [74.5, 37.0], // Kashmir North tip
        [77.5, 35.5], // Ladakh
        [80.5, 31.0], // Uttarakhand
        [88.0, 28.0], // Sikkim
        [93.5, 28.5], // Arunachal North
        [96.5, 28.0], // Arunachal East
        [95.5, 26.0], // Nagaland
        [93.0, 23.5], // Mizoram
        [89.5, 22.0], // Bengal delta
        [86.5, 20.0], // Odisha coast
        [82.5, 17.0], // Andhra coast
        [80.3, 13.0], // Chennai coast
        [79.8, 10.0], // Tamil Nadu
        [77.5, 8.1],  // Kanyakumari (Southern Tip)
        [76.5, 9.5],  // Kerala
        [74.0, 15.0], // Goa
        [73.0, 19.0], // Mumbai / Maharashtra
        [70.0, 21.0], // Gujarat South
        [68.5, 23.5], // Kutch West tip
        [71.0, 25.5], // Rajasthan West
        [74.0, 30.5], // Punjab
        [74.8, 34.0], // Jammu
      ];

      // India Glowing Fill
      ctx.save();
      ctx.beginPath();
      indiaPolygon.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * texCanvas.width;
        const y = ((90 - lat) / 180) * texCanvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Translucent cyan radiant fill
      const indiaGrad = ctx.createRadialGradient(
        ((78 + 180) / 360) * texCanvas.width,
        ((90 - 22) / 180) * texCanvas.height,
        10,
        ((78 + 180) / 360) * texCanvas.width,
        ((90 - 22) / 180) * texCanvas.height,
        180
      );
      indiaGrad.addColorStop(0, 'rgba(0, 255, 210, 0.7)');
      indiaGrad.addColorStop(0.6, 'rgba(0, 220, 255, 0.45)');
      indiaGrad.addColorStop(1, 'rgba(0, 150, 255, 0.25)');
      ctx.fillStyle = indiaGrad;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 35;
      ctx.fill();

      // High Intensity Glowing Border
      ctx.strokeStyle = '#00ffea';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // India Internal Healthcare Constellation Network
      const indiaNodes = [
        { name: 'Delhi', lon: 77.2, lat: 28.6 },
        { name: 'Mumbai', lon: 72.8, lat: 18.9 },
        { name: 'Bengaluru', lon: 77.6, lat: 12.9 },
        { name: 'Chennai', lon: 80.2, lat: 13.0 },
        { name: 'Kolkata', lon: 88.3, lat: 22.5 },
        { name: 'Hyderabad', lon: 78.4, lat: 17.3 },
        { name: 'Patna', lon: 85.1, lat: 25.6 },
        { name: 'Ahmedabad', lon: 72.5, lat: 23.0 },
        { name: 'Bhopal', lon: 77.4, lat: 23.2 },
        { name: 'Guwahati', lon: 91.7, lat: 26.1 }
      ];

      // Connect Constellation Network
      ctx.strokeStyle = 'rgba(0, 255, 230, 0.7)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < indiaNodes.length; i++) {
        for (let j = i + 1; j < indiaNodes.length; j++) {
          const n1 = indiaNodes[i];
          const n2 = indiaNodes[j];
          const d = Math.hypot(n1.lon - n2.lon, n1.lat - n2.lat);
          if (d < 16) {
            const x1 = ((n1.lon + 180) / 360) * texCanvas.width;
            const y1 = ((90 - n1.lat) / 180) * texCanvas.height;
            const x2 = ((n2.lon + 180) / 360) * texCanvas.width;
            const y2 = ((90 - n2.lat) / 180) * texCanvas.height;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
          }
        }
      }
      ctx.stroke();

      // Draw Glowing Nodes
      indiaNodes.forEach((node) => {
        const x = ((node.lon + 180) / 360) * texCanvas.width;
        const y = ((90 - node.lat) / 180) * texCanvas.height;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      });

      return new THREE.CanvasTexture(texCanvas);
    };

    const earthTexture = createEarthTexture();

    // ==========================================
    // 3. EARTH 3D SPHERE
    // ==========================================
    const earthRadius = 1.55;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.35,
      metalness: 0.15,
      emissive: new THREE.Color(0x022544),
      emissiveIntensity: 0.8
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    // Orient India toward camera on load (lon ~78° E)
    // Three.js spherical mapping puts lon 0 at -Z or +X depending on setup.
    // Setting rotation.y = -1.35 brings India directly to front-center!
    earthMesh.rotation.y = -1.35;
    earthMesh.rotation.x = 0.18; // Slight pleasing forward tilt
    earthMesh.position.set(0, 0.2, 0);
    scene.add(earthMesh);

    // ==========================================
    // 4. ATMOSPHERE FRESNEL HALO GLOW
    // ==========================================
    const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.14, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(0.0, 0.88, 1.0, 1.0) * intensity * 1.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphereMesh.position.copy(earthMesh.position);
    scene.add(atmosphereMesh);

    // Inner subtle glow shell
    const innerGlowGeo = new THREE.SphereGeometry(earthRadius * 1.015, 32, 32);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const innerGlowMesh = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    innerGlowMesh.position.copy(earthMesh.position);
    scene.add(innerGlowMesh);

    // ==========================================
    // 5. HOLOGRAPHIC ORBITAL RINGS
    // ==========================================
    const ringsGroup = new THREE.Group();
    ringsGroup.position.copy(earthMesh.position);
    scene.add(ringsGroup);

    // Ring 1 (Inner tilted)
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.015, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI * 0.42;
    ringMesh1.rotation.y = 0.2;
    ringsGroup.add(ringMesh1);

    // Ring 2 (Middle counter-tilted)
    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.012, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI * 0.35;
    ringMesh2.rotation.z = -0.3;
    ringsGroup.add(ringMesh2);

    // Ring 3 (Outer wider ring)
    const ringGeo3 = new THREE.TorusGeometry(2.95, 0.009, 16, 120);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.x = Math.PI * 0.22;
    ringMesh3.rotation.y = -0.4;
    ringsGroup.add(ringMesh3);

    // Orbiting Glowing Nodes / Satellites on Ring 1
    const createOrbitalNode = (colorHex) => {
      const nodeGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        blending: THREE.AdditiveBlending
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

      // Outer glow aura
      const auraGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      nodeMesh.add(auraMesh);
      return nodeMesh;
    };

    const orbitNode1 = createOrbitalNode(0x00ffff);
    const orbitNode2 = createOrbitalNode(0x00ffb3);
    const orbitNode3 = createOrbitalNode(0x38bdf8);
    const orbitNode4 = createOrbitalNode(0x00e5ff);
    scene.add(orbitNode1, orbitNode2, orbitNode3, orbitNode4);

    // ==========================================
    // 6. CYBERNETIC HOLOGRAPHIC PEDESTAL (BOTTOM)
    // ==========================================
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.65, 0);
    scene.add(pedestalGroup);

    // Multi-tiered glowing circular discs
    const baseDiskGeo1 = new THREE.CylinderGeometry(2.1, 2.3, 0.08, 64);
    const baseDiskMat1 = new THREE.MeshStandardMaterial({
      color: 0x04132b,
      metalness: 0.85,
      roughness: 0.2
    });
    const baseDisk1 = new THREE.Mesh(baseDiskGeo1, baseDiskMat1);
    pedestalGroup.add(baseDisk1);

    // Glowing Neon Ring on Pedestal Edge
    const pedestalRingGeo1 = new THREE.TorusGeometry(2.2, 0.025, 16, 64);
    const pedestalRingMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending
    });
    const pedestalRing1 = new THREE.Mesh(pedestalRingGeo1, pedestalRingMat1);
    pedestalRing1.rotation.x = Math.PI / 2;
    pedestalRing1.position.y = 0.05;
    pedestalGroup.add(pedestalRing1);

    // Concentric Inner Platform Ring with radial segments
    const pedestalRingGeo2 = new THREE.TorusGeometry(1.6, 0.02, 16, 48);
    const pedestalRingMat2 = new THREE.MeshBasicMaterial({
      color: 0x00d8ff,
      blending: THREE.AdditiveBlending
    });
    const pedestalRing2 = new THREE.Mesh(pedestalRingGeo2, pedestalRingMat2);
    pedestalRing2.rotation.x = Math.PI / 2;
    pedestalRing2.position.y = 0.08;
    pedestalGroup.add(pedestalRing2);

    // Upward Volumetric Hologram Light Cone
    const coneGeo = new THREE.CylinderGeometry(1.4, 0.4, 1.7, 32, 1, true);
    const coneMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying float vY;
        void main() {
          vY = position.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vY;
        void main() {
          float alpha = smoothstep(-0.85, 0.85, vY) * 0.18;
          gl_FragColor = vec4(0.0, 0.85, 1.0, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const hologramCone = new THREE.Mesh(coneGeo, coneMat);
    hologramCone.position.set(0, 0.85, 0);
    pedestalGroup.add(hologramCone);

    // ==========================================
    // 7. FLOATING DATA DUST & PARTICLES
    // ==========================================
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 1.8 + Math.random() * 2.2;

      particlePositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 2] = dist * Math.cos(phi);
      particleSpeeds[i] = 0.003 + Math.random() * 0.006;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Store refs for interactivity
    sceneObjectsRef.current = {
      earthMesh,
      ringsGroup,
      ringMesh1,
      ringMesh2,
      ringMesh3,
      orbitNode1,
      orbitNode2,
      orbitNode3,
      orbitNode4,
      pedestalGroup,
      pedestalRing1,
      pedestalRing2,
      particles
    };

    // ==========================================
    // 8. INTERACTIVE MOUSE PARALLAX
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.18;
    let targetRotY = -1.35;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ==========================================
    // 9. ANIMATION LOOP
    // ==========================================
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth slow earth rotation (gently swings around India focus)
      // We oscillate slightly or rotate slowly so India stays prominently visible
      targetRotY = -1.35 + Math.sin(elapsedTime * 0.35) * 0.25 + mouseX * 0.45;
      targetRotX = 0.18 + Math.cos(elapsedTime * 0.4) * 0.06 - mouseY * 0.35;

      earthMesh.rotation.y += (targetRotY - earthMesh.rotation.y) * 0.05;
      earthMesh.rotation.x += (targetRotX - earthMesh.rotation.x) * 0.05;

      // Inner wireframe follows
      innerGlowMesh.rotation.copy(earthMesh.rotation);

      // Rings gentle dynamic rotation
      ringMesh1.rotation.z = elapsedTime * 0.3;
      ringMesh2.rotation.z = -elapsedTime * 0.22;
      ringMesh3.rotation.z = elapsedTime * 0.15;

      // Orbiting Nodes along 3D trajectories
      const radius1 = 2.35;
      const t1 = elapsedTime * 0.8;
      orbitNode1.position.set(
        Math.cos(t1) * radius1,
        Math.sin(t1) * radius1 * 0.35 + 0.2,
        Math.sin(t1) * radius1 * 0.85
      );

      const radius2 = 2.65;
      const t2 = -elapsedTime * 0.65 + 1.5;
      orbitNode2.position.set(
        Math.cos(t2) * radius2 * 0.8,
        Math.sin(t2) * radius2 * 0.5 + 0.2,
        Math.sin(t2) * radius2 * 0.7
      );

      const t3 = elapsedTime * 0.95 + 3.0;
      orbitNode3.position.set(
        Math.sin(t3) * 2.4 * 0.9,
        Math.cos(t3) * 2.4 * 0.4 + 0.3,
        Math.cos(t3) * 2.4 * 0.75
      );

      const t4 = -elapsedTime * 0.5 + 4.5;
      orbitNode4.position.set(
        Math.cos(t4) * 2.8 * 0.85,
        Math.sin(t4) * 0.7 - 0.1,
        Math.sin(t4) * 2.8 * 0.6
      );

      // Rotating Pedestal Rings
      pedestalRing1.rotation.z = elapsedTime * 0.1;
      pedestalRing2.rotation.z = -elapsedTime * 0.15;

      // Floating Data Dust Drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = -1.8;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // ==========================================
    // 10. RESIZE HANDLER
    // ==========================================
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 560;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringGeo3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#020617] shadow-2xl shadow-cyan-950/60 min-h-[640px] pb-6 flex flex-col justify-between select-none">
      {/* Background Perspective Grid & Volumetric Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(6, 40, 75, 0.45) 0%, rgba(2, 10, 25, 0.85) 60%, #020617 100%)'
        }}
      />
      {/* Subtle floor grid in lower section */}
      <div 
        className="absolute bottom-0 inset-x-0 h-48 opacity-25 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom'
        }}
      />

      {/* 3D WebGL Canvas Mount */}
      {webglSupported ? (
        <div 
          ref={mountRef} 
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
          title="Interactive 3D Earth: Click and move cursor to explore"
        />
      ) : (
        /* Fallback if WebGL is disabled */
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="relative w-64 h-64 rounded-full border-2 border-cyan-400/40 animate-spin-slow flex items-center justify-center bg-cyan-950/20 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
            <div className="w-48 h-48 rounded-full border border-teal-400/30 animate-pulse flex items-center justify-center">
              <span className="text-3xl">🇮🇳</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HTML / CSS GLASSMORPHIC OVERLAY MATCHING REFERENCE IMAGE  */}
      {/* ========================================================= */}

      {/* TOP HEADER: Powered by AI / For a Healthier Bharat */}
      <div className="relative z-10 flex items-center justify-end p-4 sm:p-6 pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-right">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 animate-pulse">
            <Activity size={16} />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 font-mono">
              Powered by AI
            </div>
            <div className="text-xs font-semibold text-slate-200">
              For a Healthier Bharat
            </div>
          </div>
        </div>
      </div>

      {/* 4 ORBITAL FLOATING CIRCULAR BADGES (Matching reference image) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Badge 1: Heartbeat Wave (Top Left of Globe) */}
        <div 
          className="absolute left-[34%] top-[16%] w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_18px_rgba(0,240,255,0.7)] flex items-center justify-center text-cyan-300 animate-pulse"
          style={{ animationDuration: '3s' }}
          title="Vitals & Health Indicators"
        >
          <Activity size={18} />
        </div>

        {/* Badge 2: Medical Cross (Top Right of Globe) */}
        <div 
          className="absolute right-[34%] top-[18%] w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_18px_rgba(0,240,255,0.7)] flex items-center justify-center text-cyan-300 animate-pulse"
          style={{ animationDuration: '2.7s', animationDelay: '0.8s' }}
          title="Medical Care & Treatment"
        >
          <span className="text-xl font-black leading-none text-cyan-300">+</span>
        </div>

        {/* Badge 3: Heart / Health Protection (Bottom Left of Globe) */}
        <div 
          className="absolute left-[32%] bottom-[43%] w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_18px_rgba(0,240,255,0.7)] flex items-center justify-center text-cyan-300 animate-pulse"
          style={{ animationDuration: '3.2s', animationDelay: '0.4s' }}
          title="Patient Welfare"
        >
          <Heart size={17} className="text-cyan-300 fill-cyan-400/30" />
        </div>

        {/* Badge 4: Citizens / Community (Bottom Right of Globe) */}
        <div 
          className="absolute right-[33%] bottom-[44%] w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_18px_rgba(0,240,255,0.7)] flex items-center justify-center text-cyan-300 animate-pulse"
          style={{ animationDuration: '2.9s', animationDelay: '1.2s' }}
          title="Empanelled Citizen Community"
        >
          <Users size={17} />
        </div>
      </div>

      {/* FLOATING HOLOGRAPHIC CARDS (LEFT & RIGHT OF GLOBE) */}
      <div className="relative z-10 flex-1 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center pointer-events-none">
        {/* LEFT COLUMN CARDS */}
        <div className="flex flex-col gap-6 justify-center md:items-start max-w-xs">
          {/* Card 1: Finding Health Schemes */}
          <div 
            className={`pointer-events-auto flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-500 ${
              currentStep >= 2
                ? 'bg-slate-900/80 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-105'
                : 'bg-slate-950/40 border border-white/10 opacity-75'
            }`}
          >
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
              currentStep > 2
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentStep === 2
                ? 'bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse'
                : 'bg-white/5 text-slate-400'
            }`}>
              {currentStep > 2 ? <CheckCircle2 size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Finding Health Schemes...
              </div>
              <div className="text-[11px] text-cyan-300/80 flex items-center gap-1 mt-0.5">
                {currentStep > 2 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> PM-JAY & State tables checked
                  </span>
                ) : currentStep === 2 ? (
                  <span className="animate-pulse">Querying verified health tables...</span>
                ) : (
                  <span className="text-slate-400">Step 2 of 5</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Locating Empanelled Hospitals */}
          <div 
            className={`pointer-events-auto flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-500 ${
              currentStep >= 3
                ? 'bg-slate-900/80 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-105'
                : 'bg-slate-950/40 border border-white/10 opacity-75'
            }`}
          >
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
              currentStep > 3
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentStep === 3
                ? 'bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse'
                : 'bg-white/5 text-slate-400'
            }`}>
              {currentStep > 3 ? <CheckCircle2 size={20} /> : <Building2 size={20} />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Locating Empanelled Hospitals...
              </div>
              <div className="text-[11px] text-cyan-300/80 flex items-center gap-1 mt-0.5">
                {currentStep > 3 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Ayushman Mitra desks verified
                  </span>
                ) : currentStep === 3 ? (
                  <span className="animate-pulse">Matching specialty & district...</span>
                ) : (
                  <span className="text-slate-400">Step 3 of 5</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN CARDS */}
        <div className="flex flex-col gap-6 justify-center md:items-end max-w-xs md:ml-auto">
          {/* Card 3: Checking Required Documents */}
          <div 
            className={`pointer-events-auto flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-500 ${
              currentStep >= 4
                ? 'bg-slate-900/80 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-105'
                : 'bg-slate-950/40 border border-white/10 opacity-75'
            }`}
          >
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
              currentStep > 4
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentStep === 4
                ? 'bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse'
                : 'bg-white/5 text-slate-400'
            }`}>
              {currentStep > 4 ? <CheckCircle2 size={20} /> : <FileCheck2 size={20} />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Checking Required Documents...
              </div>
              <div className="text-[11px] text-cyan-300/80 flex items-center gap-1 mt-0.5">
                {currentStep > 4 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Statutory ID & referral papers
                  </span>
                ) : currentStep === 4 ? (
                  <span className="animate-pulse">Compiling paper checklist...</span>
                ) : (
                  <span className="text-slate-400">Step 4 of 5</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: Verifying Information */}
          <div 
            className={`pointer-events-auto flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md transition-all duration-500 ${
              currentStep >= 5
                ? 'bg-slate-900/80 border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-105'
                : 'bg-slate-950/40 border border-white/10 opacity-75'
            }`}
          >
            <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentStep === 5
                ? 'bg-cyan-500/25 text-cyan-300 ring-2 ring-cyan-400/40 animate-pulse'
                : 'bg-white/5 text-slate-400'
            }`}>
              {isCompleted ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                Verifying Information...
              </div>
              <div className="text-[11px] text-cyan-300/80 flex items-center gap-1 mt-0.5">
                {isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Safe guidance synthesized
                  </span>
                ) : currentStep === 5 ? (
                  <span className="animate-pulse">Safety checks & guardrails...</span>
                ) : (
                  <span className="text-slate-400">Step 5 of 5</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM CONSOLE: BRANDING, GLOWING PROGRESS BAR & STATUS   */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center pointer-events-auto">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-teal-200 drop-shadow-[0_0_20px_rgba(0,240,255,0.55)] font-heading">
          HAQDAAR AI
        </h2>
        {/* Subtitle */}
        <div className="text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold text-cyan-400/90 mt-1 mb-4">
          HAQ SE SEHAT TAK
        </div>

        {/* High-Tech Glowing Progress Bar */}
        <div className="w-full max-w-md h-2.5 sm:h-3 rounded-full bg-slate-900/90 border border-cyan-500/40 p-0.5 relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-700 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer laser reflection moving across bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        {/* Live Dynamic Status Message */}
        <div className="text-xs sm:text-sm font-medium text-slate-200 mt-3 h-5 flex items-center justify-center gap-2">
          {isLoading ? (
            <RefreshCw size={13} className="animate-spin text-cyan-400" />
          ) : (
            <CheckCircle2 size={13} className="text-emerald-400" />
          )}
          <span>{getStatusMessage()}</span>
        </div>

        {/* 5 Step Indicator Dots */}
        <div className="flex items-center gap-2.5 mt-3">
          {[1, 2, 3, 4, 5].map((dotStep) => {
            const isDotActive = currentStep === dotStep;
            const isDotPassed = currentStep > dotStep;
            return (
              <div 
                key={dotStep}
                className={`transition-all duration-300 rounded-full ${
                  isDotPassed
                    ? 'w-2 h-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : isDotActive
                    ? 'w-3.5 h-2 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,1)] ring-2 ring-cyan-300/50'
                    : 'w-2 h-2 bg-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Technical Agent Trace Collapsible Toggle (For Judges / Tech evaluation) */}
        {traces && traces.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowTraceDetails(!showTraceDetails)}
              className="text-[11px] text-cyan-400/70 hover:text-cyan-300 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-white/5"
            >
              <span>{showTraceDetails ? 'Hide Agent Trace Logs' : 'View Real-Time Trace Logs'}</span>
              {showTraceDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showTraceDetails && (
              <div className="mt-2 w-full max-w-lg text-left bg-slate-950/90 border border-cyan-500/20 rounded-xl p-3 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-36 overflow-y-auto">
                {traces.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">[{t.step}/5]</span>
                    <span className="text-slate-400">{t.title}:</span>
                    <span className="text-slate-200">{t.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer Text */}
        <p className="text-[10px] sm:text-[11px] text-slate-400/80 max-w-xl text-center mt-4 leading-relaxed">
          Informational guidance only. HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or official scheme helpline before acting.
        </p>

        {/* Retry or Error button if needed */}
        {onRetry && !isLoading && traceCount === 0 && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 px-4 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold hover:bg-red-500/30 flex items-center gap-1.5 transition-all"
          >
            <AlertCircle size={14} />
            <span>Connection stalled — Click to Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}
