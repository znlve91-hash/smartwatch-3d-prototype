# Task brief: T2

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas

### Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas
- **Scope:** Implement procedural 3D wearable geometries for Bands and Smart Watches, dynamic 512x512 Canvas watch face texture generator, 360-degree orbit rotation, auto-rotation toggle, zoom/reset controls, live color/chassis swapping, and widget interactions.
- **Deliverables:**
  - `src/components/3d/ProceduralWatchMesh.js`
  - `src/components/3d/WatchCanvasTexture.js`
  - `src/components/3d/WatchViewer3D.jsx`
  - `src/components/3d/ViewerControls.jsx`
  - `src/hooks/use3DWatch.js`
  - `tests/watchTexture.test.js`

## From tasks/todo.md: Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas

**Description:** Implement the procedural 3D wearable rendering engine in Three.js, supporting both Smart Watch and Band geometries, a dynamic 512x512 Canvas texture generator for 4 watch faces (Minimal, Neon, Chrono, Health) and 5 simulated widgets (Heart Rate, Steps, Weather, Music, Battery), with 360-degree orbit rotation, auto-spin toggle, zoom controls, reset angle, and live color customization.

**Acceptance Criteria:**
- [ ] `src/components/3d/ProceduralWatchMesh.js` constructs high-fidelity procedural 3D models for both Smart Band (elongated capsule, silicone strap) and Smart Watch (chamfered bevel disk, crown button, lug attachments, segmented strap).
- [ ] `src/components/3d/WatchCanvasTexture.js` dynamically renders 4 distinct watch faces on a 512x512 canvas:
  - Minimal: Clean typography, sleek hour/minute hands, minimal date
  - Neon: Glowing cyber cyan/purple digital clock, pulsating second ring
  - Chrono: Luxury chronograph with 3 sub-dials, tachymeter scale, metallic indices
  - Health: Concentric activity rings (Move, Exercise, Stand) and live metric readouts
- [ ] Dynamic widgets can be simulated and updated on the watch face (Heart Rate pulse, Step counter progress, Weather forecast, Music playback toggle, Battery status).
- [ ] `src/components/3d/WatchViewer3D.jsx` supports smooth 360° mouse drag orbit, touch rotation, auto-spin toggle (1.5 RPM), zoom in/out, and reset view.
- [ ] `src/components/3d/ViewerControls.jsx` provides an interactive floating dock to switch models, watch faces, widgets, and strap/casing colorways in real time.
- [ ] WebGL resources and animation frame loops are properly cleaned up on unmount.
- [ ] Unit tests in `tests/watchTexture.test.js` verify canvas face rendering logic and widget state updates.

**Verification:**
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1

---
