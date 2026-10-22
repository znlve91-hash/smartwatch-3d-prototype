/**
 * WatchViewer3D - Interactive 3D Wearable Preview Component
 * Hosts the Three.js viewport, offscreen dynamic watch face canvas texture pipeline,
 * and seamlessly synchronizes React ViewerContext state with procedural 3D models.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useViewer } from '../../context/ViewerContext';
import { SceneManager } from './SceneManager';
import { createProceduralModel, ProceduralModel } from './proceduralMeshes';
import { drawWatchFace } from './watchFaceCanvas';
import { ViewerControlsOverlay } from './ViewerControlsOverlay';

export interface WatchViewer3DProps {
  className?: string;
}

export const WatchViewer3D: React.FC<WatchViewer3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const modelRef = useRef<ProceduralModel | null>(null);
  const canvasTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [webGLError, setWebGLError] = useState<string | null>(null);

  const {
    selectedProduct,
    selectedChassisColor,
    selectedStrapColor,
    selectedWatchFace,
    isAutoRotating,
    cameraPreset,
    setCameraPreset,
    simulatedWidgets,
  } = useViewer();

  // Determine if active device is band (for capsule aspect layout)
  const isBand = selectedProduct.category === 'band';

  /**
   * Helper to re-render the 2D watch face onto the offscreen canvas
   * and signal Three.js that texture needs WebGL upload.
   */
  const updateFaceCanvas = useCallback(
    (time?: Date, animTimeMs?: number) => {
      const canvas = offscreenCanvasRef.current;
      const texture = canvasTextureRef.current;
      if (!canvas || !texture) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      drawWatchFace(ctx, {
        faceId: selectedWatchFace,
        widgets: simulatedWidgets,
        time: time || new Date(),
        size: canvas.width,
        animationTimeMs: animTimeMs ?? performance.now(),
        isBand,
      });

      texture.needsUpdate = true;
    },
    [selectedWatchFace, simulatedWidgets, isBand]
  );

  // Store latest values in ref to prevent stale closures in animation render frame callback
  const latestRef = useRef({
    selectedWatchFace,
    simulatedWidgets,
    isBand,
    updateFaceCanvas,
  });

  useEffect(() => {
    latestRef.current = {
      selectedWatchFace,
      simulatedWidgets,
      isBand,
      updateFaceCanvas,
    };
  }, [selectedWatchFace, simulatedWidgets, isBand, updateFaceCanvas]);

  // 1. Initialize SceneManager and Offscreen CanvasTexture
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Create offscreen canvas for dynamic watch face rendering (512x512)
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 512;
      offscreenCanvas.height = 512;
      offscreenCanvasRef.current = offscreenCanvas;

      // Create Three.js CanvasTexture
      const texture = new THREE.CanvasTexture(offscreenCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      canvasTextureRef.current = texture;

      // Initial draw
      updateFaceCanvas();

      // Instantiate SceneManager with onRenderFrame hook
      let lastFaceUpdate = 0;
      const sceneManager = new SceneManager({
        container: containerRef.current,
        initialPreset: 'angle',
        onRenderFrame: (timeMs) => {
          const {
            selectedWatchFace: currentFace,
            simulatedWidgets: currentWidgets,
            updateFaceCanvas: currentUpdateFaceCanvas,
          } = latestRef.current;

          // Smoothly animate watch face telemetry:
          // Health ECG waves and pulsating measuring heart rate update at ~30 FPS;
          // static faces update at ~2 FPS to conserve GPU cycles.
          const isHighRate =
            currentFace === 'health' ||
            currentFace === 'neon' ||
            currentWidgets.isMeasuringHeartRate;
          const threshold = isHighRate ? 33 : 500;

          if (timeMs - lastFaceUpdate > threshold) {
            currentUpdateFaceCanvas(undefined, timeMs);
            lastFaceUpdate = timeMs;
          }
        },
      });

      sceneManagerRef.current = sceneManager;
      setWebGLError(null);
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to 2D preview:', err);
      setWebGLError(err instanceof Error ? err.message : 'WebGL unsupported');
    }

    // Cleanup on unmount: dispose WebGL and texture resources
    return () => {
      if (sceneManagerRef.current) {
        sceneManagerRef.current.dispose();
        sceneManagerRef.current = null;
      }
      if (canvasTextureRef.current) {
        canvasTextureRef.current.dispose();
        canvasTextureRef.current = null;
      }
      offscreenCanvasRef.current = null;
      modelRef.current = null;
    };
  }, []); // Run once on mount

  // 2. Synchronize 3D Model when product modelType changes
  useEffect(() => {
    const sceneManager = sceneManagerRef.current;
    const texture = canvasTextureRef.current;
    if (!sceneManager) return;

    // Create corresponding procedural 3D model
    const newModel = createProceduralModel(
      selectedProduct.modelType,
      selectedChassisColor.hex,
      selectedStrapColor.hex,
      texture || undefined
    );

    modelRef.current = newModel;
    sceneManager.setModel(newModel);
    updateFaceCanvas();
  }, [selectedProduct.modelType]);

  // 3. Synchronize Chassis Finish Color
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.updateChassisColor(selectedChassisColor.hex);
    }
  }, [selectedChassisColor.hex]);

  // 4. Synchronize Strap Finish Color
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.updateStrapColor(selectedStrapColor.hex);
    }
  }, [selectedStrapColor.hex]);

  // 5. Synchronize Watch Face & Widget Telemetry
  useEffect(() => {
    updateFaceCanvas();
  }, [selectedWatchFace, simulatedWidgets, isBand, updateFaceCanvas]);

  // 6. Synchronize Turntable Auto-Rotation
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setAutoRotate(isAutoRotating);
    }
  }, [isAutoRotating]);

  // 7. Synchronize Camera Angle Presets
  useEffect(() => {
    if (cameraPreset && sceneManagerRef.current) {
      sceneManagerRef.current.setCameraPreset(cameraPreset);
      setCameraPreset(null); // Consume trigger
    }
  }, [cameraPreset, setCameraPreset]);

  return (
    <div
      className={`relative w-full h-[450px] sm:h-[540px] lg:h-[620px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F8F6FF] via-[#F1EEFE] to-[#EAE6FD] shadow-[0_20px_50px_rgba(124,58,237,0.08)] border border-purple-100 ${className}`}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Control & Telemetry Overlay */}
      <ViewerControlsOverlay />

      {/* Fallback View if WebGL fails */}
      {webGLError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/90 text-white backdrop-blur-md">
          <div className="max-w-md text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-violet-600/30 flex items-center justify-center text-violet-400 font-bold">
              3D
            </div>
            <h3 className="text-lg font-bold">Hardware 3D Preview Fallback</h3>
            <p className="text-sm text-slate-300">
              WebGL is currently not available in this environment. Showing simulated 2D display for{' '}
              <span className="font-semibold text-violet-400">{selectedProduct.name}</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
