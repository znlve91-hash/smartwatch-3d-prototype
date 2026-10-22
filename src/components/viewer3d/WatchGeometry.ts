import * as THREE from 'three';
import type { WatchModelType } from '../../types';

export interface WatchMaterialOptions {
  caseColor?: string;
  strapColor?: string;
  screenTexture?: THREE.Texture | null;
}

export function updateWatchMaterials(
  group: THREE.Group,
  options: WatchMaterialOptions
): void {
  const { caseColor, strapColor, screenTexture } = options;

  group.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const role = child.userData?.role;
    if (!role) return;

    const material = child.material as THREE.MeshStandardMaterial;

    if (role === 'case' && caseColor && material && material.color) {
      material.color.set(caseColor);
      material.needsUpdate = true;
    } else if (role === 'strap' && strapColor && material && material.color) {
      material.color.set(strapColor);
      material.needsUpdate = true;
    } else if (role === 'screen' && screenTexture !== undefined) {
      if (screenTexture) {
        material.map = screenTexture;
        if ('emissiveMap' in material) {
          (material as THREE.MeshStandardMaterial).emissiveMap = screenTexture;
        }
      }
      material.needsUpdate = true;
    } else if (role === 'crown' && caseColor && material && material.color) {
      // Crown slightly accented
      material.color.set(caseColor);
      material.needsUpdate = true;
    }
  });
}

/**
 * Creates Band Model (capsule chassis + screen + continuous wrap-around strap)
 */
export function createBandModel(options: WatchMaterialOptions = {}): THREE.Group {
  const group = new THREE.Group();
  group.name = 'BandModel';

  const caseColor = options.caseColor || '#1E293B';
  const strapColor = options.strapColor || '#0F172A';

  // Materials
  const caseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(caseColor),
    roughness: 0.35,
    metalness: 0.4,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(strapColor),
    roughness: 0.75,
    metalness: 0.05,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    map: options.screenTexture || null,
    roughness: 0.1,
    metalness: 0.1,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: options.screenTexture || null,
    emissiveIntensity: 0.9,
  });

  // 1. Capsule Chassis
  const capsuleGeo = new THREE.CapsuleGeometry(0.55, 1.2, 16, 32);
  const capsuleMesh = new THREE.Mesh(capsuleGeo, caseMat);
  capsuleMesh.scale.set(0.9, 1.15, 0.45);
  capsuleMesh.castShadow = true;
  capsuleMesh.receiveShadow = true;
  capsuleMesh.userData.role = 'case';
  group.add(capsuleMesh);

  // 2. Bezel Edge Ring
  const bezelGeo = new THREE.TorusGeometry(0.56, 0.035, 16, 48);
  const bezelMesh = new THREE.Mesh(bezelGeo, caseMat.clone());
  bezelMesh.scale.set(0.88, 1.45, 1);
  bezelMesh.position.z = 0.18;
  bezelMesh.userData.role = 'case';
  group.add(bezelMesh);

  // 3. Screen Face
  // Capsule screen slightly curved and mapped to 512x512 CanvasTexture
  const screenGeo = new THREE.PlaneGeometry(0.88, 1.62, 16, 16);
  // Curve screen slightly along X to match capsule curvature
  const pos = screenGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const zOffset = -Math.pow(x / 0.44, 2) * 0.04;
    pos.setZ(i, zOffset);
  }
  screenGeo.computeVertexNormals();

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.225;
  screenMesh.userData.role = 'screen';
  group.add(screenMesh);

  // 4. Continuous Wrap-Around Strap
  // Generates smooth continuous loop curving backwards around wrist
  const strapCurvePoints = [
    new THREE.Vector3(0, 0.8, -0.05),
    new THREE.Vector3(0, 1.4, -0.4),
    new THREE.Vector3(0, 1.6, -1.1),
    new THREE.Vector3(0, 1.2, -1.8),
    new THREE.Vector3(0, 0, -2.1),
    new THREE.Vector3(0, -1.2, -1.8),
    new THREE.Vector3(0, -1.6, -1.1),
    new THREE.Vector3(0, -1.4, -0.4),
    new THREE.Vector3(0, -0.8, -0.05),
  ];
  const strapCurve = new THREE.CatmullRomCurve3(strapCurvePoints);
  const strapTubeGeo = new THREE.TubeGeometry(strapCurve, 64, 0.38, 16, false);
  // Flatten tube along X and Z for a realistic strap cross-section
  const strapMesh = new THREE.Mesh(strapTubeGeo, strapMat);
  strapMesh.scale.set(1.9, 1.0, 0.42);
  strapMesh.castShadow = true;
  strapMesh.receiveShadow = true;
  strapMesh.userData.role = 'strap';
  group.add(strapMesh);

  // Strap buckle / pin loop detail at back
  const buckleGeo = new THREE.BoxGeometry(0.85, 0.22, 0.24);
  const buckleMesh = new THREE.Mesh(buckleGeo, caseMat.clone());
  buckleMesh.position.set(0, 0, -2.12);
  buckleMesh.userData.role = 'case';
  group.add(buckleMesh);

  return group;
}

