import * as THREE from 'three';
import type { WatchFaceId } from '../../types';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { renderWatchFace } from './WatchFaceRenderer';

export class WatchScreenManager {
  public canvas: HTMLCanvasElement;
  public texture: THREE.CanvasTexture;
  private isDestroyed = false;

  constructor(resolution = 512) {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = resolution;
      this.canvas.height = resolution;
    } else {
      // Fallback for SSR or non-DOM test environments
      this.canvas = {
        width: resolution,
        height: resolution,
        getContext: () => null,
      } as unknown as HTMLCanvasElement;
    }

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.generateMipmaps = true;
    this.texture.minFilter = THREE.LinearMipmapLinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    if ('colorSpace' in this.texture && (THREE as unknown as { SRGBColorSpace?: string }).SRGBColorSpace) {
      this.texture.colorSpace = (THREE as unknown as { SRGBColorSpace: string }).SRGBColorSpace;
    }
  }

  public update(
    faceId: WatchFaceId,
    simulatorState: WatchSimulatorState,
    time = new Date()
  ): void {
    if (this.isDestroyed || !this.canvas) return;

    renderWatchFace(this.canvas, faceId, time, simulatorState);
    this.texture.needsUpdate = true;
  }

  public dispose(): void {
    this.isDestroyed = true;
    if (this.texture) {
      this.texture.dispose();
    }
  }
}

export function createWatchScreenManager(resolution = 512): WatchScreenManager {
  return new WatchScreenManager(resolution);
}
