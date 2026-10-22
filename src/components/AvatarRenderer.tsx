import React from 'react';
import { AvatarConfig, PlayerAction, ChatBubble } from '../types/game';

interface AvatarRendererProps {
  avatar: AvatarConfig;
  action?: PlayerAction;
  direction?: 'left' | 'right';
  bubble?: ChatBubble | null;
  name?: string;
  title?: string;
  isCurrentPlayer?: boolean;
  scale?: number;
  size?: 'world' | 'medium' | 'large';
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  action = 'idle',
  direction = 'right',
  bubble,
  name,
  title,
  isCurrentPlayer = false,
  scale = 1,
  size = 'world',
  className = '',
}) => {
  const isFlipped = direction === 'left';
  const isWalking = action === 'walk';
  const isDancing = action === 'dance';
  const isSitting = action === 'sit';
  const isFishing = action === 'fishing';
  const isFarming = action === 'farming';

  // Hair style renderer
  const renderHair = () => {
    const color = avatar.hairColor;
    switch (avatar.hairStyle) {
      case 'hijab':
        return (
          <g id="hijab">
            {/* Hijab wrap around head and shoulders */}
            <path
              d="M 12 12 Q 24 3 36 12 Q 42 22 39 36 Q 36 44 24 45 Q 12 44 9 36 Q 6 22 12 12 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Hijab folds and chest drape */}
            <path
              d="M 14 36 Q 24 48 34 36 L 36 48 Q 24 54 12 48 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            <path d="M 18 36 Q 24 42 30 36" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />
          </g>
        );
      case 'twintails':
        return (
          <g id="twintails">
            {/* Twin side buns/tails */}
            <circle cx="9" cy="14" r="6" fill={color} stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="39" cy="14" r="6" fill={color} stroke="#0f172a" strokeWidth="1.5" />
            <path d="M 9 12 Q 4 22 8 28" fill={color} stroke="#0f172a" strokeWidth="1.2" />
            <path d="M 39 12 Q 44 22 40 28" fill={color} stroke="#0f172a" strokeWidth="1.2" />
            {/* Main hair cap & bangs */}
            <path
              d="M 13 18 Q 24 6 35 18 Q 38 24 36 26 Q 30 20 24 22 Q 18 20 12 26 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          </g>
        );
      case 'ponytail':
        return (
          <g id="ponytail">
            <path d="M 32 12 Q 45 10 44 26 Q 40 32 36 28" fill={color} stroke="#0f172a" strokeWidth="1.5" />
            <circle cx="34" cy="14" r="3" fill="#e11d48" /> {/* Hair tie */}
            <path
              d="M 13 18 Q 24 7 35 18 Q 37 24 36 26 Q 30 19 24 22 Q 18 19 12 26 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          </g>
        );
      case 'buzz':
        return (
          <g id="buzz">
            <path
              d="M 14 18 Q 24 10 34 18 Q 36 22 34 24 Q 24 18 14 24 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.2"
            />
          </g>
        );
      case 'curls':
        return (
          <g id="curls">
            <circle cx="16" cy="12" r="5" fill={color} />
            <circle cx="24" cy="9" r="6" fill={color} />
            <circle cx="32" cy="12" r="5" fill={color} />
            <path
              d="M 13 19 Q 24 7 35 19 Q 37 25 35 27 Q 29 21 24 23 Q 19 21 13 27 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          </g>
        );
      case 'spiky':
        return (
          <g id="spiky">
            <path
              d="M 12 18 L 16 8 L 22 13 L 26 6 L 31 12 L 36 8 L 36 21 Q 24 17 12 21 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          </g>
        );
      case 'messy':
      default:
        return (
          <g id="messy">
            {/* Fluffy anime bangs & layered hair */}
            <path
              d="M 12 20 Q 15 8 24 8 Q 33 8 36 20 Q 38 24 37 26 Q 32 18 27 23 Q 23 17 18 24 Q 13 21 11 26 Z"
              fill={color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Side tufts */}
            <path d="M 12 18 L 10 27 L 14 24 Z" fill={color} stroke="#0f172a" strokeWidth="1" />
            <path d="M 36 18 L 38 27 L 34 24 Z" fill={color} stroke="#0f172a" strokeWidth="1" />
          </g>
        );
    }
  };

  // Top clothing renderer
  const renderTop = () => {
    switch (avatar.top) {
      case 'varsity_red':
        return (
          <g id="top_varsity">
            {/* Red torso */}
            <path d="M 14 34 L 34 34 L 33 46 L 15 46 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="1.4" />
            {/* White sleeves */}
            <path d="M 14 34 L 8 43 L 12 45 L 16 38 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 34 34 L 40 43 L 36 45 L 32 38 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.4" />
            {/* White stripe collar and zipper */}
            <line x1="24" y1="34" x2="24" y2="46" stroke="#f8fafc" strokeWidth="1.2" />
            {/* "A" patch */}
            <circle cx="19" cy="38" r="2.2" fill="#fbbf24" stroke="#0f172a" strokeWidth="0.8" />
          </g>
        );
      case 'gamer_yellow':
        return (
          <g id="top_gamer">
            <path d="M 13 33 L 35 33 L 34 46 L 14 46 Z" fill="#eab308" stroke="#0f172a" strokeWidth="1.4" />
            {/* Black cyber stripes */}
            <line x1="17" y1="35" x2="17" y2="45" stroke="#1e293b" strokeWidth="1.8" />
            <line x1="31" y1="35" x2="31" y2="45" stroke="#1e293b" strokeWidth="1.8" />
            {/* Sleeves */}
            <path d="M 13 33 L 8 42 L 12 44 L 15 37 Z" fill="#ca8a04" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 35 33 L 40 42 L 36 44 L 33 37 Z" fill="#ca8a04" stroke="#0f172a" strokeWidth="1.4" />
            <circle cx="24" cy="40" r="2" fill="#06b6d4" /> {/* Cyan LED badge */}
          </g>
        );
      case 'flannel_pink':
        return (
          <g id="top_flannel">
            <path d="M 14 34 L 34 34 L 33 46 L 15 46 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.4" />
            {/* Plaid lines */}
            <line x1="19" y1="34" x2="19" y2="46" stroke="#4c0519" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="29" y1="34" x2="29" y2="46" stroke="#4c0519" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="14" y1="40" x2="34" y2="40" stroke="#4c0519" strokeWidth="1" strokeDasharray="2,2" />
            {/* Sleeves */}
            <path d="M 14 34 L 9 42 L 13 44 L 16 38 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 34 34 L 39 42 L 35 44 L 32 38 Z" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.4" />
          </g>
        );
      case 'batik_modern':
        return (
          <g id="top_batik">
            <path d="M 14 34 L 34 34 L 33 46 L 15 46 Z" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
            {/* Batik motifs (gold dots/swirls) */}
            <circle cx="20" cy="38" r="1.5" fill="#fde047" />
            <circle cx="28" cy="38" r="1.5" fill="#fde047" />
            <circle cx="24" cy="42" r="1.5" fill="#fde047" />
            <circle cx="18" cy="44" r="1.2" fill="#fde047" />
            <circle cx="30" cy="44" r="1.2" fill="#fde047" />
            {/* Sleeves */}
            <path d="M 14 34 L 9 42 L 13 44 L 16 38 Z" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 34 34 L 39 42 L 35 44 L 32 38 Z" fill="#78350f" stroke="#0f172a" strokeWidth="1.4" />
          </g>
        );
      case 'denim_jacket':
        return (
          <g id="top_denim">
            <path d="M 14 34 L 34 34 L 33 46 L 15 46 Z" fill="#1d4ed8" stroke="#0f172a" strokeWidth="1.4" />
            {/* Pockets & seams */}
            <rect x="17" y="37" width="4" height="4" fill="#1e40af" stroke="#0f172a" strokeWidth="0.8" />
            <rect x="27" y="37" width="4" height="4" fill="#1e40af" stroke="#0f172a" strokeWidth="0.8" />
            {/* Sleeves */}
            <path d="M 14 34 L 9 42 L 13 44 L 16 38 Z" fill="#2563eb" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 34 34 L 39 42 L 35 44 L 32 38 Z" fill="#2563eb" stroke="#0f172a" strokeWidth="1.4" />
          </g>
        );
      case 'hoodie_orange':
      default:
        return (
          <g id="top_hoodie">
            {/* Orange hoodie torso */}
            <path d="M 13 33 L 35 33 L 34 46 L 14 46 Z" fill="#ea580c" stroke="#0f172a" strokeWidth="1.4" />
            {/* Kangaroo pouch */}
            <path d="M 18 41 L 30 41 L 28 45 L 20 45 Z" fill="#c2410c" stroke="#0f172a" strokeWidth="1" />
            {/* Drawstrings */}
            <line x1="22" y1="34" x2="21" y2="40" stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="26" y1="34" x2="27" y2="40" stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" />
            {/* Sleeves */}
            <path d="M 13 33 L 8 42 L 12 44 L 15 37 Z" fill="#f97316" stroke="#0f172a" strokeWidth="1.4" />
            <path d="M 35 33 L 40 42 L 36 44 L 33 37 Z" fill="#f97316" stroke="#0f172a" strokeWidth="1.4" />
          </g>
        );
    }
  };

  // Bottom clothing renderer
  const renderBottom = () => {
    switch (avatar.bottom) {
      case 'skirt_green':
        return (
          <g id="bottom_skirt">
            <path d="M 15 46 L 33 46 L 36 53 L 12 53 Z" fill="#059669" stroke="#0f172a" strokeWidth="1.4" />
            {/* Pleats */}
            <line x1="18" y1="46" x2="17" y2="53" stroke="#047857" strokeWidth="1" />
            <line x1="24" y1="46" x2="24" y2="53" stroke="#047857" strokeWidth="1" />
            <line x1="30" y1="46" x2="31" y2="53" stroke="#047857" strokeWidth="1" />
            {/* Legs & Shoes */}
            <rect x="17" y="53" width="4" height="6" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="1" />
            <rect x="27" y="53" width="4" height="6" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="1" />
            <rect x="16" y="58" width="6" height="3.5" rx="1" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
            <rect x="26" y="58" width="6" height="3.5" rx="1" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
          </g>
        );
      case 'cargo_dark':
        return (
          <g id="bottom_cargo">
            <path d="M 15 46 L 33 46 L 32 58 L 26 58 L 24 50 L 22 58 L 16 58 Z" fill="#334155" stroke="#0f172a" strokeWidth="1.4" />
            {/* Cargo pockets */}
            <rect x="15" y="50" width="3" height="4" fill="#1e293b" />
            <rect x="30" y="50" width="3" height="4" fill="#1e293b" />
            {/* Sneakers */}
            <rect x="14" y="58" width="7" height="3.5" rx="1.5" fill="#f97316" stroke="#0f172a" strokeWidth="1" />
            <rect x="27" y="58" width="7" height="3.5" rx="1.5" fill="#f97316" stroke="#0f172a" strokeWidth="1" />
          </g>
        );
      case 'jogger_black':
        return (
          <g id="bottom_jogger">
            <path d="M 15 46 L 33 46 L 31 58 L 26 58 L 24 50 L 22 58 L 17 58 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="1.4" />
            {/* White side stripes */}
            <line x1="16" y1="46" x2="17" y2="58" stroke="#f8fafc" strokeWidth="1" />
            <line x1="32" y1="46" x2="31" y2="58" stroke="#f8fafc" strokeWidth="1" />
            {/* Sneakers */}
            <rect x="14" y="58" width="7" height="3.5" rx="1.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
            <rect x="27" y="58" width="7" height="3.5" rx="1.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
          </g>
        );
      case 'jeans_blue':
      default:
        return (
          <g id="bottom_jeans">
            <path d="M 15 46 L 33 46 L 32 58 L 26 58 L 24 50 L 22 58 L 16 58 Z" fill="#2563eb" stroke="#0f172a" strokeWidth="1.4" />
            {/* Belt */}
            <line x1="15" y1="46.5" x2="33" y2="46.5" stroke="#78350f" strokeWidth="1.5" />
            {/* White classic sneakers */}
            <rect x="14" y="58" width="7" height="3.5" rx="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
            <rect x="27" y="58" width="7" height="3.5" rx="1.5" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
          </g>
        );
    }
  };

  // Headwear renderer
  const renderHat = () => {
    switch (avatar.hat) {
      case 'snapback':
        return (
          <g id="hat_snapback">
            {/* Cap dome */}
            <path d="M 12 16 Q 24 6 36 16 L 37 19 L 11 19 Z" fill="#0284c7" stroke="#0f172a" strokeWidth="1.4" />
            {/* Flat brim */}
            <rect x="8" y="18" width="32" height="3" rx="1" fill="#0369a1" stroke="#0f172a" strokeWidth="1.2" />
            <circle cx="24" cy="14" r="1.5" fill="#ffffff" />
          </g>
        );
      case 'beanie':
        return (
          <g id="hat_beanie">
            {/* Knitted beanie hat with fold */}
            <path d="M 12 18 Q 24 4 36 18 Z" fill="#0d9488" stroke="#0f172a" strokeWidth="1.4" />
            <rect x="10" y="16" width="28" height="4" rx="2" fill="#0f766e" stroke="#0f172a" strokeWidth="1.2" />
            <circle cx="24" cy="5" r="2.5" fill="#14b8a6" stroke="#0f172a" strokeWidth="0.8" /> {/* Pom-pom */}
          </g>
        );
      case 'bucket_hat':
        return (
          <g id="hat_bucket">
            {/* Bucket crown */}
            <path d="M 15 16 L 17 9 L 31 9 L 33 16 Z" fill="#475569" stroke="#0f172a" strokeWidth="1.4" />
            {/* Slanted downward brim */}
            <path d="M 9 19 Q 24 16 39 19 L 37 16 Q 24 14 11 16 Z" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />
          </g>
        );
      case 'headphones':
        return (
          <g id="hat_headphones">
            {/* Headband arch */}
            <path d="M 10 24 Q 24 2 38 24" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* Glowing earcups */}
            <rect x="7" y="21" width="4.5" height="9" rx="2" fill="#06b6d4" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="36.5" y="21" width="4.5" height="9" rx="2" fill="#06b6d4" stroke="#0f172a" strokeWidth="1.2" />
          </g>
        );
      case 'crown':
        return (
          <g id="hat_crown">
            <path
              d="M 15 14 L 17 6 L 21 11 L 24 4 L 27 11 L 31 6 L 33 14 Z"
              fill="#eab308"
              stroke="#0f172a"
              strokeWidth="1.3"
            />
            {/* Jewels */}
            <circle cx="24" cy="8" r="1.2" fill="#ef4444" />
            <circle cx="17" cy="8.5" r="1" fill="#3b82f6" />
            <circle cx="31" cy="8.5" r="1" fill="#3b82f6" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  // Accessories renderer
  const renderAccessory = () => {
    switch (avatar.accessory) {
      case 'glasses':
        return (
          <g id="acc_glasses">
            <circle cx="19" cy="27" r="3.5" fill="rgba(255,255,255,0.4)" stroke="#0f172a" strokeWidth="1.2" />
            <circle cx="29" cy="27" r="3.5" fill="rgba(255,255,255,0.4)" stroke="#0f172a" strokeWidth="1.2" />
            <line x1="22.5" y1="27" x2="25.5" y2="27" stroke="#0f172a" strokeWidth="1.2" />
          </g>
        );
      case 'angel_wings':
        return (
          <g id="acc_angel_wings" className="animate-pulse">
            <path
              d="M 14 36 C 4 30 0 20 6 12 C 12 18 14 26 14 36 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
            <path
              d="M 34 36 C 44 30 48 20 42 12 C 36 18 34 26 34 36 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.2"
            />
          </g>
        );
      case 'demon_wings':
        return (
          <g id="acc_demon_wings">
            <path
              d="M 14 36 L 2 28 L 5 22 L 0 16 L 10 18 L 14 36 Z"
              fill="#7f1d1d"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <path
              d="M 34 36 L 46 28 L 43 22 L 48 16 L 38 18 L 34 36 Z"
              fill="#7f1d1d"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
          </g>
        );
      case 'backpack':
        return (
          <g id="acc_backpack">
            <rect x="7" y="34" width="6" height="10" rx="2" fill="#b45309" stroke="#0f172a" strokeWidth="1.2" />
            <line x1="10" y1="34" x2="14" y2="38" stroke="#78350f" strokeWidth="1.2" />
          </g>
        );
      case 'pet_cat':
        return (
          <g id="acc_pet_cat" transform="translate(36, 44)">
            {/* Mini cute orange cat following */}
            <circle cx="5" cy="8" r="4.5" fill="#f97316" stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="2,4 4,1 5,4" fill="#ea580c" stroke="#0f172a" strokeWidth="0.6" />
            <polygon points="5,4 6,1 8,4" fill="#ea580c" stroke="#0f172a" strokeWidth="0.6" />
            <circle cx="3.8" cy="7.5" r="0.7" fill="#0f172a" />
            <circle cx="6.2" cy="7.5" r="0.7" fill="#0f172a" />
            <path d="M 9 9 Q 12 7 11 12" fill="none" stroke="#ea580c" strokeWidth="1" strokeLinecap="round" />
          </g>
        );
      default:
        return null;
    }
  };

  const avatarDimensions =
    size === 'world'
      ? 'w-6 h-8 sm:w-7 sm:h-9'
      : size === 'medium'
      ? 'w-14 h-18'
      : 'w-20 h-26';

  const shadowDimensions =
    size === 'world' ? 'w-4 h-1' : size === 'medium' ? 'w-8 h-2' : 'w-12 h-3';

  return (
    <div
      className={`relative inline-flex flex-col items-center pointer-events-none ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Speech Bubble */}
      {bubble && (
        <div className={`absolute ${size === 'world' ? '-top-8' : '-top-11'} z-30 flex flex-col items-center animate-bounce-short`}>
          <div
            className={`rounded-lg bg-white/95 text-slate-900 shadow-md border-2 border-slate-900 font-semibold leading-tight text-center break-words select-text pointer-events-auto ${
              size === 'world' ? 'max-w-[130px] px-1.5 py-0.5 text-[9px]' : 'max-w-[190px] px-2.5 py-1.5 text-xs'
            }`}
          >
            {bubble.emote && <span className="mr-1 inline-block">{bubble.emote}</span>}
            {bubble.text}
          </div>
          {/* Bubble tail pointer */}
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900 -mt-[1px]" />
        </div>
      )}

      {/* Floating Action Tool Icons (Fishing Rod / Hoe / Notes) */}
      {isDancing && (
        <div className="absolute -top-3 z-20 flex gap-0.5 text-xs animate-bounce text-pink-400">
          <span>🎵</span>
          <span>✨</span>
        </div>
      )}
      {isFishing && (
        <div className="absolute -top-3.5 -right-2 z-20 text-[9px] font-bold text-sky-400 animate-pulse whitespace-nowrap">
          🎣 Mancing...
        </div>
      )}
      {isFarming && (
        <div className="absolute -top-3.5 -right-2 z-20 text-[9px] font-bold text-emerald-400 animate-pulse whitespace-nowrap">
          👨‍🌾 Bertani...
        </div>
      )}

      {/* Title & Nameplate */}
      {(name || title) && (
        <div className="flex flex-col items-center -mb-0.5 z-10 pointer-events-auto">
          {title && (
            <span
              className={`font-bold tracking-tight rounded bg-amber-500/90 text-slate-950 shadow-sm border border-amber-300 whitespace-nowrap leading-none ${
                size === 'world' ? 'text-[7px] px-1 py-0.5' : 'text-[9px] px-1.5 py-0.5'
              }`}
            >
              {title}
            </span>
          )}
          {name && (
            <span
              className={`font-extrabold tracking-tight rounded whitespace-nowrap leading-none mt-0.5 ${
                size === 'world' ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'
              } ${
                isCurrentPlayer
                  ? 'text-yellow-300 bg-slate-900/90 border border-yellow-400/70 shadow-sm'
                  : 'text-white bg-slate-950/80'
              }`}
            >
              {name}
            </span>
          )}
        </div>
      )}

      {/* Shadow */}
      <div className={`${shadowDimensions} bg-black/40 rounded-full absolute bottom-0 blur-[1px]`} />

      {/* SVG Chibi Avatar */}
      <div
        className={`relative ${avatarDimensions} transition-transform duration-150 ${
          isFlipped ? '-scale-x-100' : 'scale-x-100'
        } ${isWalking ? 'animate-pulse' : ''} ${isDancing ? 'animate-wiggle' : ''} ${
          isSitting ? 'translate-y-1.5' : ''
        }`}
      >
        <svg
          viewBox="0 0 48 64"
          className="w-full h-full pixelated drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Accessories (e.g. Wings) */}
          {renderAccessory()}

          {/* Body / Torso / Arms */}
          {renderBottom()}
          {renderTop()}

          {/* Hands */}
          <circle cx="8" cy="44" r="2.2" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="0.8" />
          <circle cx="40" cy="44" r="2.2" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="0.8" />

          {/* Head & Neck */}
          <rect x="22" y="30" width="4" height="4" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="0.8" />
          <ellipse cx="24" cy="22" rx="12" ry="11" fill={avatar.skinColor} stroke="#0f172a" strokeWidth="1.5" />

          {/* Cute Big Chibi Eyes */}
          <g id="eyes">
            {/* Left Eye */}
            <ellipse cx="19" cy="24" rx="2.4" ry="3.2" fill="#0f172a" />
            <circle cx="18.2" cy="22.8" r="1.1" fill="#ffffff" />
            <circle cx="19.8" cy="25.2" r="0.6" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="29" cy="24" rx="2.4" ry="3.2" fill="#0f172a" />
            <circle cx="28.2" cy="22.8" r="1.1" fill="#ffffff" />
            <circle cx="29.8" cy="25.2" r="0.6" fill="#ffffff" />

            {/* Cute Cheek Blushes */}
            <circle cx="15" cy="26.5" r="1.8" fill="#fb7185" opacity="0.6" />
            <circle cx="33" cy="26.5" r="1.8" fill="#fb7185" opacity="0.6" />

            {/* Little Smile */}
            <path d="M 22 28 Q 24 30 26 28" fill="none" stroke="#0f172a" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* Hair */}
          {renderHair()}

          {/* Front Accessories (Glasses, etc.) */}
          {avatar.accessory === 'glasses' && renderAccessory()}

          {/* Headwear */}
          {renderHat()}

          {/* Fishing rod held during fishing action */}
          {isFishing && (
            <g id="fishing_rod">
              <line x1="40" y1="44" x2="52" y2="28" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              <line x1="52" y1="28" x2="62" y2="48" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="62" cy="48" r="2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
            </g>
          )}

          {/* Hoe held during farming action */}
          {isFarming && (
            <g id="farming_hoe">
              <line x1="40" y1="44" x2="48" y2="34" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="47" y1="32" x2="52" y2="38" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
