import React, { useState } from 'react';
import { AvatarConfig, Gender } from '../types/game';
import { AvatarRenderer } from './AvatarRenderer';
import { sounds } from '../utils/audio';
import tamanKotaImg from '../assets/images/aoi_taman_kota_map_1792663006899.jpg';

interface TitleScreenProps {
  onStartGame: (name: string, avatar: AvatarConfig) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('AvatarSultan');
  const [gender, setGender] = useState<Gender>('male');
  const [selectedStyle, setSelectedStyle] = useState<number>(0);

  const starterPresets: AvatarConfig[] = [
    {
      gender: 'male',
      skinColor: '#f5d0b0',
      hairStyle: 'messy',
      hairColor: '#171717',
      top: 'varsity_red',
      bottom: 'jeans_blue',
      hat: 'snapback',
      accessory: 'backpack',
      title: 'Warga Baru AOI',
    },
    {
      gender: 'female',
      skinColor: '#fce3ce',
      hairStyle: 'hijab',
      hairColor: '#1e293b',
      top: 'hoodie_orange',
      bottom: 'cargo_dark',
      hat: 'bucket_hat',
      accessory: 'glasses',
      title: 'Warga Baru AOI',
    },
    {
      gender: 'male',
      skinColor: '#e0ac69',
      hairStyle: 'spiky',
      hairColor: '#382218',
      top: 'gamer_yellow',
      bottom: 'jogger_black',
      hat: 'headphones',
      accessory: 'angel_wings',
      title: 'Warga Baru AOI',
    },
    {
      gender: 'female',
      skinColor: '#c68642',
      hairStyle: 'twintails',
      hairColor: '#b91c1c',
      top: 'flannel_pink',
      bottom: 'skirt_green',
      hat: 'beanie',
      accessory: 'pet_cat',
      title: 'Warga Baru AOI',
    },
  ];

  const currentAvatar = starterPresets[selectedStyle];

  const handleStart = () => {
    sounds.playLevelUp();
    onStartGame(playerName.trim() || 'WargaAOI', currentAvatar);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-between p-6 bg-slate-950 overflow-hidden select-none">
      {/* Background Animated Map Artwork */}
      <div className="absolute inset-0 pointer-events-none opacity-45 blur-[1px] scale-105 transition-transform duration-1000">
        <img
          src={tamanKotaImg}
          alt="AOI Park"
          className="w-full h-full object-cover pixelated"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Top Lockup: Bespoke Inline SVG Title */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        <svg viewBox="0 0 540 85" className="w-[340px] sm:w-[480px] drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <text
            x="270"
            y="42"
            textAnchor="middle"
            fill="url(#goldGrad)"
            stroke="#1e293b"
            strokeWidth="5"
            paintOrder="stroke fill"
            className="font-pixel font-bold text-3xl"
          >
            AVATAR ONLINE
          </text>
          <text
            x="270"
            y="72"
            textAnchor="middle"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="4"
            paintOrder="stroke fill"
            className="font-pixel text-xl tracking-wider"
          >
            INDONESIA 2D
          </text>
        </svg>

        <p className="text-xs sm:text-sm text-amber-200/90 font-medium tracking-wide mt-1 drop-shadow">
          Nostalgia Dunia Virtual MMO & Tongkrongan Klasik
        </p>
      </div>

      {/* Centerpiece: Interactive Character Customization Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 backdrop-blur-md border-2 border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center space-y-4">
        {/* Live Chibi Avatar Preview */}
        <div className="relative w-28 h-32 bg-slate-950/80 rounded-xl border border-slate-700 flex items-center justify-center shadow-inner">
          <AvatarRenderer avatar={currentAvatar} action="dance" size="large" />
        </div>

        {/* Style Preset Selector */}
        <div className="flex gap-2">
          {starterPresets.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                setSelectedStyle(idx);
              }}
              className={`w-10 h-10 rounded-xl font-bold text-xs border-2 transition-all ${
                selectedStyle === idx
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 scale-105'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              #{idx + 1}
            </button>
          ))}
        </div>

        {/* Player Name Input */}
        <div className="w-full space-y-1 text-left">
          <label className="text-xs font-bold text-slate-300">Nama Karakter:</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={16}
            placeholder="Ketik nama avatarmu..."
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Start Game CTA */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-98 text-slate-950 font-black text-sm tracking-wide shadow-xl transition-all border border-yellow-200 cursor-pointer animate-pulse"
        >
          MASUK KE DUNIA AOI
        </button>
      </div>

      {/* Flat Control-Hint Line per Game Craft guidelines */}
      <div className="relative z-10 text-[11px] text-slate-400/90 font-medium tracking-wide">
        <span>WASD / Panah / Klik Bergerak</span> · <span>Spasi / Klik Interaksi</span> · <span>Chat Real-Time</span>
      </div>
    </div>
  );
};
