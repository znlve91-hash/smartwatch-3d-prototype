/**
 * Procedural 3D Mesh Generator for Smart Watches and Fitness Bands
 * Synthesizes procedural geometries using Three.js primitives
 * (Cylinders, Boxes, Toruses, Extrusions, and Curves) with zero external asset lag.
 */

import * as THREE from 'three';
import { DeviceModelType } from '../../types';

export interface ProceduralModel {
  type: DeviceModelType;
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  screenMaterial: THREE.MeshStandardMaterial;
  crownMesh?: THREE.Mesh;
  chassisMaterials: THREE.MeshStandardMaterial[];
  strapMaterials: THREE.MeshStandardMaterial[];
  updateChassisColor: (hex: string) => void;
  updateStrapColor: (hex: string) => void;
  setScreenTexture: (texture: THREE.CanvasTexture) => void;
  rotateCrown?: (delta: number) => void;
  dispose: () => void;
}

/**
 * Creates standard screen material with canvas texture mapping and subtle glossy sheen.
 */
function createScreenMaterial(texture?: THREE.CanvasTexture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: texture || null,
    roughness: 0.1,
    metalness: 0.05,
    roughnessMap: null,
    bumpScale: 0.01,
  });
}

/**
 * Creates chassis metallic standard material.
 */
function createChassisMaterial(hex: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.85,
    roughness: 0.22,
  });
}

/**
 * Creates strap silicone / leather matte standard material.
 */
function createStrapMaterial(hex: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    metalness: 0.1,
    roughness: 0.65,
  });
}

/**
 * Generates curved wrist strap meshes (top and bottom) that loop naturally around a wrist form.
 */
function createCurvedStrapMesh(
  strapWidth: number,
  yOffset: number,
  strapMat: THREE.MeshStandardMaterial,
  options: { isHeavyDuty?: boolean } = {}
): THREE.Group {
  const strapGroup = new THREE.Group();

  // Cross section shape for extrusion
  const shape = new THREE.Shape();
  const halfW = strapWidth / 2;
  const thickness = options.isHeavyDuty ? 0.08 : 0.05;

  shape.moveTo(-halfW, -thickness);
  shape.lineTo(halfW, -thickness);
  shape.lineTo(halfW, thickness);
  shape.lineTo(-halfW, thickness);
  shape.closePath();

  // Top strap curve: extends upward from yOffset then curves back towards -Z
  const topCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, yOffset, 0),
    new THREE.Vector3(0, yOffset + 0.5, -0.15),
    new THREE.Vector3(0, yOffset + 0.9, -0.6),
    new THREE.Vector3(0, yOffset + 0.5, -1.3),
    new THREE.Vector3(0, 0, -1.5),
  ]);

  const topGeom = new THREE.ExtrudeGeometry(shape, {
    extrudePath: topCurve,
    steps: 32,
    bevelEnabled: false,
  });
  const topMesh = new THREE.Mesh(topGeom, strapMat);
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  strapGroup.add(topMesh);

  // Bottom strap curve: extends downward from -yOffset then curves back towards -Z
  const bottomCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -yOffset, 0),
    new THREE.Vector3(0, -yOffset - 0.5, -0.15),
    new THREE.Vector3(0, -yOffset - 0.9, -0.6),
    new THREE.Vector3(0, -yOffset - 0.5, -1.3),
    new THREE.Vector3(0, 0, -1.5),
  ]);

  const bottomGeom = new THREE.ExtrudeGeometry(shape, {
    extrudePath: bottomCurve,
    steps: 32,
    bevelEnabled: false,
  });
  const bottomMesh = new THREE.Mesh(bottomGeom, strapMat);
  bottomMesh.castShadow = true;
  bottomMesh.receiveShadow = true;
  strapGroup.add(bottomMesh);

  // Buckle / Clasp at back
  const buckleGeom = new THREE.BoxGeometry(strapWidth * 1.08, 0.25, 0.12);
  const buckleMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const buckleMesh = new THREE.Mesh(buckleGeom, buckleMat);
  buckleMesh.position.set(0, 0, -1.52);
  strapGroup.add(buckleMesh);

  // If heavy duty, add ribbed grooves along top and bottom straps
  if (options.isHeavyDuty) {
    const ridgeGeom = new THREE.CylinderGeometry(0.04, 0.04, strapWidth * 0.9, 12);
    ridgeGeom.rotateZ(Math.PI / 2);
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.7,
      roughness: 0.3,
    });
    for (let i = 0; i < 4; i++) {
      const ridgeMesh = new THREE.Mesh(ridgeGeom, ridgeMat);
      ridgeMesh.position.set(0, yOffset + 0.25 + i * 0.2, -0.05 - i * 0.12);
      strapGroup.add(ridgeMesh);
    }
  }

  return strapGroup;
}

