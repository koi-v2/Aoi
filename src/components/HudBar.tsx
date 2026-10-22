import React, { useState } from 'react';
import { Player, MapId, PlayerAction } from '../types/game';
import { sounds } from '../utils/audio';

interface HudBarProps {
  player: Player;
  currentMap: MapId;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onWarpMap: (map: MapId) => void;
  onOpenBoutique: () => void;
  onOpenInventory: () => void;
  onOpenPhotoStudio: () => void;
  onOpenProfile: () => void;
  onTriggerAction: (action: PlayerAction, emote?: string) => void;
}

export const HudBar: React.FC<HudBarProps> = ({
  player,
  currentMap,
  soundEnabled,
  onToggleSound,
  onWarpMap,
  onOpenBoutique,
  onOpenInventory,
  onOpenPhotoStudio,
  onOpenProfile,
  onTriggerAction,
}) => {
  const [showMapMenu, setShowMapMenu] = useState(false);

  const mapLabels: Record<MapId, { name: string; icon: string }> = {
    taman_kota: { name: 'Taman Kota AOI', icon: '🏛️' },
    kebun: { name: 'Kebun & Ternak', icon: '🚜' },
    pantai: { name: 'Pantai Biru', icon: '🏖️' },
  };

  const xpProgress = ((player.level * 100 - (player.level * 100 - (player.xu % 100))) / 100) * 100;

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-none select-none z-30">
      {/* Top Main Status Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl pointer-events-auto">
        {/* Left: Player Avatar Profile Strip */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Buka Profil Karakter"
        >
          {/* Avatar Face Badge */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-sm">
              {player.avatar.gender === 'male' ? '👦' : '👧'}
            </div>
            <span className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-tl">
              {player.level}
            </span>
          </div>

          {/* Name & Energy Meters */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">{player.name}</span>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1 rounded">
                {player.avatar.title}
              </span>
            </div>
            {/* Energy Bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                  style={{ width: `${Math.min(100, player.energy)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-300 font-semibold tabular-nums">⚡ {player.energy}/100</span>
            </div>
          </div>
        </div>

        {/* Center: Currency Cluster */}
        <div className="flex items-center gap-2">
          {/* Xu Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/40 shadow-inner">
            <span className="text-sm">🪙</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold leading-none">Xu</span>
              <span className="text-xs font-black text-amber-300 tabular-nums leading-none mt-0.5">
                {player.xu.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Lượng Gems */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-purple-500/40 shadow-inner">
            <span className="text-sm">💎</span>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase font-bold leading-none">Lượng</span>
              <span className="text-xs font-black text-purple-300 tabular-nums leading-none mt-0.5">
                {player.luong}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Direct Map Warp Tabs & System Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Direct 3-Map Selector Buttons */}
          <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-700/80">
            {(['taman_kota', 'kebun', 'pantai'] as MapId[]).map((mId) => {
              const active = currentMap === mId;
              const shortLabels: Record<MapId, string> = {
                taman_kota: 'Taman',
                kebun: 'Kebun',
                pantai: 'Pantai',
              };
              return (
                <button
                  key={mId}
                  onClick={() => {
                    sounds.playPop();
                    onWarpMap(mId);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold scale-102'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Pindah ke ${mapLabels[mId].name}`}
                >
                  <span className="text-sm">{mapLabels[mId].icon}</span>
                  <span className="hidden sm:inline">{shortLabels[mId]}</span>
                </button>
              );
            })}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sounds.playPop();
            }}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs transition-colors"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Action Shortcuts & Emote Pill Bar */}
      <div className="flex items-center justify-between gap-2 pointer-events-auto">
        {/* Navigation Modals */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => {
              sounds.playPop();
              onOpenBoutique();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-600/30 hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 text-xs font-bold transition-all active:scale-95"
          >
            <span>🛍️</span>
            <span>Butik</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onOpenInventory();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all active:scale-95"
          >
            <span>🎒</span>
            <span>Kantong & Pasar</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onOpenPhotoStudio();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-300 border border-yellow-500/40 text-xs font-bold transition-all active:scale-95"
          >
            <span>🍌</span>
            <span>Foto AI</span>
          </button>
        </div>

        {/* Emote & Social Interaction Quick Trigger */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => {
              sounds.playEmote();
              onTriggerAction('dance', '🎵');
            }}
            title="Joget Asik"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
          >
            💃
          </button>
          <button
            onClick={() => {
              sounds.playEmote();
              onTriggerAction('idle', '👋');
            }}
            title="Dadah / Sapa"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
          >
            👋
          </button>
          <button
            onClick={() => {
              sounds.playEmote();
              onTriggerAction('idle', '❤️');
            }}
            title="Cinta / Emote Love"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
          >
            ❤️
          </button>
          <button
            onClick={() => {
              sounds.playEmote();
              onTriggerAction('idle', '😂');
            }}
            title="Tertawa Terbahak"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
          >
            😂
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              onTriggerAction('sit');
            }}
            title="Duduk Santai"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-sm active:scale-90 transition-transform"
          >
            🪑
          </button>
        </div>
      </div>
    </div>
  );
};
