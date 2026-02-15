'use client';

import React from 'react';
import { X, HelpCircle, Command, Info } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
            <Info className="text-blue-500" />
            Game of Life Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-slate-300 space-y-8">
          
          {/* Rules */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">The Rules</h3>
            <p className="mb-4 text-slate-400 leading-relaxed">
              Conway's Game of Life is a cellular automaton played on a grid. Each cell is either alive or dead.
            </p>
            <ul className="space-y-2 list-disc pl-5 marker:text-blue-500">
              <li><strong className="text-blue-300">Underpopulation:</strong> A live cell with &lt; 2 neighbors dies.</li>
              <li><strong className="text-blue-300">Survival:</strong> A live cell with 2 or 3 neighbors lives.</li>
              <li><strong className="text-blue-300">Overpopulation:</strong> A live cell with &gt; 3 neighbors dies.</li>
              <li><strong className="text-green-300">Reproduction:</strong> A dead cell with exactly 3 neighbors becomes a live cell.</li>
            </ul>
          </section>

          {/* Controls */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
               <Command size={18} />
               Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <span>Play / Pause</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-white">Space</kbd>
              </div>
               <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <span>Reset Pattern</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-white">R</kbd>
              </div>
               <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <span>Clear Board</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-white">C</kbd>
              </div>
               <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <span>Randomize</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-white">Z</kbd>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center border border-slate-700/50">
                <span>Help</span>
                <kbd className="bg-slate-700 px-2 py-1 rounded text-xs font-mono text-white">?</kbd>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors w-full md:w-auto"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
