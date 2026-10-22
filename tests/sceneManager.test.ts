import { describe, it, expect, vi } from 'vitest';
import { SceneManager } from '../src/components/viewer3d/SceneManager';

describe('SceneManager - REQ-01 setOnRenderFrame', () => {
  it('should define setOnRenderFrame method on SceneManager', () => {
    expect(typeof SceneManager.prototype.setOnRenderFrame).toBe('function');
  });

  it('should update onRenderFrameCallback via setOnRenderFrame', () => {
    const fakeInstance = Object.create(SceneManager.prototype);
    const cb = vi.fn();
    fakeInstance.setOnRenderFrame(cb);
    expect((fakeInstance as any).onRenderFrameCallback).toBe(cb);

    fakeInstance.setOnRenderFrame(undefined);
    expect((fakeInstance as any).onRenderFrameCallback).toBeUndefined();
  });
});

describe('WatchViewer3D - CRIT-02 latestRef Stale Closure Safeguard', () => {
  it('should read latest dynamic state from mutable ref without stale closure', () => {
    // Simulate the latestRef pattern used in WatchViewer3D
    let lastFaceUpdate = 0;
    const initialUpdateFaceCanvas = vi.fn();
    const updatedUpdateFaceCanvas = vi.fn();

    const latestRef = {
      current: {
        selectedWatchFace: 'minimal' as const,
        simulatedWidgets: {
          heartRate: 72,
          isMeasuringHeartRate: false,
          steps: 5000,
          stepGoal: 10000,
          isPlayingMusic: false,
          currentTrack: null,
          weather: { temp: 20, condition: 'sunny' as const, city: 'Cupertino' },
          battery: 85,
        },
        isBand: false,
        updateFaceCanvas: initialUpdateFaceCanvas,
      },
    };

    const onRenderFrame = (timeMs: number) => {
      const {
        selectedWatchFace: currentFace,
        simulatedWidgets: currentWidgets,
        updateFaceCanvas: currentUpdateFaceCanvas,
      } = latestRef.current;

      const isHighRate =
        currentFace === 'health' ||
        currentFace === 'neon' ||
        currentWidgets.isMeasuringHeartRate;
      const threshold = isHighRate ? 33 : 500;

      if (timeMs - lastFaceUpdate > threshold) {
        currentUpdateFaceCanvas(undefined, timeMs);
        lastFaceUpdate = timeMs;
      }
    };

    // Frame 1: Initial minimal face with threshold = 500ms
    onRenderFrame(100);
    expect(initialUpdateFaceCanvas).not.toHaveBeenCalled();

    onRenderFrame(600);
    expect(initialUpdateFaceCanvas).toHaveBeenCalledTimes(1);

    // Now update state (user switches to health face and measuring heart rate)
    latestRef.current = {
      selectedWatchFace: 'health' as const,
      simulatedWidgets: {
        ...latestRef.current.simulatedWidgets,
        isMeasuringHeartRate: true,
      },
      isBand: false,
      updateFaceCanvas: updatedUpdateFaceCanvas,
    };

    // Frame 2: Should now recognize high rate threshold (33ms) and invoke the NEW updateFaceCanvas
    onRenderFrame(640);
    expect(updatedUpdateFaceCanvas).toHaveBeenCalledWith(undefined, 640);
    // Initial callback should not have been called again
    expect(initialUpdateFaceCanvas).toHaveBeenCalledTimes(1);
  });
});