/**
 * Creates back sensor array dome and charging pins.
 */
function createBackSensorDome(): THREE.Group {
  const sensorGroup = new THREE.Group();

  // Glass sensor dome
  const domeGeom = new THREE.CylinderGeometry(0.55, 0.65, 0.06, 32);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.1,
    metalness: 0.9,
  });
  const domeMesh = new THREE.Mesh(domeGeom, domeMat);
  domeMesh.rotation.x = Math.PI / 2;
  domeMesh.position.set(0, 0, -0.2);
  sensorGroup.add(domeMesh);

  // Green LED optical emitter diodes
  const ledGeom = new THREE.CircleGeometry(0.06, 16);
  const ledMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: new THREE.Color(0x10b981),
    emissiveIntensity: 0.6,
  });
  const led1 = new THREE.Mesh(ledGeom, ledMat);
  led1.position.set(-0.16, 0, -0.235);
  led1.rotation.y = Math.PI;
  const led2 = new THREE.Mesh(ledGeom, ledMat);
  led2.position.set(0.16, 0, -0.235);
  led2.rotation.y = Math.PI;
  sensorGroup.add(led1, led2);

  return sensorGroup;
}

/**
 * Common helper to assemble procedural model with reactive color/texture updates and dispose logic.
 */
function assembleProceduralModel(
  type: DeviceModelType,
  group: THREE.Group,
  screenMesh: THREE.Mesh,
  screenMaterial: THREE.MeshStandardMaterial,
  chassisMaterials: THREE.MeshStandardMaterial[],
  strapMaterials: THREE.MeshStandardMaterial[],
  crownMesh?: THREE.Mesh
): ProceduralModel {
  return {
    type,
    group,
    screenMesh,
    screenMaterial,
    crownMesh,
    chassisMaterials,
    strapMaterials,
    updateChassisColor: (hex: string) => {
      chassisMaterials.forEach((m) => m.color.set(hex));
    },
    updateStrapColor: (hex: string) => {
      strapMaterials.forEach((m) => m.color.set(hex));
    },
    setScreenTexture: (texture: THREE.CanvasTexture) => {
      screenMaterial.map = texture;
      screenMaterial.needsUpdate = true;
    },
    rotateCrown: crownMesh
      ? (delta: number) => {
          crownMesh.rotation.x += delta;
        }
      : undefined,
    dispose: () => {
      disposeMeshHierarchy(group);
    },
  };
}

/**
 * 1. PulseBand 2 (Band - Standard):
 * Slim capsule profile, 1.1" screen ratio, lightweight silicone band, aluminum bezel.
 */
export function buildBandStandard(
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  const group = new THREE.Group();
  const chassisMat = createChassisMaterial(chassisHex);
  const strapMat = createStrapMaterial(strapHex);
  const screenMat = createScreenMaterial(texture);

  // Slim capsule case body (Rounded capsule using Extrude of rounded rect)
  const capsuleShape = new THREE.Shape();
  const w = 0.42;
  const h = 0.85;
  const r = 0.35;

  capsuleShape.absarc(0, h, r, 0, Math.PI);
  capsuleShape.lineTo(-r, -h);
  capsuleShape.absarc(0, -h, r, Math.PI, Math.PI * 2);
  capsuleShape.lineTo(r, h);

  const caseGeom = new THREE.ExtrudeGeometry(capsuleShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  });
  caseGeom.center();
  const caseMesh = new THREE.Mesh(caseGeom, chassisMat);
  group.add(caseMesh);

  // Bezel ring border
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.25,
  });
  const bezelGeom = new THREE.BoxGeometry(0.72, 1.62, 0.04);
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  bezelMesh.position.set(0, 0, 0.19);
  group.add(bezelMesh);

  // Screen mesh (Elongated 1.1" OLED plane with UV mapping)
  const screenGeom = new THREE.PlaneGeometry(0.56, 1.42);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.set(0, 0, 0.215);
  group.add(screenMesh);

  // Curved Silicone Strap
  const strapGroup = createCurvedStrapMesh(0.62, 1.05, strapMat);
  group.add(strapGroup);

  // Back sensor dome
  group.add(createBackSensorDome());

  return assembleProceduralModel(
    'band_standard',
    group,
    screenMesh,
    screenMat,
    [chassisMat],
    [strapMat]
  );
}

