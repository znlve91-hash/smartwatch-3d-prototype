/**
 * Procedural 3D Wearable Geometry Builder (Three.js)
 * High-fidelity Smart Watch & Smart Band Models
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import * as THREE from 'three';

/**
 * Creates high-fidelity procedural 3D model for Smart Watch
 * Features: chamfered chassis, bezel ring, sapphire glass, rotating crown,
 * micro push-button, lug attachments, and dual curved segmented straps.
 */
export function createWatchModel(options = {}) {
  const {
    chassisColor = '#0F172A',
    strapColor = '#1E293B',
    accentColor = '#7C3AED',
    screenTexture = null,
    tier = 'pro',
  } = options;

  const group = new THREE.Group();
  group.name = 'SmartWatch';

  // Materials
  const metalness = tier === 'pro_max' ? 0.95 : (tier === 'pro' ? 0.9 : 0.8);
  const roughness = tier === 'pro_max' ? 0.35 : 0.25;

  const chassisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisColor),
    metalness,
    roughness,
  });

  const bezelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisColor),
    metalness: 0.95,
    roughness: 0.2,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(strapColor),
    roughness: 0.65,
    metalness: 0.1,
  });

  const crownMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisColor),
    metalness: 0.95,
    roughness: 0.3,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.85,
    roughness: 0.25,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.5,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTexture || null,
    roughness: 0.15,
    metalness: 0.05,
    emissive: 0xffffff,
    emissiveMap: screenTexture || null,
    emissiveIntensity: 0.45,
  });

  // 1. Main Beveled Chassis Cylinder
  const chassisGeom = new THREE.CylinderGeometry(1.85, 1.85, 0.45, 64);
  const chassisMesh = new THREE.Mesh(chassisGeom, chassisMat);
  chassisMesh.name = 'WatchChassis';
  chassisMesh.rotation.x = Math.PI / 2;
  group.add(chassisMesh);

  // 2. Chamfered Outer Bezel Ring
  const bezelGeom = new THREE.TorusGeometry(1.82, 0.09, 16, 64);
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  bezelMesh.name = 'WatchBezel';
  bezelMesh.position.z = 0.2;
  group.add(bezelMesh);

  // 3. Watch Face Screen Disk
  const screenGeom = new THREE.CylinderGeometry(1.7, 1.7, 0.02, 64);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.name = 'WatchScreen';
  screenMesh.rotation.x = Math.PI / 2;
  screenMesh.position.z = 0.23;
  group.add(screenMesh);

  // 4. Sapphire Glass Lens Cap
  const glassGeom = new THREE.CylinderGeometry(1.72, 1.72, 0.03, 64);
  const glassMesh = new THREE.Mesh(glassGeom, glassMat);
  glassMesh.name = 'WatchGlass';
  glassMesh.rotation.x = Math.PI / 2;
  glassMesh.position.z = 0.26;
  group.add(glassMesh);

  // 5. Digital Crown (Right side: +X)
  const crownGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.28, 32);
  const crownMesh = new THREE.Mesh(crownGeom, crownMat);
  crownMesh.name = 'WatchCrown';
  crownMesh.rotation.z = Math.PI / 2;
  crownMesh.position.set(1.98, 0.35, 0);
  group.add(crownMesh);

  // Accent Ring inside Crown
  const crownRingGeom = new THREE.TorusGeometry(0.22, 0.03, 16, 32);
  const crownRingMesh = new THREE.Mesh(crownRingGeom, accentMat);
  crownRingMesh.name = 'WatchCrownAccent';
  crownRingMesh.rotation.y = Math.PI / 2;
  crownRingMesh.position.set(2.05, 0.35, 0);
  group.add(crownRingMesh);

  // 6. Micro Push Button (Lower right: +X, -Y)
  const buttonGeom = new THREE.BoxGeometry(0.18, 0.32, 0.16);
  const buttonMesh = new THREE.Mesh(buttonGeom, chassisMat);
  buttonMesh.name = 'WatchButton';
  buttonMesh.position.set(1.92, -0.45, 0);
  group.add(buttonMesh);

  // 7. Lug Attachments (Top & Bottom)
  const lugGeom = new THREE.BoxGeometry(0.32, 0.65, 0.42);

  // Top Left Lug
  const lugTL = new THREE.Mesh(lugGeom, chassisMat);
  lugTL.name = 'WatchLugTL';
  lugTL.position.set(-1.0, 2.05, -0.05);
  lugTL.rotation.z = 0.1;
  group.add(lugTL);

  // Top Right Lug
  const lugTR = new THREE.Mesh(lugGeom, chassisMat);
  lugTR.name = 'WatchLugTR';
  lugTR.position.set(1.0, 2.05, -0.05);
  lugTR.rotation.z = -0.1;
  group.add(lugTR);

  // Bottom Left Lug
  const lugBL = new THREE.Mesh(lugGeom, chassisMat);
  lugBL.name = 'WatchLugBL';
  lugBL.position.set(-1.0, -2.05, -0.05);
  lugBL.rotation.z = -0.1;
  group.add(lugBL);

  // Bottom Right Lug
  const lugBR = new THREE.Mesh(lugGeom, chassisMat);
  lugBR.name = 'WatchLugBR';
  lugBR.position.set(1.0, -2.05, -0.05);
  lugBR.rotation.z = 0.1;
  group.add(lugBR);

  // 8. Dual Curved Segmented Wrist Straps
  // Top Strap (Curving up and back towards -Z)
  const topStrapGroup = createSegmentedStrap(strapMat, 1, 1.6, 10, -0.18, 'WatchStrapTop');
  topStrapGroup.name = 'WatchStrapTop';
  topStrapGroup.position.set(0, 2.0, -0.05);
  group.add(topStrapGroup);

  // Bottom Strap (Curving down and back towards -Z)
  const bottomStrapGroup = createSegmentedStrap(strapMat, -1, 1.6, 12, 0.18, 'WatchStrapBottom');
  bottomStrapGroup.name = 'WatchStrapBottom';
  bottomStrapGroup.position.set(0, -2.0, -0.05);
  group.add(bottomStrapGroup);

  return group;
}

