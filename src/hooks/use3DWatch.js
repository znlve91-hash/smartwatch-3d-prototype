/**
 * Three.js 3D Wearable Lifecycle & Render Loop Hook
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  createWatchModel,
  createBandModel,
  updateModelColors,
  disposeModel,
} from '../components/3d/ProceduralWatchMesh.js';
import { createWatchCanvasTexture } from '../components/3d/WatchCanvasTexture.js';

// 1.5 RPM in radians per second: 1.5 * 2 * PI / 60 ≈ 0.15708 rad/s
const AUTO_ROTATE_SPEED = (1.5 * 2 * Math.PI) / 60;
const DEFAULT_DISTANCE = 7.0;
const MIN_DISTANCE = 4.0;
const MAX_DISTANCE = 11.0;
const DAMPING = 0.08;

export function use3DWatch({
  containerRef,
  modelType = 'watch',
  tier = 'pro',
  chassisColor = '#0F172A',
  strapColor = '#1E293B',
  accentColor = '#7C3AED',
  faceId = 'minimal',
  widgetId = 'heartRate',
  widgetState = {},
  autoRotate = true,
} = {}) {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const textureWrapperRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Rotation & zoom state refs for smooth damping
  const targetRotationRef = useRef({ x: 0.1, y: -0.3 });
  const currentRotationRef = useRef({ x: 0.1, y: -0.3 });
  const targetDistanceRef = useRef(DEFAULT_DISTANCE);
  const currentDistanceRef = useRef(DEFAULT_DISTANCE);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(autoRotate);

  // Keep autoRotateRef in sync
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Update canvas texture on face or widget changes
  useEffect(() => {
    if (textureWrapperRef.current) {
      textureWrapperRef.current.update({
        faceId,
        widgetId,
        widgetState,
      });
    }
  }, [faceId, widgetId, widgetState]);

  // Update materials when colors change
  useEffect(() => {
    if (modelGroupRef.current) {
      updateModelColors(modelGroupRef.current, {
        chassisColor,
        strapColor,
        accentColor,
      });
    }
  }, [chassisColor, strapColor, accentColor]);

  // Rebuild model when modelType or tier changes
  useEffect(() => {
    if (!sceneRef.current || !textureWrapperRef.current) return;

    // Dispose old model
    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
      disposeModel(modelGroupRef.current);
    }

    // Build new model
    const builder = modelType === 'band' ? createBandModel : createWatchModel;
    const newModel = builder({
      chassisColor,
      strapColor,
      accentColor,
      screenTexture: textureWrapperRef.current.texture,
      tier,
    });

    modelGroupRef.current = newModel;
    sceneRef.current.add(newModel);
  }, [modelType, tier]);

  // Reset view to default front-facing orientation
  const resetView = useCallback(() => {
    targetRotationRef.current = { x: 0.05, y: 0 };
    targetDistanceRef.current = DEFAULT_DISTANCE;
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    targetDistanceRef.current = Math.max(MIN_DISTANCE, targetDistanceRef.current - 1.2);
  }, []);

  const zoomOut = useCallback(() => {
    targetDistanceRef.current = Math.min(MAX_DISTANCE, targetDistanceRef.current + 1.2);
  }, []);

  // Initialize Three.js scene, lighting, camera, renderer, and events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, DEFAULT_DISTANCE);
    cameraRef.current = camera;

    // 3. Lighting
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x7c3aed, 1.0);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // 4. Dynamic Watch Face Texture
    const textureWrapper = createWatchCanvasTexture({
      faceId,
      widgetId,
      widgetState,
    });
    textureWrapperRef.current = textureWrapper;

    // 5. Initial Procedural Model
    const builder = modelType === 'band' ? createBandModel : createWatchModel;
    const modelGroup = builder({
      chassisColor,
      strapColor,
      accentColor,
      screenTexture: textureWrapper.texture,
      tier,
    });
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // 6. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 7. Interaction Handlers
    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.6,
        Math.min(Math.PI / 2.6, targetRotationRef.current.x + deltaY * 0.008)
      );
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    // Touch controls
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastPointerRef.current.x;
      const deltaY = e.touches[0].clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      targetRotationRef.current.y += deltaX * 0.01;
      targetRotationRef.current.x = Math.max(
        -Math.PI / 2.6,
        Math.min(Math.PI / 2.6, targetRotationRef.current.x + deltaY * 0.01)
      );
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Wheel zoom
    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.005;
      targetDistanceRef.current = Math.max(
        MIN_DISTANCE,
        Math.min(MAX_DISTANCE, targetDistanceRef.current + zoomDelta)
      );
    };

    // Resize handler
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    domElement.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);

    // 8. Animation & Render Loop
    let lastTime = performance.now();
    let tickCounter = 0;

    const animate = (currentTime) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Auto-spin turntable (1.5 RPM) when not user-dragging
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += AUTO_ROTATE_SPEED * deltaTime;
      }

      // Smooth inertia damping for rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * DAMPING;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * DAMPING;

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.x = currentRotationRef.current.x;
        modelGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Smooth zoom damping
      currentDistanceRef.current += (targetDistanceRef.current - currentDistanceRef.current) * DAMPING;
      camera.position.z = currentDistanceRef.current;

      // Update watch face time (hands / seconds) every 4 frames for optimal 60fps rendering
      tickCounter++;
      if (tickCounter % 4 === 0 && textureWrapperRef.current) {
        textureWrapperRef.current.update({ time: new Date() });
      }

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 9. Cleanup on Unmount
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      if (modelGroupRef.current) {
        scene.remove(modelGroupRef.current);
        disposeModel(modelGroupRef.current);
      }

      if (textureWrapperRef.current) {
        textureWrapperRef.current.dispose();
      }

      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [containerRef]);

  return {
    resetView,
    zoomIn,
    zoomOut,
  };
}