/**
 * 2. PulseBand Pro (Band - Pro):
 * Curved 1.47" AMOLED display, aircraft-grade aluminum bezel, standalone GPS badge.
 */
export function buildBandPro(
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  const group = new THREE.Group();
  const chassisMat = createChassisMaterial(chassisHex);
  const strapMat = createStrapMaterial(strapHex);
  const screenMat = createScreenMaterial(texture);

  // Wider curved capsule body
  const capsuleShape = new THREE.Shape();
  const w = 0.52;
  const h = 0.95;
  const r = 0.44;

  capsuleShape.absarc(0, h, r, 0, Math.PI);
  capsuleShape.lineTo(-r, -h);
  capsuleShape.absarc(0, -h, r, Math.PI, Math.PI * 2);
  capsuleShape.lineTo(r, h);

  const caseGeom = new THREE.ExtrudeGeometry(capsuleShape, {
    depth: 0.38,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  caseGeom.center();
  const caseMesh = new THREE.Mesh(caseGeom, chassisMat);
  group.add(caseMesh);

  // Aircraft-grade aluminum bezel border
  const bezelGeom = new THREE.BoxGeometry(0.9, 1.88, 0.04);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.9,
    roughness: 0.18,
  });
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  bezelMesh.position.set(0, 0, 0.21);
  group.add(bezelMesh);

  // Screen mesh (Larger 1.47" curved display plane)
  const screenGeom = new THREE.PlaneGeometry(0.74, 1.62);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.set(0, 0, 0.235);
  group.add(screenMesh);

  // Sport Strap
  const strapGroup = createCurvedStrapMesh(0.76, 1.25, strapMat);
  group.add(strapGroup);

  // Back sensor dome with ECG electrodes
  const sensorDome = createBackSensorDome();
  const electrodeGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
  const electrodeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
  });
  const elec1 = new THREE.Mesh(electrodeGeom, electrodeMat);
  elec1.rotation.x = Math.PI / 2;
  elec1.position.set(0, 0.35, -0.22);
  const elec2 = new THREE.Mesh(electrodeGeom, electrodeMat);
  elec2.rotation.x = Math.PI / 2;
  elec2.position.set(0, -0.35, -0.22);
  sensorDome.add(elec1, elec2);
  group.add(sensorDome);

  return assembleProceduralModel(
    'band_pro',
    group,
    screenMesh,
    screenMat,
    [chassisMat],
    [strapMat]
  );
}

/**
 * 3. Horizon Watch SE (Watch - Standard):
 * Round squircle aluminum casing, dual side buttons, sleek silicone lugs, circular AMOLED screen.
 */
export function buildWatchStandard(
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  const group = new THREE.Group();
  const chassisMat = createChassisMaterial(chassisHex);
  const strapMat = createStrapMaterial(strapHex);
  const screenMat = createScreenMaterial(texture);

  // Polished cylindrical squircle casing
  const caseGeom = new THREE.CylinderGeometry(1.28, 1.28, 0.36, 48);
  caseGeom.rotateX(Math.PI / 2);
  const caseMesh = new THREE.Mesh(caseGeom, chassisMat);
  group.add(caseMesh);

  // Polished outer bezel ring
  const bezelGeom = new THREE.TorusGeometry(1.24, 0.05, 16, 48);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
  bezelMesh.position.set(0, 0, 0.18);
  group.add(bezelMesh);

  // Screen mesh (Round AMOLED display)
  const screenGeom = new THREE.CircleGeometry(1.12, 48);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.set(0, 0, 0.185);
  group.add(screenMesh);

  // Dual side pushers at 2 o'clock and 4 o'clock (+X side)
  const buttonGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 16);
  buttonGeom.rotateZ(Math.PI / 2);

  const button1 = new THREE.Mesh(buttonGeom, chassisMat);
  button1.position.set(1.32, 0.45, 0);

  const button2 = new THREE.Mesh(buttonGeom, chassisMat);
  button2.position.set(1.32, -0.45, 0);
  group.add(button1, button2);

  // Top and bottom silicone strap lugs
  const lugGeom = new THREE.BoxGeometry(0.95, 0.24, 0.28);
  const lugTop = new THREE.Mesh(lugGeom, chassisMat);
  lugTop.position.set(0, 1.35, 0);
  const lugBottom = new THREE.Mesh(lugGeom, chassisMat);
  lugBottom.position.set(0, -1.35, 0);
  group.add(lugTop, lugBottom);

  // Curved strap
  const strapGroup = createCurvedStrapMesh(0.88, 1.45, strapMat);
  group.add(strapGroup);

  // Back sensor dome
  group.add(createBackSensorDome());

  return assembleProceduralModel(
    'watch_standard',
    group,
    screenMesh,
    screenMat,
    [chassisMat],
    [strapMat]
  );
}

