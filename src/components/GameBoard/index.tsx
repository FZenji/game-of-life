'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HelpCircle, Volume2, VolumeOff } from 'lucide-react';
import GridCanvas from './GridCanvas';
import Controls from './Controls';
import HelpModal from '../HelpModal';
import ColorPicker from '../ColorPicker';
import { playSound, setGlobalMute } from '../../utils/sound';

// Simulation Configuration
const ROWS = 40;
const COLS = 60;

// Grid Helpers
const createEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(false));
const createRandomGrid = () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.random() > 0.7));

const operations = [
  [0, 1], [0, -1], [1, -1], [-1, 1],
  [1, 1], [-1, -1], [1, 0], [-1, 0]
];

export default function Game() {
  const [grid, setGrid] = useState<boolean[][]>(createEmptyGrid);
  const [initialGrid, setInitialGrid] = useState<boolean[][] | null>(null); // For resetting
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(500); // Start halfway (approx 500ms)
  const [themeColor, setThemeColor] = useState('#38bdf8');
  const [showHelp, setShowHelp] = useState(true); // Show on load
  const [isMuted, setIsMuted] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;
  
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Simulation Loop
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      const nextGrid = g.map(row => [...row]);
      let changed = false;

      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
              neighbors += g[newI][newJ] ? 1 : 0;
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            if (g[i][j]) {
                nextGrid[i][j] = false;
                changed = true;
            }
          } else if (g[i][j] === false && neighbors === 3) {
            nextGrid[i][j] = true;
            changed = true;
          }
        }
      }
      return changed ? nextGrid : g;
    });

    setGeneration((gen) => {
        playSound('step'); // Loop sound
        return gen + 1;
    });
    
    setTimeout(runSimulation, speedRef.current);
  }, []);

  // Handlers
  const togglePlay = useCallback(() => {
    const isNowPlaying = !running;
    setRunning(isNowPlaying);
    runningRef.current = isNowPlaying;
    
    if (isNowPlaying) {
      playSound('start');
      if (!initialGrid || generation === 0) {
          setInitialGrid(grid.map(row => [...row]));
      }
      runSimulation();
    } else {
        playSound('click');
    }
  }, [running, grid, generation, initialGrid, runSimulation]);

  const handleRandomize = useCallback(() => {
    const newGrid = createRandomGrid();
    setGrid(newGrid);
    setInitialGrid(newGrid); // Update initial state
    setGeneration(0);
    playSound('success');
  }, []);

  const handleClear = useCallback(() => {
    setGrid(createEmptyGrid());
    setInitialGrid(null);
    setGeneration(0);
    setRunning(false);
    playSound('clear');
  }, []);
  
  const handleReset = useCallback(() => {
      if (initialGrid) {
          setGrid(initialGrid.map(row => [...row])); // Restore copy
          setGeneration(0);
          setRunning(false);
          playSound('reset');
      } else {
          // Fallback if no initial state
          handleClear();
      }
  }, [initialGrid, handleClear]);

  const toggleMute = useCallback(() => {
      setIsMuted(prev => {
          const newState = !prev;
          setGlobalMute(newState);
          return newState;
      });
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'r':
          handleReset();
          break;
        case 'c':
        case 'd': // "Clear" / "Delete"
          handleClear();
          break;
        case 'z':
          handleRandomize();
          break;
        case '?':
        case '/':
           setShowHelp(prev => !prev);
           break;
        case '+':
        case '=': // Support = for + functionality without shift
             setSpeed(prev => Math.max(50, prev - 50)); // Decrease interval = Increase speed
             break;
        case '-':
        case '_':
             setSpeed(prev => Math.min(1000, prev + 50)); // Increase interval = Decrease speed
             break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, handleReset, handleClear, handleRandomize]);


  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto z-10">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6 px-4">
        <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Game of Life
            </h1>
            <p className="text-slate-400 text-sm mt-1">
             <kbd className="bg-slate-800 px-1 rounded">SPACE</kbd> to Run  •  <kbd className="bg-slate-800 px-1 rounded">?</kbd> for Help
            </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-4 items-center">
             <button 
               onClick={toggleMute}
               className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
               title={isMuted ? "Unmute" : "Mute"}
             >
                 {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
             </button>
             
             <ColorPicker color={themeColor} setColor={setThemeColor} />
             
             <button 
               onClick={() => setShowHelp(true)}
               className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
               title="Help"
             >
                 <HelpCircle size={20} />
             </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group rounded-xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mb-8">
        <GridCanvas 
            grid={grid} 
            setGrid={(newGrid) => {
                setGrid(newGrid);
                playSound('click'); // Sound on paint
            }} 
            interactive={!running}
            color={themeColor}
        />
        
        {/* Helper overlay */}
        {generation === 0 && !running && grid.every(r => r.every(c => !c)) && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <p className="text-slate-500 text-lg animate-pulse">
                     Click or drag to paint cells
                 </p>
             </div>
        )}
      </div>

      <Controls
        isPlaying={running}
        onPlayPause={togglePlay}
        onReset={handleReset}
        onRandomize={handleRandomize}
        onClear={handleClear}
        speed={speed}
        setSpeed={setSpeed}
        generation={generation}
      />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