/**
 * Creates Smart Watch Round Model (casing, bezel, crown knob, side button, lugs, straps)
 */
export function createWatchRoundModel(options: WatchMaterialOptions = {}): THREE.Group {
  const group = new THREE.Group();
  group.name = 'WatchRoundModel';

  const caseColor = options.caseColor || '#CBD5E1';
  const strapColor = options.strapColor || '#94A3B8';

  // Materials
  const caseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(caseColor),
    roughness: 0.2,
    metalness: 0.88,
  });

  const bezelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(caseColor).offsetHSL(0, 0, -0.04),
    roughness: 0.15,
    metalness: 0.92,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(strapColor),
    roughness: 0.68,
    metalness: 0.1,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    map: options.screenTexture || null,
    roughness: 0.08,
    metalness: 0.1,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: options.screenTexture || null,
    emissiveIntensity: 0.92,
  });

  // 1. Outer Casing Cylinder
  const caseGeo = new THREE.CylinderGeometry(1.28, 1.25, 0.38, 64);
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.rotation.x = Math.PI / 2;
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  caseMesh.userData.role = 'case';
  group.add(caseMesh);

  // 2. Bezel Ring Chamfer
  const bezelGeo = new THREE.TorusGeometry(1.25, 0.075, 16, 64);
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
  bezelMesh.position.z = 0.18;
  bezelMesh.userData.role = 'case';
  group.add(bezelMesh);

  // 3. Circular Screen Face
  const screenGeo = new THREE.CircleGeometry(1.17, 64);
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.201;
  screenMesh.userData.role = 'screen';
  group.add(screenMesh);

  // 4. Digital Crown Knob at 3 o'clock
  const crownGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 32);
  const crownMesh = new THREE.Mesh(crownGeo, bezelMat.clone());
  crownMesh.rotation.z = Math.PI / 2;
  crownMesh.position.set(1.36, 0.18, 0);
  crownMesh.castShadow = true;
  crownMesh.userData.role = 'crown';
  group.add(crownMesh);

  // Crown accent ring
  const crownRingGeo = new THREE.TorusGeometry(0.182, 0.02, 16, 32);
  const crownRingMesh = new THREE.Mesh(crownRingGeo, strapMat.clone());
  crownRingMesh.rotation.y = Math.PI / 2;
  crownRingMesh.position.set(1.42, 0.18, 0);
  crownRingMesh.userData.role = 'strap';
  group.add(crownRingMesh);

  // 5. Tactile Side Pusher Button at 4 o'clock
  const buttonGeo = new THREE.BoxGeometry(0.12, 0.28, 0.16);
  const buttonMesh = new THREE.Mesh(buttonGeo, caseMat.clone());
  buttonMesh.position.set(1.3, -0.42, 0);
  buttonMesh.userData.role = 'case';
  group.add(buttonMesh);

  // 6. Lugs (Top and Bottom dual brackets)
  const lugGeo = new THREE.BoxGeometry(0.18, 0.44, 0.32);
  const lugPositions = [
    [-0.64, 1.34, -0.04],
    [0.64, 1.34, -0.04],
    [-0.64, -1.34, -0.04],
    [0.64, -1.34, -0.04],
  ];
  lugPositions.forEach(([x, y, z]) => {
    const lug = new THREE.Mesh(lugGeo, caseMat.clone());
    lug.position.set(x, y, z);
    lug.userData.role = 'case';
    group.add(lug);
  });

  // 7. Top & Bottom Straps
  // Top strap curving backward
  const topStrapPoints = [
    new THREE.Vector3(0, 1.25, 0),
    new THREE.Vector3(0, 1.85, -0.2),
    new THREE.Vector3(0, 2.35, -0.75),
    new THREE.Vector3(0, 2.2, -1.45),
  ];
  const topCurve = new THREE.CatmullRomCurve3(topStrapPoints);
  const topStrapGeo = new THREE.TubeGeometry(topCurve, 32, 0.52, 16, false);
  const topStrapMesh = new THREE.Mesh(topStrapGeo, strapMat);
  topStrapMesh.scale.set(1.85, 1, 0.22);
  topStrapMesh.castShadow = true;
  topStrapMesh.userData.role = 'strap';
  group.add(topStrapMesh);

  // Bottom strap curving backward
  const bottomStrapPoints = [
    new THREE.Vector3(0, -1.25, 0),
    new THREE.Vector3(0, -1.85, -0.2),
    new THREE.Vector3(0, -2.35, -0.75),
    new THREE.Vector3(0, -2.2, -1.45),
  ];
  const bottomCurve = new THREE.CatmullRomCurve3(bottomStrapPoints);
  const bottomStrapGeo = new THREE.TubeGeometry(bottomCurve, 32, 0.52, 16, false);
  const bottomStrapMesh = new THREE.Mesh(bottomStrapGeo, strapMat);
  bottomStrapMesh.scale.set(1.85, 1, 0.22);
  bottomStrapMesh.castShadow = true;
  bottomStrapMesh.userData.role = 'strap';
  group.add(bottomStrapMesh);

  return group;
}

