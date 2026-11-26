import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Check, ArrowRight, Truck } from 'lucide-react';
import { HOT_HONEY_HOLIDAY_BUNDLE } from '../constants';
import { Product } from '../types';

interface HolidayPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimBundle: (product: Product, quantity: number) => void;
}

type BulbColor = 'red' | 'green' | 'blue' | 'amber' | 'warmWhite';

interface BulbStyleConfig {
  core: string;
  mid: string;
  edge: string;
  glow: string;
  ambient: string;
}

const BULB_PALETTES: Record<BulbColor, BulbStyleConfig> = {
  red: {
    core: '#fff2f2',
    mid: '#ff3647',
    edge: '#9b0918',
    glow: 'rgba(255, 48, 66, 0.92)',
    ambient: 'rgba(255, 42, 62, 0.34)',
  },
  green: {
    core: '#effff5',
    mid: '#19e66d',
    edge: '#086b30',
    glow: 'rgba(25, 230, 109, 0.88)',
    ambient: 'rgba(22, 214, 100, 0.30)',
  },
  blue: {
    core: '#eef6ff',
    mid: '#3498ff',
    edge: '#0d449c',
    glow: 'rgba(52, 152, 255, 0.90)',
    ambient: 'rgba(46, 142, 255, 0.32)',
  },
  amber: {
    core: '#fff8e1',
    mid: '#ffad1f',
    edge: '#a85300',
    glow: 'rgba(255, 173, 31, 0.92)',
    ambient: 'rgba(255, 166, 20, 0.34)',
  },
  warmWhite: {
    core: '#ffffff',
    mid: '#ffe9aa',
    edge: '#c7973c',
    glow: 'rgba(255, 232, 166, 0.95)',
    ambient: 'rgba(255, 224, 145, 0.36)',
  },
};

const BULB_SEQUENCE: BulbColor[] = ['red', 'green', 'amber', 'blue', 'warmWhite'];

const ChristmasBulb: React.FC<{
  color: BulbColor;
  rotationDeg: number;
  index: number;
  size?: 'sm' | 'md';
}> = ({ color, rotationDeg, index, size = 'md' }) => {
  const palette = BULB_PALETTES[color];
  const gradId = `bulb-grad-${color}-${index}`;
  const animVariant = index % 3 === 0 ? 'jf-twinkle-a' : index % 3 === 1 ? 'jf-twinkle-b' : 'jf-twinkle-c';
  const duration = (2.1 + ((index * 7) % 13) * 0.19).toFixed(2);
  const delay = (-(((index * 11) % 19) * 0.23)).toFixed(2);
  const dims = size === 'sm' ? 'w-[18px] h-[28px]' : 'w-[22px] h-[34px]';

  return (
    <div
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{ transform: `rotate(${rotationDeg}deg)` }}
    >
      {/* Colored light spill cast onto surrounding pine & modal frame */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${palette.ambient} 0%, transparent 68%)`,
          animation: `${animVariant} ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />

      {/* Realistic physical glass Christmas bulb + brass/green ribbed socket */}
      <svg
        viewBox="0 0 24 38"
        className={`${dims} relative z-10 overflow-visible`}
        style={{
          filter: `drop-shadow(0 0 6px ${palette.glow}) drop-shadow(0 0 13px ${palette.ambient})`,
          animation: `${animVariant} ${duration}s ease-in-out ${delay}s infinite`,
        }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={gradId} cx="46%" cy="54%" r="55%" fx="44%" fy="48%">
            <stop offset="0%" stopColor={palette.core} />
            <stop offset="38%" stopColor={palette.mid} />
            <stop offset="85%" stopColor={palette.edge} />
            <stop offset="100%" stopColor={palette.edge} stopOpacity="0.92" />
          </radialGradient>
        </defs>

        {/* Cord attachment loop */}
        <path
          d="M 10 1.5 Q 12 0 14 1.5"
          stroke="#133822"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Ribbed dark green / brass socket base */}
        <rect x="8.2" y="2" width="7.6" height="5.2" rx="1.4" fill="#183f28" stroke="#0d2617" strokeWidth="0.7" />
        <line x1="8.4" y1="3.8" x2="15.6" y2="3.8" stroke="#316b46" strokeWidth="0.65" />
        <line x1="8.4" y1="5.5" x2="15.6" y2="5.5" stroke="#0b2013" strokeWidth="0.65" />
        {/* Brass collar rim */}
        <rect x="7.5" y="7.1" width="9" height="2.2" rx="0.9" fill="#9c7a32" stroke="#5c4311" strokeWidth="0.5" />

        {/* Teardrop incandescent glass envelope */}
        <path
          d="M 8.2 9.2 C 6.2 12.2, 4.4 17.5, 5.2 22.8 C 6.0 28.0, 9.2 33.4, 12 34.4 C 14.8 33.4, 18.0 28.0, 18.8 22.8 C 19.6 17.5, 17.8 12.2, 15.8 9.2 Z"
          fill={`url(#${gradId})`}
        />

        {/* Glowing internal tungsten filament */}
        <path
          d="M 10.6 12.5 L 11.2 19.5 Q 12 21.5 12.8 19.5 L 13.4 12.5"
          stroke="#ffffff"
          strokeWidth="1.05"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        <ellipse cx="12" cy="19.5" rx="2.4" ry="3.2" fill="#ffffff" opacity="0.45" />

        {/* Curved glossy glass highlight reflection */}
        <path
          d="M 7.8 13.2 C 6.8 16.5, 6.7 20.6, 7.6 24.5"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          fill="none"
          opacity="0.72"
        />
        <circle cx="8.4" cy="11.4" r="0.75" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
};

