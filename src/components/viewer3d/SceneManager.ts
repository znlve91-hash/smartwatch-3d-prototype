/**
 * Three.js 3D Scene Manager
 * Manages WebGLRenderer, OrbitControls, lighting rig, model swapping,
 * turntable auto-rotation, camera presets, and GPU resource disposal.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPreset } from '../../context/ViewerContext';
import { ProceduralModel } from './proceduralMeshes';

export interface SceneManagerOptions {
  container: HTMLElement;
  initialPreset?: CameraPreset;
  onRenderFrame?: (timeMs: number) => void;
}

export class SceneManager {
  public readonly container: HTMLElement;
  public readonly scene: THREE.Scene;
  public readonly camera: THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly controls: OrbitControls;

  private currentModel: ProceduralModel | null = null;
  private animFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private onRenderFrameCallback?: (timeMs: number) => void;

  // Camera transition state
  private targetCameraPos: THREE.Vector3 | null = null;
  private targetCameraTarget: THREE.Vector3 | null = null;
  private isTransitioningCamera = false;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;
    this.onRenderFrameCallback = options.onRenderFrame;

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;

    // 1. Create Scene
    this.scene = new THREE.Scene();

    // 2. Setup Perspective Camera (45° FOV)
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 3.8);

    // 3. Setup Hardware-Accelerated Tone-Mapped WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Style canvas to fit container
    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.outline = 'none';
    this.container.appendChild(canvas);

    // 4. Setup Damping OrbitControls with Zoom & Polar Limits
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 6.0;
    // Polar limits: 15° to 165° to avoid awkward bottom under-flips
    this.controls.minPolarAngle = (Math.PI * 15) / 180;
    this.controls.maxPolarAngle = (Math.PI * 165) / 180;
    this.controls.target.set(0, 0, 0);

    // Turntable speed (2.0 RPM presentation)
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;

    // 5. Setup Lighting Rig
    this.setupLighting();

    // 6. Setup Responsive ResizeObserver
    this.setupResizeObserver();

    // 7. Start Animation Loop
    this.startLoop();

    if (options.initialPreset) {
      this.setCameraPreset(options.initialPreset, true);
    }
  }

  /**
   * Initializes multi-point lighting rig:
   * Soft ambient bounce, primary key light, cyan rim light, and subtle fill light.
   */
  private setupLighting(): void {
    // Soft lavender ambient light
    const ambientLight = new THREE.AmbientLight(0xede9fe, 0.7);
    this.scene.add(ambientLight);

    // Primary key directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    this.scene.add(keyLight);

    // Secondary cyan rim light behind device to accentuate metallic bevels
    const rimLight = new THREE.PointLight(0x06b6d4, 1.1, 15);
    rimLight.position.set(-4, 2, -5);
    this.scene.add(rimLight);

    // Subtle soft lavender-white fill light from opposite angle
    const fillLight = new THREE.DirectionalLight(0xf5f3ff, 0.45);
    fillLight.position.set(-5, -4, 3);
    this.scene.add(fillLight);
  }

  /**
   * Sets up a ResizeObserver to adapt viewport dimensions on responsive container changes.
   */
  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.handleResize(width, height);
        }
      }
    });

    this.resizeObserver.observe(this.container);
  }

  /**
   * Handles canvas dimension updates.
   */
  public handleResize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Sets or replaces the active 3D procedural model in the scene.
   */
  public setModel(newModel: ProceduralModel): void {
    if (this.currentModel) {
      this.scene.remove(this.currentModel.group);
      this.currentModel.dispose();
    }

    this.currentModel = newModel;
    this.scene.add(newModel.group);
  }

  /**
   * Gets the active procedural model.
   */
  public getModel(): ProceduralModel | null {
    return this.currentModel;
  }

  /**
   * Toggles turntable auto-rotation.
   */
  public setAutoRotate(enabled: boolean): void {
    this.controls.autoRotate = enabled;
  }

  /**
   * Transitions camera to a preset view angle:
   * 'front', 'angle', 'side', or 'reset'.
   */
  public setCameraPreset(preset: CameraPreset, immediate = false): void {
    const target = new THREE.Vector3(0, 0, 0);
    const pos = new THREE.Vector3();

    switch (preset) {
      case 'front':
        pos.set(0, 0, 3.8);
        break;
      case 'angle':
        pos.set(2.4, 1.8, 3.1);
        break;
      case 'side':
        pos.set(3.8, 0, 0.3);
        break;
      case 'reset':
      default:
        pos.set(0, 0.8, 3.8);
        break;
    }

    if (immediate) {
      this.camera.position.copy(pos);
      this.controls.target.copy(target);
      this.controls.update();
      this.isTransitioningCamera = false;
    } else {
      this.targetCameraPos = pos;
      this.targetCameraTarget = target;
      this.isTransitioningCamera = true;
    }
  }

  /**
   * Animation render loop.
   */
  private startLoop = (): void => {
    const render = (timeMs: number): void => {
      this.animFrameId = requestAnimationFrame(render);

      // Handle camera smooth transition
      if (this.isTransitioningCamera && this.targetCameraPos && this.targetCameraTarget) {
        this.camera.position.lerp(this.targetCameraPos, 0.08);
        this.controls.target.lerp(this.targetCameraTarget, 0.08);

        if (
          this.camera.position.distanceTo(this.targetCameraPos) < 0.02 &&
          this.controls.target.distanceTo(this.targetCameraTarget) < 0.01
        ) {
          this.camera.position.copy(this.targetCameraPos);
          this.controls.target.copy(this.targetCameraTarget);
          this.isTransitioningCamera = false;
        }
      }

      // Update controls damping & auto-rotate
      this.controls.update();

      // Subtle crown spin if auto-rotating
      if (this.controls.autoRotate && this.currentModel && this.currentModel.rotateCrown) {
        this.currentModel.rotateCrown(0.015);
      }

      // External callback (e.g. For screen texture canvas redrawing)
      if (this.onRenderFrameCallback) {
        this.onRenderFrameCallback(timeMs);
      }

      // Render Three.js scene
      this.renderer.render(this.scene, this.camera);
    };

    this.animFrameId = requestAnimationFrame(render);
  };

  /**
   * Properly disposes renderer, controls, geometries, materials, and observers
   * to guarantee zero WebGL memory leaks.
   */
  public dispose(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.currentModel) {
      this.scene.remove(this.currentModel.group);
      this.currentModel.dispose();
      this.currentModel = null;
    }

    this.controls.dispose();

    // Traverse and dispose any remaining scene objects
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
