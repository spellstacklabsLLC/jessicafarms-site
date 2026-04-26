import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Heart, Play, RotateCcw, ArrowRight, Info, Zap } from 'lucide-react';

// --- GAME CONSTANTS ---
const INITIAL_LIVES = 3;
const FPS = 60;
const FRICTION = 0.98;
const ROTATION_SPEED = 0.1;
const THRUST = 0.15;
const MAX_SPEED = 5;
const BULLET_SPEED = 7;
const BULLET_LIFE = 60; // frames
const INVULNERABILITY_TIME = 120; // frames

type EntityType = 'BEE' | 'FLOWER_LG' | 'FLOWER_MD' | 'FLOWER_SM' | 'BULLET';

interface Entity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  emoji: string;
  life?: number;
}

const BeeBlaster: React.FC = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'HIGHSCORE_ENTRY' | 'LEADERBOARD'>('START');
  const [highscores, setHighscores] = useState<{ initials: string; score: number; date: string }[]>([]);
  const [initials, setInitials] = useState(['A', 'A', 'A']);
  const [activeInitialIndex, setActiveInitialIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  // Game State Refs (to avoid closure issues in loop)
  const playerRef = useRef<Entity>({
    id: 0, type: 'BEE', x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2, radius: 20, emoji: '🐝'
  });
  const flowersRef = useRef<Entity[]>([]);
  const bulletsRef = useRef<Entity[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const invulnRef = useRef(0);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);

  const fetchHighscores = async () => {
    try {
      const res = await fetch('/api/highscores');
      const data = await res.json();
      setHighscores(data);
    } catch (err) {
      console.error("Failed to fetch highscores", err);
    }
  };

  const submitScore = async () => {
    try {
      await fetch('/api/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials: initials.join(''), score: scoreRef.current }),
      });
      await fetchHighscores();
      setGameState('LEADERBOARD');
    } catch (err) {
      console.error("Failed to submit score", err);
      setGameState('LEADERBOARD');
    }
  };

  useEffect(() => {
    fetchHighscores();
  }, []);

  const spawnFlowers = (count: number) => {
    const newFlowers: Entity[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < count; i++) {
      let x, y;
      // Spawn away from center
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } while (Math.hypot(x - canvas.width / 2, y - canvas.height / 2) < 150);

      newFlowers.push({
        id: Math.random(),
        type: 'FLOWER_LG',
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        angle: Math.random() * Math.PI * 2,
        radius: 30,
        emoji: '🌸'
      });
    }
    flowersRef.current = newFlowers;
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    scoreRef.current = 0;
    setScore(0);
    setLives(INITIAL_LIVES);
    levelRef.current = 1;
    setLevel(1);
    
    playerRef.current = {
      id: 0, type: 'BEE', 
      x: canvas.width / 2, 
      y: canvas.height / 2, 
      vx: 0, vy: 0, 
      angle: -Math.PI / 2, 
      radius: 20, 
      emoji: '🐝'
    };
    
    bulletsRef.current = [];
    invulnRef.current = INVULNERABILITY_TIME;
    spawnFlowers(3);
    setGameState('PLAYING');
  };

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'PLAYING') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- INPUT ---
    if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) playerRef.current.angle -= ROTATION_SPEED;
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) playerRef.current.angle += ROTATION_SPEED;
    if (keysRef.current.has('ArrowUp') || keysRef.current.has('w')) {
      playerRef.current.vx += Math.cos(playerRef.current.angle) * THRUST;
      playerRef.current.vy += Math.sin(playerRef.current.angle) * THRUST;
    }

    // --- PHYSICS ---
    const p = playerRef.current;
    p.vx *= FRICTION;
    p.vy *= FRICTION;
    
    // Limit speed
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > MAX_SPEED) {
      p.vx = (p.vx / speed) * MAX_SPEED;
      p.vy = (p.vy / speed) * MAX_SPEED;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap around
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    if (invulnRef.current > 0) invulnRef.current--;

    // Update Bullets
    bulletsRef.current = bulletsRef.current.filter(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.life!--;
      
      if (b.x < 0) b.x = canvas.width;
      if (b.x > canvas.width) b.x = 0;
      if (b.y < 0) b.y = canvas.height;
      if (b.y > canvas.height) b.y = 0;
      
      return b.life! > 0;
    });

    // Update Flowers
    flowersRef.current.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;
    });

    // --- COLLISIONS ---
    // Bullets vs Flowers
    bulletsRef.current.forEach((b, bIdx) => {
      flowersRef.current.forEach((f, fIdx) => {
        const dist = Math.hypot(b.x - f.x, b.y - f.y);
        if (dist < f.radius + 5) {
          // Hit!
          b.life = 0; // Remove bullet
          
          // Split flower
          const newFlowers: Entity[] = [];
          if (f.type === 'FLOWER_LG') {
            scoreRef.current += 100;
            for (let i = 0; i < 2; i++) {
              newFlowers.push({
                id: Math.random(), type: 'FLOWER_MD', x: f.x, y: f.y,
                vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                angle: Math.random() * Math.PI * 2, radius: 20, emoji: '🌻'
              });
            }
          } else if (f.type === 'FLOWER_MD') {
            scoreRef.current += 200;
            for (let i = 0; i < 2; i++) {
              newFlowers.push({
                id: Math.random(), type: 'FLOWER_SM', x: f.x, y: f.y,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                angle: Math.random() * Math.PI * 2, radius: 12, emoji: '🌼'
              });
            }
          } else {
            scoreRef.current += 300;
          }
          
          setScore(scoreRef.current);
          flowersRef.current.splice(fIdx, 1);
          flowersRef.current.push(...newFlowers);
        }
      });
    });

    // Player vs Flowers
    if (invulnRef.current === 0) {
      flowersRef.current.forEach(f => {
        const dist = Math.hypot(p.x - f.x, p.y - f.y);
        if (dist < f.radius + p.radius - 5) {
          // Crash!
          setLives(l => {
            const nl = l - 1;
            if (nl <= 0) {
              setGameState('HIGHSCORE_ENTRY');
            } else {
              // Reset player
              p.x = canvas.width / 2;
              p.y = canvas.height / 2;
              p.vx = 0;
              p.vy = 0;
              invulnRef.current = INVULNERABILITY_TIME;
            }
            return nl;
          });
        }
      });
    }

    // Level Up
    if (flowersRef.current.length === 0) {
      levelRef.current++;
      setLevel(levelRef.current);
      spawnFlowers(3 + levelRef.current);
      invulnRef.current = INVULNERABILITY_TIME;
    }

    // --- DRAW ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bullets
    ctx.font = '20px serif';
    bulletsRef.current.forEach(b => {
      ctx.fillText('📍', b.x - 10, b.y + 10);
    });

    // Draw Flowers
    flowersRef.current.forEach(f => {
      ctx.font = `${f.radius * 2}px serif`;
      ctx.fillText(f.emoji, f.x - f.radius, f.y + f.radius);
    });

    // Draw Player
    if (invulnRef.current % 10 < 5) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + Math.PI / 2); // Adjust emoji orientation
      ctx.font = '40px serif';
      ctx.fillText('🐝', -20, 20);
      ctx.restore();
    }

    requestRef.current = requestAnimationFrame(update);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, update]);

  // --- CONTROLS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for game controls
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      keysRef.current.add(e.key);
      
      if (gameState === 'PLAYING' && e.key === ' ') {
        // Shoot
        const p = playerRef.current;
        bulletsRef.current.push({
          id: Math.random(),
          type: 'BULLET',
          x: p.x + Math.cos(p.angle) * p.radius,
          y: p.y + Math.sin(p.angle) * p.radius,
          vx: Math.cos(p.angle) * BULLET_SPEED + p.vx,
          vy: Math.sin(p.angle) * BULLET_SPEED + p.vy,
          angle: p.angle,
          radius: 5,
          emoji: '📍',
          life: BULLET_LIFE
        });
      }

      if (gameState === 'HIGHSCORE_ENTRY') {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?-".split("");
        if (e.key === 'ArrowUp') {
          setInitials(prev => {
            const next = [...prev];
            const currIdx = alphabet.indexOf(next[activeInitialIndex]);
            next[activeInitialIndex] = alphabet[(currIdx - 1 + alphabet.length) % alphabet.length];
            return next;
          });
        } else if (e.key === 'ArrowDown') {
          setInitials(prev => {
            const next = [...prev];
            const currIdx = alphabet.indexOf(next[activeInitialIndex]);
            next[activeInitialIndex] = alphabet[(currIdx + 1) % alphabet.length];
            return next;
          });
        } else if (e.key === 'ArrowLeft') {
          setActiveInitialIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
          if (activeInitialIndex < 2) {
            setActiveInitialIndex(prev => prev + 1);
          } else {
            submitScore();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, activeInitialIndex, initials]);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[3rem] overflow-hidden border-2 border-stone-100 shadow-2xl flex flex-col md:flex-row">
      
      {/* GAME SIDEBAR / STATS */}
      <div className="w-full md:w-64 bg-forest p-8 text-white flex flex-col gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-tight">Bee Blaster</h3>
          <div className="h-1 w-12 bg-honey"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 text-honey mb-1">
              <Trophy size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Score</span>
            </div>
            <div className="text-3xl font-black italic">{score}</div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <Heart size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Lives</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                <div key={i} className={`text-xl ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>❤️</div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <ArrowRight size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Level</span>
            </div>
            <div className="text-3xl font-black italic">{level}</div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <button 
            onClick={() => setGameState('LEADERBOARD')}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Trophy size={14} /> Leaderboard
          </button>
          <button 
            onClick={startGame}
            className="w-full py-4 bg-honey hover:bg-honey/90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Restart
          </button>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[9px] text-white/60 uppercase tracking-widest font-bold leading-relaxed">
              Arrows to move/thrust. Space to shoot stingers! Blast the flowers before they hit you.
            </p>
          </div>
        </div>
      </div>

      {/* GAME VIEWPORT */}
      <div className="flex-grow bg-stone-950 relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        
        {gameState === 'START' && (
          <div className="absolute inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center space-y-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="text-8xl"
            >
              🐝
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-4xl font-black text-honey uppercase tracking-tighter italic">Bee Blaster</h4>
              <p className="text-stone-400 font-serif-modern italic text-lg max-w-md">
                Defend the apiary! Blast the invasive flowers in this Asteroids-style space adventure.
              </p>
            </div>
            <button 
              onClick={startGame}
              className="bg-honey text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
            >
              <Play size={16} fill="currentColor" /> Launch Bee
            </button>
          </div>
        )}

        {gameState === 'HIGHSCORE_ENTRY' && (
          <div className="absolute inset-0 z-50 bg-forest/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center space-y-8 text-white">
            <div className="text-6xl font-black uppercase italic tracking-tighter">New Highscore!</div>
            <div className="text-9xl font-black text-honey">{score}</div>
            
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-white/60">Enter Initials</p>
              <div className="flex gap-4">
                {initials.map((char, i) => (
                  <motion.div 
                    key={i}
                    animate={activeInitialIndex === i ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className={`w-20 h-24 border-b-4 flex items-center justify-center text-6xl font-black ${activeInitialIndex === i ? 'border-honey text-honey' : 'border-white/20 text-white/40'}`}
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-8">Use Arrows to select & Enter to confirm</p>
            </div>
          </div>
        )}

        {gameState === 'LEADERBOARD' && (
          <div className="absolute inset-0 z-50 bg-stone-900/95 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center space-y-8 text-white">
            <div className="text-4xl font-black uppercase italic tracking-tighter text-honey">Hall of Fame</div>
            
            <div className="w-full max-w-md space-y-2">
              {highscores.map((hs, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b border-white/5 font-mono">
                  <div className="flex items-center gap-4">
                    <span className="text-white/20 w-6">{i + 1}.</span>
                    <span className="text-2xl font-black tracking-widest">{hs.initials}</span>
                  </div>
                  <span className="text-2xl font-black text-honey">{hs.score.toLocaleString()}</span>
                </div>
              ))}
              {highscores.length === 0 && <p className="text-white/40 italic">No records yet...</p>}
            </div>

            <button 
              onClick={() => setGameState('START')}
              className="bg-white text-stone-900 px-12 py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-105 transition-all"
            >
              Back to Menu
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export const GamesSection: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-16"
    >
      <div className="hidden md:block w-full">
        <BeeBlaster />
      </div>

      <div className="md:hidden flex flex-col items-center justify-center p-12 bg-forest rounded-[3rem] text-white text-center space-y-6 shadow-2xl border-4 border-honey/20">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-7xl"
        >
          🎮
        </motion.div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-tight">Desktop Only Experience</h3>
          <div className="h-1 w-12 bg-honey mx-auto"></div>
        </div>
        <p className="font-serif-modern italic text-lg text-white/80 max-w-xs mx-auto">
          Bee Blaster requires a keyboard and a larger screen for the full arcade experience. Please visit us on a desktop to play!
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-forest text-white p-12 rounded-[3rem] text-center space-y-4 shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/honey-comb.png')] group-hover:scale-110 transition-transform duration-1000"></div>
        <h4 className="text-3xl font-serif-modern font-black italic relative z-10 tracking-tight">
          "Float like a butterfly, blast like a bee."
        </h4>
        <p className="text-[10px] uppercase tracking-[0.5em] text-honey font-black relative z-10">
          Norton Arcade Universe
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GamesSection;
