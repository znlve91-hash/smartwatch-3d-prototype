import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { Product, ColorOption, WatchFaceId, ActiveWidgetId, WatchModelType } from '../../types';
import { useWatchSimulator } from '../../hooks/useWatchSimulator';
import { createWatchModel, updateWatchMaterials } from './WatchGeometry';
import { createWatchScreenManager, WatchScreenManager } from './WatchScreenTexture';
import { StudioControls, CameraPreset } from './StudioControls';
import { HeartRateWidget } from '../widgets/HeartRateWidget';
import { StepsWidget } from '../widgets/StepsWidget';
import { WeatherWidget } from '../widgets/WeatherWidget';
import { MusicWidget } from '../widgets/MusicWidget';
import { BatteryWidget } from '../widgets/BatteryWidget';

export interface WatchViewer3DProps {
  product?: Product;
  modelType?: WatchModelType;
  initialColor?: ColorOption;
  initialFace?: WatchFaceId;
  autoRotate?: boolean;
  showControls?: boolean;
  className?: string;
  heightClass?: string;
}

export const WatchViewer3D: React.FC<WatchViewer3DProps> = ({
  product,
  modelType: propModelType,
  initialColor,
  initialFace,
  autoRotate: propAutoRotate = true,
  showControls = true,
  className = '',
  heightClass = 'h-[540px]',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Determine active model type & initial colors
  const activeModelType: WatchModelType =
    propModelType || product?.modelType || 'watch_round';

  const defaultColor: ColorOption =
    initialColor ||
    product?.colors[0] || {
      id: 'default',
      name: 'Titanium Slate',
      hex: '#CBD5E1',
      caseHex: '#94A3B8',
      strapHex: '#64748B',
    };

  const [selectedColor, setSelectedColor] = useState<ColorOption>(defaultColor);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(propAutoRotate);
  const [isWidgetDrawerOpen, setIsWidgetDrawerOpen] = useState<boolean>(false);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Watch Simulator State Hook
  const simulator = useWatchSimulator(initialFace || product?.defaultFace || 'minimal');
  const { activeFace, setActiveFace, activeWidget, setActiveWidget } = simulator;

  // Sync color when product changes
  useEffect(() => {
    if (product?.colors?.[0]) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pivotRef = useRef<THREE.Group | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const screenManagerRef = useRef<WatchScreenManager | null>(null);

  // Rotation & Drag Interaction state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotTargetRef = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.55 });
  const rotCurrentRef = useRef<{ x: number; y: number }>({ x: 0.25, y: -0.55 });
  const cameraDistanceRef = useRef<number>(4.4);
  const targetDistanceRef = useRef<number>(4.4);

  // Refs for animation loop to prevent stale closures (CRIT-01)
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  const activeFaceRef = useRef(activeFace);
  activeFaceRef.current = activeFace;

  const simulatorRef = useRef(simulator);
  simulatorRef.current = simulator;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;

    try {
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 540;

      // 1. Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
      camera.position.set(0, 0, cameraDistanceRef.current);
      cameraRef.current = camera;

      // 3. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Lighting Setup
      // Subtle lilac-tinted fill light (#F5F3FF, 0.8 intensity)
      const ambientLight = new THREE.AmbientLight('#F5F3FF', 0.85);
      scene.add(ambientLight);

      // Sharp key directional light (#FFFFFF, 1.3 intensity)
      const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.3);
      keyLight.position.set(4, 7, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Cool cyan rim directional light (#06B6D4, 0.7 intensity)
      const rimLight = new THREE.DirectionalLight('#06B6D4', 0.7);
      rimLight.position.set(-5, 3, -4);
      scene.add(rimLight);

      // Soft bottom bounce light
      const bounceLight = new THREE.DirectionalLight('#E0F7FA', 0.4);
      bounceLight.position.set(0, -6, 2);
      scene.add(bounceLight);

      // 5. Pivot & Model Creation
      const pivot = new THREE.Group();
      scene.add(pivot);
      pivotRef.current = pivot;

      // Screen Texture Manager
      const screenManager = createWatchScreenManager(512);
      screenManagerRef.current = screenManager;
      screenManager.update(activeFaceRef.current, simulatorRef.current);

      const model = createWatchModel(activeModelType, {
        caseColor: selectedColor.caseHex || selectedColor.hex,
        strapColor: selectedColor.strapHex || selectedColor.hex,
        screenTexture: screenManager.texture,
      });
      pivot.add(model);
      modelGroupRef.current = model;

      // 6. Animation Render Loop
      let lastScreenUpdate = 0;

      const animate = (timestamp: number) => {
        // Auto-rotation when enabled and user not interacting (reads live ref)
        if (isAutoRotatingRef.current && !isDraggingRef.current) {
          rotTargetRef.current.y += 0.005;
        }

        // Smooth Damped Rotation
        rotCurrentRef.current.x += (rotTargetRef.current.x - rotCurrentRef.current.x) * 0.09;
        rotCurrentRef.current.y += (rotTargetRef.current.y - rotCurrentRef.current.y) * 0.09;
        pivot.rotation.x = rotCurrentRef.current.x;
        pivot.rotation.y = rotCurrentRef.current.y;

        // Smooth Camera Zoom
        cameraDistanceRef.current += (targetDistanceRef.current - cameraDistanceRef.current) * 0.1;
        camera.position.z = cameraDistanceRef.current;

        // Periodic Dynamic Canvas Texture Updates (approx 15-20 fps reads live face & simulator refs)
        if (timestamp - lastScreenUpdate > 50) {
          screenManager.update(activeFaceRef.current, simulatorRef.current, new Date());
          lastScreenUpdate = timestamp;
        }

        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };

      animId = requestAnimationFrame(animate);

      // 7. Responsive Resize Observer
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Cleanup on unmount with full GPU geometry & material disposal (REQ-01)
      return () => {
        cancelAnimationFrame(animId);
        resizeObserver.disconnect();
        screenManager.dispose();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          }
        });
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization error (headless/unsupported environment):', err);
      setWebGlAvailable(false);
    }
  }, [activeModelType]);

  // Real-time material updates on color change
  useEffect(() => {
    if (modelGroupRef.current) {
      updateWatchMaterials(modelGroupRef.current, {
        caseColor: selectedColor.caseHex || selectedColor.hex,
        strapColor: selectedColor.strapHex || selectedColor.hex,
        screenTexture: screenManagerRef.current?.texture,
      });
    }
  }, [selectedColor]);

  // Real-time screen update on face or simulator state change
  useEffect(() => {
    if (screenManagerRef.current) {
      screenManagerRef.current.update(activeFace, simulator);
    }
  }, [activeFace, simulator]);

  // Pointer drag event handlers for smooth 360-degree rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    rotTargetRef.current.y += dx * 0.009;
    rotTargetRef.current.x += dy * 0.009;

    // Clamp pitch angle to prevent flipping
    const maxPitch = Math.PI / 2.3;
    rotTargetRef.current.x = Math.max(-maxPitch, Math.min(maxPitch, rotTargetRef.current.x));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if pointer capture already ended
    }
  };

  // Wheel zoom handler with cancelable guard (OPT-01)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.cancelable) e.preventDefault();
    targetDistanceRef.current = Math.max(
      2.8,
      Math.min(6.5, targetDistanceRef.current + e.deltaY * 0.003)
    );
  };

  // Camera Presets handler
  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    switch (preset) {
      case 'front':
        rotTargetRef.current = { x: 0, y: 0 };
        targetDistanceRef.current = 4.2;
        break;
      case 'perspective':
        rotTargetRef.current = { x: 0.25, y: -0.55 };
        targetDistanceRef.current = 4.5;
        break;
      case 'crown':
        rotTargetRef.current = { x: 0.05, y: -Math.PI / 2 + 0.15 };
        targetDistanceRef.current = 3.8;
        break;
      case 'profile':
        rotTargetRef.current = { x: 0, y: Math.PI / 2 };
        targetDistanceRef.current = 4.0;
        break;
    }
  }, []);

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      {/* 3D Canvas Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`relative w-full ${heightClass} rounded-3xl bg-gradient-to-b from-[#F8F6FF] via-[#F1EFFF]/80 to-[#E0F7FA]/30 overflow-hidden cursor-grab active:cursor-grabbing select-none border border-purple-100 shadow-inner`}
      >
        {/* Subtle Backdrop Radial Spotlight */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-purple-200/20 via-cyan-100/30 to-transparent blur-3xl" />
        </div>

        {/* 360 Degree Drag Hint Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100/60 text-xs font-semibold text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Drag to orbit 360° • Scroll to zoom</span>
        </div>

        {/* Selected Finish Tag */}
        <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100/60 text-xs font-semibold text-slate-700 shadow-sm">
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-purple-300"
            style={{ backgroundColor: selectedColor.caseHex || selectedColor.hex }}
          />
          <span>{selectedColor.name}</span>
        </div>

        {/* Fallback if WebGL unsupported in headless mode */}
        {!webGlAvailable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/90 backdrop-blur-md">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              3D Three.js Studio Simulation Active
            </h4>
            <p className="text-xs text-slate-600 max-w-sm">
              Procedural mesh geometries initialized for {activeModelType}. Use the studio controls below to customize watch face, widgets, and materials.
            </p>
          </div>
        )}

        {/* Interactive Simulated Widget Floating Drawer (on right/bottom) */}
        {isWidgetDrawerOpen && (
          <div className="absolute right-4 bottom-4 top-16 w-80 max-w-[90%] z-20 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
            {activeWidget === 'heart_rate' && (
              <HeartRateWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
            {activeWidget === 'steps' && (
              <StepsWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
            {activeWidget === 'weather' && (
              <WeatherWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
            {activeWidget === 'music' && (
              <MusicWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
            {activeWidget === 'battery' && (
              <BatteryWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
            {!activeWidget && (
              <HeartRateWidget
                simulator={simulator}
                onClose={() => setIsWidgetDrawerOpen(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Floating / Docked Studio Controls */}
      {showControls && (
        <div className="mt-3">
          <StudioControls
            product={product}
            colors={product?.colors}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            activeFace={activeFace}
            onSelectFace={setActiveFace}
            activeCameraPreset={cameraPreset}
            onSelectCameraPreset={applyCameraPreset}
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={() => setIsAutoRotating((prev) => !prev)}
            isWidgetDrawerOpen={isWidgetDrawerOpen}
            onToggleWidgetDrawer={() => setIsWidgetDrawerOpen((prev) => !prev)}
            activeWidget={activeWidget}
            onSelectWidget={(w) => {
              setActiveWidget(w);
              setIsWidgetDrawerOpen(true);
            }}
          />
        </div>
      )}
    </div>
  );
};