/**
 * 4. Horizon Watch Pro (Watch - Pro):
 * Brushed aerospace titanium chassis, sapphire crystal rim, precision rotating digital crown at 2 o'clock,
 * tactile pusher at 4 o'clock, premium sport strap.
 */
export function buildWatchPro(
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  const group = new THREE.Group();
  const chassisMat = createChassisMaterial(chassisHex);
  const strapMat = createStrapMaterial(strapHex);
  const screenMat = createScreenMaterial(texture);

  // Chamfered titanium casing
  const caseGeom = new THREE.CylinderGeometry(1.38, 1.42, 0.4, 48);
  caseGeom.rotateX(Math.PI / 2);
  const caseMesh = new THREE.Mesh(caseGeom, chassisMat);
  group.add(caseMesh);

  // Elevated sapphire crystal rim
  const rimGeom = new THREE.TorusGeometry(1.28, 0.045, 16, 48);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.95,
    roughness: 0.1,
  });
  const rimMesh = new THREE.Mesh(rimGeom, rimMat);
  rimMesh.position.set(0, 0, 0.2);
  group.add(rimMesh);

  // Screen mesh (Circular sapphire AMOLED)
  const screenGeom = new THREE.CircleGeometry(1.22, 48);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.set(0, 0, 0.205);
  group.add(screenMesh);

  // Precision Rotating Digital Crown at 2 o'clock
  const crownGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 24);
  crownGeom.rotateZ(Math.PI / 2);
  const crownMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisHex),
    metalness: 0.92,
    roughness: 0.25,
  });
  const crownMesh = new THREE.Mesh(crownGeom, crownMat);
  crownMesh.position.set(1.45, 0.52, 0);
  group.add(crownMesh);

  // Secondary tactile pusher at 4 o'clock
  const pusherGeom = new THREE.BoxGeometry(0.14, 0.32, 0.16);
  const pusherMesh = new THREE.Mesh(pusherGeom, chassisMat);
  pusherMesh.position.set(1.42, -0.5, 0);
  group.add(pusherMesh);

  // Sculpted titanium lugs
  const lugGeom = new THREE.BoxGeometry(1.05, 0.26, 0.32);
  const lugTop = new THREE.Mesh(lugGeom, chassisMat);
  lugTop.position.set(0, 1.48, 0);
  const lugBottom = new THREE.Mesh(lugGeom, chassisMat);
  lugBottom.position.set(0, -1.48, 0);
  group.add(lugTop, lugBottom);

  // Curved strap
  const strapGroup = createCurvedStrapMesh(0.96, 1.58, strapMat);
  group.add(strapGroup);

  // Back sensor dome
  group.add(createBackSensorDome());

  return assembleProceduralModel(
    'watch_pro',
    group,
    screenMesh,
    screenMat,
    [chassisMat, crownMat],
    [strapMat],
    crownMesh
  );
}

/**
 * 5. Horizon Watch Pro Max (Watch - Pro Max Flagship):
 * Rugged 49mm titanium bumper armor case (octagonal profile), safety orange action button at 9 o'clock,
 * crown guard with heavy-duty rotating crown, raised bezel lip, and heavy-duty ribbed ocean strap.
 */
