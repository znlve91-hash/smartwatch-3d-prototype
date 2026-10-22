# Task brief: T2

Requirements below are verbatim from the approved plan and task list. Use exact values, names and test cases as written.

## From tasks/plan.md: **Task T2**: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas S

- **Task T2**: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas System

## From tasks/todo.md: Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas System

## Task T2: 3D Three.js Studio & Dynamic Watch Face / Widget Canvas System

**Description:** Build the Three.js 3D rendering pipeline and dynamic offscreen canvas texture engine. Implement procedural 3D geometries for Band (capsule + curved strap) and Watch (Standard, Pro, Pro Max with rugged bumper and rotating crown). Create the dynamic 2D canvas renderer supporting 4 watch faces (Minimal, Neon, Chrono, Health) and interactive simulated telemetry widgets (live pulsing heart rate, step counter, weather toggle, music playback, battery monitor). Implement `ViewerContext` and interactive camera controls (360° orbit rotation, auto-rotate turntable, reset view).

**Acceptance criteria:**
- [ ] Three.js scene manager with WebGLRenderer, lights, damping OrbitControls, and auto-rotation toggle in `src/components/viewer3d/SceneManager.ts`.
- [ ] Procedural geometries for Band (Standard/Pro) and Watch (Standard/Pro/Pro Max) with customizable chassis and strap colors in `src/components/viewer3d/proceduralMeshes.ts`.
- [ ] Dynamic offscreen canvas texture renderer in `src/components/viewer3d/watchFaceCanvas.ts` supporting Minimal, Neon, Chrono, and Health watch faces.
- [ ] Interactive widget telemetry simulator (heart rate pulse & measurement, step increment, weather toggle, music player, battery status) in `src/context/ViewerContext.tsx`.
- [ ] React 3D viewer component and control overlay (`WatchViewer3D.tsx`, `ViewerControlsOverlay.tsx`).
- [ ] Unit tests in `tests/watchFaceCanvas.test.ts` verifying face rendering logic, color themes, and widget updates pass.

**Verification:**
- [ ] Tests pass: `npm test tests/watchFaceCanvas.test.ts`
- [ ] Build succeeds: `npm run build`

**Dependencies:** Task T1

**Files likely touched:**
- `src/components/viewer3d/SceneManager.ts`
- `src/components/viewer3d/proceduralMeshes.ts`
- `src/components/viewer3d/watchFaceCanvas.ts`
- `src/components/viewer3d/WatchViewer3D.tsx`
- `src/components/viewer3d/ViewerControlsOverlay.tsx`
- `src/context/ViewerContext.tsx`
- `tests/watchFaceCanvas.test.ts`

**Estimated scope:** Medium-Large (6-7 files)

---
