'use client';

import React from 'react';
import { Play, Pause, RefreshCw, Shuffle, Trash2 } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onClear: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  generation: number;
}

export default function Controls({
  isPlaying,
  onPlayPause,
  onReset,
  onRandomize,
  onClear,
  speed,
  setSpeed,
  generation,
}: ControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl w-full max-w-2xl mx-auto mb-8 pointer-events-auto">
      
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayPause}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg shadow-blue-500/30"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
        </button>

        <button
          onClick={onReset}
          className="p-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors"
          title="Reset"
        >
          <RefreshCw size={20} />
        </button>
        
         <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
          title="Clear Board"
        >
          <Trash2 size={20} />
        </button>

        <button
          onClick={onRandomize}
          className="p-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors"
          title="Randomize"
        >
          <Shuffle size={20} />
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <span className="text-sm font-medium text-slate-300">Speed</span>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={101 - (speed / 10)} // Map 1000ms -> 1, 50ms -> 96 (approx) 
          // Let's do a cleaner mapping. 
          // High speed (100) = Low Interval (50ms). Low Speed (1) = High Interval (1000ms).
          // Inverse relationship.
          onChange={(e) => {
             const val = Number(e.target.value);
             // val 1 -> 1000ms
             // val 100 -> 50ms
             // Linear interpolation: 
             // speed = 1000 - ((val - 1) / (100 - 1)) * (1000 - 50)
             const newInterval = 1000 - ((val - 1) / 99) * 950;
             setSpeed(newInterval);
          }}
          className="w-full md:w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="text-right">
        <div className="text-xs text-slate-400 uppercase tracking-wider">Generation</div>
        <div className="text-xl font-bold text-white font-mono">{generation}</div>
      </div>
    </div>
  );
}
