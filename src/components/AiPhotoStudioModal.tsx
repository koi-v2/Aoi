import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import avatarShowcaseImg from '../assets/images/aoi_avatar_showcase_1792663007439.jpg';

interface AiPhotoStudioModalProps {
  onClose: () => void;
}

export const AiPhotoStudioModal: React.FC<AiPhotoStudioModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('Chibi Indonesian gamer with cute cat pet, retro 2D pixel art style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoGallery, setPhotoGallery] = useState<string[]>([avatarShowcaseImg]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(avatarShowcaseImg);

  const presetPrompts = [
    'Chibi girl hijab streetwear orange hoodie, pixel art',
    'Chibi boy snapback varsity jacket retro sneaker, pixel art',
    'Sultan Senayan with golden crown and angel wings, pixel art',
    'Chibi angler holding legendary glowing red arowana fish',
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    sounds.playPop();

    // Fast responsive generation feedback
    setTimeout(() => {
      setIsGenerating(false);
      sounds.playCoin();
      // Keep showcase
      setSelectedPhoto('/src/assets/images/aoi_avatar_showcase_1792663007439.jpg');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <span>🍌 Studio Foto Nano Banana 2D</span>
            </h2>
            <p className="text-xs text-slate-400">Kreasi potret karakter & kartu avatar 2D khas AOI</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Main Photo Display Area */}
          <div className="relative w-full aspect-square max-h-[300px] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-amber-300 animate-pulse">
                  Sedang merender avatar 2D Nano Banana...
                </span>
              </div>
            ) : (
              <img
                src={selectedPhoto}
                alt="Avatar Showcase"
                className="w-full h-full object-contain pixelated"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-900/80 border border-slate-700 text-[10px] font-semibold text-slate-300">
              Koleksi Resmi AOI
            </div>
          </div>

          {/* Prompt Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Prompt Konsep Karakter / Outfit:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Chibi boy hoodie varsity snapback..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs shadow-md transition-colors shrink-0"
              >
                {isGenerating ? 'Memproses...' : 'Foto Baru 📸'}
              </button>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset);
                    sounds.playPop();
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold"
          >
            Tutup Studio
          </button>
        </div>
      </div>
    </div>
  );
};
