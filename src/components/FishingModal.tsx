import React, { useState, useEffect } from 'react';
import { CaughtFish, FishSpecies } from '../types/game';
import { FISH_CATALOG } from '../data/gameData';
import { sounds } from '../utils/audio';

interface FishingModalProps {
  onCatchSuccess: (fish: CaughtFish) => void;
  onClose: () => void;
}

export const FishingModal: React.FC<FishingModalProps> = ({ onCatchSuccess, onClose }) => {
  const [stage, setStage] = useState<'casting' | 'waiting' | 'bite' | 'reeling' | 'caught'>('casting');
  const [caughtFish, setCaughtFish] = useState<CaughtFish | null>(null);
  const [reelingProgress, setReelingProgress] = useState(30); // 0 to 100
  const [tensionZone, setTensionZone] = useState(50); // target zone

  useEffect(() => {
    // Stage 1: Casting line
    sounds.playSplash();
    const waitTimer = setTimeout(() => {
      setStage('waiting');
    }, 1200);

    // Stage 2: Waiting for bite (random 2-4 sec)
    const biteDelay = 2000 + Math.random() * 2500;
    const biteTimer = setTimeout(() => {
      setStage('bite');
      sounds.playBite();
    }, 1200 + biteDelay);

    return () => {
      clearTimeout(waitTimer);
      clearTimeout(biteTimer);
    };
  }, []);

  // Hooking the fish on bite
  const handleHook = () => {
    if (stage !== 'bite') return;
    sounds.playSplash();
    setStage('reeling');
  };

  // Reeling game loop
  useEffect(() => {
    if (stage !== 'reeling') return;

    const interval = setInterval(() => {
      // Zone fluctuates smoothly
      setTensionZone((prev) => {
        const delta = (Math.random() - 0.48) * 12;
        return Math.max(20, Math.min(80, prev + delta));
      });

      // Decay reeling progress if not tapping
      setReelingProgress((prev) => {
        const next = Math.max(0, prev - 2);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [stage]);

  // Player reels by clicking or pressing space
  const handleReelPull = () => {
    if (stage !== 'reeling') return;
    sounds.playPop();

    setReelingProgress((prev) => {
      const next = prev + 14;
      if (next >= 100) {
        // Complete catch!
        finishCatch();
      }
      return Math.min(100, next);
    });
  };

  const finishCatch = () => {
    // Pick fish species based on probability
    const roll = Math.random();
    let species: FishSpecies;
    if (roll < 0.08) {
      // Legendary
      species = FISH_CATALOG.find((f) => f.rarity === 'Legendaris') || FISH_CATALOG[0];
    } else if (roll < 0.35) {
      // Rare
      species = FISH_CATALOG.find((f) => f.rarity === 'Langka') || FISH_CATALOG[0];
    } else {
      // Common
      species = FISH_CATALOG[Math.floor(Math.random() * 3)];
    }

    const weight = parseFloat((species.minWeight + Math.random() * (species.maxWeight - species.minWeight)).toFixed(2));
    const fish: CaughtFish = {
      id: `fish_${Date.now()}`,
      speciesId: species.id,
      name: species.name,
      weightKg: weight,
      price: Math.round(species.price * (1 + (weight - species.minWeight) / (species.maxWeight - species.minWeight) * 0.5)),
      rarity: species.rarity,
      caughtAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCaughtFish(fish);
    setStage('caught');
    sounds.playCoin();
    onCatchSuccess(fish);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-sky-500/80 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Title */}
        <h3 className="text-base font-bold text-sky-400 mb-1">Dermaga Pancing Pantai Biru</h3>
        <p className="text-xs text-slate-400 mb-4">Rasakan sensasi tarikan ikan khas nusantara!</p>

        {/* Fishing Visual Stage */}
        <div className="relative w-full h-44 bg-gradient-to-b from-sky-900/60 to-blue-950/90 rounded-xl border border-sky-600/40 flex flex-col items-center justify-center overflow-hidden mb-4 shadow-inner">
          {stage === 'casting' && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl animate-bounce">🎣</span>
              <span className="text-xs font-semibold text-sky-200">Melempar kail ke laut...</span>
            </div>
          )}

          {stage === 'waiting' && (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <span className="text-3xl animate-pulse">🔴</span>
                <div className="w-10 h-10 rounded-full border border-sky-300/40 animate-ping absolute -inset-1" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Menunggu umpan disambar... Tenang...</span>
            </div>
          )}

          {stage === 'bite' && (
            <div className="flex flex-col items-center space-y-3">
              <div className="text-4xl animate-bounce">❗🐟❗</div>
              <span className="text-sm font-extrabold text-amber-400 animate-pulse">UMPAN DISAMBAR! CEPAT TARIK!</span>
              <button
                onClick={handleHook}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl animate-pulse cursor-pointer border border-yellow-300"
              >
                TARIK SEKARANG!
              </button>
            </div>
          )}

          {stage === 'reeling' && (
            <div className="w-full px-6 flex flex-col items-center space-y-3">
              <div className="text-3xl animate-spin">🎣</div>
              <div className="w-full bg-slate-950/80 h-5 rounded-full border border-slate-700 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-100"
                  style={{ width: `${reelingProgress}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                  {Math.round(reelingProgress)}%
                </span>
              </div>
              <button
                onClick={handleReelPull}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-extrabold text-xs shadow-lg transition-transform"
              >
                GULUNG SENAR! (KLIK BERULANG)
              </button>
            </div>
          )}

          {stage === 'caught' && caughtFish && (
            <div className="flex flex-col items-center space-y-2 animate-fade-in">
              <span className="text-5xl">{caughtFish.rarity === 'Legendaris' ? '✨👑' : '🐟'}</span>
              <div className="text-sm font-black text-amber-300">{caughtFish.name}</div>
              <div className="text-xs text-slate-300">
                Berat: <strong className="text-white">{caughtFish.weightKg} kg</strong> · Harga: <strong className="text-amber-400">🪙 {caughtFish.price} Xu</strong>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                caughtFish.rarity === 'Legendaris'
                  ? 'bg-amber-500 text-slate-950 border border-yellow-300'
                  : caughtFish.rarity === 'Langka'
                  ? 'bg-purple-600 text-white'
                  : 'bg-sky-600 text-white'
              }`}>
                {caughtFish.rarity}
              </span>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="flex gap-2 w-full">
          {stage === 'caught' ? (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Simpan ke Ember Ikan
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
            >
              Batalkan Mancing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