/* Detailed layered corner garland with evergreen boughs, pinecones, red glass ornaments & gold silk ribbons */
const CornerGarland: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position }) => {
  const flipX = position === 'top-right' || position === 'bottom-right';
  const flipY = position === 'bottom-left' || position === 'bottom-right';
  const posClasses =
    position === 'top-left'
      ? '-top-6 -left-6 sm:-top-8 sm:-left-8'
      : position === 'top-right'
      ? '-top-6 -right-6 sm:-top-8 sm:-right-8'
      : position === 'bottom-left'
      ? '-bottom-6 -left-6 sm:-bottom-8 sm:-left-8'
      : '-bottom-6 -right-6 sm:-bottom-8 sm:-right-8';

  const uid = position;

  return (
    <div
      className={`absolute ${posClasses} w-36 h-36 sm:w-48 sm:h-48 pointer-events-none z-20 select-none`}
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]">
        <defs>
          <radialGradient id={`ornament-red-${uid}`} cx="36%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ff7b89" />
            <stop offset="28%" stopColor="#db152c" />
            <stop offset="72%" stopColor="#8d0818" />
            <stop offset="100%" stopColor="#4c030b" />
          </radialGradient>
          <linearGradient id={`gold-ribbon-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#946814" />
            <stop offset="35%" stopColor="#f6d87e" />
            <stop offset="65%" stopColor="#d9a520" />
            <stop offset="100%" stopColor="#8a5d11" />
          </linearGradient>
          <linearGradient id={`pinecone-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9e6840" />
            <stop offset="50%" stopColor="#6b3e20" />
            <stop offset="100%" stopColor="#3c1f0e" />
          </linearGradient>
        </defs>

        {/* Back layer dark spruce pine boughs */}
        <g strokeLinecap="round">
          {/* Horizontal branch */}
          <path d="M 14 28 Q 78 24 156 16" stroke="#082417" strokeWidth="5" fill="none" />
          {/* Vertical branch */}
          <path d="M 28 14 Q 24 78 16 156" stroke="#082417" strokeWidth="5" fill="none" />
          {/* Diagonal spray */}
          <path d="M 22 22 Q 68 58 106 86" stroke="#0b2c1c" strokeWidth="4.5" fill="none" />

          {/* Fan of outer dark pine needles */}
          {[
            [42, 26, 28, 6], [56, 24, 48, 2], [72, 23, 68, 1], [90, 21, 92, 0],
            [108, 20, 114, 2], [126, 18, 136, 4], [142, 17, 158, 7],
            [48, 28, 56, 48], [66, 26, 76, 46], [86, 24, 96, 44], [108, 22, 118, 40],
            [26, 44, 6, 30], [24, 62, 2, 52], [22, 82, 1, 76], [20, 102, 2, 98],
            [18, 122, 4, 120], [17, 140, 7, 142],
            [28, 54, 48, 62], [26, 74, 46, 82], [24, 94, 44, 104], [22, 114, 40, 126],
            [45, 42, 62, 26], [58, 52, 78, 38], [72, 62, 94, 52], [88, 74, 110, 68],
            [40, 48, 28, 70], [54, 58, 42, 82], [68, 68, 58, 92], [84, 78, 78, 102],
          ].map(([x1, y1, x2, y2], idx) => (
            <line
              key={`dn-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={idx % 2 === 0 ? '#113c27' : '#184e34'}
              strokeWidth="2.4"
            />
          ))}

          {/* Lighter sunlit/lit pine needle highlights */}
          {[
            [50, 25, 42, 9], [70, 23, 68, 6], [92, 22, 96, 5], [116, 19, 124, 6],
            [25, 52, 9, 44], [23, 72, 6, 68], [21, 94, 5, 92], [19, 116, 6, 118],
            [44, 44, 64, 34], [62, 56, 84, 48], [52, 50, 44, 72], [68, 64, 64, 86],
          ].map(([x1, y1, x2, y2], idx) => (
            <line
              key={`ln-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#276e4b"
              strokeWidth="1.6"
              opacity="0.85"
            />
          ))}
        </g>

        {/* Subtle flowing metallic gold silk ribbon */}
        <path
          d="M 10 38 C 36 22, 56 46, 88 26 C 110 12, 134 20, 152 14"
          stroke={`url(#gold-ribbon-${uid})`}
          strokeWidth="4.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 38 10 C 22 36, 46 58, 26 92 C 14 114, 22 132, 14 150"
          stroke={`url(#gold-ribbon-${uid})`}
          strokeWidth="3.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.88"
        />

        {/* Sculpted Pinecone */}
        <g transform="translate(52, 34) rotate(-32)">
          <ellipse cx="0" cy="0" rx="13" ry="18" fill="#3a1e0e" />
          {[
            [-6, -12, 6, 4], [4, -12, 6, 4], [0, -9, 7, 5],
            [-7, -5, 7, 5], [6, -5, 7, 5], [0, -2, 8, 5],
            [-8, 3, 7, 5], [7, 3, 7, 5], [0, 6, 8, 5],
            [-6, 10, 6, 4], [5, 10, 6, 4], [0, 13, 6, 4],
          ].map(([cx, cy, rx, ry], idx) => (
            <ellipse
              key={`pc-${idx}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={`url(#pinecone-grad-${uid})`}
              stroke="#2c1609"
              strokeWidth="0.8"
            />
          ))}
        </g>

        {/* Red Glass Christmas Ornament #1 (Primary) */}
        <g transform="translate(36, 56)">
          {/* Hanging gold thread & cap */}
          <circle cx="0" cy="-16" r="2.2" fill="none" stroke="#f4d378" strokeWidth="1.2" />
          <rect x="-4" y="-14" width="8" height="4" rx="1" fill={`url(#gold-ribbon-${uid})`} />
          {/* Glossy sphere */}
          <circle cx="0" cy="0" r="13.5" fill={`url(#ornament-red-${uid})`} />
          {/* Specular reflection highlight */}
          <ellipse cx="-4.5" cy="-4.5" rx="3.4" ry="2.0" transform="rotate(-35 -4.5 -4.5)" fill="#ffffff" opacity="0.65" />
          <circle cx="-6" cy="-1" r="1" fill="#ffffff" opacity="0.4" />
        </g>

        {/* Red Glass Christmas Ornament #2 (Secondary smaller) */}
        <g transform="translate(80, 26)">
          <circle cx="0" cy="-11.5" r="1.8" fill="none" stroke="#f4d378" strokeWidth="1.1" />
          <rect x="-3" y="-10" width="6" height="3.2" rx="0.8" fill={`url(#gold-ribbon-${uid})`} />
          <circle cx="0" cy="0" r="9.5" fill={`url(#ornament-red-${uid})`} />
          <ellipse cx="-3" cy="-3.2" rx="2.4" ry="1.4" transform="rotate(-35 -3 -3.2)" fill="#ffffff" opacity="0.65" />
        </g>
      </svg>
    </div>
  );
};

/* Multi-layer snowfall configuration (deterministic so no re-render jitter) */
const SNOWFLAKES = Array.from({ length: 58 }).map((_, i) => {
  const layer = i < 26 ? 'far' : i < 45 ? 'mid' : 'near';
  const left = ((i * 17.3 + (i % 5) * 3.7) % 98) + 1;
  const duration =
    layer === 'far'
      ? 16 + ((i * 3) % 8)
      : layer === 'mid'
      ? 10.5 + ((i * 2.3) % 5)
      : 6.8 + ((i * 1.7) % 3.2);
  const delay = -((i * 1.37) % duration);
  const size =
    layer === 'far'
      ? 2.2 + (i % 3) * 0.55
      : layer === 'mid'
      ? 4.2 + (i % 3) * 0.9
      : 7.5 + (i % 4) * 1.4;
  const opacity =
    layer === 'far'
      ? 0.25 + (i % 4) * 0.04
      : layer === 'mid'
      ? 0.45 + (i % 3) * 0.07
      : 0.65 + (i % 3) * 0.08;
  const swayPx = (i % 2 === 0 ? 1 : -1) * (layer === 'far' ? 14 : layer === 'mid' ? 24 : 36);
  const isCrystal = layer === 'near' && i % 2 === 0;

  return { id: i, layer, left, duration, delay, size, opacity, swayPx, isCrystal };
});

/* Soft golden bokeh discs inside the dark evergreen modal backdrop */
const BOKEH_ORBS = [
  { top: '12%', left: '8%', size: 78, opacity: 0.14, dur: 9, delay: 0 },
  { top: '24%', left: '42%', size: 110, opacity: 0.10, dur: 12, delay: -3 },
  { top: '68%', left: '14%', size: 92, opacity: 0.13, dur: 11, delay: -5 },
  { top: '15%', left: '86%', size: 84, opacity: 0.12, dur: 10, delay: -2 },
  { top: '52%', left: '90%', size: 68, opacity: 0.11, dur: 8.5, delay: -4 },
  { top: '82%', left: '72%', size: 96, opacity: 0.13, dur: 12.5, delay: -6 },
  { top: '42%', left: '22%', size: 54, opacity: 0.16, dur: 7.5, delay: -1 },
  { top: '78%', left: '46%', size: 62, opacity: 0.11, dur: 9.5, delay: -2.5 },
  { top: '8%', left: '62%', size: 48, opacity: 0.14, dur: 8, delay: -4.5 },
];

/* Golden sparkles around the Hot Honey bottle trio */
const PRODUCT_SPARKLES = [
  { top: '10%', left: '12%', size: 16, delay: '0s', dur: '2.8s' },
  { top: '18%', right: '11%', size: 14, delay: '-0.9s', dur: '3.2s' },
  { top: '44%', left: '7%', size: 11, delay: '-1.6s', dur: '2.5s' },
  { top: '50%', right: '8%', size: 15, delay: '-0.4s', dur: '3.4s' },
  { bottom: '20%', left: '14%', size: 13, delay: '-2.1s', dur: '2.9s' },
  { bottom: '16%', right: '15%', size: 12, delay: '-1.1s', dur: '2.6s' },
  { top: '28%', left: '48%', size: 10, delay: '-1.8s', dur: '3.1s' },
  { top: '64%', right: '26%', size: 11, delay: '-0.7s', dur: '2.7s' },
];

const TOP_BULBS = Array.from({ length: 13 }).map((_, i) => ({
  color: BULB_SEQUENCE[i % BULB_SEQUENCE.length],
  rotation: i % 2 === 0 ? -6 : 6,
  index: i,
}));

const BOTTOM_BULBS = Array.from({ length: 13 }).map((_, i) => ({
  color: BULB_SEQUENCE[(i + 2) % BULB_SEQUENCE.length],
  rotation: i % 2 === 0 ? 174 : 186,
  index: 20 + i,
}));

const LEFT_BULBS = Array.from({ length: 6 }).map((_, i) => ({
  color: BULB_SEQUENCE[(i + 1) % BULB_SEQUENCE.length],
  rotation: i % 2 === 0 ? 84 : 96,
  index: 40 + i,
}));

const RIGHT_BULBS = Array.from({ length: 6 }).map((_, i) => ({
  color: BULB_SEQUENCE[(i + 3) % BULB_SEQUENCE.length],
  rotation: i % 2 === 0 ? -84 : -96,
  index: 60 + i,
}));

export const HolidayPromoModal: React.FC<HolidayPromoModalProps> = ({
  isOpen,
  onClose,
  onClaimBundle,
}) => {
  const [bundleQty, setBundleQty] = useState(1);
  const [imgSrc, setImgSrc] = useState('/src/assets/images/holiday_hot_honey_trio_1795699848333.jpg');
  const [imgFailed, setImgFailed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsClosing(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  };

  if (!isOpen) return null;

  const totalPrice = (HOT_HONEY_HOLIDAY_BUNDLE.priceNumber * bundleQty).toFixed(2);

  return (
    <div
      className={`fixed inset-0 z-[240] flex items-center justify-center p-4 sm:p-8 md:p-10 overflow-y-auto bg-[#020805]/82 backdrop-blur-md transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100 jf-backdrop-enter'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="holiday-bundle-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) triggerClose();
      }}
    >
      <style>{`
        @keyframes jfBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes jfModalEnter {
          0% { opacity: 0; transform: scale(0.91) translateY(18px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes jf-twinkle-a {
          0%, 100% { opacity: 1; filter: brightness(1.12); transform: scale(1); }
          45% { opacity: 0.42; filter: brightness(0.75); transform: scale(0.95); }
          70% { opacity: 0.96; filter: brightness(1.15); transform: scale(1.03); }
        }
        @keyframes jf-twinkle-b {
          0%, 100% { opacity: 0.65; filter: brightness(0.88); transform: scale(0.97); }
          35% { opacity: 1; filter: brightness(1.2); transform: scale(1.04); }
          75% { opacity: 0.48; filter: brightness(0.78); transform: scale(0.95); }
        }
        @keyframes jf-twinkle-c {
          0%, 100% { opacity: 0.92; filter: brightness(1.06); transform: scale(1); }
          20% { opacity: 0.55; filter: brightness(0.8); transform: scale(0.96); }
          55% { opacity: 1; filter: brightness(1.22); transform: scale(1.04); }
          85% { opacity: 0.72; filter: brightness(0.92); transform: scale(0.98); }
        }
        @keyframes jfSnowfall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(var(--sway, 20px), 50vh, 0) rotate(180deg);
          }
          100% {
            transform: translate3d(0, 112vh, 0) rotate(360deg);
          }
        }
        @keyframes jfBokehDrift {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: var(--b-op, 0.12); }
          50% { transform: translate3d(10px, -12px, 0) scale(1.12); opacity: calc(var(--b-op, 0.12) * 1.45); }
        }
        @keyframes jfSparklePulse {
          0%, 100% { opacity: 0.15; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 0.95; transform: scale(1.18) rotate(22deg); }
        }
        @keyframes jfStockingFlex {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-2.5deg) scale(1.045); }
          50% { transform: rotate(1.6deg) scale(1.01); }
          75% { transform: rotate(-1.8deg) scale(1.055); }
        }
        @keyframes jfStockingGlow {
          0%, 100% { opacity: 0.45; transform: scale(0.95); }
          50% { opacity: 0.92; transform: scale(1.08); }
        }
        @keyframes jfBuyBlink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            text-shadow: 0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(255, 232, 160, 0.4);
          }
          50% {
            opacity: 0.86;
            transform: scale(1.05);
            text-shadow: 0 2px 8px rgba(0,0,0,0.7), 0 0 22px rgba(255, 240, 170, 0.95);
          }
        }
        @keyframes jfArrowNudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes jfStockingSheen {
          0%, 55% { transform: translateX(-140%) skewX(-20deg); opacity: 0; }
          65% { opacity: 0.45; }
          85% { transform: translateX(240%) skewX(-20deg); opacity: 0; }
          100% { transform: translateX(240%) skewX(-20deg); opacity: 0; }
        }
        .jf-backdrop-enter {
          animation: jfBackdropIn 420ms ease-out forwards;
        }
        .jf-modal-enter {
          animation: jfModalEnter 560ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .jf-snowflake {
          animation-name: jfSnowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .jf-bokeh {
          animation: jfBokehDrift ease-in-out infinite;
          will-change: transform, opacity;
        }
        .jf-sparkle {
          animation: jfSparklePulse ease-in-out infinite;
          will-change: transform, opacity;
        }
        .jf-stocking-flex {
          transform-origin: 20% 8%;
          animation: jfStockingFlex 2.4s ease-in-out infinite;
          will-change: transform;
        }
        .jf-stocking-flex:hover {
          animation-play-state: paused;
        }
        .jf-stocking-glow {
          animation: jfStockingGlow 1.7s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .jf-buy-blink {
          animation: jfBuyBlink 1.35s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .jf-arrow-nudge {
          animation: jfArrowNudge 1.1s ease-in-out infinite;
        }
        .jf-stocking-sheen {
          animation: jfStockingSheen 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .jf-snowflake, .jf-bokeh, .jf-sparkle, .jf-stocking-flex, .jf-stocking-glow, .jf-buy-blink, .jf-arrow-nudge, .jf-stocking-sheen {
            animation: none !important;
          }
          * {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Continuous Multi-Layer Snowfall across the viewport */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {SNOWFLAKES.map((flake) => (
          <div
            key={flake.id}
            className="jf-snowflake absolute top-0"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: flake.opacity,
              filter: flake.layer === 'mid' ? 'blur(0.6px)' : flake.layer === 'far' ? 'blur(0.3px)' : 'none',
              ['--sway' as string]: `${flake.swayPx}px`,
            }}
          >
            {flake.isCrystal ? (
              <svg
                width={flake.size}
                height={flake.size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="3.3" y1="7" x2="20.7" y2="17" />
                <line x1="20.7" y1="7" x2="3.3" y2="17" />
                <path d="M 9.5 4.5 L 12 7 L 14.5 4.5" />
                <path d="M 9.5 19.5 L 12 17 L 14.5 19.5" />
              </svg>
            ) : (
              <div
                className="rounded-full bg-white"
                style={{
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  boxShadow: flake.layer === 'near' ? '0 0 8px rgba(255,255,255,0.75)' : 'none',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Outer Frame Wrapper hosting Border Lights & Evergreen Corner Garlands */}
      <div
        className={`relative w-full max-w-[940px] my-auto transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95 translate-y-2' : 'jf-modal-enter'
        }`}
      >
        {/* Evergreen Boughs, Pinecones, Red Ornaments & Gold Ribbons Framing All 4 Corners */}
        <CornerGarland position="top-left" />
        <CornerGarland position="top-right" />
        <CornerGarland position="bottom-left" />
        <CornerGarland position="bottom-right" />

        {/* Dark Green Scalloped Wire & Multicolored String Lights Around Entire Perimeter */}
        {/* TOP BORDER LIGHTS */}
        <div className="absolute -top-4 inset-x-8 sm:inset-x-12 z-30 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 600 22" preserveAspectRatio="none" className="w-full h-5 overflow-visible">
            <path
              d="M 0 10 Q 50 20 100 10 T 200 10 T 300 10 T 400 10 T 500 10 T 600 10"
              stroke="#0e331f"
              strokeWidth="2.8"
              fill="none"
            />
          </svg>
          <div className="flex items-start justify-between -mt-3 px-1">
            {TOP_BULBS.map((bulb, i) => (
              <div key={bulb.index} className={i % 2 === 1 ? 'hidden sm:block' : 'block'}>
                <ChristmasBulb color={bulb.color} rotationDeg={bulb.rotation} index={bulb.index} />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BORDER LIGHTS */}
        <div className="absolute -bottom-4 inset-x-8 sm:inset-x-12 z-30 pointer-events-none" aria-hidden="true">
          <div className="flex items-end justify-between -mb-3 px-1">
            {BOTTOM_BULBS.map((bulb, i) => (
              <div key={bulb.index} className={i % 2 === 1 ? 'hidden sm:block' : 'block'}>
                <ChristmasBulb color={bulb.color} rotationDeg={bulb.rotation} index={bulb.index} />
              </div>
            ))}
          </div>
          <svg viewBox="0 0 600 22" preserveAspectRatio="none" className="w-full h-5 overflow-visible">
            <path
              d="M 0 12 Q 50 2 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12"
              stroke="#0e331f"
              strokeWidth="2.8"
              fill="none"
            />
          </svg>
        </div>

        {/* LEFT BORDER LIGHTS */}
        <div className="absolute -left-4 inset-y-12 z-30 pointer-events-none flex items-center" aria-hidden="true">
          <svg viewBox="0 0 22 400" preserveAspectRatio="none" className="w-5 h-full overflow-visible">
            <path
              d="M 12 0 Q 2 50 12 100 T 12 200 T 12 300 T 12 400"
              stroke="#0e331f"
              strokeWidth="2.8"
              fill="none"
            />
          </svg>
          <div className="absolute inset-y-2 -left-1 flex flex-col justify-between items-center">
            {LEFT_BULBS.map((bulb, i) => (
              <div key={bulb.index} className={i % 2 === 1 ? 'hidden sm:block' : 'block'}>
                <ChristmasBulb color={bulb.color} rotationDeg={bulb.rotation} index={bulb.index} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT BORDER LIGHTS */}
        <div className="absolute -right-4 inset-y-12 z-30 pointer-events-none flex items-center" aria-hidden="true">
          <svg viewBox="0 0 22 400" preserveAspectRatio="none" className="w-5 h-full overflow-visible">
            <path
              d="M 10 0 Q 20 50 10 100 T 10 200 T 10 300 T 10 400"
              stroke="#0e331f"
              strokeWidth="2.8"
              fill="none"
            />
          </svg>
          <div className="absolute inset-y-2 -right-1 flex flex-col justify-between items-center">
            {RIGHT_BULBS.map((bulb, i) => (
              <div key={bulb.index} className={i % 2 === 1 ? 'hidden sm:block' : 'block'}>
                <ChristmasBulb color={bulb.color} rotationDeg={bulb.rotation} index={bulb.index} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Rich Dark Evergreen Card Container */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2318] via-[#071811] to-[#040e09] border-2 border-[#d9a520]/55 shadow-[0_32px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(217,165,32,0.14)] text-[#fdfcf8]">
          {/* Subtle inner gold filigree hairline frame */}
          <div className="absolute inset-2.5 rounded-[1.5rem] border border-[#f4d378]/15 pointer-events-none z-10" />

          {/* Warm Atmospheric Radial Lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 28% 48%, rgba(235, 165, 40, 0.16) 0%, transparent 56%), radial-gradient(circle at 82% 20%, rgba(190, 30, 45, 0.10) 0%, transparent 48%)',
            }}
          />

          {/* Soft Golden Christmas Light Bokeh Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {BOKEH_ORBS.map((orb, idx) => (
              <div
                key={idx}
                className="jf-bokeh absolute rounded-full"
                style={{
                  top: orb.top,
                  left: orb.left,
                  width: `${orb.size}px`,
                  height: `${orb.size}px`,
                  background:
                    'radial-gradient(circle, rgba(255, 224, 130, 0.85) 0%, rgba(217, 165, 32, 0.28) 45%, transparent 72%)',
                  filter: 'blur(4px)',
                  animationDuration: `${orb.dur}s`,
                  animationDelay: `${orb.delay}s`,
                  ['--b-op' as string]: orb.opacity,
                }}
              />
            ))}
          </div>

          {/* Close Button (44px+ touch target, keyboard accessible) */}
          <button
            type="button"
            onClick={triggerClose}
            aria-label="Close Holiday Bundle Pop-Up"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-40 w-11 h-11 rounded-full bg-black/45 hover:bg-black/70 border border-[#f4d378]/35 text-[#fdfcf8]/85 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d378]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content Grid: Prominent 3-Bottle Holiday Visual Left, Cohesive Offer & Tall Stocking CTA Right */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* LEFT: Three Actual Jessica Farms Hot Honey Bottles on Festive Wooden Surface */}
            <div className="lg:col-span-6 p-5 sm:p-6 lg:p-7 flex">
              <div className="relative w-full h-full min-h-[250px] sm:min-h-[340px] lg:min-h-[455px] rounded-2xl overflow-hidden border border-[#d9a520]/40 bg-[#0d1912] shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                {imgFailed ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#112b1f] to-[#081610]">
                    <ShoppingBag className="w-10 h-10 text-[#d9a520] mb-3" />
                    <p className="font-serif-modern italic font-bold text-lg text-[#fdfcf8]">
                      Jessica Farms Hot Honey Trio
                    </p>
                    <p className="text-xs text-stone-300 mt-1">
                      Three 12 oz Squeeze Bottles · Made in Ohio
                    </p>
                  </div>
                ) : (
                  <img
                    src={imgSrc}
                    alt="Three Jessica Farms Hot Honey 12 oz squeeze bottles on a festive wooden table surrounded by evergreen branches, pinecones, red Christmas ornaments, and golden bokeh"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={() => {
                      if (imgSrc !== '/assets/holiday-hot-honey-bundle.jpg') {
                        setImgSrc('/assets/holiday-hot-honey-bundle.jpg');
                      } else {
                        setImgFailed(true);
                      }
                    }}
                  />
                )}

                {/* Warm dark perimeter vignette so edges melt seamlessly into evergreen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 58%, rgba(5, 16, 11, 0.52) 100%)',
                  }}
                />

                {/* Subtle Golden Sparkles around the Product */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  {PRODUCT_SPARKLES.map((sp, idx) => (
                    <svg
                      key={idx}
                      viewBox="0 0 24 24"
                      width={sp.size}
                      height={sp.size}
                      className="jf-sparkle absolute"
                      style={{
                        top: sp.top,
                        bottom: sp.bottom,
                        left: sp.left,
                        right: sp.right,
                        animationDelay: sp.delay,
                        animationDuration: sp.dur,
                        filter: 'drop-shadow(0 0 5px rgba(255, 222, 130, 0.9))',
                      }}
                    >
                      <path
                        d="M 12 0 L 14.2 9.8 L 24 12 L 14.2 14.2 L 12 24 L 9.8 14.2 L 0 12 L 9.8 9.8 Z"
                        fill="#ffe799"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Cohesive Editorial Copy + Unified Bottom Pricing & Tall Stocking BUY NOW Lockup */}
            <div className="lg:col-span-6 px-6 pb-7 pt-2 sm:px-8 sm:pb-8 lg:py-8 lg:pr-9 lg:pl-3 flex flex-col justify-between text-left gap-5">
              {/* Top Editorial Intro */}
              <div className="space-y-3.5 pr-4 sm:pr-6">
                <div className="text-xs font-semibold tracking-wider text-[#f0c75e] uppercase">
                  Limited-Time Holiday Release · Norton, Ohio
                </div>

                <h2
                  id="holiday-bundle-heading"
                  className="text-3xl sm:text-4xl lg:text-[2.5rem] font-serif-modern font-black italic text-[#fdfcf8] leading-[1.06] tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Hot Honey Holiday Bundle
                </h2>

                <p className="text-sm text-stone-200/90 leading-relaxed">
                  Three 12 oz squeeze bottles of pure Ohio wildflower honey infused with fiery habanero and ghost peppers—crafted for holiday glazes, cheese boards, and gifting.
                </p>

                <ul className="space-y-1.5 pt-1 text-xs sm:text-[13px] text-stone-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#f4d378] shrink-0" />
                    <span>Three full-size 12 oz squeeze bottles (36 oz total)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#f4d378] shrink-0" />
                    <span>Real Ohio wildflower honey, habanero &amp; ghost peppers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="font-semibold text-emerald-200">
                      100% Free U.S. Shipping — $0.00 delivery at checkout
                    </span>
                  </li>
                </ul>
              </div>

              {/* Bottom Cohesive Action Stage: Price/Free Shipping/Qty Left + Tall Flexing Stocking BUY NOW Right */}
              <div className="pt-4 border-t border-[#f4d378]/20 flex flex-col sm:flex-row items-center justify-between gap-5">
                {/* Price, Free Shipping Pitch & Quantity Stepper */}
                <div className="flex-1 w-full space-y-3.5 text-center sm:text-left">
                  <div>
                    <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                      <span className="text-4xl sm:text-[2.75rem] font-serif-modern font-black italic text-[#f4d378] tabular-nums leading-none">
                        ${totalPrice}
                      </span>
                    </div>
                    <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300 mt-1.5">
                      <Truck className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Free U.S. Shipping</span>
                    </div>
                    <p className="text-[11px] text-emerald-200/80 mt-0.5">
                      No shipping fees at checkout
                    </p>
                  </div>

                  {/* Bundle Quantity Stepper */}
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                      Qty
                    </span>
                    <div className="flex items-center gap-1.5 bg-black/40 border border-[#f4d378]/35 rounded-xl px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => setBundleQty((q) => Math.max(1, q - 1))}
                        disabled={bundleQty <= 1}
                        aria-label="Decrease bundle quantity"
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 text-[#f4d378] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-sm text-[#fdfcf8] tabular-nums">
                        {bundleQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBundleQty((q) => Math.min(10, q + 1))}
                        aria-label="Increase bundle quantity"
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#f4d378] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerClose}
                    className="text-xs text-stone-400 hover:text-stone-200 underline underline-offset-4 transition-colors cursor-pointer py-1 inline-block"
                  >
                    No thanks, continue browsing
                  </button>
                </div>

                {/* Tall Classic Christmas Stocking-Shaped BUY NOW Button (with eye-catching flex & glow pulse) */}
                <div className="shrink-0 flex items-center justify-center relative py-1">
                  {/* Pulsing Radiant Warm Aura behind the Stocking */}
                  <div
                    className="jf-stocking-glow absolute -inset-4 rounded-full pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(255, 200, 60, 0.34) 0%, rgba(225, 29, 48, 0.25) 45%, transparent 72%)',
                      filter: 'blur(10px)',
                    }}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => onClaimBundle(HOT_HONEY_HOLIDAY_BUNDLE, bundleQty)}
                    aria-label={`Buy Now — Hot Honey Holiday Bundle for $${totalPrice} with Free Shipping`}
                    className="jf-stocking-flex group relative w-[178px] sm:w-[194px] cursor-pointer transition-transform duration-200 hover:scale-[1.08] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d378] rounded-3xl"
                  >
                    <svg
                      viewBox="0 0 220 246"
                      className="w-full h-auto overflow-visible drop-shadow-[0_14px_26px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_20px_34px_rgba(255,205,70,0.45)] transition-all duration-200"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="tall-stocking-velvet" x1="15%" y1="0%" x2="85%" y2="100%">
                          <stop offset="0%" stopColor="#f22940" />
                          <stop offset="45%" stopColor="#c40f25" />
                          <stop offset="100%" stopColor="#750512" />
                        </linearGradient>
                        <linearGradient id="tall-stocking-patch" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#99081a" />
                          <stop offset="100%" stopColor="#5e030e" />
                        </linearGradient>
                        <linearGradient id="tall-stocking-cuff" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fffdf7" />
                          <stop offset="65%" stopColor="#f5ebd5" />
                          <stop offset="100%" stopColor="#decfa9" />
                        </linearGradient>
                        <linearGradient id="tall-stocking-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ba871d" />
                          <stop offset="50%" stopColor="#fae18f" />
                          <stop offset="100%" stopColor="#9e6d11" />
                        </linearGradient>
                        <clipPath id="tall-stocking-clip">
                          <path d="M 34 48 L 138 48 L 138 144 C 138 156, 152 162, 178 164 C 208 166, 214 196, 198 218 C 180 238, 128 238, 66 234 C 36 232, 22 212, 26 184 C 28 168, 34 156, 34 140 Z" />
                        </clipPath>
                      </defs>

                      {/* Gold hanging cord loop at top-left */}
                      <path
                        d="M 42 22 C 26 2, 12 16, 28 32"
                        stroke="url(#tall-stocking-gold)"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Tall Classic Crimson Velvet Stocking Silhouette */}
                      <path
                        d="M 34 48 L 138 48 L 138 144 C 138 156, 152 162, 178 164 C 208 166, 214 196, 198 218 C 180 238, 128 238, 66 234 C 36 232, 22 212, 26 184 C 28 168, 34 156, 34 140 Z"
                        fill="url(#tall-stocking-velvet)"
                        stroke="#59030d"
                        strokeWidth="1.6"
                      />

                      {/* Sweeping Glossy Velvet Sheen Highlight */}
                      <g clipPath="url(#tall-stocking-clip)">
                        <rect
                          x="-60"
                          y="40"
                          width="60"
                          height="210"
                          fill="rgba(255, 244, 196, 0.35)"
                          className="jf-stocking-sheen"
                        />
                      </g>

                      {/* Deeper Velvet Heel & Toe Patches */}
                      <path
                        d="M 27 174 C 46 176, 56 196, 52 232 C 32 228, 22 208, 26 184 Z"
                        fill="url(#tall-stocking-patch)"
                        opacity="0.72"
                      />
                      <path
                        d="M 164 163 C 154 186, 158 214, 178 228 C 208 222, 214 172, 178 164 Z"
                        fill="url(#tall-stocking-patch)"
                        opacity="0.74"
                      />

                      {/* Embroidered Gold Dashed Stitching following Tall Stocking Contour */}
                      <path
                        d="M 41 54 L 41 142 C 41 158, 34 170, 33 185 C 30 208, 42 224, 68 226 C 126 230, 176 230, 191 213 C 204 196, 199 173, 176 171 C 148 169, 131 160, 131 144 L 131 54"
                        fill="none"
                        stroke="#f6d87e"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.78"
                      />

                      {/* Tiny Gold Embroidered Star Accents */}
                      <path d="M 56 70 L 58 74 L 62 75 L 58 76 L 56 80 L 54 76 L 50 75 L 54 74 Z" fill="#fae18f" opacity="0.8" />
                      <path d="M 114 68 L 116 71 L 119 72 L 116 73 L 114 76 L 112 73 L 109 72 L 112 71 Z" fill="#fae18f" opacity="0.8" />

                      {/* Plush Fluffy Ivory Sherpa Cuff Across Top */}
                      <path
                        d="M 24 20 C 52 15, 120 15, 148 20 C 156 22, 158 36, 152 46 C 144 54, 134 45, 124 50 C 114 55, 102 45, 92 50 C 82 55, 70 45, 60 50 C 50 55, 38 45, 28 49 C 20 52, 16 40, 18 29 C 19 23, 21 21, 24 20 Z"
                        fill="url(#tall-stocking-cuff)"
                        stroke="#d4c09a"
                        strokeWidth="1.3"
                      />

                      {/* Gold Satin Ribbon Trim Across Cuff */}
                      <path
                        d="M 21 30 Q 86 26 153 30"
                        stroke="url(#tall-stocking-gold)"
                        strokeWidth="3"
                        fill="none"
                      />

                      {/* Festive Holly Leaves & Red Berries on Cuff Corner */}
                      <g transform="translate(136, 28)">
                        <path d="M 0 0 C 9 -9, 20 -7, 23 1 C 14 5, 5 5, 0 0 Z" fill="#175c36" stroke="#0c361e" strokeWidth="0.8" />
                        <path d="M 0 2 C 7 11, 18 12, 22 5 C 13 1, 5 0, 0 2 Z" fill="#217847" stroke="#0c361e" strokeWidth="0.8" />
                        <circle cx="-1" cy="1" r="3" fill="#e0162d" />
                        <circle cx="3.5" cy="-2.2" r="2.6" fill="#ff4258" />
                        <circle cx="3.5" cy="3.8" r="2.6" fill="#bd0c20" />
                      </g>
                    </svg>

                    {/* Eye-Catching Blinking/Glowing BUY NOW Text Inside Tall Stocking */}
                    <div className="absolute top-[25%] bottom-[18%] left-[15%] right-[34%] flex flex-col items-center justify-center pointer-events-none text-center">
                      <div className="jf-buy-blink flex flex-col items-center">
                        <span className="font-sans font-black text-[22px] sm:text-[25px] leading-[0.94] uppercase tracking-wider text-white">
                          BUY
                        </span>
                        <span className="font-sans font-black text-[22px] sm:text-[25px] leading-[0.94] uppercase tracking-wider text-[#fae18f] mt-0.5">
                          NOW
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/95 bg-black/30 px-2 py-0.5 rounded-full border border-[#fae18f]/45">
                        <span>Click</span>
                        <ArrowRight className="w-3 h-3 text-[#fae18f] jf-arrow-nudge" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayPromoModal;
