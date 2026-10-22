/**
 * Simulated Widgets Configuration & Mock State
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

export const WIDGETS = [
  {
    id: 'heartRate',
    name: 'Heart Rate',
    unit: 'BPM',
    icon: 'Heart',
    description: 'Interactive animated pulse wave with live BPM simulator',
    initialState: {
      bpm: 78,
      minBpm: 68,
      maxBpm: 115,
      restingBpm: 64,
      status: 'Normal',
      history: [72, 74, 76, 75, 78, 82, 80, 78],
    },
  },
  {
    id: 'steps',
    name: 'Daily Steps',
    unit: 'steps',
    icon: 'Footprints',
    description: 'Circular progress ring with step counter incrementation and distance estimate',
    initialState: {
      current: 7420,
      goal: 10000,
      distanceKm: 5.4,
      caloriesBurned: 342,
      progress: 0.742,
    },
  },
  {
    id: 'weather',
    name: 'Weather',
    unit: '°C',
    icon: 'CloudSun',
    description: 'Current temperature, high/low forecasts, UV index, and weather condition',
    initialState: {
      tempC: 24,
      tempF: 75,
      condition: 'Partly Sunny',
      high: 28,
      low: 20,
      uvIndex: 4,
      humidity: 62,
      city: 'San Francisco',
    },
  },
  {
    id: 'music',
    name: 'Music Controller',
    unit: 'track',
    icon: 'Music',
    description: 'Mini media player with track info, play/pause toggle, and playback progress',
    initialState: {
      track: 'Echoes of Tomorrow',
      artist: 'Nova Beats',
      isPlaying: false,
      progress: 42,
      duration: 210,
      albumArt: 'nova-beats-cover',
    },
  },
  {
    id: 'battery',
    name: 'Battery Indicator',
    unit: '%',
    icon: 'Battery',
    description: 'Dynamic percentage readout, charging status, and Low Power Mode toggle',
    initialState: {
      level: 88,
      isCharging: false,
      lowPowerMode: false,
      estimatedHoursRemaining: 36,
    },
  },
];

export function getWidgetById(id) {
  if (!id) return undefined;
  return WIDGETS.find((w) => w.id === id);
}

export function getAllWidgets() {
  return WIDGETS;
}

/**
 * Simulates a realistic fluctuation of heart rate within the spec-mandated 68 to 115 BPM range.
 * @param {number} currentBpm
 * @returns {number} new BPM clamped to [68, 115]
 */
export function simulateNextHeartRate(currentBpm = 78) {
  // Delta between -4 and +4 BPM
  const delta = Math.floor(Math.random() * 9) - 4;
  const next = currentBpm + delta;
  return Math.max(68, Math.min(115, next));
}

/**
 * Increments step count and updates proportional distance, calories, and goal progress.
 * @param {number|object} currentOrState
 * @param {number} [incrementAmount=100]
 * @param {number} [goal=10000]
 * @returns {object} updated steps state
 */
export function incrementSteps(currentOrState, incrementAmount = 100, goal = 10000) {
  let current;
  let targetGoal = goal;

  if (typeof currentOrState === 'object' && currentOrState !== null) {
    current = currentOrState.current ?? 0;
    targetGoal = currentOrState.goal ?? goal;
  } else {
    current = typeof currentOrState === 'number' ? currentOrState : 0;
  }

  const newCurrent = current + incrementAmount;
  // Approx 0.00075 km per step
  const distanceKm = Number((newCurrent * 0.00075).toFixed(2));
  // Approx 0.045 kcal per step
  const caloriesBurned = Math.round(newCurrent * 0.045);
  const progress = Number((newCurrent / targetGoal).toFixed(3));

  return {
    current: newCurrent,
    goal: targetGoal,
    distanceKm,
    caloriesBurned,
    progress,
  };
}

/**
 * Toggles music playback state (playing vs paused).
 * @param {object} musicState
 * @returns {object} updated music state
 */
export function toggleMusicPlayback(musicState) {
  if (!musicState) {
    return { isPlaying: true, track: 'Echoes of Tomorrow', artist: 'Nova Beats' };
  }
  return {
    ...musicState,
    isPlaying: !musicState.isPlaying,
  };
}

/**
 * Toggles device low power mode.
 * @param {object} batteryState
 * @returns {object} updated battery state
 */
export function toggleLowPowerMode(batteryState) {
  if (!batteryState) {
    return { level: 100, isCharging: false, lowPowerMode: true };
  }
  return {
    ...batteryState,
    lowPowerMode: !batteryState.lowPowerMode,
  };
}
