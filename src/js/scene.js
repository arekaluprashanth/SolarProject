import * as THREE from 'three';
import { planetsData, sunData } from '../data/planets.js';

export class SolarSystem {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.planets = [];
    this.stars = null;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedPlanet = null;
    this.isAnimating = false;
    this.timeScale = 1;
    this.speedMultiplier = 1;
    this.showOrbits = true;
    this.showLabels = true;
    this.isPaused = false;
    this.labels = [];
    this.onPlanetClick = null;

    this.init();
    this.createSun();
    this.createPlanets();
    this.createStarField();
    this.createLighting();
    this.addEventListeners();
    this.animate();
  }

  init() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000008);
    this.scene.fog = new THREE.FogExp2(0x000008, 0.00015);

    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 5000);
    this.camera.position.set(0, 80, 250);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);

    // OrbitControls (simple implementation inline)
    this.controls = this.createOrbitControls();
  }

  createOrbitControls() {
    const controls = {
      target: new THREE.Vector3(0, 0, 0),
      rotateSpeed: 0.5,
      zoomSpeed: 1.0,
      panSpeed: 0.5,
      minDistance: 15,
      maxDistance: 1200,
      spherical: new THREE.Spherical(),
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      autoRotate: false,
      autoRotateSpeed: 0.3
    };

    const offset = new THREE.Vector3().copy(this.camera.position).sub(controls.target);
    controls.spherical.setFromVector3(offset);

    return controls;
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(12, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xFDB813,
      emissive: 0xFDB813,
      emissiveIntensity: 1.0
    });

    this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
    this.sun.name = 'sun';
    this.scene.add(this.sun);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(16, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        glowColor: { value: new THREE.Color(0xFF8C00) },
        coeff: { value: 0.8 },
        power: { value: 2.5 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 glowColor;
        uniform float coeff;
        uniform float power;
        void main() {
          float intensity = pow(coeff - dot(vNormal, vec3(0, 0, 1.0)), power);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `
    });

    this.sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sun.add(this.sunGlow);

    // Corona sprite
    const coronaTexture = this.createRadialGradientTexture(0xFFD700, 0xFF8C00);
    const coronaMaterial = new THREE.SpriteMaterial({
      map: coronaTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const corona = new THREE.Sprite(coronaMaterial);
    corona.scale.set(60, 60, 1);
    this.sun.add(corona);

    // Sun light
    const sunLight = new THREE.PointLight(0xFFF8E7, 3, 0, 0);
    sunLight.position.set(0, 0, 0);
    this.sun.add(sunLight);

    // Ambient light for visibility
    const ambient = new THREE.AmbientLight(0x404050, 0.4);
    this.scene.add(ambient);
  }

  createRadialGradientTexture(innerColor, outerColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(${(innerColor >> 16) & 255}, ${(innerColor >> 8) & 255}, ${innerColor & 255}, 1)`);
    gradient.addColorStop(0.5, `rgba(${(outerColor >> 16) & 255}, ${(outerColor >> 8) & 255}, ${outerColor & 255}, 0.4)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }

  createPlanets() {
    const AU_SCALE = 22; // 1 AU = 22 units for visual distance
    const SIZE_SCALE = 1.2; // size multiplier for visual proportion

    planetsData.forEach((data, index) => {
      const group = new THREE.Group();
      group.name = `orbit-${data.id}`;

      // Orbit radius based on distance from sun scaled
      const orbitRadius = 20 + (data.distanceFromSun * AU_SCALE);
      group.userData = { orbitRadius };

      // Planet size - logarithmically scaled for visibility
      const baseSize = Math.max(0.8, Math.pow(data.radius / 6371, 0.4) * 3);
      const planetSize = baseSize * SIZE_SCALE;

      // Planet mesh
      const geometry = new THREE.SphereGeometry(planetSize, 48, 48);
      const material = new THREE.MeshStandardMaterial({
        map: this.textureLoader.load(data.texture),
        roughness: 0.8,
        metalness: 0.1
      });

      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.name = data.id;
      planetMesh.position.x = orbitRadius;
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      planetMesh.userData = { ...data, planetSize };

      group.add(planetMesh);

      // Axial tilt
      planetMesh.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);

      // Rings
      if (data.hasRing && data.ringData) {
        this.addRings(planetMesh, planetSize, data.ringData);
      }

      // Moons
      if (data.moonData && data.moonData.length > 0) {
        this.addMoons(planetMesh, planetSize, data.moonData);
      }

      // Orbit path - use a ring geometry line
      this.addOrbitPath(group, orbitRadius);

      // Label sprite
      const label = this.createLabel(data.name, data.color);
      label.position.set(orbitRadius, planetSize + 4, 0);
      group.add(label);
      this.labels.push(label);

      // Starting angle for orbit - spread out planets
      const startAngle = (index * 137.5) * (Math.PI / 180); // golden angle distribution
      group.rotation.y = startAngle;

      // Store for animation
      this.planets.push({
        group,
        mesh: planetMesh,
        data,
        orbitRadius,
        planetSize,
        angle: startAngle,
        orbitalSpeed: 0.02 / Math.sqrt(data.distanceFromSun), // Kepler-inspired
        rotationSpeed: 0.002 * (Math.random() + 0.5),
        label
      });

      this.scene.add(group);
    });
  }

  addRings(planetMesh, planetSize, ringData) {
    const innerRadius = planetSize * ringData.innerRadius;
    const outerRadius = planetSize * ringData.outerRadius;

    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(ringData.color),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: ringData.opacity
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = THREE.MathUtils.degToRad(15);
    planetMesh.add(ring);

    // Add a second ring for detail
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius * 0.6, innerRadius * 0.95, 128),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(ringData.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: ringData.opacity * 0.7
      })
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.z = THREE.MathUtils.degToRad(15);
    planetMesh.add(ring2);
  }

  addMoons(planetMesh, planetSize, moonData) {
    const moonsGroup = new THREE.Group();
    moonsGroup.name = 'moons';

    moonData.forEach((moon, i) => {
      const moonSize = Math.max(0.15, (moon.radius / 6371) * 3 * planetSize / 3);
      const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 32);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xCCCCCC,
        roughness: 0.9,
        metalness: 0.1
      });
      const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

      const moonOrbitRadius = planetSize * (2.2 + i * 0.7);
      moonMesh.position.x = moonOrbitRadius;

      const moonOrbit = new THREE.Group();
      moonOrbit.add(moonMesh);
      moonOrbit.rotation.x = THREE.MathUtils.degToRad(15 + i * 5);
      moonOrbit.rotation.y = (i * 137.5) * (Math.PI / 180);

      moonMesh.userData = { orbitSpeed: 0.05 + i * 0.02, orbit: moonOrbit };
      moonsGroup.add(moonOrbit);
    });

    planetMesh.add(moonsGroup);
    planetMesh.userData.moonsGroup = moonsGroup;
  }

  addOrbitPath(group, radius) {
    const segments = 128;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x4A5568,
      transparent: true,
      opacity: 0.4
    });
    const orbitLine = new THREE.Line(geometry, material);
    group.add(orbitLine);
  }

  createLabel(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.font = 'bold 28px Montserrat, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 4, 1);
    sprite.userData = { isLabel: true, text };
    return sprite;
  }

  createStarField() {
    const count = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 800 + Math.random() * 1500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness * (0.8 + Math.random() * 0.2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  createLighting() {
    // Sun already has a point light
    // Add subtle hemisphere light for ambient detail
    const hemiLight = new THREE.HemisphereLight(0x444466, 0x000000, 0.2);
    this.scene.add(hemiLight);
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse interactions for planet selection
    this.renderer.domElement.addEventListener('click', (e) => this.onClick(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Drag for orbit controls
    this.renderer.domElement.addEventListener('mousedown', (e) => {
      this.controls.isDragging = true;
      this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.controls.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => this.onDrag(e));

    this.renderer.domElement.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
  }

  onWheel(e) {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    this.controls.spherical.radius *= scale;
    this.controls.spherical.radius = Math.max(
      this.controls.minDistance,
      Math.min(this.controls.maxDistance, this.controls.spherical.radius)
    );
  }

  onDrag(e) {
    if (!this.controls.isDragging) return;

    const deltaX = e.clientX - this.controls.previousMousePosition.x;
    const deltaY = e.clientY - this.controls.previousMousePosition.y;

    this.controls.spherical.theta -= deltaX * 0.005 * this.controls.rotateSpeed;
    this.controls.spherical.phi -= deltaY * 0.005 * this.controls.rotateSpeed;

    // Clamp phi to avoid gimbal lock
    this.controls.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.controls.spherical.phi));

    this.controls.previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  onMouseMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onClick(e) {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const planetMeshes = this.planets.map(p => p.mesh);
    const intersects = this.raycaster.intersectObjects(planetMeshes, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.name.includes('planet') && !planetsData.find(p => p.id === obj.name)) {
        if (planetsData.find(p => p.id === obj.name)) break;
        obj = obj.parent;
        if (!obj) break;
      }

      if (obj && obj.name && planetsData.find(p => p.id === obj.name)) {
        if (this.onPlanetClick) {
          this.onPlanetClick(obj.name);
        }
      }
    }
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  focusPlanet(planetId) {
    const planet = this.planets.find(p => p.data.id === planetId);
    if (!planet) return;

    this.selectedPlanet = planet;

    // Calculate target position
    const worldPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(worldPos);

    const distance = planet.planetSize * 8 + 15;

    // Animate camera to planet
    const targetOffset = new THREE.Vector3(distance, distance * 0.4, distance);
    const targetPosition = worldPos.clone().add(targetOffset);

    this.animateCamera(targetPosition, worldPos);
  }

  resetView() {
    this.selectedPlanet = null;
    const targetPosition = new THREE.Vector3(0, 80, 250);
    this.animateCamera(targetPosition, new THREE.Vector3(0, 0, 0));
  }

  animateCamera(targetPos, targetLookAt) {
    this.isAnimating = true;
    const startPos = this.camera.position.clone();
    const startLookAt = this.controls.target.clone();
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, eased);
      this.controls.target.lerpVectors(startLookAt, targetLookAt, eased);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    requestAnimationFrame(animate);
  }

  setTimeScale(scale) {
    this.timeScale = scale;
  }

  setSpeedMultiplier(mult) {
    this.speedMultiplier = mult;
  }

  setShowOrbits(show) {
    this.showOrbits = show;
    this.planets.forEach(p => {
      p.group.children.forEach(child => {
        if (child instanceof THREE.Line) {
          child.visible = show;
        }
      });
    });
  }

  setShowLabels(show) {
    this.showLabels = show;
    this.labels.forEach(l => l.visible = show);
  }

  pause() {
    this.isPaused = true;
  }

  play() {
    this.isPaused = false;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (!this.isPaused) {
      const time = performance.now() * 0.001 * this.timeScale * this.speedMultiplier;

      // Rotate sun
      this.sun.rotation.y += 0.002;

      // Animate planets
      this.planets.forEach((p) => {
        // Orbit
        p.group.rotation.y += p.orbitalSpeed * delta * 60 * this.timeScale * this.speedMultiplier;

        // Self rotation
        p.mesh.rotation.y += p.rotationSpeed * this.timeScale * this.speedMultiplier;

        // Animate moons
        if (p.mesh.userData.moonsGroup) {
          p.mesh.userData.moonsGroup.children.forEach(orbit => {
            orbit.rotation.y += orbit.children[0].userData.orbitSpeed * delta * 60;
          });
        }
      });

      // Rotate stars slowly
      if (this.stars) {
        this.stars.rotation.y += 0.0002;
      }
    }

    // Update orbit controls
    if (!this.isAnimating) {
      const offset = new THREE.Vector3().copy(this.camera.position).sub(this.controls.target);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.radius = this.controls.spherical.radius;
      spherical.theta = this.controls.spherical.theta;
      spherical.phi = this.controls.spherical.phi;

      const newPos = new THREE.Vector3().setFromSpherical(spherical).add(this.controls.target);
      this.camera.position.copy(newPos);
    }

    this.camera.lookAt(this.controls.target);

    this.renderer.render(this.scene, this.camera);
  }
}