/**
 * Creates high-fidelity procedural 3D model for Smart Band
 * Features: elongated capsule chassis, silicone band loop, pill screen, clasp pin
 */
export function createBandModel(options = {}) {
  const {
    chassisColor = '#0F172A',
    strapColor = '#1E293B',
    accentColor = '#CBD5E1',
    screenTexture = null,
    tier = 'pro',
  } = options;

  const group = new THREE.Group();
  group.name = 'SmartBand';

  const chassisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisColor),
    metalness: tier === 'pro' ? 0.9 : 0.75,
    roughness: 0.3,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(strapColor),
    roughness: 0.8,
    metalness: 0.05,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTexture || null,
    roughness: 0.15,
    metalness: 0.05,
    emissive: 0xffffff,
    emissiveMap: screenTexture || null,
    emissiveIntensity: 0.45,
  });

  const pinMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    metalness: 0.95,
    roughness: 0.2,
  });

  // 1. Elongated Capsule Chassis
  const capsuleGeom = new THREE.CapsuleGeometry(0.85, 1.8, 16, 32);
  const capsuleMesh = new THREE.Mesh(capsuleGeom, chassisMat);
  capsuleMesh.name = 'BandCapsuleChassis';
  capsuleMesh.scale.set(0.9, 1.0, 0.55);
  group.add(capsuleMesh);

  // 2. Beveled Bezel Trim
  const bezelGeom = new THREE.TorusGeometry(0.88, 0.06, 16, 32);
  const bezelMesh = new THREE.Mesh(bezelGeom, chassisMat);
  bezelMesh.name = 'BandBezel';
  bezelMesh.scale.set(0.85, 1.7, 0.55);
  bezelMesh.position.z = 0.22;
  group.add(bezelMesh);

  // 3. Pill Screen
  const screenGeom = new THREE.CylinderGeometry(0.68, 0.68, 0.02, 32);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.name = 'BandScreen';
  screenMesh.rotation.x = Math.PI / 2;
  screenMesh.scale.set(1.0, 0.9, 2.0);
  screenMesh.position.z = 0.28;
  group.add(screenMesh);

  // 4. Silicone Strap Loop (Wraps around capsule and loops back)
  const topBandStrap = createBandSiliconeStrap(strapMat, 1, 1.3, 12);
  topBandStrap.name = 'BandStrapTop';
  topBandStrap.position.set(0, 1.5, 0);
  group.add(topBandStrap);

  const bottomBandStrap = createBandSiliconeStrap(strapMat, -1, 1.3, 14);
  bottomBandStrap.name = 'BandStrapBottom';
  bottomBandStrap.position.set(0, -1.5, 0);
  group.add(bottomBandStrap);

  // 5. Clasp Pin / Accent Stud
  const pinGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 24);
  const pinMesh = new THREE.Mesh(pinGeom, pinMat);
  pinMesh.name = 'BandClaspPin';
  pinMesh.rotation.x = Math.PI / 2;
  pinMesh.position.set(0, -3.2, -1.5);
  group.add(pinMesh);

  return group;
}

