'use client';

import React, { useRef, useEffect, useState } from 'react';

interface GridCanvasProps {
  grid: boolean[][];
  setGrid: (newGrid: boolean[][]) => void;
  interactive: boolean;
  color?: string;
}

const CELL_SIZE = 15; // Size of each cell in pixels
const GRID_COLOR = '#334155'; // Slate-700
// const ALIVE_COLOR = '#38bdf8'; // Sky-400 (DEFAULT REMOVED)
const DEAD_COLOR = '#0f172a'; // Slate-900 (Background)

export default function GridCanvas({ grid, setGrid, interactive, color = '#38bdf8' }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = grid.length;
    const cols = grid[0].length;

    // Clear canvas
    ctx.fillStyle = DEAD_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (optional, can be performance intensive for large grids)
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;

    /* 
       Optimization: Draw cells only. 
       Drawing grid lines on every frame for large grids is slow.
       We can draw the grid background once or just infer it from gaps if needed.
       For "sleek" look, maybe no grid lines, just cells? 
       Let's try drawing cells with a slight gap to simulate grid lines.
    */
    
    // Draw alive cells
    ctx.fillStyle = color;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          // Draw with a 1px gap for grid effect
          ctx.fillRect(
            c * CELL_SIZE + 1, 
            r * CELL_SIZE + 1, 
            CELL_SIZE - 2, 
            CELL_SIZE - 2
          );
        } else {
             // Draw dead cells as slightly lighter than background (optional) or just leave empty
             // To visualize grid structure:
             ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
             ctx.fillRect(
                c * CELL_SIZE + 1, 
                r * CELL_SIZE + 1, 
                CELL_SIZE - 2, 
                CELL_SIZE - 2
              );
              ctx.fillStyle = color; // Reset for next alive cell
        }
      }
    }

  }, [grid]);

  const handleInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      // Toggle logic usually works on click. For dragging, we usually "paint" alive cells.
      // If we want to toggle, we should track the initial state.
      // For simplicity/painting: Paint ALIVE on drag.
      newGrid[row][col] = true; 
      setGrid(newGrid);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={grid[0].length * CELL_SIZE}
      height={grid.length * CELL_SIZE}
      className="cursor-crosshair touch-none"
      onMouseDown={(e) => { setIsDrawing(true); handleInteraction(e); }}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
      onMouseMove={(e) => { if (isDrawing) handleInteraction(e); }}
      onTouchStart={(e) => { setIsDrawing(true); handleInteraction(e); }}
      onTouchEnd={() => setIsDrawing(false)}
      onTouchMove={(e) => { if (isDrawing) handleInteraction(e); }}
    />
  );
}
