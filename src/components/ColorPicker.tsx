'use client';

import React from 'react';

interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
}

const PRESETS = [
    '#38bdf8', // Sky (Default)
    '#a855f7', // Purple
    '#f472b6', // Pink
    '#22c55e', // Green
    '#eab308', // Yellow
    '#f97316', // Orange
];

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm pointer-events-auto">
      <span className="text-xs text-slate-400 font-medium uppercase px-1">Theme</span>
      
      {/* Presets */}
      <div className="flex gap-1.5">
          {PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setColor(preset)}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${color === preset ? 'ring-2 ring-white scale-110' : ''}`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
          ))}
      </div>

       {/* Custom Input */}
       <div className="relative group ml-1">
           <input 
             type="color" 
             value={color}
             onChange={(e) => setColor(e.target.value)}
             className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden cursor-pointer bg-transparent"
             title="Custom Color"
           />
           <div className="absolute inset-0 rounded-full ring-1 ring-slate-600 pointer-events-none group-hover:ring-slate-400" />
       </div>
    </div>
  );
}
