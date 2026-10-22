# Task brief: T2

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Eng

- **Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Engine**
  - Implement Three.js procedural geometries for Band (capsule & loop) and Smart Watch (casing, bezel, crown, lugs, straps).
  - Build dynamic 512x512 CanvasTexture generator supporting 4 watch faces (**Minimal**, **Neon**, **Chrono**, **Health/Activity**).
  - Build 5 interactive simulated widgets (**Heart Rate**, **Steps**, **Weather**, **Music**, **Battery**).
  - Implement `WatchViewer3D` container with 360-degree orbit rotation, camera presets, and `StudioControls`.
  - Author simulator unit tests in `tests/simulator.test.ts`.

## From tasks/todo.md: Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Engine

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas Engine

**Description:** Build the Three.js procedural 3D wearable model synthesis for both Smart Band (capsule chassis + wrap-around strap) and Smart Watch (round/squircle case + bezel + crown + lugs + strap), implement dynamic 512x512 CanvasTexture watch face rendering with 4 faces (Minimal, Neon, Chrono, Health), implement 5 interactive simulated widgets (Heart Rate, Steps, Weather, Music, Battery), and provide 360-degree orbit rotation controls.

**Acceptance criteria:**
- [ ] `src/components/viewer3d/WatchGeometry.ts` generates Three.js procedural meshes for Band (capsule) and Watch (case, bezel, crown, lugs, straps) with real-time material/color updating.
- [ ] `src/components/viewer3d/WatchFaceRenderer.ts` draws 4 distinct watch faces (Minimal, Neon, Chrono, Health) on offscreen canvas.
- [ ] `src/components/widgets/` contains 5 interactive smart widgets: Heart Rate (ECG wave), Steps (10k progress ring), Weather, Music Player (playback controls & equalizer), and Battery (level & eco mode).
- [ ] `src/components/viewer3d/WatchViewer3D.tsx` provides 360-degree orbit mouse/touch drag rotation, auto-rotate toggle, and lighting setup.
- [ ] `src/components/viewer3d/StudioControls.tsx` provides color swatches, face picker, camera preset buttons, and widget drawer toggle.
- [ ] `tests/simulator.test.ts` validates widget calculation bounds and watch face switching logic.

**Verification:**
- [ ] Tests pass: `npm test tests/simulator.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1

**Files likely touched:**
- `src/components/viewer3d/WatchViewer3D.tsx`
- `src/components/viewer3d/WatchGeometry.ts`
- `src/components/viewer3d/WatchScreenTexture.ts`
- `src/components/viewer3d/WatchFaceRenderer.ts`
- `src/components/viewer3d/StudioControls.tsx`
- `src/components/widgets/HeartRateWidget.tsx`
- `src/components/widgets/StepsWidget.tsx`
- `src/components/widgets/WeatherWidget.tsx`
- `src/components/widgets/MusicWidget.tsx`
- `src/components/widgets/BatteryWidget.tsx`
- `src/hooks/useWatchSimulator.ts`
- `tests/simulator.test.ts`

**Estimated scope:** Large (6-8 files)

---