export function buildWatchProMax(
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  const group = new THREE.Group();
  const chassisMat = createChassisMaterial(chassisHex);
  const strapMat = createStrapMaterial(strapHex);
  const screenMat = createScreenMaterial(texture);

  // Rugged octagonal bumper case (8-segment cylinder)
  const caseGeom = new THREE.CylinderGeometry(1.58, 1.62, 0.46, 8);
  caseGeom.rotateX(Math.PI / 2);
  caseGeom.rotateZ(Math.PI / 8); // Orient flat faces nicely
  const caseMesh = new THREE.Mesh(caseGeom, chassisMat);
  group.add(caseMesh);

  // Raised protective titanium bezel lip protecting screen
  const lipGeom = new THREE.TorusGeometry(1.4, 0.065, 16, 48);
  const lipMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.9,
    roughness: 0.3,
  });
  const lipMesh = new THREE.Mesh(lipGeom, lipMat);
  lipMesh.position.set(0, 0, 0.23);
  group.add(lipMesh);

  // Screen mesh (Large sapphire display)
  const screenGeom = new THREE.CircleGeometry(1.32, 48);
  const screenMesh = new THREE.Mesh(screenGeom, screenMat);
  screenMesh.position.set(0, 0, 0.235);
  group.add(screenMesh);

  // Safety Orange Action Button at 9 o'clock (-X side)
  const actionButtonGeom = new THREE.BoxGeometry(0.18, 0.45, 0.22);
  const actionButtonMat = new THREE.MeshStandardMaterial({
    color: 0xf97316, // International safety orange
    metalness: 0.3,
    roughness: 0.4,
  });
  const actionButtonMesh = new THREE.Mesh(actionButtonGeom, actionButtonMat);
  actionButtonMesh.position.set(-1.64, 0, 0);
  group.add(actionButtonMesh);

  // Right Side Crown Guard & Heavy-Duty Knurled Crown at 3 o'clock
  const guardGeom = new THREE.BoxGeometry(0.25, 0.75, 0.38);
  const guardMesh = new THREE.Mesh(guardGeom, chassisMat);
  guardMesh.position.set(1.55, 0.15, 0);
  group.add(guardMesh);

  const crownGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.26, 24);
  crownGeom.rotateZ(Math.PI / 2);
  const crownMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(chassisHex),
    metalness: 0.95,
    roughness: 0.3,
  });
  const crownMesh = new THREE.Mesh(crownGeom, crownMat);
  crownMesh.position.set(1.68, 0.2, 0);
  group.add(crownMesh);

  // Heavy-duty titanium lugs
  const lugGeom = new THREE.BoxGeometry(1.22, 0.32, 0.36);
  const lugTop = new THREE.Mesh(lugGeom, chassisMat);
  lugTop.position.set(0, 1.68, 0);
  const lugBottom = new THREE.Mesh(lugGeom, chassisMat);
  lugBottom.position.set(0, -1.68, 0);
  group.add(lugTop, lugBottom);

  // Heavy-duty ribbed strap with titanium buckle pins
  const strapGroup = createCurvedStrapMesh(1.12, 1.8, strapMat, { isHeavyDuty: true });
  group.add(strapGroup);

  // Back sensor dome
  group.add(createBackSensorDome());

  return assembleProceduralModel(
    'watch_pro_max',
    group,
    screenMesh,
    screenMat,
    [chassisMat, crownMat],
    [strapMat],
    crownMesh
  );
}

/**
 * Factory dispatching creation of corresponding 3D procedural model.
 */
export function createProceduralModel(
  modelType: DeviceModelType,
  chassisHex: string,
  strapHex: string,
  texture?: THREE.CanvasTexture
): ProceduralModel {
  switch (modelType) {
    case 'band_standard':
      return buildBandStandard(chassisHex, strapHex, texture);
    case 'band_pro':
      return buildBandPro(chassisHex, strapHex, texture);
    case 'watch_standard':
      return buildWatchStandard(chassisHex, strapHex, texture);
    case 'watch_pro_max':
      return buildWatchProMax(chassisHex, strapHex, texture);
    case 'watch_pro':
    default:
      return buildWatchPro(chassisHex, strapHex, texture);
  }
}

/**
 * Cleanly disposes all geometries, materials, and textures in a Three.js hierarchy.
 */
export function disposeMeshHierarchy(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      }
    }
  });
}
