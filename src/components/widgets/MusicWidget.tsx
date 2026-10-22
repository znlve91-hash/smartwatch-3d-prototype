import React from 'react';
import type { WatchSimulatorState } from '../../hooks/useWatchSimulator';
import { Play, Pause, SkipBack, SkipForward, Music, Disc3, Volume2 } from 'lucide-react';

export interface MusicWidgetProps {
  simulator: WatchSimulatorState;
  onClose?: () => void;
}

export const MusicWidget: React.FC<MusicWidgetProps> = ({ simulator, onClose }) => {
  const {
    currentTrack,
    isPlayingMusic,
    toggleMusicPlay,
    nextTrack,
    prevTrack,
    musicProgressSec,
    equalizerBars,
  } = simulator;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(
    100,
    Math.round((musicProgressSec / currentTrack.durationSec) * 100)
  );

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/50">
            <Music className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Music Player</h4>
            <p className="text-xs text-slate-500">Bluetooth Audio 5.3</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md"
          >
            ✕
          </button>
        )}
      </div>

      {/* Album Art & Track Info Card */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-cyan-50/50 p-4 rounded-xl border border-purple-100">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300"
          style={{ backgroundColor: currentTrack.albumArtColor }}
        >
          <Disc3
            className={`w-9 h-9 text-white/90 ${
              isPlayingMusic ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-sm font-extrabold text-slate-900 truncate">
            {currentTrack.title}
          </h5>
          <p className="text-xs text-slate-600 truncate mt-0.5">{currentTrack.artist}</p>

          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-4 mt-2">
            {equalizerBars.map((height, idx) => (
              <span
                key={idx}
                className="w-1 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-full transition-all duration-300"
                style={{
                  height: isPlayingMusic ? `${height}%` : '20%',
                }}
              />
            ))}
            <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
              {isPlayingMusic ? 'Playing' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
          <span>{formatTime(musicProgressSec)}</span>
          <span>{formatTime(currentTrack.durationSec)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          onClick={prevTrack}
          title="Previous Track"
          className="p-2.5 rounded-full text-slate-600 hover:bg-purple-100/60 active:scale-95 transition-all"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={toggleMusicPlay}
          title={isPlayingMusic ? 'Pause' : 'Play'}
          className="p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all"
        >
          {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        <button
          onClick={nextTrack}
          title="Next Track"
          className="p-2.5 rounded-full text-slate-600 hover:bg-purple-100/60 active:scale-95 transition-all"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
