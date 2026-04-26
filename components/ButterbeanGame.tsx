
import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- CONSTANTS ---
const GRID_SIZE = 16;
const TILE_SIZE = 32;
const GAME_WIDTH = GRID_SIZE * TILE_SIZE;
const GAME_HEIGHT = GRID_SIZE * TILE_SIZE;

const TILE_EMPTY = 0;
const TILE_WALL = 1;
const TILE_BLOCK = 2;
const TILE_MOUSE = 3;
const TILE_PLAYER = 4;
const TILE_FISH = 5;
const TILE_TRAPPED_MOUSE = 6;

// --- TYPES ---
interface Point {
  x: number;
  y: number;
}

interface Mouse {
  pos: Point;
  id: number;
  trapped: boolean;
}

interface GameState {
  level: number;
  score: number;
  lives: number;
  grid: number[][];
  playerPos: Point;
  mice: Mouse[];
  gameOver: boolean;
  gameWon: boolean;
  status: 'start' | 'playing' | 'gameover' | 'levelwin';
  speedBoost: number; // frames left
}

const ButterbeanGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    lives: 3,
    grid: [],
    playerPos: { x: 1, y: 1 },
    mice: [],
    gameOver: false,
    gameWon: false,
    status: 'start',
    speedBoost: 0,
  });

  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // --- INITIALIZATION ---
  const initLevel = useCallback((level: number, resetScore = false) => {
    setShowHelp(false);
    const grid: number[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) {
          grid[y][x] = TILE_WALL;
        } else {
          grid[y][x] = TILE_EMPTY;
        }
      }
    }

    // Add random blocks
    const blockCount = 40 + level * 5;
    for (let i = 0; i < blockCount; i++) {
      let rx, ry;
      do {
        rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      } while (grid[ry][rx] !== TILE_EMPTY || (rx === 1 && ry === 1));
      grid[ry][rx] = TILE_BLOCK;
    }

    // Add mice
    const mice: Mouse[] = [];
    const mouseCount = 2 + Math.floor(level / 2);
    for (let i = 0; i < mouseCount; i++) {
      let rx, ry;
      do {
        rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      } while (grid[ry][rx] !== TILE_EMPTY || (rx < 3 && ry < 3));
      mice.push({ pos: { x: rx, y: ry }, id: i, trapped: false });
    }

    // Add fish power-up occasionally
    if (Math.random() > 0.6) {
      let rx, ry;
      do {
        rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      } while (grid[ry][rx] !== TILE_EMPTY);
      grid[ry][rx] = TILE_FISH;
    }

    setGameState(prev => ({
      ...prev,
      level,
      score: resetScore ? 0 : prev.score,
      lives: resetScore ? 3 : prev.lives,
      grid,
      playerPos: { x: 1, y: 1 },
      mice,
      status: 'playing',
      speedBoost: 0,
    }));
  }, []);

  // --- GAME LOGIC ---
  const movePlayer = (dx: number, dy: number) => {
    const { grid, playerPos, status, mice, speedBoost } = gameStateRef.current;
    if (status !== 'playing') return;

    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return;

    const target = grid[ny][nx];

    if (target === TILE_EMPTY || target === TILE_FISH) {
      if (target === TILE_FISH) {
        setGameState(prev => ({ ...prev, speedBoost: 20, score: prev.score + 50 }));
        const newGrid = [...grid.map(row => [...row])];
        newGrid[ny][nx] = TILE_EMPTY;
        setGameState(prev => ({ ...prev, grid: newGrid, playerPos: { x: nx, y: ny } }));
      } else {
        setGameState(prev => ({ ...prev, playerPos: { x: nx, y: ny } }));
      }
    } else if (target === TILE_BLOCK) {
      // Try to push
      const pnx = nx + dx;
      const pny = ny + dy;
      
      if (pnx >= 0 && pnx < GRID_SIZE && pny >= 0 && pny < GRID_SIZE) {
        if (grid[pny][pnx] === TILE_EMPTY) {
          const newGrid = [...grid.map(row => [...row])];
          newGrid[ny][nx] = TILE_EMPTY;
          newGrid[pny][pnx] = TILE_BLOCK;
          setGameState(prev => ({ ...prev, grid: newGrid, playerPos: { x: nx, y: ny } }));
        } else if (grid[pny][pnx] === TILE_BLOCK && speedBoost > 0) {
          // Push two blocks if speedBoost (Super Strength) is active
          const p2nx = pnx + dx;
          const p2ny = pny + dy;
          if (p2nx >= 0 && p2nx < GRID_SIZE && p2ny >= 0 && p2ny < GRID_SIZE && grid[p2ny][p2nx] === TILE_EMPTY) {
            const newGrid = [...grid.map(row => [...row])];
            newGrid[ny][nx] = TILE_EMPTY;
            newGrid[pny][pnx] = TILE_BLOCK;
            newGrid[p2ny][p2nx] = TILE_BLOCK;
            setGameState(prev => ({ ...prev, grid: newGrid, playerPos: { x: nx, y: ny }, speedBoost: prev.speedBoost - 1 }));
          }
        }
      }
    }

    // Check collision with mice
    const hitMouse = mice.find(m => m.pos.x === nx && m.pos.y === ny && !m.trapped);
    if (hitMouse) {
      handleLifeLoss();
    }
  };

  const handleLifeLoss = () => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        return { ...prev, lives: 0, status: 'gameover' };
      }
      return { ...prev, lives: newLives, playerPos: { x: 1, y: 1 } };
    });
  };

  const updateMice = useCallback(() => {
    const { grid, mice, playerPos, status } = gameStateRef.current;
    if (status !== 'playing') return;

    const newMice = mice.map(mouse => {
      if (mouse.trapped) return mouse;

      // Check if trapped
      const neighbors = [
        { x: mouse.pos.x + 1, y: mouse.pos.y },
        { x: mouse.pos.x - 1, y: mouse.pos.y },
        { x: mouse.pos.x, y: mouse.pos.y + 1 },
        { x: mouse.pos.x, y: mouse.pos.y - 1 },
      ];

      const canMove = neighbors.some(n => 
        n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && 
        grid[n.y][n.x] === TILE_EMPTY
      );

      if (!canMove) {
        setGameState(prev => ({ ...prev, score: prev.score + 100 }));
        return { ...mouse, trapped: true };
      }

      // Move randomly
      if (Math.random() > 0.5) {
        const validMoves = neighbors.filter(n => 
          n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && 
          grid[n.y][n.x] === TILE_EMPTY
        );
        if (validMoves.length > 0) {
          const move = validMoves[Math.floor(Math.random() * validMoves.length)];
          // Check collision with player
          if (move.x === playerPos.x && move.y === playerPos.y) {
            handleLifeLoss();
          }
          return { ...mouse, pos: move };
        }
      }
      return mouse;
    });

    setGameState(prev => ({ ...prev, mice: newMice }));

    // Check if all mice trapped
    if (newMice.every(m => m.trapped)) {
      setGameState(prev => ({ ...prev, status: 'levelwin' }));
    }
  }, []);

  // --- INPUT ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- GAME LOOP ---
  useEffect(() => {
    const interval = setInterval(() => {
      updateMice();
    }, 500);
    return () => clearInterval(interval);
  }, [updateMice]);

  // --- RENDERING ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { grid, playerPos, mice, status } = gameStateRef.current;
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw Grid
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const tile = grid[y][x];
          ctx.strokeStyle = '#ddd';
          ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

          if (tile === TILE_WALL) {
            ctx.fillStyle = '#444';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // Bevel
            ctx.strokeStyle = '#000';
            ctx.strokeRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          } else if (tile === TILE_BLOCK) {
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // Bevel
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE);
            ctx.lineTo(x * TILE_SIZE, y * TILE_SIZE);
            ctx.lineTo(x * TILE_SIZE + TILE_SIZE, y * TILE_SIZE);
            ctx.stroke();
            ctx.strokeStyle = '#808080';
            ctx.beginPath();
            ctx.moveTo(x * TILE_SIZE + TILE_SIZE, y * TILE_SIZE);
            ctx.lineTo(x * TILE_SIZE + TILE_SIZE, y * TILE_SIZE + TILE_SIZE);
            ctx.lineTo(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE);
            ctx.stroke();
          } else if (tile === TILE_FISH) {
            ctx.font = '20px Arial';
            ctx.fillText('🐟', x * TILE_SIZE + 4, y * TILE_SIZE + 24);
          }
        }
      }

      // Draw Mice
      mice.forEach(mouse => {
        if (mouse.trapped) {
          ctx.font = '20px Arial';
          ctx.fillText('🧀', mouse.pos.x * TILE_SIZE + 4, mouse.pos.y * TILE_SIZE + 24);
        } else {
          ctx.fillStyle = '#888';
          ctx.beginPath();
          ctx.arc(mouse.pos.x * TILE_SIZE + 16, mouse.pos.y * TILE_SIZE + 16, 10, 0, Math.PI * 2);
          ctx.fill();
          // Tail
          ctx.strokeStyle = '#888';
          ctx.beginPath();
          ctx.moveTo(mouse.pos.x * TILE_SIZE + 6, mouse.pos.y * TILE_SIZE + 16);
          ctx.lineTo(mouse.pos.x * TILE_SIZE, mouse.pos.y * TILE_SIZE + 16);
          ctx.stroke();
          // Ears
          ctx.fillStyle = '#888';
          ctx.beginPath();
          ctx.arc(mouse.pos.x * TILE_SIZE + 22, mouse.pos.y * TILE_SIZE + 10, 4, 0, Math.PI * 2);
          ctx.arc(mouse.pos.x * TILE_SIZE + 22, mouse.pos.y * TILE_SIZE + 22, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Player (Butterbean)
      ctx.fillStyle = '#ffa500'; // Orange
      ctx.beginPath();
      ctx.arc(playerPos.x * TILE_SIZE + 16, playerPos.y * TILE_SIZE + 16, 14, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(playerPos.x * TILE_SIZE + 6, playerPos.y * TILE_SIZE + 6);
      ctx.lineTo(playerPos.x * TILE_SIZE + 12, playerPos.y * TILE_SIZE + 10);
      ctx.lineTo(playerPos.x * TILE_SIZE + 10, playerPos.y * TILE_SIZE + 14);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(playerPos.x * TILE_SIZE + 26, playerPos.y * TILE_SIZE + 6);
      ctx.lineTo(playerPos.x * TILE_SIZE + 20, playerPos.y * TILE_SIZE + 10);
      ctx.lineTo(playerPos.x * TILE_SIZE + 22, playerPos.y * TILE_SIZE + 14);
      ctx.fill();
      // Face
      ctx.fillStyle = '#000';
      ctx.fillRect(playerPos.x * TILE_SIZE + 10, playerPos.y * TILE_SIZE + 12, 2, 2);
      ctx.fillRect(playerPos.x * TILE_SIZE + 20, playerPos.y * TILE_SIZE + 12, 2, 2);
      ctx.fillStyle = '#f00';
      ctx.fillRect(playerPos.x * TILE_SIZE + 15, playerPos.y * TILE_SIZE + 18, 2, 2);

      if (status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = '40px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      } else if (status === 'levelwin') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = '40px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      }
    };

    let animationFrameId: number;
    const loop = () => {
      render();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#008080] font-mono select-none">
      
      {/* WINDOW 95 CONTAINER */}
      <div className="w-[540px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-[4px_4px_0_0_#000]">
        
        {/* TITLE BAR */}
        <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white">
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm">🐱</span>
            <span className="text-xs font-bold">Butterbean.exe</span>
          </div>
          <div className="flex gap-1">
            <button className="w-4 h-4 bg-[#c0c0c0] border border-white border-b-[#808080] border-r-[#808080] text-black text-[10px] flex items-center justify-center">_</button>
            <button className="w-4 h-4 bg-[#c0c0c0] border border-white border-b-[#808080] border-r-[#808080] text-black text-[10px] flex items-center justify-center">□</button>
            <button onClick={onExit} className="w-4 h-4 bg-[#c0c0c0] border border-white border-b-[#808080] border-r-[#808080] text-black text-[10px] flex items-center justify-center">X</button>
          </div>
        </div>

        {/* MENU BAR */}
        <div className="flex gap-4 px-2 py-1 text-xs text-black border-b border-[#808080]">
          <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={() => initLevel(1, true)}>New Game</span>
          <span className="cursor-default hover:bg-[#000080] hover:text-white px-1" onClick={() => setShowHelp(true)}>Help</span>
        </div>

        {/* GAME AREA */}
        <div className="p-4 relative">
          <div className="bg-white border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white p-1">
            {gameState.status === 'start' ? (
              <div className="w-[512px] h-[512px] flex flex-col items-center justify-center bg-[#c0c0c0] gap-8">
                <h1 className="text-4xl font-black text-[#000080] italic">BUTTERBEAN'S REVENGE</h1>
                <div className="text-8xl">🐱</div>
                <button 
                  onClick={() => initLevel(1, true)}
                  className="px-8 py-4 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold"
                >
                  START GAME
                </button>
                <p className="text-xs text-center px-12">
                  Use ARROW KEYS or WASD to move.<br/>
                  Push blocks to trap the mice!<br/>
                  Don't let them touch you.
                </p>
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                width={GAME_WIDTH} 
                height={GAME_HEIGHT} 
                className="block cursor-default"
              />
            )}
          </div>

          {/* HELP MODAL */}
          {showHelp && (
            <div className="absolute inset-0 flex items-center justify-center z-[60] bg-black/20">
              <div className="w-[300px] bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080] shadow-xl">
                <div className="bg-[#000080] text-white text-[10px] px-2 py-1 flex justify-between items-center">
                  <span>Help Topics</span>
                  <button onClick={() => setShowHelp(false)}>X</button>
                </div>
                <div className="p-4 text-xs space-y-2">
                  <p><strong>Goal:</strong> Trap all mice by pushing blocks around them.</p>
                  <p><strong>Controls:</strong> Arrow Keys or WASD.</p>
                  <p><strong>Power-ups:</strong> 🐟 Fish gives you Super Strength (push 2 blocks at once) for a limited time!</p>
                  <button 
                    onClick={() => setShowHelp(false)}
                    className="w-full mt-4 py-1 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] font-bold"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        <div className="flex justify-between px-2 py-1 text-xs border-t border-[#808080] bg-[#c0c0c0]">
          <div className="flex gap-4">
            <div className="border-t border-l border-[#808080] border-b border-r border-white px-2 min-w-[60px]">
              Lvl: {gameState.level}
            </div>
            <div className="border-t border-l border-[#808080] border-b border-r border-white px-2 min-w-[80px]">
              Pts: {gameState.score}
            </div>
            {gameState.speedBoost > 0 && (
              <div className="border-t border-l border-[#808080] border-b border-r border-white px-2 bg-yellow-200 text-[#000080] font-bold animate-pulse">
                SUPER STRENGTH: {gameState.speedBoost}
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="border-t border-l border-[#808080] border-b border-r border-white px-2 min-w-[80px]">
              Lives: {'❤️'.repeat(gameState.lives)}
            </div>
          </div>
        </div>

        {/* OVERLAYS */}
        {gameState.status === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080] p-6 shadow-2xl flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">GAME OVER</h2>
              <p>Final Score: {gameState.score}</p>
              <button 
                onClick={() => initLevel(1, true)}
                className="px-6 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] font-bold"
              >
                RESTART
              </button>
            </div>
          </div>
        )}

        {gameState.status === 'levelwin' && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-white border-b-[#808080] border-r-[#808080] p-6 shadow-2xl flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">LEVEL COMPLETE!</h2>
              <p>Get ready for Level {gameState.level + 1}</p>
              <button 
                onClick={() => initLevel(gameState.level + 1)}
                className="px-6 py-2 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] font-bold"
              >
                NEXT LEVEL
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-[#c0c0c0] text-[10px] uppercase tracking-widest opacity-50">
        © 1995 Norton Software Systems
      </p>
    </div>
  );
};

export default ButterbeanGame;