/**
 * Creates Smart Watch Squircle Model (Grade 5 Titanium squircle casing, bezel rim, crown guard, straps)
 */
export function createWatchSquircleModel(options: WatchMaterialOptions = {}): THREE.Group {
  const group = new THREE.Group();
  group.name = 'WatchSquircleModel';

  const caseColor = options.caseColor || '#94A3B8';
  const strapColor = options.strapColor || '#0891B2';

  // Materials
  const caseMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(caseColor),
    roughness: 0.32,
    metalness: 0.82,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(caseColor).offsetHSL(0, 0, 0.06),
    roughness: 0.25,
    metalness: 0.88,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(strapColor),
    roughness: 0.72,
    metalness: 0.08,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    map: options.screenTexture || null,
    roughness: 0.08,
    metalness: 0.1,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: options.screenTexture || null,
    emissiveIntensity: 0.95,
  });

  // 1. Squircle Shape & Extrusion
  const width = 2.2;
  const height = 2.45;
  const radius = 0.55;

  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.44,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  const caseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  caseGeo.center();
  const caseMesh = new THREE.Mesh(caseGeo, caseMat);
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  caseMesh.userData.role = 'case';
  group.add(caseMesh);

  // 2. Protective Raised Bezel Lip
  const lipShape = new THREE.Shape();
  const lw = width - 0.12;
  const lh = height - 0.12;
  const lr = radius - 0.06;
  const lx = -lw / 2;
  const ly = -lh / 2;
  lipShape.moveTo(lx + lr, ly);
  lipShape.lineTo(lx + lw - lr, ly);
  lipShape.quadraticCurveTo(lx + lw, ly, lx + lw, ly + lr);
  lipShape.lineTo(lx + lw, ly + lh - lr);
  lipShape.quadraticCurveTo(lx + lw, ly + lh, lx + lw - lr, ly + lh);
  lipShape.lineTo(lx + lr, ly + lh);
  lipShape.quadraticCurveTo(lx, ly + lh, lx, ly + lh - lr);
  lipShape.lineTo(lx, ly + lr);
  lipShape.quadraticCurveTo(lx, ly, lx + lr, ly);

  // Screen cutout inner hole
  const hole = new THREE.Path();
  const sw = lw - 0.18;
  const sh = lh - 0.18;
  const sr = lr - 0.08;
  const sx = -sw / 2;
  const sy = -sh / 2;
  hole.moveTo(sx + sr, sy);
  hole.lineTo(sx + sw - sr, sy);
  hole.quadraticCurveTo(sx + sw, sy, sx + sw, sy + sr);
  hole.lineTo(sx + sw, sy + sh - sr);
  hole.quadraticCurveTo(sx + sw, sy + sh, sx + sw - sr, sy + sh);
  hole.lineTo(sx + sr, sy + sh);
  hole.quadraticCurveTo(sx, sy + sh, sx, sy + sh - sr);
  hole.lineTo(sx, sy + sr);
  hole.quadraticCurveTo(sx, sy, sx + sr, sy);
  lipShape.holes.push(hole);

  const lipGeo = new THREE.ExtrudeGeometry(lipShape, {
    depth: 0.06,
    bevelEnabled: false,
  });
  lipGeo.center();
  const lipMesh = new THREE.Mesh(lipGeo, rimMat);
  lipMesh.position.z = 0.28;
  lipMesh.userData.role = 'case';
  group.add(lipMesh);

  // 3. Screen Face (Squircle plane with UV mapping)
  const screenShape = new THREE.Shape();
  screenShape.moveTo(sx + sr, sy);
  screenShape.lineTo(sx + sw - sr, sy);
  screenShape.quadraticCurveTo(sx + sw, sy, sx + sw, sy + sr);
  screenShape.lineTo(sx + sw, sy + sh - sr);
  screenShape.quadraticCurveTo(sx + sw, sy + sh, sx + sw - sr, sy + sh);
  screenShape.lineTo(sx + sr, sy + sh);
  screenShape.quadraticCurveTo(sx, sy + sh, sx, sy + sh - sr);
  screenShape.lineTo(sx, sy + sr);
  screenShape.quadraticCurveTo(sx, sy, sx + sr, sy);

  const screenGeo = new THREE.ShapeGeometry(screenShape);
  // Remap UV coordinates cleanly from [0, 1]
  const screenPos = screenGeo.attributes.position;
  const uvs = new Float32Array(screenPos.count * 2);
  for (let i = 0; i < screenPos.count; i++) {
    const px = screenPos.getX(i);
    const py = screenPos.getY(i);
    uvs[i * 2] = (px - sx) / sw;
    uvs[i * 2 + 1] = (py - sy) / sh;
  }
  screenGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.27;
  screenMesh.userData.role = 'screen';
  group.add(screenMesh);

  // 4. Digital Crown + Crown Guard at Right Side
  const guardGeo = new THREE.BoxGeometry(0.24, 0.95, 0.38);
  const guardMesh = new THREE.Mesh(guardGeo, caseMat.clone());
  guardMesh.position.set(1.24, 0.22, 0);
  guardMesh.userData.role = 'case';
  group.add(guardMesh);

  const crownGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.24, 32);
  const crownMesh = new THREE.Mesh(crownGeo, rimMat.clone());
  crownMesh.rotation.z = Math.PI / 2;
  crownMesh.position.set(1.36, 0.32, 0);
  crownMesh.castShadow = true;
  crownMesh.userData.role = 'crown';
  group.add(crownMesh);

  // Orange Action Button on Left Side
  const actionButtonGeo = new THREE.BoxGeometry(0.12, 0.6, 0.22);
  const actionButtonMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F97316'), // Bright Tactical Orange
    roughness: 0.3,
    metalness: 0.5,
  });
  const actionButtonMesh = new THREE.Mesh(actionButtonGeo, actionButtonMat);
  actionButtonMesh.position.set(-1.24, 0.1, 0);
  group.add(actionButtonMesh);

  // 5. Alpine / Trail Loop Straps
  const topStrapPoints = [
    new THREE.Vector3(0, 1.35, -0.05),
    new THREE.Vector3(0, 1.95, -0.25),
    new THREE.Vector3(0, 2.45, -0.85),
    new THREE.Vector3(0, 2.25, -1.5),
  ];
  const topCurve = new THREE.CatmullRomCurve3(topStrapPoints);
  const topStrapGeo = new THREE.TubeGeometry(topCurve, 32, 0.56, 16, false);
  const topStrapMesh = new THREE.Mesh(topStrapGeo, strapMat);
  topStrapMesh.scale.set(1.95, 1, 0.26);
  topStrapMesh.castShadow = true;
  topStrapMesh.userData.role = 'strap';
  group.add(topStrapMesh);

  const bottomStrapPoints = [
    new THREE.Vector3(0, -1.35, -0.05),
    new THREE.Vector3(0, -1.95, -0.25),
    new THREE.Vector3(0, -2.45, -0.85),
    new THREE.Vector3(0, -2.25, -1.5),
  ];
  const bottomCurve = new THREE.CatmullRomCurve3(bottomStrapPoints);
  const bottomStrapGeo = new THREE.TubeGeometry(bottomCurve, 32, 0.56, 16, false);
  const bottomStrapMesh = new THREE.Mesh(bottomStrapGeo, strapMat);
  bottomStrapMesh.scale.set(1.95, 1, 0.26);
  bottomStrapMesh.castShadow = true;
  bottomStrapMesh.userData.role = 'strap';
  group.add(bottomStrapMesh);

  return group;
}

/**
 * Main factory function to create procedural model according to modelType
 */
export function createWatchModel(
  modelType: WatchModelType,
  options: WatchMaterialOptions = {}
): THREE.Group {
  switch (modelType) {
    case 'band_capsule':
      return createBandModel(options);
    case 'watch_round':
      return createWatchRoundModel(options);
    case 'watch_squircle':
      return createWatchSquircleModel(options);
    default:
      return createWatchRoundModel(options);
  }
}