/**
 * Creates segmented wrist strap for Smart Watch
 */
function createSegmentedStrap(material, direction = 1, width = 1.6, segmentCount = 10, bendOffset = 0, prefix = 'WatchStrap') {
  const strapGroup = new THREE.Group();
  const segmentLength = 0.35;
  const thickness = 0.22;

  let currentY = 0;
  let currentZ = 0;
  let currentAngle = 0;

  for (let i = 0; i < segmentCount; i++) {
    // Each segment gets progressively slightly narrower and curves backwards (-Z)
    const segWidth = width * (1 - (i / segmentCount) * 0.15);
    const geom = new THREE.BoxGeometry(segWidth, segmentLength * 0.92, thickness);
    const mesh = new THREE.Mesh(geom, material);
    mesh.name = `${prefix}_Segment_${i}`;

    // Calculate curve bending back towards -Z (wrist curvature)
    const curveFactor = Math.pow(i / segmentCount, 1.4) * 0.3;
    currentAngle += curveFactor * direction;

    mesh.position.set(0, currentY, currentZ);
    mesh.rotation.x = currentAngle;

    strapGroup.add(mesh);

    currentY += Math.cos(currentAngle) * segmentLength * direction;
    currentZ -= Math.sin(Math.abs(currentAngle)) * segmentLength + 0.08;
  }

  return strapGroup;
}

/**
 * Creates seamless silicone band loop for Smart Band
 */
function createBandSiliconeStrap(material, direction = 1, width = 1.3, segmentCount = 12) {
  const strapGroup = new THREE.Group();
  const segmentLength = 0.32;
  const thickness = 0.2;

  let currentY = 0;
  let currentZ = 0;
  let currentAngle = 0;

  for (let i = 0; i < segmentCount; i++) {
    const geom = new THREE.BoxGeometry(width, segmentLength * 0.95, thickness);
    const mesh = new THREE.Mesh(geom, material);
    mesh.name = `BandStrapSegment_${i}`;

    const curveFactor = Math.pow(i / segmentCount, 1.3) * 0.28;
    currentAngle += curveFactor * direction;

    mesh.position.set(0, currentY, currentZ);
    mesh.rotation.x = currentAngle;

    strapGroup.add(mesh);

    currentY += Math.cos(currentAngle) * segmentLength * direction;
    currentZ -= Math.sin(Math.abs(currentAngle)) * segmentLength + 0.1;
  }

  return strapGroup;
}

/**
 * Swaps / updates chassis and strap colors in real time across the model hierarchy
 */
export function updateModelColors(modelGroup, { chassisColor, strapColor, accentColor }) {
  if (!modelGroup) return;

  modelGroup.traverse((child) => {
    if (!child.isMesh || !child.material) return;

    const name = child.name || '';
    const parentName = child.parent?.name || '';

    if (chassisColor && (
      name.includes('Chassis') ||
      name.includes('Bezel') ||
      name.includes('Crown') ||
      name.includes('Button') ||
      name.includes('Lug')
    )) {
      if (!name.includes('Accent')) {
        child.material.color.set(chassisColor);
        child.material.needsUpdate = true;
      }
    }

    if (strapColor && (
      name.includes('Strap') ||
      parentName.includes('Strap')
    )) {
      child.material.color.set(strapColor);
      child.material.needsUpdate = true;
    }

    if (accentColor && (
      name.includes('Accent') ||
      name.includes('Pin')
    )) {
      child.material.color.set(accentColor);
      child.material.needsUpdate = true;
    }
  });
}

/**
 * Safely disposes all geometries and materials across model hierarchy
 */
export function disposeModel(modelGroup) {
  if (!modelGroup) return;

  modelGroup.traverse((child) => {
    if (child.isMesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });

  while (modelGroup.children.length > 0) {
    modelGroup.remove(modelGroup.children[0]);
  }
}
